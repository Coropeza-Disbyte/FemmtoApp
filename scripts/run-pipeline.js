/**
 * run-pipeline.js
 *
 * Orquestador del pipeline de QA. Se ejecuta automáticamente desde watch-apk.js
 * cuando se detecta un nuevo APK, o manualmente:
 *
 *   node scripts/run-pipeline.js --version 4.0.0 --build 1023 --prev-version 4.0.0 --prev-build 1022
 *
 * Reglas:
 *   Build fix  (4.0.0/1022 → 4.0.0/1023): git pull → Claude analiza + actualiza docs → tests completos
 *   Version bump (4.0.0 → 4.1.0):          git pull → Claude analiza + docs + test plan → tests completos
 */

require('dotenv').config({ path: require('path').join(__dirname, '..', '.env') });

const { execSync, spawn } = require('child_process');
const path = require('path');
const fs   = require('fs');

// ─── Configuración ───────────────────────────────────────────────────────────

const FRAMEWORK_ROOT = path.resolve(__dirname, '..');
const RN_REPO_PATH   = process.env.RN_REPO_PATH;
const ADB            = 'C:\\Users\\coropeza2\\AppData\\Local\\Android\\Sdk\\platform-tools\\adb.exe';
const EMULATOR_EXE   = 'C:\\Users\\coropeza2\\AppData\\Local\\Android\\Sdk\\emulator\\emulator.exe';
const AVD_NAME       = 'Pixel_7';

// ─── Logger ───────────────────────────────────────────────────────────────────

function log(msg, level = 'INFO') {
  const time   = new Date().toLocaleTimeString('es-AR', { hour12: false });
  const prefix = { INFO: '  ', STEP: '▶', OK: '✔', WARN: '⚠', ERROR: '✖' }[level] || '  ';
  console.log(`[Pipeline ${time}] ${prefix} ${msg}`);
}

function logSection(title) {
  console.log('');
  console.log('─'.repeat(50));
  console.log(`  ${title}`);
  console.log('─'.repeat(50));
}

// ─── Parseo de argumentos ─────────────────────────────────────────────────────

function parseArgs() {
  const args = process.argv.slice(2);
  const get  = (flag) => {
    const idx = args.indexOf(flag);
    return idx !== -1 ? args[idx + 1] : null;
  };
  return {
    version:     get('--version'),
    build:       parseInt(get('--build') || '0', 10),
    prevVersion: get('--prev-version'),
    prevBuild:   parseInt(get('--prev-build') || '0', 10),
  };
}

// ─── Pasos del pipeline ───────────────────────────────────────────────────────

function stepGitPull() {
  logSection('PASO 1 — Git pull repo RN');

  if (!RN_REPO_PATH) {
    log('RN_REPO_PATH no configurado en .env — saltando git pull', 'WARN');
    return;
  }

  if (!fs.existsSync(RN_REPO_PATH)) {
    log(`Ruta no encontrada: ${RN_REPO_PATH}`, 'WARN');
    return;
  }

  try {
    log(`Repo: ${RN_REPO_PATH}`, 'STEP');
    execSync('git pull', { cwd: RN_REPO_PATH, stdio: 'inherit' });
    log('Git pull completado', 'OK');
  } catch (err) {
    log(`Git pull falló: ${err.message}`, 'WARN');
    log('Continuando con código local...', 'WARN');
  }
}

function stepClaudeAnalysis(version, prevVersion, prevBuild, isVersionBump) {
  logSection('PASO 2 — Análisis con Claude');

  const tipo = isVersionBump
    ? `VERSION BUMP: v${prevVersion} → v${version}`
    : `BUILD FIX: v${version} build anterior ${prevBuild} — mismo X.Y.Z`;

  const instruccion = isVersionBump
    ? 'Ejecuta el protocolo COMPLETO de análisis de versión nueva (Fases 1 a 4) incluyendo actualización del test plan.'
    : 'Ejecuta SOLO Fases 1 y 2 del protocolo de análisis (análisis + docs). NO actualizar el test plan porque es un build fix del mismo X.Y.Z.';

  const prompt = [
    `[PIPELINE QA AUTOMÁTICO] ${tipo}.`,
    instruccion,
    `Repo RN: ${RN_REPO_PATH || 'ver RN_REPO_PATH en .env'}.`,
    'Seguir las reglas definidas en CLAUDE.md sección "Pipeline automático".',
  ].join(' ');

  log(`Tipo: ${isVersionBump ? 'Version bump → docs + test plan' : 'Build fix → solo docs'}`, 'STEP');
  log('Invocando Claude...', 'STEP');

  try {
    execSync(`claude --print "${prompt.replace(/"/g, "'")}"`, {
      cwd:     FRAMEWORK_ROOT,
      stdio:   'inherit',
      timeout: 600_000, // 10 min — el análisis puede tomar tiempo
    });
    log('Análisis completado', 'OK');
  } catch (err) {
    log(`Claude analysis falló: ${err.message}`, 'WARN');
    log('Continuando con tests...', 'WARN');
  }
}

