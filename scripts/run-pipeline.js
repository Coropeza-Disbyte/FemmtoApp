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
const ADB          = 'C:\\Users\\coropeza2\\AppData\\Local\\Android\\Sdk\\platform-tools\\adb.exe';
const EMULATOR_EXE = 'C:\\Users\\coropeza2\\AppData\\Local\\Android\\Sdk\\emulator\\emulator.exe';

// Misma matriz que wdio.conf.js — cada AVD arranca en su puerto fijo
const EMULATORS = [
  { avd: 'Pixel_7',             deviceName: 'emulator-5554' },
  { avd: 'AVD_ARG_Mainstream',  deviceName: 'emulator-5556' },
  { avd: 'AVD_ARG_MidRange',    deviceName: 'emulator-5558' },
];

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
    execSync(`git -C "${RN_REPO_PATH}" pull`, { stdio: 'inherit' });
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
      timeout: 1_200_000, // 20 min — límite máximo para análisis de repo RN
    });
    log('Análisis completado', 'OK');
  } catch (err) {
    log(`Claude analysis falló: ${err.message}`, 'WARN');
    log('Continuando con tests...', 'WARN');
  }
}

function getActiveDevices() {
  try {
    return execSync(`"${ADB}" devices`, { encoding: 'utf8' })
      .split('\n')
      .slice(1)
      .filter(line => line.includes('device') && !line.includes('offline'))
      .map(line => line.split('\t')[0].trim())
      .filter(Boolean);
  } catch {
    return [];
  }
}

function stepEmulator() {
  logSection('PASO 3 — Verificar emuladores Android');

  const active = getActiveDevices();

  if (active.length === 0) {
    log('No hay emuladores activos — tests se omitirán', 'WARN');
    log('Levantá los emuladores manualmente antes de correr el pipeline', 'WARN');
    return false;
  }

  const found = EMULATORS.filter(e => active.includes(e.deviceName));
  log(`Emuladores listos: ${found.map(e => e.avd).join(', ')}`, 'OK');

  const missing = EMULATORS.filter(e => !active.includes(e.deviceName));
  if (missing.length > 0) {
    log(`Sin respuesta: ${missing.map(e => e.avd).join(', ')} — tests solo en los activos`, 'WARN');
  }

  return true;
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
  const testsLabel = testsPassed === null
    ? 'omitidos — no había emuladores activos'
    : testsPassed ? 'suite completa pasó' : 'hay tests fallidos — revisar output';
  log(`Tests:      ${testsLabel}`, testsPassed ? 'OK' : 'WARN');

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
  const emulatorsReady = stepEmulator();
  const testsPassed = emulatorsReady ? stepTests() : null;
  stepReport({ version, build, prevVersion, prevBuild, isVersionBump }, testsPassed);
}

main();
