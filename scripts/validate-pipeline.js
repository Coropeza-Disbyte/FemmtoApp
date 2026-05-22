/**
 * validate-pipeline.js
 *
 * Valida etapas 1 y 2 del pipeline con display en tiempo real:
 *   - Timer en vivo con barra de progreso y ETA por etapa
 *   - Output del subproceso visible mientras corre
 *   - Resumen final con tiempos reales
 *
 * Uso:
 *   npm run pipeline:validate           → etapas 1 + 2a + 2b (completo)
 *   npm run pipeline:validate:smoke     → etapas 1 + 2a (rápido, sin análisis)
 */

require('dotenv').config({ path: require('path').join(__dirname, '..', '.env') });

const { execSync, spawn } = require('child_process');
const path = require('path');
const fs   = require('fs');

const FRAMEWORK_ROOT = path.resolve(__dirname, '..');
const RN_REPO_PATH   = process.env.RN_REPO_PATH;

// Estimaciones de duración por etapa (segundos)
const EST = {
  gitPull:        15,
  claudeSmoke:    45,
  claudeAnalysis: 480,   // ~8 min típico para análisis real
};

// ─── Terminal helpers ──────────────────────────────────────────────────────────

const COLS = 70;

function clearLine() {
  process.stdout.write(`\r${' '.repeat(COLS)}\r`);
}

function fmt(secs) {
  const m = Math.floor(secs / 60);
  const s = Math.floor(secs % 60);
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
}

function bar(pct, width) {
  const filled = Math.min(width, Math.floor(pct / 100 * width));
  return '[' + '█'.repeat(filled) + '░'.repeat(width - filled) + ']';
}

// ─── StageTimer ────────────────────────────────────────────────────────────────
//
// Dibuja una línea de progreso que se actualiza en tiempo real.
// Cuando el subproceso emite output, la línea se limpia, se imprime
// el output y luego se redibuja el timer, sin solapamiento.

class StageTimer {
  constructor(estimatedSecs) {
    this.est    = estimatedSecs;
    this.start  = null;
    this._iv    = null;
    this._alive = false;
    this._hold  = false;  // pausa el redibujado mientras se imprime output
  }

  begin() {
    this.start  = Date.now();
    this._alive = true;
    this._draw();
    this._iv = setInterval(() => this._draw(), 1000);
  }

  _elapsed() { return (Date.now() - (this.start || Date.now())) / 1000; }

  _draw() {
    if (!this._alive || this._hold) return;
    const el  = this._elapsed();
    const pct = Math.min(100, (el / this.est) * 100);
    const rem = Math.max(0, this.est - el);
    const eta = rem > 0
      ? `  ~${fmt(rem)} restantes`
      : '  (superando estimación)';
    process.stdout.write(
      `\r  ⟳  ${fmt(el)} ${bar(pct, 18)} ${String(Math.floor(pct)).padStart(3)}%${eta}   `
    );
  }

  // Llamar ANTES de imprimir una línea de output
  hold() {
    this._hold = true;
    clearLine();
  }

  // Llamar DESPUÉS de imprimir una línea de output
  release() {
    this._hold = false;
    this._draw();
  }

  end(ok) {
    clearInterval(this._iv);
    this._alive = false;
    clearLine();
    const el   = this._elapsed();
    const icon = ok ? '✔' : '✖';
    const lbl  = ok ? 'OK' : 'FALLÓ';
    console.log(`  ${icon}  ${lbl} — tiempo real: ${fmt(el)} (${Math.floor(el)}s)`);
    return el;
  }
}

// ─── Section / banner helpers ──────────────────────────────────────────────────

function section(title) {
  console.log('');
  console.log('─'.repeat(54));
  console.log(`  ${title}`);
  console.log('─'.repeat(54));
}

function banner(title) {
  console.log('');
  console.log('═'.repeat(54));
  console.log(`  ${title}`);
  console.log('═'.repeat(54));
}

