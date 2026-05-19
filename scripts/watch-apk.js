/**
 * watch-apk.js
 *
 * Monitorea la raíz del framework en busca de APKs nuevos.
 * Cuando detecta un .apk con versión/build mayor al activo en .env,
 * actualiza .env y dispara el pipeline completo.
 *
 * Opcionalmente también monitorea DRIVE_APK_PATH si está configurado y accesible.
 *
 * Uso:
 *   npm run watch:apk
 */

require('dotenv').config();

const chokidar  = require('chokidar');
const path      = require('path');
const fs        = require('fs');
const { spawn } = require('child_process');

// ─── Configuración ───────────────────────────────────────────────────────────

const FRAMEWORK_ROOT = path.resolve(__dirname, '..');
const DRIVE_FOLDER   = process.env.DRIVE_APK_PATH || '';
const REGISTRY_FILE  = path.join(__dirname, '.apk-registry.json');
const ENV_FILE       = path.join(FRAMEWORK_ROOT, '.env');

// ─── Helpers ─────────────────────────────────────────────────────────────────

/**
 * Parsea nombre de APK local: 4.0.0(1023).apk
 */
function parseApkFilename(filename) {
  // Con build: 4.0.0(1023).apk
  const withBuild = filename.match(/^(\d+\.\d+\.\d+)\((\d+)\)\.apk$/);
  if (withBuild) return { version: withBuild[1], build: parseInt(withBuild[2], 10) };

  // Sin build: 3.1.0.apk
  const withoutBuild = filename.match(/^(\d+\.\d+\.\d+)\.apk$/);
  if (withoutBuild) return { version: withoutBuild[1], build: 0 };

  return null;
}

/**
 * Parsea nombre de ZIP de Drive: 4.0.0(1023).apk.zip
 */
function parseZipFilename(filename) {
  const match = filename.match(/^(\d+\.\d+\.\d+)\((\d+)\)\.apk\.zip$/);
  if (!match) return null;
  return { version: match[1], build: parseInt(match[2], 10) };
}

function loadRegistry() {
  if (!fs.existsSync(REGISTRY_FILE)) return {};
  try { return JSON.parse(fs.readFileSync(REGISTRY_FILE, 'utf8')); } catch { return {}; }
}

function saveRegistry(registry) {
  fs.writeFileSync(REGISTRY_FILE, JSON.stringify(registry, null, 2));
}

function getCurrentFromEnv() {
  if (!fs.existsSync(ENV_FILE)) return { version: '', build: 0 };
  const content    = fs.readFileSync(ENV_FILE, 'utf8');
  const version    = (content.match(/^APP_VERSION=(.+)$/m) || [])[1]?.trim() || '';
  const apkPath    = (content.match(/^APP_PATH=(.+)$/m)    || [])[1]?.trim() || '';
  const buildMatch = apkPath.match(/\((\d+)\)/);
  return { version, build: buildMatch ? parseInt(buildMatch[1], 10) : 0 };
}

function updateEnv(version, apkFilename) {
  let content = fs.existsSync(ENV_FILE) ? fs.readFileSync(ENV_FILE, 'utf8') : '';
  const apkPath = `./${apkFilename}`;

  content = content.match(/^APP_VERSION=.*/m)
    ? content.replace(/^APP_VERSION=.*/m, `APP_VERSION=${version}`)
    : content + `\nAPP_VERSION=${version}`;

  content = content.match(/^APP_PATH=.*/m)
    ? content.replace(/^APP_PATH=.*/m, `APP_PATH=${apkPath}`)
    : content + `\nAPP_PATH=${apkPath}`;

  // Remove trailing empty credentials lines if they exist from .env.example
  fs.writeFileSync(ENV_FILE, content);
}

function compareVersions(a, b) {
  const pa = a.split('.').map(Number);
  const pb = b.split('.').map(Number);
  for (let i = 0; i < 3; i++) {
    if (pa[i] > pb[i]) return 1;
    if (pa[i] < pb[i]) return -1;
  }
  return 0;
}

function isNewer(parsed, current) {
  const cmp = compareVersions(parsed.version, current.version);
  if (cmp > 0) return true;
  if (cmp === 0 && parsed.build > current.build) return true;
  return false;
}

// ─── Pipeline ────────────────────────────────────────────────────────────────