function stepEmulator() {
  logSection('PASO 3 — Emulador Android');

  let devices = '';
  try {
    devices = execSync(`"${ADB}" devices`, { encoding: 'utf8' });
  } catch {
    log('No se pudo ejecutar adb', 'WARN');
  }

  const hasDevice = devices
    .split('\n')
    .slice(1)
    .some(line => line.includes('emulator') && line.includes('device'));

  if (hasDevice) {
    log('Emulador ya activo — saltando arranque', 'OK');
    return;
  }

  log(`Iniciando emulador: ${AVD_NAME}`, 'STEP');

  spawn(EMULATOR_EXE, ['-avd', AVD_NAME], {
    detached: true,
    stdio:    'ignore',
  }).unref();

  log('Esperando boot completo...', 'STEP');

  try {
    execSync(
      `"${ADB}" wait-for-device shell "while [ $(getprop sys.boot_completed) != 1 ]; do sleep 2; done; echo Device ready"`,
      { stdio: 'inherit', timeout: 120_000 }
    );
    log('Emulador listo', 'OK');
  } catch {
    log('Timeout esperando emulador — continuando', 'WARN');
  }
}

function stepTests() {
  logSection('PASO 4 — Tests completos');

  log('Ejecutando suite completa: npm test', 'STEP');

  try {
    execSync('npm test', { cwd: FRAMEWORK_ROOT, stdio: 'inherit' });
    return true;
  } catch {
    // wdio sale con código != 0 cuando hay tests fallidos — no es error del pipeline
    return false;
  }
}

function stepReport(params, testsPassed) {
  logSection('RESUMEN FINAL');

  const { version, build, prevVersion, prevBuild, isVersionBump } = params;

  log(`Versión:    v${prevVersion}(${prevBuild})  →  v${version}(${build})`);
  log(`Tipo:       ${isVersionBump ? 'Version bump' : 'Build fix'}`);
  log(`Análisis:   docs actualizados${isVersionBump ? ' + test plan actualizado' : ' (test plan sin cambios)'}`);
  log(`Tests:      ${testsPassed ? 'suite completa pasó' : 'hay tests fallidos — revisar output'}`,
    testsPassed ? 'OK' : 'ERROR');

  console.log('');
}

// ─── Main ─────────────────────────────────────────────────────────────────────

function main() {
  const { version, build, prevVersion, prevBuild } = parseArgs();

  if (!version || !build) {
    console.error('[Pipeline] Uso: node scripts/run-pipeline.js --version X.Y.Z --build NNNN [--prev-version X.Y.Z --prev-build NNNN]');
    process.exit(1);
  }

  const isVersionBump = prevVersion ? (version !== prevVersion) : false;

  console.log('');
  console.log('══════════════════════════════════════════════════');
  console.log('  QA PIPELINE — iniciando');
  console.log(`  Nueva build:  v${version} (${build})`);
  if (prevVersion) console.log(`  Anterior:     v${prevVersion} (${prevBuild})`);
  console.log(`  Tipo:         ${isVersionBump ? 'Version bump' : 'Build fix'}`);
  console.log('══════════════════════════════════════════════════');

  stepGitPull();
  stepClaudeAnalysis(version, prevVersion, prevBuild, isVersionBump);
  stepEmulator();
  const testsPassed = stepTests();
  stepReport({ version, build, prevVersion, prevBuild, isVersionBump }, testsPassed);
}

main();