function logLine(msg, level = 'INFO') {
  const icons = { INFO: ' ', OK: '✔', FAIL: '✖', STEP: '▶', WARN: '⚠' };
  console.log(`  ${icons[level] || ' '}  ${msg}`);
}

// ─── Subprocess runner (async, output visible en tiempo real) ──────────────────

function runProc(exe, args, opts, timer) {
  return new Promise(resolve => {
    const useShell = !exe.endsWith('.exe');

    const child = spawn(exe, args, {
      cwd:     opts.cwd || FRAMEWORK_ROOT,
      shell:   useShell,
      stdio:   ['inherit', 'pipe', 'pipe'],
      timeout: opts.timeout,
    });

    function handleChunk(chunk) {
      const lines = chunk.toString().split(/\r?\n/);
      for (const raw of lines) {
        const line = raw.trimEnd();
        if (!line) continue;
        timer.hold();
        process.stdout.write(`  │  ${line}\n`);
        timer.release();
      }
    }

    child.stdout.on('data', handleChunk);
    child.stderr.on('data', handleChunk);

    child.on('error', err  => resolve({ ok: false, error: err }));
    child.on('close', code => resolve({ ok: code === 0, code }));
  });
}

// ─── Localizar ejecutables ─────────────────────────────────────────────────────

function findClaudeExe() {
  const appdata = process.env.APPDATA;
  if (appdata) {
    const p = path.join(appdata, 'npm', 'node_modules', '@anthropic-ai', 'claude-code', 'bin', 'claude.exe');
    if (fs.existsSync(p)) return p;
  }
  try {
    const out   = execSync('where claude', { encoding: 'utf8', shell: true });
    const lines = out.trim().split(/\r?\n/).map(l => l.trim()).filter(Boolean);
    return lines.find(l => l.endsWith('.exe'))
        || lines.find(l => l.endsWith('.cmd'))
        || lines[0];
  } catch {}
  return 'claude';
}

// ─── Etapa 1 — Git pull ────────────────────────────────────────────────────────

async function validateGitPull() {
  section('ETAPA 1 — Git pull repo RN');

  if (!RN_REPO_PATH) {
    logLine('RN_REPO_PATH no configurado en .env', 'FAIL');
    return false;
  }
  if (!fs.existsSync(RN_REPO_PATH)) {
    logLine(`Ruta no encontrada: ${RN_REPO_PATH}`, 'FAIL');
    return false;
  }

  logLine(`Repo: ${RN_REPO_PATH}`, 'STEP');
  logLine(`Tiempo estimado: ~${EST.gitPull}s`, 'INFO');
  console.log('');

  const timer = new StageTimer(EST.gitPull);
  timer.begin();

  const result = await runProc('git', ['-C', RN_REPO_PATH, 'pull'], { timeout: 90_000 }, timer);

  timer.end(result.ok);

  if (!result.ok) {
    logLine(`Git pull falló${result.error ? ': ' + result.error.message : ''}`, 'FAIL');
  }
  return result.ok;
}

// ─── Etapa 2a — Smoke test Claude CLI ─────────────────────────────────────────

async function validateClaudeSmoke(claudeExe) {
  section('ETAPA 2a — Smoke test Claude CLI');

  const prompt = 'Responde SOLO con la palabra OK (sin explicación, sin puntuación adicional).';

  logLine(`Ejecutable: ${claudeExe}`, 'STEP');
  logLine(`Tiempo estimado: ~${EST.claudeSmoke}s`, 'INFO');
  console.log('');

  const timer = new StageTimer(EST.claudeSmoke);
  timer.begin();

  const result = await runProc(claudeExe, ['--print', prompt], { timeout: 90_000 }, timer);

  timer.end(result.ok);

  if (!result.ok) {
    logLine('Claude CLI no respondió — verificá: npm i -g @anthropic-ai/claude-code', 'FAIL');
  }
  return result.ok;
}