function launchPipeline({ version, build, prevVersion, prevBuild }) {
  const pipelineScript = path.join(__dirname, 'run-pipeline.js');
  const args = [
    pipelineScript,
    '--version',      version,
    '--build',        String(build),
    '--prev-version', prevVersion || version,
    '--prev-build',   String(prevBuild || 0),
  ];

  const logFile  = path.join(__dirname, `pipeline-${version}-${build}.log`);
  const logStream = fs.openSync(logFile, 'a');

  log(`Pipeline → v${version}(${build})  [prev: v${prevVersion || '?'}(${prevBuild || 0})]`);
  log(`Log: ${logFile}`);

  const child = spawn(process.execPath, args, {
    cwd:      FRAMEWORK_ROOT,
    stdio:    ['ignore', logStream, logStream],
    detached: true,
  });

  child.unref();

  child.on('error', (err) => logError(`Pipeline no pudo iniciarse: ${err.message}`));
}

// ─── Procesamiento de APK local ───────────────────────────────────────────────

function processLocalApk(apkFilename, parsed, registry) {
  const { version, build } = parsed;
  const current = getCurrentFromEnv();

  log(`APK detectado: ${apkFilename}  (v${version}, build ${build})`);

  const prevVersion = current.version;
  const prevBuild   = current.build;

  updateEnv(version, apkFilename);

  registry[version] = Math.max(build, registry[version] || 0);
  saveRegistry(registry);

  log(`.env actualizado → APP_VERSION=${version}, APP_PATH=./${apkFilename}`);

  launchPipeline({ version, build, prevVersion, prevBuild });
}

// ─── Procesamiento de ZIP de Drive ───────────────────────────────────────────

function processZip(zipPath, parsed, registry) {
  const AdmZip = (() => {
    try { return require('adm-zip'); } catch { return null; }
  })();

  if (!AdmZip) {
    logError('adm-zip no instalado — no se puede extraer el ZIP.');
    return;
  }

  const { version, build } = parsed;
  log(`Extrayendo ZIP: ${path.basename(zipPath)}`);

  let zip;
  try { zip = new AdmZip(zipPath); } catch (err) {
    logError(`No se pudo abrir el ZIP: ${err.message}`);
    return;
  }

  const apkEntry = zip.getEntries().find(e =>
    e.entryName.endsWith('.apk') && !e.entryName.includes('__MACOSX')
  );

  if (!apkEntry) { logError('No se encontró .apk dentro del ZIP.'); return; }

  const apkName = `${version}(${build}).apk`;
  const apkDest = path.join(FRAMEWORK_ROOT, apkName);

  try {
    zip.extractEntryTo(apkEntry.entryName, FRAMEWORK_ROOT, false, true);
    const extractedPath = path.join(FRAMEWORK_ROOT, path.basename(apkEntry.entryName));
    if (extractedPath !== apkDest && fs.existsSync(extractedPath)) {
      fs.renameSync(extractedPath, apkDest);
    }
  } catch (err) {
    logError(`Error al extraer: ${err.message}`);
    return;
  }

  log(`APK extraído: ${apkName}`);
  return apkName;
}

// ─── Logger ──────────────────────────────────────────────────────────────────

function log(msg) {
  const time = new Date().toLocaleTimeString('es-AR', { hour12: false });
  console.log(`[APK Watcher ${time}] ${msg}`);
}

function logError(msg) {
  const time = new Date().toLocaleTimeString('es-AR', { hour12: false });
  console.error(`[APK Watcher ${time}] ERROR: ${msg}`);
}

// ─── Inicio ───────────────────────────────────────────────────────────────────

