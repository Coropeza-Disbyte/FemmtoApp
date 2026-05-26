/**
 * qa-monitor.js
 *
 * QA Monitor Dashboard — servidor local, sin dependencias externas
 * Interfaz tipo Cypress Test Runner: panel izquierdo + panel derecho
 *
 * Uso:
 *   npm run monitor              → abre http://localhost:3001
 */

require('dotenv').config({ path: require('path').join(__dirname, '..', '.env') });

const http             = require('http');
const path             = require('path');
const fs               = require('fs');
const { spawn, execSync } = require('child_process');

const ROOT = path.resolve(__dirname, '..');
const PORT = process.env.MONITOR_PORT || 3001;
const ADB  = 'C:\\Users\\coropeza2\\AppData\\Local\\Android\\Sdk\\platform-tools\\adb.exe';
const EMU  = 'C:\\Users\\coropeza2\\AppData\\Local\\Android\\Sdk\\emulator\\emulator.exe';

// Logos de la app — leídos del repo RN una sola vez al arrancar el servidor
const RN_ASSETS = 'C:\\Users\\coropeza2\\Desktop\\Front FemmtoApp\\OCR%20Femmto%20-%20New%20App';
function loadB64(p) { try { return fs.readFileSync(p).toString('base64'); } catch { return ''; } }
const LOGO_ICON_B64 = loadB64(path.join(RN_ASSETS, 'assets', 'images', 'app-icon.png'));
const LOGO_TEXT_B64 = loadB64(path.join(RN_ASSETS, 'android', 'app', 'src', 'main', 'res', 'drawable-xxxhdpi', 'text_logo.png'));

// ─── Estado global ─────────────────────────────────────────────────────────────

const state = {
  sseClients: new Set(),
  running:    false,
  proc:       null,

  devices: [],

  pipeline: [
    { id: 'git',      label: 'Git Pull',  status: 'idle', elapsed: null },
    { id: 'analysis', label: 'Análisis',  status: 'idle', elapsed: null },
    { id: 'tests',    label: 'Tests',     status: 'idle', elapsed: null },
    { id: 'report',   label: 'Reporte',   status: 'idle', elapsed: null },
    { id: 'notify',   label: 'Notificar', status: 'idle', elapsed: null },
  ],

  results: {
    modules:     {},   // 'folder/spec.spec.js' → { total, pass, fail, skip, tests[], tag, folder }
    failures:    [],
    currentTest: null, // { module, describe, it, startMs }
    startTime:   null,
    endTime:     null,
  },
  currentSpec: '',     // 'auth/login.spec.js' — updated on each spec file start

  log: [],  // últimas 500 entradas { ts, type, msg }
  hookResultsSeen: new Set(), // dedupe: prevent double-counting when afterTest hook + spec reporter both report
};

// ─── SSE ───────────────────────────────────────────────────────────────────────

function broadcast(type, data) {
  const payload = 'event: ' + type + '\ndata: ' + JSON.stringify(data) + '\n\n';
  for (const res of state.sseClients) {
    try { res.write(payload); } catch (_) {}
  }
}

function addLog(type, msg) {
  const entry = { ts: new Date().toISOString(), type, msg };
  state.log.push(entry);
  if (state.log.length > 500) state.log.shift();
  broadcast('log', entry);
}

function setPipeline(id, status, elapsed) {
  const s = state.pipeline.find(x => x.id === id);
  if (!s) return;
  s.status = status;
  if (elapsed !== undefined) s.elapsed = elapsed;
  broadcast('pipeline', state.pipeline);
}

// ─── ADB polling ──────────────────────────────────────────────────────────────

function parseAdbDevices() {
  try {
    const raw   = execSync('"' + ADB + '" devices -l', { encoding: 'utf8', timeout: 5000 });
    const lines = raw.trim().split(/\r?\n/).slice(1);
    return lines
      .map(l => l.trimEnd())
      .filter(l => l.trim().length > 0)
      .filter(l => /^\S+\s+(device|unauthorized|offline)/.test(l))
      .map(l => {
        // Handles both tab and space separators between serial and state
        const m = l.match(/^(\S+)\s+(device|unauthorized|offline)([\s\S]*)$/);
        if (!m) return null;
        const id     = m[1];
        const devState = m[2];
        const attrs  = m[3] || '';
        const online = devState === 'device';
        const auth   = devState !== 'unauthorized';
        const model  = (attrs.match(/model:(\S+)/)       || [])[1] || '';
        const avd    = (attrs.match(/avd_name:(\S+)/)    || [])[1] || '';
        const api    = (attrs.match(/sdk_version:(\d+)/) || [])[1] || '';
        const type   = id.startsWith('emulator') ? 'emulator' : 'usb';
        return { id, model: model || avd || id, avd, api, type, online, auth, state: devState };
      })
      .filter(Boolean);
  } catch (err) {
    return [{ id: 'adb-error', model: 'ADB no disponible: ' + err.message,
              type: 'usb', online: false, auth: false, state: 'error' }];
  }
}

function pollDevices() {
  const fresh = parseAdbDevices();
  if (JSON.stringify(fresh) !== JSON.stringify(state.devices)) {
    state.devices = fresh;
    broadcast('devices', fresh);
  }
}

setInterval(pollDevices, 3000);
pollDevices();

// ─── Spec scanner ─────────────────────────────────────────────────────────────