// ─── Etapa 2b — Análisis real ──────────────────────────────────────────────────

async function validateClaudeAnalysis(claudeExe) {
  section('ETAPA 2b — Análisis real (build fix versión activa)');

  const version    = process.env.APP_VERSION;
  const apkPath    = process.env.APP_PATH || '';
  const buildMatch = apkPath.match(/\((\d+)\)/);
  const build      = buildMatch ? parseInt(buildMatch[1], 10) : 0;
  const prevBuild  = build > 0 ? build - 1 : 0;

  if (!version) {
    logLine('APP_VERSION no configurado en .env — no se puede construir el prompt', 'FAIL');
    return false;
  }

  const prompt = [
    `[PIPELINE QA AUTOMÁTICO] BUILD FIX: v${version} build anterior ${prevBuild} — mismo X.Y.Z.`,
    'Ejecuta SOLO Fases 1 y 2 del protocolo de análisis (análisis + docs).',
    'NO actualizar el test plan porque es un build fix del mismo X.Y.Z.',
    `Repo RN: ${RN_REPO_PATH || 'ver RN_REPO_PATH en .env'}.`,
    'Seguir las reglas definidas en CLAUDE.md sección "Pipeline automático".',
  ].join(' ');

  logLine(`Versión activa: v${version}${build ? ` (build ${build})` : ''}`, 'STEP');
  logLine(`Tiempo estimado: ~${Math.floor(EST.claudeAnalysis / 60)} min`, 'INFO');
  console.log('');

  const timer = new StageTimer(EST.claudeAnalysis);
  timer.begin();

  const result = await runProc(claudeExe, ['--print', prompt], { timeout: 1_200_000 }, timer);

  timer.end(result.ok);

  if (!result.ok) logLine('Análisis falló', 'FAIL');
  return result.ok;
}

// ─── Main ──────────────────────────────────────────────────────────────────────

async function main() {
  const args      = process.argv.slice(2);
  const smokeOnly = args.includes('--smoke');

  banner('VALIDATE PIPELINE — Etapas 1 y 2');

  const claudeExe = findClaudeExe();
  logLine(`Claude:  ${claudeExe}`, 'INFO');

  const totalEst = smokeOnly
    ? EST.gitPull + EST.claudeSmoke
    : EST.gitPull + EST.claudeSmoke + EST.claudeAnalysis;

  logLine(`Tiempo total estimado: ~${fmt(totalEst)}${smokeOnly ? ' (modo smoke)' : ''}`, 'INFO');

  const t0 = Date.now();

  const step1  = await validateGitPull();
  const step2a = await validateClaudeSmoke(claudeExe);
  const step2b = smokeOnly ? null : (step2a ? await validateClaudeAnalysis(claudeExe) : false);

  const totalSecs = Math.floor((Date.now() - t0) / 1000);

  // ─── Resumen final ────────────────────────────────────────────────────────────
  banner('RESULTADO FINAL');

  const ok   = v => v ? '✔  OK   ' : '✖  FALLÓ';
  const skip = '─  omitido (--smoke)';

  logLine(`Etapa 1 — Git pull:          ${ok(step1)}`);
  logLine(`Etapa 2a — Claude smoke:     ${ok(step2a)}`);
  logLine(`Etapa 2b — Análisis real:    ${step2b === null ? skip : ok(step2b)}`);
  console.log('');
  logLine(`Tiempo total real:           ${fmt(totalSecs)} (${totalSecs}s)`);

  const passed = step1 && step2a && (step2b === null || step2b);

  console.log('');
  if (passed) {
    console.log('  ✔  Pipeline listo — las etapas críticas funcionan correctamente.');
  } else {
    console.log('  ✖  Una o más etapas fallaron — revisar output de cada etapa.');
  }
  console.log('');

  process.exit(passed ? 0 : 1);
}

main().catch(err => {
  console.error('\n  [ERROR] Fallo inesperado:', err.message);
  process.exit(1);
});