function start() {
  const registry = loadRegistry();
  const current  = getCurrentFromEnv();

  log(`Monitoreando raíz del framework: ${FRAMEWORK_ROOT}`);
  if (current.version) {
    log(`APK activo: v${current.version}(${current.build})`);
  }

  // ── Watcher Drive — opcional, solo si la ruta existe ─────────────────────
  const driveAccessible = DRIVE_FOLDER && fs.existsSync(DRIVE_FOLDER);
  if (DRIVE_FOLDER && !driveAccessible) {
    log(`Drive no accesible (${DRIVE_FOLDER}) — solo monitoreando local.`);
  }
  if (driveAccessible) {
    log(`Drive accesible: ${DRIVE_FOLDER}`);
  }

  // ── Catch-up: Drive es la fuente de verdad ────────────────────────────────
  // Si Drive está disponible, buscar el build más alto por versión.
  // Si no, buscar el APK más reciente ya disponible en el raíz local.
  let catchUpProcessed = false;

  if (driveAccessible) {
    const driveFiles = fs.readdirSync(DRIVE_FOLDER);
    // Agrupar por versión, quedarse con el build más alto
    const latestByVersion = {};
    for (const file of driveFiles) {
      const parsed = parseZipFilename(file);
      if (!parsed) continue;
      const known = latestByVersion[parsed.version];
      if (!known || parsed.build > known.parsed.build) {
        latestByVersion[parsed.version] = { file, parsed };
      }
    }

    // Encontrar el candidato más reciente en Drive vs .env actual
    let driveLatest = null;
    for (const { file, parsed } of Object.values(latestByVersion)) {
      if (isNewer(parsed, current)) {
        if (!driveLatest || isNewer(parsed, driveLatest.parsed)) {
          driveLatest = { file, parsed };
        }
      }
    }

    if (driveLatest) {
      log(`Drive tiene build más reciente: ${driveLatest.file} → extrayendo...`);
      const zipPath = path.join(DRIVE_FOLDER, driveLatest.file);
      const apkName = processZip(zipPath, driveLatest.parsed, registry);
      if (apkName) processLocalApk(apkName, driveLatest.parsed, registry);
      catchUpProcessed = true;
    }
  }

  if (!catchUpProcessed) {
    // Fallback: buscar APK más nuevo ya disponible en el raíz local
    const localApks = fs.readdirSync(FRAMEWORK_ROOT)
      .filter(f => f.endsWith('.apk'))
      .map(f => ({ filename: f, parsed: parseApkFilename(f) }))
      .filter(x => x.parsed !== null)
      .sort((a, b) => {
        const cmp = compareVersions(b.parsed.version, a.parsed.version);
        return cmp !== 0 ? cmp : b.parsed.build - a.parsed.build;
      });

    // Verificar si el APK activo en .env existe en disco
    const activeApkFilename = current.version
      ? (current.build > 0 ? `${current.version}(${current.build}).apk` : `${current.version}.apk`)
      : null;
    const activeApkMissing = activeApkFilename &&
      !fs.existsSync(path.join(FRAMEWORK_ROOT, activeApkFilename));

    if (activeApkMissing) {
      log(`APK activo en .env no existe en disco: ${activeApkFilename}`);
    }

    const latest = localApks[0];
    if (latest && (isNewer(latest.parsed, current) || activeApkMissing)) {
      log(`APK más reciente encontrado localmente: ${latest.filename} — iniciando pipeline...`);
      processLocalApk(latest.filename, latest.parsed, registry);
    } else {
      log('Framework sincronizado.');
    }
  }

  const watchPaths = [FRAMEWORK_ROOT];
  if (driveAccessible) watchPaths.push(DRIVE_FOLDER);

  log('Esperando nuevos APKs...');

  const watcher = chokidar.watch(watchPaths, {
    persistent:       true,
    ignoreInitial:    true,
    depth:            0,
    awaitWriteFinish: { stabilityThreshold: 4000, pollInterval: 500 },
  });

  watcher.on('add', (filePath) => {
    const filename = path.basename(filePath);
    const dir      = path.dirname(filePath);
    const isLocal  = dir === FRAMEWORK_ROOT;

    if (isLocal) {
      const parsed = parseApkFilename(filename);
      if (!parsed) return;

      const cur = getCurrentFromEnv();
      if (!isNewer(parsed, cur)) {
        log(`Ignorado: ${filename} (no es más nuevo que v${cur.version}(${cur.build}))`);
        return;
      }
      processLocalApk(filename, parsed, registry);

    } else {
      // Es un ZIP de Drive — extraer y disparar pipeline directamente
      const parsed = parseZipFilename(filename);
      if (!parsed) return;

      const cur = getCurrentFromEnv();
      if (!isNewer(parsed, cur)) {
        log(`Ignorado ZIP: ${filename}`);
        return;
      }
      const apkName = processZip(filePath, parsed, registry);
      if (apkName) processLocalApk(apkName, parsed, registry);
    }
  });

  watcher.on('error', (err) => logError(`Watcher error: ${err.message}`));
}

start();