function scanSpecs() {
  const dir = path.join(ROOT, 'tests', 'specs');
  if (!fs.existsSync(dir)) return [];

  function parseIts(filePath) {
    try {
      const src     = fs.readFileSync(filePath, 'utf8');
      const desc    = (src.match(/describe\s*\(\s*['"`]([^'"`]+)['"`]/) || [])[1] || '';
      const its     = [];
      const re      = /\bit\s*\(\s*['"`]([^'"`]+)['"`]/g;
      let m;
      while ((m = re.exec(src)) !== null) its.push(m[1]);
      return { describe: desc, its };
    } catch (_) { return { describe: '', its: [] }; }
  }

  function walk(dir) {
    const result = [];
    for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
      if (e.isDirectory()) {
        const children = walk(path.join(dir, e.name));
        if (children.length) result.push({ type: 'folder', name: e.name, children });
      } else if (e.name.endsWith('.spec.js')) {
        const fp   = path.join(dir, e.name);
        const info = parseIts(fp);
        result.push({
          type:     'file',
          name:     e.name,
          path:     path.relative(ROOT, fp).replace(/\\/g, '/'),
          describe: info.describe,
          its:      info.its,
        });
      }
    }
    return result;
  }

  return walk(dir);
}

// ─── WDIO output parser ────────────────────────────────────────────────────────

// Remove ANSI escape codes that WDIO/chalk may include in piped output
function stripAnsi(str) {
  return str.replace(/\x1b\[[0-9;]*[mGKHF]/g, '');
}

function parseWdioLine(rawLine) {
  // Strip worker prefix [0-0], [0-1], etc., then ANSI codes
  const s = stripAnsi(rawLine.replace(/^\[\d+-\d+\]\s*/, '')).trimEnd();
  if (!s) return null;

  // Spec file start:
  //   worker log: "RUNNING in Android(16) on Android - file:///C:/path/login.spec.js"
  //   spec reporter: "Running:  tests/specs/auth/login.spec.js"
  if (/running/i.test(s) && s.includes('.spec.js')) {
    const short = (s.match(/tests\/specs\/(.+\.spec\.js)/i)  || [])[1]
               || (s.match(/specs\/(.+\.spec\.js)/i)          || [])[1];
    const uri   = (s.match(/file:\/\/\/(.+\.spec\.js)/i)      || [])[1];
    const rline = (s.match(/Running:\s*(.+\.spec\.js)/i)       || [])[1];
    const file  = short ? 'tests/specs/' + short
                : rline ? rline.trim()
                : uri   ? decodeURIComponent(uri.replace(/\\/g, '/')) : null;
    if (file) return { type: 'spec', file };
  }

  // Worker PASSED/FAILED lines — emitted in real time, before spec reporter batch
  if (/^PASSED\s+in\s+/i.test(s)) return { type: 'spec_pass' };
  if (/^FAILED\s+in\s+/i.test(s)) return { type: 'spec_fail' };

  // Describe block: "  [auth] Login Screen" (1-8 leading spaces, lowercase module)
  // Lowercase first char distinguishes module names from hook tags [Suite], [Setup], [Device]
  const dm = s.match(/^\s{1,8}\[([a-z]\w*)\]\s+(.+)$/);
  if (dm && !s.match(/[✓✔✗✘×✖]/)) {
    return { type: 'describe', module: dm[1], label: dm[2] };
  }

  // Passing test: "    ✔ should display login (234ms)" or "(1.2s)"
  const pm = s.match(/[✓✔]\s+(.+?)(?:\s+\([\d.]+m?s\))?$/);
  if (pm) {
    const t = (s.match(/\(([\d.]+)m?s\)/) || [])[1];
    return { type: 'pass', label: pm[1].trim(), ms: t ? Math.round(parseFloat(t) * (t.includes('.') ? 1000 : 1)) : null };
  }

  // Failing test
  const fm = s.match(/[✗✘×✖]\s+(.+?)(?:\s+\([\d.]+m?s\))?$/);
  if (fm) {
    const t = (s.match(/\(([\d.]+)m?s\)/) || [])[1];
    return { type: 'fail', label: fm[1].trim(), ms: t ? Math.round(parseFloat(t) * (t.includes('.') ? 1000 : 1)) : null };
  }

  // Pending / skipped: "    - test name"
  const skm = s.match(/^\s+-\s+(.+)$/);
  if (skm) return { type: 'skip', label: skm[1].trim() };

  // Error message block (indented after fail)
  const em = s.match(/^\s{6,}(.+)$/);
  if (em && em[1].length < 200) return { type: 'error_detail', msg: em[1].trim() };

  return null;
}

// ─── Test runner ──────────────────────────────────────────────────────────────

function startRun({ suite, specs, grep }) {
  if (state.running) return { ok: false, error: 'Ya hay una ejecución en curso' };

  // Refresh device list and abort early if nothing is connected
  pollDevices();
  const onlineDevices = state.devices.filter(d => d.online);
  if (onlineDevices.length === 0) {
    return { ok: false, error: 'NO_DEVICE' };
  }

  state.running     = true;
  state.grep        = grep || null;
  state.currentSpec = '';
  state.results = { modules: {}, failures: [], currentTest: null,
                    startTime: Date.now(), endTime: null };
  state.log = [];
  state.hookResultsSeen = new Set();
  state.pipeline.forEach(s => { s.status = 'idle'; s.elapsed = null; });

  broadcast('run_start', { ts: Date.now() });
  addLog('PIPELINE', 'Iniciando ejecución' + (suite ? ' — Suite: ' + suite : ''));

  let currentModule   = '';
  let currentDescribe = '';
  let lastErrorFor    = null;

  const wdioArgs = ['wdio', 'run', 'wdio.conf.js'];
  if (suite) { wdioArgs.push('--suite', suite); }
  if (specs && specs.length) specs.forEach(s => wdioArgs.push('--spec', s));

  // Brief analysis phase then launch wdio
  setPipeline('analysis', 'running');
  addLog('ANÁLISIS', 'Escaneando specs...');

  const scanned = scanSpecs();
  let totalIts  = 0;
  function countIts(nodes) { for (const n of nodes) { if (n.type === 'file') totalIts += n.its.length; else countIts(n.children); } }
  countIts(scanned);

  setPipeline('analysis', 'done', 1);
  addLog('ANÁLISIS', totalIts + ' test cases encontrados — lanzando WDIO' + (grep ? ' (grep: ' + grep + ')' : ''));
  setPipeline('tests', 'running');

  const t0 = Date.now();

  // Pass grep filter via env var — WDIO CLI has no --grep flag; wdio.conf.js reads WDIO_GREP
  const spawnEnv = grep ? Object.assign({}, process.env, { WDIO_GREP: grep }) : process.env;

  const proc = spawn('npx', wdioArgs, {
    cwd:   ROOT,
    shell: true,
    stdio: ['ignore', 'pipe', 'pipe'],
    env:   spawnEnv,
  });
  state.proc = proc;

  let buf = '';

  function onChunk(chunk) {
    buf += chunk.toString();
    const lines = buf.split(/\r?\n/);
    buf = lines.pop();
    lines.forEach(processLine);
  }

  function processLine(raw) {
    const line = raw.trimEnd();
    if (!line) return;

    // Stream raw to log
    addLog('WDIO', line);

    const p = parseWdioLine(line);
    if (!p) return;

    if (p.type === 'spec') {
      const grepSuffix = state.grep
        ? '  —  ' + state.grep.split('|').map(s => s.trim()).filter(Boolean).join(', ')
        : '';
      addLog('TEST', '▶ ' + p.file + grepSuffix);
      // Extract "auth/login.spec.js" from full path for grouping
      const specM = p.file.match(/tests\/specs\/(.+)$/i) || p.file.match(/specs\/(.+)$/i);
      state.currentSpec = specM ? specM[1].replace(/\\/g, '/') : p.file;
      state.results.currentTest = { file: p.file, describe: '', it: '', startMs: Date.now() };
      broadcast('current_test', state.results.currentTest);
    }

    if (p.type === 'spec_pass') {
      const f = (state.results.currentTest && state.results.currentTest.file) || 'spec';
      addLog('TEST', '✔  ' + f + ' — OK');
    }

    if (p.type === 'spec_fail') {
      const f = (state.results.currentTest && state.results.currentTest.file) || 'spec';
      addLog('TEST', '✖  ' + f + ' — FALLÓ');
    }

    if (p.type === 'describe') {
      currentModule   = '[' + p.module + ']';
      currentDescribe = p.label;
      const descKey   = state.currentSpec || currentModule;
      if (!state.results.modules[descKey]) {
        const folder = state.currentSpec ? state.currentSpec.split('/')[0] : p.module;
        state.results.modules[descKey] = { total: 0, pass: 0, fail: 0, skip: 0, tests: [], tag: currentModule, folder };
      }
      state.results.currentTest = { module: currentModule, describe: currentDescribe, it: '…', startMs: Date.now() };
      broadcast('current_test', state.results.currentTest);
      broadcast('results', state.results);
    }

    if (p.type === 'pass' || p.type === 'fail' || p.type === 'skip') {
      // Skip if already counted via the real-time afterTest hook (prevents double-counting the spec-reporter batch)
      if (state.hookResultsSeen.has(p.label)) return;

      const lineKey = state.currentSpec || currentModule;
      const folder  = state.currentSpec ? state.currentSpec.split('/')[0] : currentModule.replace(/[\[\]]/g, '');
      const mod = state.results.modules[lineKey]
               || (state.results.modules[lineKey] = { total: 0, pass: 0, fail: 0, skip: 0, tests: [], tag: currentModule, folder });

      mod.total++;
      if (p.type === 'pass') mod.pass++;
      if (p.type === 'fail') mod.fail++;
      if (p.type === 'skip') mod.skip++;

      const entry = {
        module:   currentModule,
        describe: currentDescribe,
        it:       p.label,
        status:   p.type,
        ms:       p.ms,
      };
      mod.tests.push(entry);

      if (p.type === 'fail') {
        const failure = Object.assign({}, entry, { error: '' });
        state.results.failures.push(failure);
        lastErrorFor = failure;
        addLog('TEST', '✖ ' + currentModule + ' ' + p.label + (p.ms ? ' (' + p.ms + 'ms)' : ''));
      } else {
        lastErrorFor = null;
        addLog('TEST', (p.type === 'pass' ? '✔' : '−') + ' ' + currentModule + ' ' + p.label + (p.ms ? ' (' + p.ms + 'ms)' : ''));
      }

      // Update current test to next (still in same describe, unknown it)
      state.results.currentTest = { module: currentModule, describe: currentDescribe, it: '…', startMs: Date.now() };
      broadcast('test_result', entry);
      broadcast('current_test', state.results.currentTest);
      broadcast('results', state.results);
    }

    if (p.type === 'error_detail' && lastErrorFor) {
      lastErrorFor.error = lastErrorFor.error
        ? lastErrorFor.error + ' ' + p.msg
        : p.msg;
      broadcast('results', state.results);
    }
  }

  proc.stdout.on('data', onChunk);
  proc.stderr.on('data', onChunk);

  proc.on('close', code => {
    const alreadyStopped = !state.running;
    if (buf.trim()) processLine(buf);
    state.running = false;
    state.proc    = null;
    state.results.endTime    = Date.now();
    state.results.currentTest = null;

    if (alreadyStopped) return;  // user already stopped — run_end was already broadcast

    const elapsed = Math.floor((state.results.endTime - t0) / 1000);
    setPipeline('tests',  code === 0 ? 'done' : 'error', elapsed);
    setPipeline('report', 'done');

    broadcast('run_end', { code, elapsed, results: state.results });
    addLog('PIPELINE', 'Ejecución finalizada — código: ' + code + ' — ' + elapsed + 's');
  });

  proc.on('error', err => {
    state.running = false;
    state.proc    = null;
    addLog('ERROR', err.message);
    broadcast('run_end', { code: 1, error: err.message });
  });

  return { ok: true };
}

// ─── Whitelisted commands ──────────────────────────────────────────────────────

const CMD_PRESETS = {
  'adb devices':       { cmd: '"' + ADB + '" devices -l' },
  'appium status':     { cmd: 'curl -s http://localhost:4723/status' },
  'start pixel_7':     { cmd: '"' + EMU + '" -avd Pixel_7',                           bg: true },
  'start android16':   { cmd: '"' + EMU + '" -avd Pixel_9_Pro_XL -port 5560',       bg: true },
  'start mainstream':  { cmd: '"' + EMU + '" -avd AVD_ARG_Mainstream -port 5556',   bg: true },
  'start midrange':    { cmd: '"' + EMU + '" -avd AVD_ARG_MidRange -port 5558',     bg: true },
  'npm run devices':   { cmd: '"' + ADB + '" devices' },
};

function runShellCmd(cmd) {
  const key    = cmd.toLowerCase().trim();
  const preset = CMD_PRESETS[key];
  const resolved = preset ? preset.cmd : cmd;
  const bg       = preset ? !!preset.bg : false;

  // Background commands (emulators) must not block — spawn detached and return immediately
  if (bg) {
    try {
      const child = spawn(resolved, { cwd: ROOT, shell: true, stdio: 'ignore', detached: true });
      child.unref();
      return Promise.resolve({ ok: true, output: 'Lanzando emulador en background…' });
    } catch (err) {
      return Promise.resolve({ ok: false, output: err.message });
    }
  }

  return new Promise(resolve => {
    const child = spawn(resolved, { cwd: ROOT, shell: true, stdio: ['ignore', 'pipe', 'pipe'] });
    let out = '';
    child.stdout.on('data', d => { out += d; });
    child.stderr.on('data', d => { out += d; });
    child.on('close',  code => resolve({ ok: code === 0, output: out.trim() }));
    child.on('error',  err  => resolve({ ok: false, output: err.message }));
  });
}

// ─── HTTP helpers ─────────────────────────────────────────────────────────────

function readBody(req) {
  return new Promise(resolve => {
    let d = '';
    req.on('data', c => { d += c; });
    req.on('end',  () => { try { resolve(JSON.parse(d)); } catch (_) { resolve({}); } });
  });
}

function json(res, data, status) {
  res.writeHead(status || 200, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify(data));
}

// ─── HTTP server ──────────────────────────────────────────────────────────────

const server = http.createServer(async (req, res) => {
  const url = req.url.split('?')[0];

  res.setHeader('Access-Control-Allow-Origin',  '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') { res.writeHead(204); res.end(); return; }

  // SSE stream
  if (url === '/events' && req.method === 'GET') {
    res.writeHead(200, {
      'Content-Type':  'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection':    'keep-alive',
    });
    res.write('retry: 3000\n\n');
    res.write('event: init\ndata: ' + JSON.stringify({
      pipeline: state.pipeline,
      devices:  state.devices,
      results:  state.results,
      log:      state.log.slice(-150),
      running:  state.running,
    }) + '\n\n');
    state.sseClients.add(res);
    req.on('close', () => state.sseClients.delete(res));
    return;
  }

  // REST
  if (url === '/api/devices' && req.method === 'GET') {
    pollDevices();
    return json(res, state.devices);
  }

  if (url === '/api/specs' && req.method === 'GET') {
    return json(res, scanSpecs());
  }

  if (url === '/api/run' && req.method === 'POST') {
    const b = await readBody(req);
    const r = startRun(b);
    return json(res, r, r.ok ? 200 : 409);
  }

  if (url === '/api/stop' && req.method === 'POST') {
    if (state.proc) {
      const pid = state.proc.pid;
      if (process.platform === 'win32') {
        // On Windows, SIGTERM only kills the shell (cmd.exe); use taskkill /T to kill the full tree
        if (pid) try { execSync('taskkill /F /T /PID ' + pid, { shell: true }); } catch (_) {}
        try { state.proc.kill(); } catch (_) {}
      } else {
        state.proc.kill('SIGTERM');
      }
      state.running = false;  // set before close event fires to prevent duplicate run_end
      const ts = state.pipeline.find(s => s.id === 'tests');
      if (ts && ts.status === 'running') { ts.status = 'error'; broadcast('pipeline', state.pipeline); }
      broadcast('run_end', { code: -1, stopped: true });
      addLog('PIPELINE', 'Ejecución detenida por el usuario');
      return json(res, { ok: true });
    }
    return json(res, { ok: false, error: 'No hay proceso activo' });
  }

  if (url === '/api/command' && req.method === 'POST') {
    const { cmd } = await readBody(req);
    if (!cmd || !cmd.trim()) return json(res, { ok: false, error: 'cmd requerido' }, 400);
    addLog('CMD', '$ ' + cmd);
    const r = await runShellCmd(cmd.trim());
    if (r.output) addLog('CMD', r.output);
    return json(res, r);
  }

  if (url === '/api/reset' && req.method === 'POST') {
    if (!state.running) {
      state.log = [];
      state.results = { modules: {}, failures: [], currentTest: null, startTime: null, endTime: null };
      state.pipeline.forEach(s => { s.status = 'idle'; s.elapsed = null; });
      broadcast('pipeline', state.pipeline);
    }
    return json(res, { ok: !state.running });
  }

  // Real-time per-test results from wdio.conf.js afterTest hook
  if (url === '/api/test-event' && req.method === 'POST') {
    if (!state.running) return json(res, { ok: false });
    const { fullName, title, passed, duration } = await readBody(req);
    if (!title) return json(res, { ok: false });

    // Parse module bracket: "[auth] Login Screen should ..." → module = "[auth]"
    const modM = (fullName || '').match(/^\[([a-z]\w*)\]/);
    const module = modM ? '[' + modM[1] + ']' : '';

    // Derive describe name: strip module prefix and it title from fullName
    let describe = '';
    if (modM && fullName) {
      const afterMod = fullName.slice(modM[0].length).trim();
      if (afterMod.endsWith(title)) {
        describe = afterMod.slice(0, afterMod.length - title.length).trim();
      }
    }

    const status  = passed ? 'pass' : 'fail';
    const ms      = duration || null;
    const hookKey = state.currentSpec || module;
    const hookFolder = state.currentSpec ? state.currentSpec.split('/')[0]
                     : (module.match(/\[([^\]]+)\]/) || ['', ''])[1];

    if (!state.results.modules[hookKey]) {
      state.results.modules[hookKey] = { total: 0, pass: 0, fail: 0, skip: 0, tests: [], tag: module, folder: hookFolder };
    }
    const mod = state.results.modules[hookKey];
    mod.total++;
    if (status === 'pass') mod.pass++; else mod.fail++;

    const entry = { module, describe, it: title, status, ms };
    mod.tests.push(entry);
    if (status === 'fail') state.results.failures.push(Object.assign({}, entry, { error: '' }));

    state.hookResultsSeen.add(title);
    state.results.currentTest = { module, describe, it: '…', startMs: Date.now() };

    addLog('TEST', (status === 'pass' ? '✔' : '✖') + ' ' + (module ? module + ' ' : '') + title + (ms ? ' (' + ms + 'ms)' : ''));
    broadcast('test_result', entry);
    broadcast('current_test', state.results.currentTest);
    broadcast('results', state.results);

    return json(res, { ok: true });
  }

  if (url === '/api/status' && req.method === 'GET') {
    return json(res, {
      running: state.running,
      devices: state.devices.length,
      version: process.env.APP_VERSION || null,
    });
  }

  // HTML
  if (url === '/' || url === '/index.html') {
    res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
    res.end(buildHTML());
    return;
  }

  res.writeHead(404);
  res.end('Not found');
});

// ─── HTML ─────────────────────────────────────────────────────────────────────

function buildHTML() {
  return '<!DOCTYPE html>\n<html lang="es">\n<head>\n' +
'<meta charset="UTF-8">\n' +
'<title>QA Monitor</title>\n' +
'<meta name="viewport" content="width=device-width,initial-scale=1">\n' +
'<style>\n' +
CSS_BLOCK +
'\n</style>\n</head>\n<body>\n' +
HTML_BLOCK
  .replace('__LOGO_ICON__', LOGO_ICON_B64)
  .replace('__LOGO_TEXT__', LOGO_TEXT_B64) +
'\n<script>\n' +
JS_BLOCK +
'\n</script>\n</body>\n</html>';
}

// ─── CSS ──────────────────────────────────────────────────────────────────────

const CSS_BLOCK = `
*{box-sizing:border-box;margin:0;padding:0}
:root{
  --bg:#0d1117;--panel:#161b22;--border:#30363d;--border2:#21262d;
  --text:#e6edf3;--muted:#7d8590;--muted2:#484f58;
  --green:#3fb950;--red:#f85149;--yellow:#d29922;--blue:#388bfd;
  --purple:#bc8cff;--cyan:#79c0ff;--orange:#ffa657;
  --running:#58a6ff;--pass:#3fb950;--fail:#f85149;--skip:#7d8590;
}
html,body{height:100%;overflow:hidden}
body{background:var(--bg);color:var(--text);font:13px/1.5 -apple-system,BlinkMacSystemFont,'Segoe UI',monospace;display:flex;flex-direction:column}

/* ─── Top bar ─── */
.topbar{display:flex;align-items:center;gap:12px;padding:0 16px;height:48px;
  background:var(--panel);border-bottom:1px solid var(--border);flex-shrink:0;z-index:10}
.topbar .logo-icon{height:30px;border-radius:8px;flex-shrink:0}
.topbar .logo-text{height:18px;flex-shrink:0;filter:invert(1);mix-blend-mode:screen}
.topbar .pipeline-status{display:flex;align-items:center;gap:6px;font-size:12px;
  background:var(--border2);padding:4px 10px;border-radius:20px}
.status-dot{width:8px;height:8px;border-radius:50%;flex-shrink:0}
.status-dot.idle{background:var(--muted2)}
.status-dot.running{background:var(--running);animation:pulse 1.2s ease infinite}
.status-dot.done{background:var(--green)}
.status-dot.error{background:var(--red)}
@keyframes pulse{0%,100%{opacity:1}50%{opacity:.4}}
.topbar-spacer{flex:1}
.btn{display:inline-flex;align-items:center;gap:6px;padding:6px 14px;border-radius:6px;
  border:none;cursor:pointer;font:13px/1 inherit;font-weight:600;transition:opacity .15s}
.btn:disabled{opacity:.4;cursor:default}
.btn-run{background:#238636;color:#fff}
.btn-run:hover:not(:disabled){background:#2ea043}
.btn-stop{background:#b62324;color:#fff}
.btn-stop:hover:not(:disabled){background:#da3633}
.btn-clear{background:var(--border2);color:var(--muted);border:1px solid var(--border)}
.btn-clear:hover{color:var(--text)}

/* ─── Main layout ─── */
.main{display:flex;flex:1;overflow:hidden}

/* ─── Left panel ─── */
.left{width:290px;flex-shrink:0;background:var(--panel);border-right:1px solid var(--border);
  display:flex;flex-direction:column;overflow:hidden}
.lsect{flex-shrink:0}
.lsect-header{display:flex;align-items:center;justify-content:space-between;
  padding:8px 14px 6px;border-bottom:1px solid var(--border2)}
.lsect-title{font-size:11px;font-weight:700;color:var(--muted);letter-spacing:.08em;text-transform:uppercase}
.lsect-actions{display:flex;gap:4px}
.icon-btn{background:none;border:none;cursor:pointer;color:var(--muted);padding:2px 4px;
  border-radius:4px;font-size:13px;line-height:1}
.icon-btn:hover{color:var(--text);background:var(--border2)}

/* Devices list */
.device-list{padding:6px 0}
.device-item{display:flex;align-items:center;gap:8px;padding:6px 14px;
  cursor:pointer;transition:background .1s}
.device-item:hover{background:var(--border2)}
.device-item.selected{background:#161b22;border-left:2px solid var(--blue)}
.device-dot{width:8px;height:8px;border-radius:50%;flex-shrink:0}
.device-dot.online{background:var(--green)}
.device-dot.offline{background:var(--muted2)}
.device-info{flex:1;min-width:0}
.device-name{font-size:12px;font-weight:600;color:var(--text);truncate;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.device-meta{font-size:10px;color:var(--muted)}
.device-type-badge{font-size:9px;font-weight:700;padding:1px 5px;border-radius:3px;text-transform:uppercase;flex-shrink:0}
.device-type-badge.emulator{background:#21262d;color:var(--cyan)}
.device-type-badge.usb{background:#21262d;color:var(--green)}
.device-empty{padding:12px 14px;font-size:12px;color:var(--muted);font-style:italic}

/* Suites */
.suites-row{display:flex;flex-wrap:wrap;gap:6px;padding:8px 14px}
.suite-btn{padding:4px 12px;border-radius:20px;border:1px solid var(--border);
  background:var(--border2);color:var(--muted);font-size:11px;font-weight:600;cursor:pointer;transition:all .15s}
.suite-btn:hover{border-color:var(--muted);color:var(--text)}
.suite-btn.active{background:var(--blue);border-color:var(--blue);color:#fff}

/* Emulator launch panel */
.emu-panel{padding:6px 10px 8px;border-top:1px solid var(--border2)}
.emu-panel-title{font-size:10px;font-weight:700;color:var(--muted);letter-spacing:.08em;text-transform:uppercase;margin-bottom:5px}
.emu-btns{display:flex;flex-wrap:wrap;gap:4px}
.emu-btn{background:var(--surface2);border:1px solid var(--border);color:var(--text);
  font-size:10px;padding:3px 8px;border-radius:4px;cursor:pointer;transition:background .15s}
.emu-btn:hover{background:var(--border2);border-color:var(--cyan);color:var(--cyan)}
.emu-btn-all{background:var(--border2);border-color:var(--green);color:var(--green);font-weight:700}
.emu-btn-all:hover{background:#1a3a1a}

/* Spec search */
.spec-search{width:100%;box-sizing:border-box;background:var(--surface2);border:1px solid var(--border);
  color:var(--text);font-size:11px;padding:4px 8px;border-radius:4px;outline:none}
.spec-search:focus{border-color:var(--cyan)}
.spec-search::placeholder{color:var(--muted)}

/* Test tree */
.tree{flex:1;overflow-y:auto;padding:4px 0 8px}
.tree::-webkit-scrollbar{width:4px}
.tree::-webkit-scrollbar-track{background:transparent}
.tree::-webkit-scrollbar-thumb{background:var(--border);border-radius:2px}

.tree-folder,.tree-file,.tree-it{display:flex;align-items:flex-start;gap:6px;
  padding:3px 8px 3px 14px;cursor:pointer;transition:background .1s;
  border-radius:4px;margin:0 4px}
.tree-folder:hover,.tree-file:hover,.tree-it:hover{background:var(--border2)}
.tree-folder > .tree-label{font-size:11px;font-weight:700;color:var(--muted);text-transform:uppercase;letter-spacing:.05em}
.tree-file > .tree-label{font-size:11px;color:var(--cyan)}
.tree-it > .tree-label{font-size:11px;color:var(--text);padding-left:16px}
.tree-it.running > .tree-label{color:var(--running)}
.tree-it.pass > .tree-label{color:var(--pass)}
.tree-it.fail > .tree-label{color:var(--fail)}
.tree-it.skip > .tree-label{color:var(--muted)}
.tree-check{width:14px;height:14px;flex-shrink:0;margin-top:2px;accent-color:var(--blue)}
.tree-toggle{flex-shrink:0;color:var(--muted);font-size:10px;margin-top:2px;user-select:none}
.tree-children{padding-left:10px}
.tree-status-icon{font-size:11px;flex-shrink:0;width:14px;text-align:center}

/* Commands */
.cmd-presets{display:flex;flex-wrap:wrap;gap:4px;padding:6px 14px 8px}
.cmd-btn{padding:3px 10px;border:1px solid var(--border);border-radius:4px;
  background:var(--border2);color:var(--muted);font-size:10px;font-weight:600;cursor:pointer}
.cmd-btn:hover{border-color:var(--muted);color:var(--text)}
.cmd-input-row{display:flex;gap:6px;padding:0 10px 10px}
.cmd-input{flex:1;background:var(--bg);border:1px solid var(--border);border-radius:6px;
  color:var(--text);font:12px/1 inherit;padding:6px 10px;outline:none}
.cmd-input:focus{border-color:var(--blue)}
.cmd-send{padding:6px 10px;background:var(--blue);border:none;border-radius:6px;
  color:#fff;font:11px/1 inherit;font-weight:700;cursor:pointer}
.cmd-send:hover{background:#58a6ff}

/* ─── Right panel ─── */
.right{flex:1;overflow-y:auto;display:flex;flex-direction:column;gap:0}
.right::-webkit-scrollbar{width:6px}
.right::-webkit-scrollbar-track{background:transparent}
.right::-webkit-scrollbar-thumb{background:var(--border);border-radius:3px}

.rsect{border-bottom:1px solid var(--border2);padding:12px 16px}
.rsect-header{display:flex;align-items:center;justify-content:space-between;margin-bottom:10px}
.rsect-title{font-size:11px;font-weight:700;color:var(--muted);letter-spacing:.08em;text-transform:uppercase}
.rsect-badge{background:var(--border2);border-radius:20px;padding:1px 8px;font-size:10px;
  font-weight:700;color:var(--text)}

/* Pipeline stages */
.pipeline-row{display:flex;align-items:center;gap:0}
.stage{display:flex;flex-direction:column;align-items:center;flex:1;padding:10px 8px;
  border-radius:8px;border:1px solid transparent;transition:all .2s;position:relative}
.stage.idle{border-color:var(--border2)}
.stage.running{border-color:var(--running);background:#0d2044;animation:stage-pulse 2s ease infinite}
.stage.done{border-color:var(--green);background:#0a1f0f}
.stage.error{border-color:var(--red);background:#1e0a0a}
@keyframes stage-pulse{0%,100%{box-shadow:0 0 0 0 rgba(88,166,255,.3)}50%{box-shadow:0 0 0 6px rgba(88,166,255,0)}}
.stage-icon{font-size:18px;line-height:1}
.stage-label{font-size:11px;font-weight:700;color:var(--text);margin-top:4px}
.stage-time{font-size:10px;color:var(--muted);margin-top:2px;font-variant-numeric:tabular-nums}
.stage-arrow{color:var(--muted2);flex-shrink:0;font-size:16px;margin:0 4px;align-self:center}

/* Current test card */
.current-test-card{background:var(--border2);border:1px solid var(--border);border-radius:8px;
  padding:10px 14px;display:flex;flex-direction:column;gap:4px}
.current-test-card.idle{opacity:.5}
.current-label{font-size:10px;font-weight:700;color:var(--muted);letter-spacing:.06em;text-transform:uppercase}
.current-module{font-size:11px;font-weight:700;color:var(--cyan)}
.current-describe{font-size:12px;color:var(--text)}
.current-it{font-size:13px;font-weight:600;color:var(--running);display:flex;align-items:center;gap:8px}
.current-it .spinner{animation:spin 1s linear infinite;display:inline-block}
@keyframes spin{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}
.current-elapsed{font-size:10px;color:var(--muted);font-variant-numeric:tabular-nums}

/* Devices table */
table{width:100%;border-collapse:collapse}
th{text-align:left;font-size:10px;font-weight:700;color:var(--muted);letter-spacing:.06em;
  text-transform:uppercase;padding:4px 8px;border-bottom:1px solid var(--border2)}
td{padding:6px 8px;font-size:12px;border-bottom:1px solid var(--border2);vertical-align:middle}
tr:last-child td{border-bottom:none}
tr:hover td{background:rgba(48,54,61,.3)}
.td-device{display:flex;align-items:center;gap:6px;font-weight:600}
.progress-bar{height:4px;background:var(--border2);border-radius:2px;overflow:hidden;margin-top:3px;width:80px}
.progress-fill{height:100%;background:var(--blue);border-radius:2px;transition:width .5s}

/* Results columns */
.results-cols{display:flex;gap:12px}
.results-table{flex:1;min-width:0}
.failures-col{flex:1;min-width:0}
#failuresList{max-height:420px;overflow-y:auto;padding-right:2px}
#failuresList::-webkit-scrollbar{width:4px}
#failuresList::-webkit-scrollbar-track{background:transparent}
#failuresList::-webkit-scrollbar-thumb{background:#3a3a3a;border-radius:2px}
.failures-title{font-size:11px;font-weight:700;color:var(--muted);letter-spacing:.08em;text-transform:uppercase;margin-bottom:8px;display:flex;align-items:center;gap:6px}
.fail-card{background:#1e0a0a;border:1px solid #5a1a1a;border-radius:6px;padding:8px 10px;margin-bottom:6px}
.fail-card-name{font-size:12px;font-weight:700;color:var(--red)}
.fail-card-describe{font-size:11px;color:var(--muted);margin-top:2px}
.fail-card-error{font-size:10px;color:var(--orange);margin-top:4px;font-family:monospace;
  background:#160e00;border-radius:4px;padding:4px 6px;word-break:break-all}

/* Module result badge */
.pct-badge{display:inline-block;padding:1px 6px;border-radius:3px;font-size:10px;font-weight:700}
.pct-badge.good{background:#0a1f0f;color:var(--green)}
.pct-badge.warn{background:#1e1500;color:var(--yellow)}
.pct-badge.bad{background:#1e0a0a;color:var(--red)}
.pct-badge.na{color:var(--muted)}

/* Log */
.log-area{flex:1;min-height:200px;display:flex;flex-direction:column}
.log-toolbar{display:flex;align-items:center;gap:8px;flex-shrink:0;flex-wrap:wrap}
.log-filter-btn{padding:3px 10px;border-radius:12px;border:1px solid transparent;
  background:var(--border2);color:var(--muted);font-size:10px;font-weight:700;cursor:pointer;text-transform:uppercase}
.log-filter-btn.active{background:var(--blue);color:#fff;border-color:var(--blue)}
.log-filter-btn:hover:not(.active){border-color:var(--muted);color:var(--text)}
.log-autoscroll{display:flex;align-items:center;gap:6px;font-size:11px;color:var(--muted);margin-left:auto;cursor:pointer}
.log-entries{flex:1;overflow-y:auto;padding:6px 0;font-family:monospace;font-size:11px;
  background:var(--bg);border:1px solid var(--border2);border-radius:6px;margin-top:8px;min-height:160px;max-height:280px}
.log-entries::-webkit-scrollbar{width:4px}
.log-entries::-webkit-scrollbar-thumb{background:var(--border);border-radius:2px}
.log-line{display:flex;align-items:baseline;gap:8px;padding:1px 12px;line-height:1.6}
.log-line:hover{background:var(--border2)}
.log-ts{color:var(--muted2);flex-shrink:0;font-size:10px}
.log-type{flex-shrink:0;width:68px;font-weight:700;font-size:10px;text-transform:uppercase}
.log-type.PIPELINE{color:var(--purple)}
.log-type.TEST{color:var(--cyan)}
.log-type.ANÁLISIS{color:var(--yellow)}
.log-type.WDIO{color:var(--muted)}
.log-type.CMD{color:var(--orange)}
.log-type.ERROR{color:var(--red)}
.log-msg{color:var(--text);flex:1;white-space:pre-wrap;word-break:break-all}
.log-msg.pass{color:var(--green)}
.log-msg.fail{color:var(--red)}

/* Stat cells */
.stat-pass{color:var(--green);font-weight:700}
.stat-fail{color:var(--red);font-weight:700}
.stat-skip{color:var(--muted)}
.stat-na{color:var(--muted2)}

/* Scrollbar */
::-webkit-scrollbar{width:6px;height:6px}
::-webkit-scrollbar-track{background:transparent}
::-webkit-scrollbar-thumb{background:var(--border);border-radius:3px}
`;

// ─── HTML template ─────────────────────────────────────────────────────────────

const HTML_BLOCK = `
<!-- Top bar -->
<div class="topbar">
  <img class="logo-icon" src="data:image/png;base64,__LOGO_ICON__" alt="">
  <img class="logo-text" src="data:image/png;base64,__LOGO_TEXT__" alt="femmto">
  <div class="pipeline-status" id="topStatus">
    <div class="status-dot idle" id="topDot"></div>
    <span id="topStatusText">Listo</span>
  </div>
  <div class="topbar-spacer"></div>
  <button class="btn btn-run"   id="btnRun"  onclick="doRun()">▶ RUN</button>
  <button class="btn btn-stop"  id="btnStop" onclick="doStop()" disabled>■ STOP</button>
  <button class="btn btn-clear" onclick="clearLog()">Clear</button>
</div>

<!-- Main layout -->
<div class="main">

  <!-- LEFT PANEL -->
  <div class="left">

    <!-- Devices -->
    <div class="lsect">
      <div class="lsect-header">
        <span class="lsect-title">Dispositivos</span>
        <div class="lsect-actions">
          <button class="icon-btn" title="Actualizar" onclick="refreshDevices()">⟳</button>
        </div>
      </div>
      <div class="device-list" id="deviceList">
        <div class="device-empty">Detectando dispositivos…</div>
      </div>
      <div class="emu-panel">
        <div class="emu-panel-title">Emuladores</div>
        <div class="emu-btns">
          <button class="emu-btn" title="Android 17" onclick="launchEmulator('start pixel_7')">Pixel 7</button>
          <button class="emu-btn" title="Android 16" onclick="launchEmulator('start android16')">Pixel 9 Pro XL</button>
          <button class="emu-btn" title="Android 14" onclick="launchEmulator('start mainstream')">Mainstream</button>
          <button class="emu-btn" title="Android 13" onclick="launchEmulator('start midrange')">Mid Range</button>
          <button class="emu-btn emu-btn-all" onclick="launchAllEmulators()">▶ Todos</button>
        </div>
      </div>
    </div>

    <!-- Suites -->
    <div class="lsect">
      <div class="lsect-header">
        <span class="lsect-title">Suites</span>
      </div>
      <div class="suites-row">
        <button class="suite-btn active" data-suite="smoke"      onclick="selectSuite(this)">Smoke</button>
        <button class="suite-btn"        data-suite="regression" onclick="selectSuite(this)">Regression</button>
        <button class="suite-btn"        data-suite="critical"   onclick="selectSuite(this)">Critical</button>
        <button class="suite-btn"        data-suite=""           onclick="selectSuite(this)">Custom</button>
      </div>
    </div>

    <!-- Test cases -->
    <div class="lsect" style="flex:1;display:flex;flex-direction:column;overflow:hidden">
      <div class="lsect-header">
        <span class="lsect-title">Test Cases</span>
        <div class="lsect-actions">
          <button class="icon-btn" title="Recargar specs" onclick="loadSpecs()">⟳</button>
        </div>
      </div>
      <div style="padding:5px 8px 3px">
        <input id="specSearch" class="spec-search" placeholder="Buscar test…" oninput="filterSpecs(this.value)">
      </div>
      <div class="tree" id="specTree">
        <div class="device-empty">Cargando specs…</div>
      </div>
    </div>

    <!-- Commands -->
    <div class="lsect">
      <div class="lsect-header">
        <span class="lsect-title">Comandos</span>
      </div>
      <div class="cmd-presets">
        <button class="cmd-btn" onclick="sendCmd('adb devices')">ADB Devices</button>
        <button class="cmd-btn" onclick="sendCmd('appium status')">Appium Status</button>
        <button class="cmd-btn" onclick="sendCmd('start pixel_7')">Iniciar Pixel_7</button>
        <button class="cmd-btn" onclick="sendCmd('start mainstream')">Iniciar Mainstream</button>
      </div>
      <div class="cmd-input-row">
        <input class="cmd-input" id="cmdInput" placeholder="Escribí un comando…"
               onkeydown="if(event.key==='Enter') sendCmd(this.value)">
        <button class="cmd-send" onclick="sendCmd(document.getElementById('cmdInput').value)">▶</button>
      </div>
    </div>

  </div><!-- end left -->

  <!-- RIGHT PANEL -->
  <div class="right" id="rightPanel">

    <!-- Pipeline -->
    <div class="rsect">
      <div class="rsect-header">
        <span class="rsect-title">Pipeline</span>
      </div>
      <div class="pipeline-row" id="pipelineRow">
        <!-- rendered by JS -->
      </div>
    </div>

    <!-- Current test running -->
    <div class="rsect" id="currentTestSect">
      <div class="rsect-header">
        <span class="rsect-title">En ejecución</span>
        <span id="testElapsedBadge" class="rsect-badge" style="display:none"></span>
      </div>
      <div class="current-test-card idle" id="currentTestCard">
        <div class="current-label">Test activo</div>
        <div class="current-describe" id="ctDescribe" style="color:var(--muted);font-style:italic">Sin ejecución activa</div>
        <div class="current-it" id="ctIt" style="display:none">
          <span class="spinner">⟳</span>
          <span id="ctItLabel"></span>
        </div>
        <div class="current-elapsed" id="ctElapsed"></div>
      </div>
    </div>

    <!-- Devices table -->
    <div class="rsect">
      <div class="rsect-header">
        <span class="rsect-title">Dispositivos</span>
        <span class="rsect-badge" id="devicesBadge">0</span>
      </div>
      <table>
        <thead>
          <tr>
            <th>Dispositivo</th><th>Tipo</th><th>Estado</th>
            <th>Ejecución</th><th>API</th>
          </tr>
        </thead>
        <tbody id="devicesTableBody">
          <tr><td colspan="5" style="color:var(--muted);font-style:italic">Sin dispositivos conectados</td></tr>
        </tbody>
      </table>
    </div>

    <!-- Results + Failures -->
    <div class="rsect">
      <div class="results-cols">

        <!-- Module results -->
        <div class="results-table">
          <div class="rsect-header" style="margin-bottom:8px">
            <span class="rsect-title">Resultados por módulo</span>
          </div>
          <table>
            <thead>
              <tr>
                <th>Módulo</th><th>Total</th>
                <th style="color:var(--green)">✔</th>
                <th style="color:var(--red)">✖</th>
                <th style="color:var(--muted)">−</th>
                <th>% Éxito</th>
              </tr>
            </thead>
            <tbody id="resultsTableBody">
              <tr><td colspan="6" style="color:var(--muted);font-style:italic">Sin datos</td></tr>
            </tbody>
          </table>
        </div>

        <!-- Failures -->
        <div class="failures-col">
          <div class="failures-title">
            Fallos detectados
            <span class="rsect-badge" id="failBadge">0</span>
          </div>
          <div id="failuresList">
            <div style="font-size:11px;color:var(--muted);font-style:italic">Sin fallos</div>
          </div>
        </div>

      </div>
    </div>

    <!-- Live log -->
    <div class="rsect log-area">
      <div class="rsect-header">
        <span class="rsect-title">Log en vivo</span>
        <div class="log-toolbar">
          <button class="log-filter-btn active" data-filter="ALL"      onclick="setFilter(this)">Todos</button>
          <button class="log-filter-btn"        data-filter="PIPELINE" onclick="setFilter(this)">Pipeline</button>
          <button class="log-filter-btn"        data-filter="TEST"     onclick="setFilter(this)">Test</button>
          <button class="log-filter-btn"        data-filter="CMD"      onclick="setFilter(this)">CMD</button>
          <button class="log-filter-btn"        data-filter="WDIO"     onclick="setFilter(this)">WDIO</button>
          <button class="log-filter-btn" onclick="clearLogEntries()" style="margin-left:6px;border-color:var(--muted2)">🗑 Limpiar</button>
          <label class="log-autoscroll">
            <input type="checkbox" id="autoScrollChk" checked> Auto-scroll
          </label>
        </div>
      </div>
      <div class="log-entries" id="logEntries"></div>
    </div>

  </div><!-- end right -->

</div><!-- end main -->
`;

// ─── Browser-side JS ──────────────────────────────────────────────────────────

const JS_BLOCK = `
// State
var gSuite         = 'smoke';
var gCustomSpecs   = [];   // spec file paths to include in the run
var gItSelections  = {};   // specPath → [itName] for individual it() selections
var gHasFileChecks = false; // true when any file-level checkbox is checked
var gRunning       = false;
var gLogFilter     = 'ALL';
var gCurrentTest   = null;
var gElapsedTimer  = null;
var gRunStart      = null;
var gSpecs         = [];
var gResults       = { modules: {}, failures: [], currentTest: null };

// ─── SSE ───────────────────────────────────────────────────────────────────────
var es = new EventSource('/events');

es.addEventListener('init', function(e) {
  var d = JSON.parse(e.data);
  renderPipeline(d.pipeline);
  renderDevices(d.devices);
  if (d.log) d.log.forEach(appendLog);
  gRunning = d.running;
  gResults = d.results || gResults;
  renderResults();
  updateRunButtons();
});

es.addEventListener('pipeline',     function(e) { renderPipeline(JSON.parse(e.data)); });
es.addEventListener('devices',      function(e) { renderDevices(JSON.parse(e.data)); });
es.addEventListener('log',          function(e) { appendLog(JSON.parse(e.data)); });
es.addEventListener('results',      function(e) { gResults = JSON.parse(e.data); renderResults(); });
es.addEventListener('current_test', function(e) { setCurrentTest(JSON.parse(e.data)); });
es.addEventListener('test_result',  function(e) { updateTreeItem(JSON.parse(e.data)); });

es.addEventListener('run_start', function(e) {
  gRunning  = true;
  gRunStart = Date.now();
  updateRunButtons();
  setTopStatus('running', 'En ejecución…');
  clearResults();
  document.getElementById('testElapsedBadge').style.display = '';
  document.getElementById('testElapsedBadge').textContent = '00:00';
  startElapsedTimer();
});

es.addEventListener('run_end', function(e) {
  var d = JSON.parse(e.data);
  gRunning = false;
  updateRunButtons();
  stopElapsedTimer();
  clearCurrentTest();
  if (d.stopped) {
    setTopStatus('idle', 'Detenido');
  } else {
    var allPass = d.code === 0;
    setTopStatus(allPass ? 'done' : 'error', allPass ? 'Completado' : 'Hubo fallos');
  }
  // Reset all selections so the next run starts from a clean state.
  // Without this, selections from prior runs accumulate invisibly in gItSelections.
  gItSelections  = {};
  gHasFileChecks = false;
  gCustomSpecs   = [];
  document.querySelectorAll('.tree-check').forEach(function(cb) { cb.checked = false; });
  document.querySelectorAll('.suite-btn').forEach(function(b) { b.classList.remove('active'); });
  var smokeBtn = document.querySelector('[data-suite="smoke"]');
  if (smokeBtn) smokeBtn.classList.add('active');
  gSuite = 'smoke';
});

// ─── Actions ───────────────────────────────────────────────────────────────────
function doRun() {
  var specs = gCustomSpecs.length ? gCustomSpecs : undefined;
  var grep  = null;
  // Use grep only when individual it()s are selected without any file-level selections
  // (file-level means "run all tests in that file", incompatible with a global grep filter)
  if (!gHasFileChecks && Object.keys(gItSelections).length > 0) {
    var names = [];
    Object.keys(gItSelections).forEach(function(sp) {
      gItSelections[sp].forEach(function(n) { if (names.indexOf(n) < 0) names.push(n); });
    });
    if (names.length) grep = names.join('|');
  }
  var body = { suite: gSuite || undefined, specs: specs, grep: grep || undefined };
  fetch('/api/run', { method: 'POST', headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body) })
    .then(function(r) { return r.json(); })
    .then(function(r) {
      if (!r.ok && r.error === 'NO_DEVICE') {
        setTopStatus('error', 'Sin dispositivo');
        appendLog({ type: 'PIPELINE', ts: new Date().toISOString(),
          msg: '⚠  Sin dispositivos — iniciá un emulador o conectá un teléfono antes de correr tests.' });
      }
    })
    .catch(function() {});
}

function doStop() {
  fetch('/api/stop', { method: 'POST' });
}

function clearLog() {
  document.getElementById('logEntries').innerHTML = '';
  if (gRunning) return;  // mid-run: only clear the display, leave state intact
  stopElapsedTimer();
  gRunStart    = null;
  gCurrentTest = null;
  document.getElementById('testElapsedBadge').style.display  = 'none';
  document.getElementById('testElapsedBadge').textContent    = '00:00';
  clearCurrentTest();
  clearResults();
  setTopStatus('idle', 'Listo');
  renderPipeline([
    { id:'git',      label:'Git Pull',  status:'idle', elapsed:null },
    { id:'analysis', label:'Análisis',  status:'idle', elapsed:null },
    { id:'tests',    label:'Tests',     status:'idle', elapsed:null },
    { id:'report',   label:'Reporte',   status:'idle', elapsed:null },
    { id:'notify',   label:'Notificar', status:'idle', elapsed:null },
  ]);
  fetch('/api/reset', { method: 'POST' });
}

function refreshDevices() {
  fetch('/api/devices').then(function(r) { return r.json(); }).then(renderDevices);
}

function launchEmulator(cmd) {
  sendCmd(cmd);
}

function launchAllEmulators() {
  sendCmd('start pixel_7');
  setTimeout(function() { sendCmd('start android16');  }, 600);
  setTimeout(function() { sendCmd('start mainstream'); }, 1200);
  setTimeout(function() { sendCmd('start midrange');   }, 1800);
}

function loadSpecs() {
  fetch('/api/specs').then(function(r) { return r.json(); }).then(function(specs) {
    gSpecs = specs;
    renderSpecTree(specs, false);
  });
}

function filterSpecs(query) {
  var q = (query || '').trim().toLowerCase();
  if (!q) { renderSpecTree(gSpecs, false); return; }

  function filterNodes(nodes) {
    var out = [];
    nodes.forEach(function(n) {
      if (n.type === 'folder') {
        var ch = filterNodes(n.children);
        if (ch.length) out.push({ type: 'folder', name: n.name, children: ch });
      } else if (n.type === 'file') {
        var hits = n.its.filter(function(it) { return it.toLowerCase().indexOf(q) >= 0; });
        if (n.name.toLowerCase().indexOf(q) >= 0) {
          out.push(n);
        } else if (hits.length) {
          out.push({ type: 'file', name: n.name, path: n.path, its: hits });
        }
      }
    });
    return out;
  }
  renderSpecTree(filterNodes(gSpecs), true);
}

function sendCmd(cmd) {
  if (!cmd || !cmd.trim()) return;
  document.getElementById('cmdInput').value = '';
  fetch('/api/command', { method: 'POST', headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ cmd: cmd }) });
}

function selectSuite(btn) {
  document.querySelectorAll('.suite-btn').forEach(function(b) { b.classList.remove('active'); });
  btn.classList.add('active');
  gSuite = btn.dataset.suite;
  if (gSuite === '') {
    gSuite = null; // Custom: use checked spec files
  } else {
    // Clear all custom selections when switching to a preset suite
    gCustomSpecs   = [];
    gItSelections  = {};
    gHasFileChecks = false;
    document.querySelectorAll('.tree-check').forEach(function(cb) { cb.checked = false; });
  }
}

function setFilter(btn) {
  document.querySelectorAll('.log-filter-btn').forEach(function(b) { b.classList.remove('active'); });
  btn.classList.add('active');
  gLogFilter = btn.dataset.filter;
  applyLogFilter();
}

// ─── Pipeline ──────────────────────────────────────────────────────────────────
var STAGE_ICONS = { idle: '○', running: '⟳', done: '✔', error: '✖' };
var STAGE_COLORS = { idle: 'var(--muted2)', running: 'var(--running)', done: 'var(--green)', error: 'var(--red)' };

function renderPipeline(stages) {
  var row = document.getElementById('pipelineRow');
  var html = '';
  stages.forEach(function(s, i) {
    html += '<div class="stage ' + s.status + '">';
    html += '<div class="stage-icon" style="color:' + STAGE_COLORS[s.status] + '">' + STAGE_ICONS[s.status] + '</div>';
    html += '<div class="stage-label">' + s.label + '</div>';
    html += '<div class="stage-time">' + (s.elapsed != null ? fmtSec(s.elapsed) : '—') + '</div>';
    html += '</div>';
    if (i < stages.length - 1) html += '<div class="stage-arrow">→</div>';
  });
  row.innerHTML = html;
}

// ─── Devices ───────────────────────────────────────────────────────────────────
function deviceDotStyle(d) {
  if (d.state === 'unauthorized') return 'background:var(--yellow)';
  if (d.online) return 'background:var(--green)';
  return 'background:var(--muted2)';
}
function deviceStateLabel(d) {
  if (d.state === 'unauthorized') return '<span style="color:var(--yellow)">&#9888; Autorizar en equipo</span>';
  if (d.state === 'offline')      return '<span style="color:var(--muted)">Offline</span>';
  if (d.state === 'error')        return '<span style="color:var(--red)">Error ADB</span>';
  return '<span style="color:var(--green)">Activo</span>';
}

function renderDevices(devices) {
  document.getElementById('devicesBadge').textContent = devices.length;

  // Left panel list
  var list = document.getElementById('deviceList');
  if (!devices.length) {
    list.innerHTML = '<div class="device-empty">Sin dispositivos conectados</div>';
  } else {
    list.innerHTML = devices.map(function(d) {
      var warn = d.state === 'unauthorized'
        ? '<div style="font-size:10px;color:var(--yellow);margin-top:1px">&#9888; Aceptar autorizacion USB en el equipo</div>' : '';
      return '<div class="device-item">' +
        '<div class="device-dot" style="' + deviceDotStyle(d) + '"></div>' +
        '<div class="device-info">' +
          '<div class="device-name">' + esc(d.model) + '</div>' +
          '<div class="device-meta">' + esc(d.id) + (d.api ? ' &nbsp;API ' + d.api : '') + '</div>' +
          warn +
        '</div>' +
        '<div class="device-type-badge ' + d.type + '">' + d.type + '</div>' +
        '</div>';
    }).join('');
  }

  // Right panel table
  var tbody = document.getElementById('devicesTableBody');
  if (!devices.length) {
    tbody.innerHTML = '<tr><td colspan="5" style="color:var(--muted);font-style:italic">Sin dispositivos conectados</td></tr>';
    return;
  }
  tbody.innerHTML = devices.map(function(d) {
    var mod = gResults.modules;
    var total = 0, pass = 0;
    Object.keys(mod).forEach(function(k) { total += mod[k].total; pass += mod[k].pass; });
    var pct = total > 0 ? Math.round(pass / total * 100) : 0;
    return '<tr>' +
      '<td><div class="td-device">' +
        '<div class="device-dot" style="' + deviceDotStyle(d) + '"></div>' +
        esc(d.model) + '</div></td>' +
      '<td><span class="device-type-badge ' + d.type + '">' + d.type + '</span></td>' +
      '<td>' + deviceStateLabel(d) + '</td>' +
      '<td>' + (total > 0 && d.online ? (pass + ' / ' + total + ' (' + pct + '%)') + '<div class="progress-bar"><div class="progress-fill" style="width:' + pct + '%"></div></div>' : '—') + '</td>' +
      '<td style="color:var(--muted)">' + (d.api || '—') + '</td>' +
      '</tr>';
  }).join('');
}

// ─── Spec tree ──────────────────────────────────────────────────────────────────
function renderSpecTree(nodes, expanded) {
  var tree = document.getElementById('specTree');
  tree.innerHTML = renderTreeNodes(nodes, 0, !!expanded);
}

function renderTreeNodes(nodes, depth, expanded) {
  var arrow    = expanded ? '▾' : '▸';
  var display  = expanded ? '' : 'display:none';
  return nodes.map(function(n) {
    if (n.type === 'folder') {
      return '<div style="padding-left:' + (depth * 10) + 'px">' +
        '<div class="tree-folder" onclick="toggleFolder(this)">' +
          '<span class="tree-toggle">' + arrow + '</span>' +
          '<span class="tree-label">📁 ' + esc(n.name) + '</span>' +
        '</div>' +
        '<div class="tree-children" style="' + display + '">' + renderTreeNodes(n.children, depth + 1, expanded) + '</div>' +
        '</div>';
    }
    if (n.type === 'file') {
      var itsHtml = n.its.map(function(it) {
        return '<div class="tree-it" data-spec="' + esc(n.path) + '" data-it="' + esc(it) + '" id="ti_' + itId(n.path, it) + '">' +
          '<input type="checkbox" class="tree-check" onchange="onSpecCheck(event)">' +
          '<span class="tree-status-icon"> </span>' +
          '<span class="tree-label">' + esc(it) + '</span>' +
          '</div>';
      }).join('');
      return '<div style="padding-left:' + (depth * 10) + 'px">' +
        '<div class="tree-file" onclick="toggleFolder(this)">' +
          '<span class="tree-toggle">' + arrow + '</span>' +
          '<input type="checkbox" class="tree-check" data-fpath="' + esc(n.path) + '" onclick="event.stopPropagation()" onchange="onFileCheck(event)">' +
          '<span class="tree-label">' + esc(n.name) + '</span>' +
        '</div>' +
        '<div class="tree-children" style="' + display + '">' + itsHtml + '</div>' +
        '</div>';
    }
    return '';
  }).join('');
}

function itId(filePath, it) {
  var s = filePath + '|' + it;
  var h = 5381;
  for (var i = 0; i < s.length; i++) h = ((h * 33) ^ s.charCodeAt(i)) >>> 0;
  return 'it_' + h;
}

function toggleFolder(el) {
  var children = el.nextElementSibling;
  if (!children) return;
  var isOpen = children.style.display !== 'none';
  children.style.display = isOpen ? 'none' : '';
  var toggle = el.querySelector('.tree-toggle');
  if (toggle) toggle.textContent = isOpen ? '▸' : '▾';
}

function onFileCheck(e) {
  e.stopPropagation();
  var filePath = e.target.dataset.fpath;
  if (!filePath) return;
  var checked = e.target.checked;
  if (checked) {
    if (!gCustomSpecs.includes(filePath)) gCustomSpecs.push(filePath);
    delete gItSelections[filePath]; // file-level overrides individual it() selections
  } else {
    gCustomSpecs = gCustomSpecs.filter(function(s) { return s !== filePath; });
    delete gItSelections[filePath];
  }
  // Track whether any file-level checkboxes are active (disables grep when true)
  gHasFileChecks = document.querySelectorAll('.tree-file .tree-check:checked').length > 0;
  if (gCustomSpecs.length > 0 || Object.keys(gItSelections).length > 0) {
    document.querySelectorAll('.suite-btn').forEach(function(b) { b.classList.remove('active'); });
    document.querySelector('[data-suite=""]').classList.add('active');
    gSuite = null;
  } else {
    document.querySelectorAll('.suite-btn').forEach(function(b) { b.classList.remove('active'); });
    document.querySelector('[data-suite="smoke"]').classList.add('active');
    gSuite = 'smoke';
  }
}

function onSpecCheck(e) {
  e.stopPropagation();
  var treeIt = e.target.closest('.tree-it');
  if (!treeIt) return;
  var specPath = treeIt.dataset.spec;
  var itName   = treeIt.dataset.it;
  if (!specPath || !itName) return;
  var checked = e.target.checked;
  if (checked) {
    // Track this specific it() name under its spec file
    if (!gItSelections[specPath]) gItSelections[specPath] = [];
    if (gItSelections[specPath].indexOf(itName) < 0) gItSelections[specPath].push(itName);
    if (!gCustomSpecs.includes(specPath)) gCustomSpecs.push(specPath);
    document.querySelectorAll('.suite-btn').forEach(function(b) { b.classList.remove('active'); });
    document.querySelector('[data-suite=""]').classList.add('active');
    gSuite = null;
  } else {
    // Remove this it() from individual selections
    if (gItSelections[specPath]) {
      gItSelections[specPath] = gItSelections[specPath].filter(function(n) { return n !== itName; });
      if (gItSelections[specPath].length === 0) delete gItSelections[specPath];
    }
    // Remove spec from run list if neither individual its nor file-level checkbox remain
    var hasItSel = gItSelections[specPath] && gItSelections[specPath].length > 0;
    var fileChks = document.querySelectorAll('.tree-check[data-fpath]');
    var fileChecked = false;
    for (var fi = 0; fi < fileChks.length; fi++) {
      if (fileChks[fi].dataset.fpath === specPath && fileChks[fi].checked) { fileChecked = true; break; }
    }
    if (!hasItSel && !fileChecked) {
      gCustomSpecs = gCustomSpecs.filter(function(s) { return s !== specPath; });
    }
    if (gCustomSpecs.length === 0 && Object.keys(gItSelections).length === 0) {
      document.querySelectorAll('.suite-btn').forEach(function(b) { b.classList.remove('active'); });
      document.querySelector('[data-suite="smoke"]').classList.add('active');
      gSuite = 'smoke';
    }
  }
}

function updateTreeItem(testResult) {
  // Try to find the matching tree-it node by its label
  var els = document.querySelectorAll('.tree-it');
  for (var i = 0; i < els.length; i++) {
    var el = els[i];
    if (el.dataset.it === testResult.it) {
      el.className = 'tree-it ' + testResult.status;
      var icon = el.querySelector('.tree-status-icon');
      if (icon) {
        icon.textContent = testResult.status === 'pass' ? '✔' : testResult.status === 'fail' ? '✖' : '−';
        icon.style.color = testResult.status === 'pass' ? 'var(--green)' : testResult.status === 'fail' ? 'var(--red)' : 'var(--muted)';
      }
    }
  }
  // If currently highlighted, also remove running class
  if (testResult.status !== 'running') {
    var els2 = document.querySelectorAll('.tree-it.running');
    els2.forEach(function(el) { if (el.dataset.it === testResult.it) el.classList.remove('running'); });
  }
}

// ─── Current test card ──────────────────────────────────────────────────────────
function setCurrentTest(t) {
  gCurrentTest = t;
  var card = document.getElementById('currentTestCard');
  if (!t) {
    card.className = 'current-test-card idle';
    document.getElementById('ctDescribe').textContent = 'Sin ejecución activa';
    document.getElementById('ctDescribe').style.color  = 'var(--muted)';
    document.getElementById('ctDescribe').style.fontStyle = 'italic';
    document.getElementById('ctIt').style.display = 'none';
    document.getElementById('ctElapsed').textContent = '';
    return;
  }
  card.className = 'current-test-card';
  var desc = (t.module ? t.module + ' ' : '') + (t.describe || '');
  // Fallback: show spec file name while describe hasn't been parsed yet
  // (WDIO spec reporter flushes describe/test output after the spec file completes)
  if (!desc && t.file) {
    var f = t.file;
    if (f.indexOf('tests/specs/') === 0) f = f.slice('tests/specs/'.length);
    if (f.slice(-8) === '.spec.js') f = f.slice(0, -8);
    desc = f;
  }
  document.getElementById('ctDescribe').textContent  = desc || 'Iniciando…';
  document.getElementById('ctDescribe').style.color  = t.describe ? 'var(--cyan)' : 'var(--muted)';
  document.getElementById('ctDescribe').style.fontStyle = t.describe ? 'normal' : 'italic';
  if (t.it && t.it !== '…') {
    document.getElementById('ctItLabel').textContent  = t.it;
    document.getElementById('ctIt').style.display     = 'flex';
  } else {
    document.getElementById('ctIt').style.display = 'none';
  }
  document.getElementById('testElapsedBadge').style.display = '';

  // Highlight in tree
  document.querySelectorAll('.tree-it.running').forEach(function(el) { el.classList.remove('running'); });
  if (t.it) {
    document.querySelectorAll('.tree-it').forEach(function(el) {
      if (el.dataset.it === t.it) el.classList.add('running');
    });
  }
}

function clearCurrentTest() { setCurrentTest(null); }

// ─── Results ───────────────────────────────────────────────────────────────────
function clearResults() {
  gResults = { modules: {}, failures: [], currentTest: null };
  renderResults();
  document.querySelectorAll('.tree-it').forEach(function(el) {
    el.className = 'tree-it';
    var icon = el.querySelector('.tree-status-icon');
    if (icon) { icon.textContent = ' '; icon.style.color = ''; }
  });
}

function renderResults() {
  var modules = gResults.modules || {};
  var failures = gResults.failures || [];

  document.getElementById('failBadge').textContent = failures.length;

  // Module table
  var tbody = document.getElementById('resultsTableBody');
  var keys = Object.keys(modules).sort();
  if (!keys.length) {
    tbody.innerHTML = '<tr><td colspan="6" style="color:var(--muted);font-style:italic">Sin datos</td></tr>';
  } else {
    var totalRow = { total: 0, pass: 0, fail: 0, skip: 0 };
    var curFolder = null;
    var html = '';
    keys.forEach(function(k) {
      var m = modules[k];
      totalRow.total += m.total; totalRow.pass += m.pass;
      totalRow.fail  += m.fail;  totalRow.skip  += m.skip;
      var pct = m.total > 0 ? Math.round(m.pass / m.total * 100) : null;
      var pctClass = pct === null ? 'na' : pct === 100 ? 'good' : pct >= 80 ? 'warn' : 'bad';

      // Folder header row
      var folder = m.folder || (k.includes('/') ? k.split('/')[0] : '');
      var label  = k.includes('/') ? k.split('/').slice(1).join('/') : k;
      if (folder && folder !== curFolder) {
        curFolder = folder;
        html += '<tr style="background:rgba(0,180,216,.06)">' +
          '<td colspan="6" style="color:var(--cyan);font-size:10px;font-weight:700;letter-spacing:.05em;padding:3px 8px;opacity:.8">' +
          esc(folder + '/') + '</td></tr>';
      }

      html += '<tr' + (m.fail > 0 ? ' style="background:rgba(248,81,73,.05)"' : '') + '>' +
        '<td style="' + (folder ? 'padding-left:14px' : 'font-weight:700;color:var(--cyan)') + '">' + esc(label) + '</td>' +
        '<td>' + m.total + '</td>' +
        '<td class="stat-pass">' + (m.pass || '—') + '</td>' +
        '<td class="stat-fail">' + (m.fail || '—') + '</td>' +
        '<td class="stat-skip">' + (m.skip || '—') + '</td>' +
        '<td><span class="pct-badge ' + pctClass + '">' + (pct !== null ? pct + '%' : '—') + '</span></td>' +
        '</tr>';
    });
    var tpct = totalRow.total > 0 ? Math.round(totalRow.pass / totalRow.total * 100) : null;
    html += '<tr style="border-top:1px solid var(--border);font-weight:700">' +
      '<td style="color:var(--text)">Total</td>' +
      '<td>' + totalRow.total + '</td>' +
      '<td class="stat-pass">' + (totalRow.pass || '—') + '</td>' +
      '<td class="stat-fail">' + (totalRow.fail || '—') + '</td>' +
      '<td class="stat-skip">' + (totalRow.skip || '—') + '</td>' +
      '<td><span class="pct-badge ' + (tpct === null ? 'na' : tpct === 100 ? 'good' : tpct >= 80 ? 'warn' : 'bad') + '">' + (tpct !== null ? tpct + '%' : '—') + '</span></td>' +
      '</tr>';
    tbody.innerHTML = html;
  }

  // Failures
  var failDiv = document.getElementById('failuresList');
  if (!failures.length) {
    failDiv.innerHTML = '<div style="font-size:11px;color:var(--muted);font-style:italic">Sin fallos</div>';
  } else {
    failDiv.innerHTML = failures.map(function(f) {
      return '<div class="fail-card">' +
        '<div class="fail-card-name">✖ ' + esc(f.it || f.label || '') + '</div>' +
        '<div class="fail-card-describe">' + esc((f.module || '') + ' ' + (f.describe || '')) + '</div>' +
        (f.error ? '<div class="fail-card-error">' + esc(f.error) + '</div>' : '') +
        '</div>';
    }).join('');
  }

  // Update devices table progress
  renderDevices(window._lastDevices || []);
}

// ─── Log ───────────────────────────────────────────────────────────────────────
function appendLog(entry) {
  var container = document.getElementById('logEntries');
  var show = gLogFilter === 'ALL' || entry.type === gLogFilter;
  var div = document.createElement('div');
  div.className = 'log-line';
  div.dataset.type = entry.type;
  if (!show) div.style.display = 'none';

  var ts = entry.ts ? entry.ts.substr(11, 8) : '';
  var msgClass = entry.msg && entry.msg.startsWith('✔') ? 'pass' :
                 entry.msg && (entry.msg.startsWith('✖') || entry.msg.startsWith('ERROR')) ? 'fail' : '';

  div.innerHTML =
    '<span class="log-ts">' + esc(ts) + '</span>' +
    '<span class="log-type ' + esc(entry.type) + '">' + esc(entry.type) + '</span>' +
    '<span class="log-msg ' + msgClass + '">' + esc(entry.msg || '') + '</span>';

  container.appendChild(div);

  var chk = document.getElementById('autoScrollChk');
  if (chk && chk.checked) container.scrollTop = container.scrollHeight;

  // Cap at 1000 lines
  while (container.children.length > 1000) container.removeChild(container.firstChild);
}

function clearLogEntries() {
  document.getElementById('logEntries').innerHTML = '';
}

function applyLogFilter() {
  document.querySelectorAll('#logEntries .log-line').forEach(function(el) {
    el.style.display = (gLogFilter === 'ALL' || el.dataset.type === gLogFilter) ? '' : 'none';
  });
}

// ─── UI helpers ────────────────────────────────────────────────────────────────
function updateRunButtons() {
  document.getElementById('btnRun').disabled  = gRunning;
  document.getElementById('btnStop').disabled = !gRunning;
}

function setTopStatus(state, text) {
  var dot = document.getElementById('topDot');
  dot.className = 'status-dot ' + state;
  document.getElementById('topStatusText').textContent = text;
}

function startElapsedTimer() {
  stopElapsedTimer();
  gElapsedTimer = setInterval(function() {
    // Always tick run-level badge from run start
    if (gRunStart) {
      var runS = Math.floor((Date.now() - gRunStart) / 1000);
      document.getElementById('testElapsedBadge').textContent = fmtSec(runS);
    }
    // Tick per-test elapsed inside the current-test card
    if (gCurrentTest && gCurrentTest.startMs) {
      var testS = Math.floor((Date.now() - gCurrentTest.startMs) / 1000);
      var el = document.getElementById('ctElapsed');
      if (el) el.textContent = fmtSec(testS);
    }
  }, 1000);
}

function stopElapsedTimer() {
  if (gElapsedTimer) { clearInterval(gElapsedTimer); gElapsedTimer = null; }
}

function fmtSec(s) {
  var m = Math.floor(s / 60);
  var sec = s % 60;
  return (m < 10 ? '0' : '') + m + ':' + (sec < 10 ? '0' : '') + sec;
}

function esc(s) {
  if (s == null) return '';
  return String(s)
    .replace(/&/g,'&amp;')
    .replace(/</g,'&lt;')
    .replace(/>/g,'&gt;')
    .replace(/"/g,'&quot;');
}

// ─── Patch renderDevices to save last devices ──────────────────────────────────
var _origRenderDevices = renderDevices;
renderDevices = function(devices) { window._lastDevices = devices; _origRenderDevices(devices); };

// ─── Init ──────────────────────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', function() {
  renderPipeline([
    { id:'git', label:'Git Pull', status:'idle', elapsed:null },
    { id:'analysis', label:'Análisis', status:'idle', elapsed:null },
    { id:'tests', label:'Tests', status:'idle', elapsed:null },
    { id:'report', label:'Reporte', status:'idle', elapsed:null },
    { id:'notify', label:'Notificar', status:'idle', elapsed:null },
  ]);
  loadSpecs();
  refreshDevices();
});
`;

// ─── Start ────────────────────────────────────────────────────────────────────

server.listen(PORT, () => {
  const url = 'http://localhost:' + PORT;
  console.log('');
  console.log('  ┌──────────────────────────────────────────────┐');
  console.log('  │  QA Monitor                                  │');
  console.log('  │  ' + url + '                    │');
  console.log('  └──────────────────────────────────────────────┘');
  console.log('');
  try { execSync('start ' + url, { shell: true }); } catch (_) {}
});
