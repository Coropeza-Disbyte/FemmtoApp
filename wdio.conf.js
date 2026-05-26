require('dotenv').config();
const path = require('path');
const { execSync } = require('child_process');
const { DEFAULT_TIMEOUT } = require('./src/config/timeouts');

// Garantiza que ANDROID_HOME esté disponible para el proceso de Appium
if (!process.env.ANDROID_HOME && !process.env.ANDROID_SDK_ROOT) {
  const sdkPath = process.env.ANDROID_SDK_PATH
    || `${process.env.LOCALAPPDATA}\\Android\\Sdk`;
  process.env.ANDROID_HOME     = sdkPath;
  process.env.ANDROID_SDK_ROOT = sdkPath;
}

const ADB = `"${process.env.ANDROID_HOME}\\platform-tools\\adb.exe"`;

// Matriz de emuladores: Pixel_7 (flagship Android 17) + 2 segmentos del mercado argentino
// Specs distribuidos 5 por device — evita que cada spec corra en los 3 devices (45 workers)
const EMULATORS = [
  {
    deviceName: 'emulator-5554', platformVersion: '17', avd: 'Pixel_7',
    specs: [
      './tests/specs/welcome/welcome.spec.js',
      './tests/specs/auth/login.spec.js',
      './tests/specs/auth/meetUser.spec.js',
      './tests/specs/auth/resetPassword.spec.js',
      './tests/specs/auth/saveOnboardingProgress.spec.js',
    ],
  },
  {
    deviceName: 'emulator-5556', platformVersion: '14', avd: 'AVD_ARG_Mainstream',
    specs: [
      './tests/specs/onboarding/onboarding.spec.js',
      './tests/specs/home/home.spec.js',
      './tests/specs/profile/profile.spec.js',
      './tests/specs/tabs/medition.spec.js',
      './tests/specs/medition/newMedition.spec.js',
    ],
  },
  {
    deviceName: 'emulator-5558', platformVersion: '13', avd: 'AVD_ARG_MidRange',
    specs: [
      './tests/specs/tabs/devices.spec.js',
      './tests/specs/tabs/reminders.spec.js',
      './tests/specs/tabs/share.spec.js',
      './tests/specs/metrics/metricsDetail.spec.js',
      './tests/specs/metrics/measurementHistory.spec.js',
    ],
  },
];

// Devuelve los seriales de todos los emuladores online en este momento
function getOnlineEmulatorSerials() {
  try {
    const out = execSync(`${ADB} devices`, { encoding: 'utf8', timeout: 10000 });
    const serials = [];
    for (const line of out.split('\n').slice(1)) {
      const parts = line.trim().split(/\s+/);
      if (parts.length >= 2 && parts[1] === 'device' && parts[0].startsWith('emulator-')) {
        serials.push(parts[0]);
      }
    }
    return serials;
  } catch {
    return [];
  }
}

// Obtiene la versión de Android de un emulador dado su serial
function getEmulatorVersion(serial) {
  try {
    return execSync(
      `${ADB} -s ${serial} shell getprop ro.build.version.release`,
      { encoding: 'utf8', timeout: 5000 }
    ).trim();
  } catch {
    return '13';
  }
}

// Detecta el primer teléfono físico conectado (excluye emuladores)
function detectPhysicalDevice() {
  try {
    const output = execSync(`${ADB} devices -l`, { encoding: 'utf8', timeout: 10000 });
    for (const line of output.split('\n').slice(1)) {
      if (!line.trim() || line.includes('offline')) continue;
      const serial = line.split(/\s+/)[0];
      if (serial && !serial.startsWith('emulator-')) {
        const version = execSync(
          `${ADB} -s ${serial} shell getprop ro.build.version.release`,
          { encoding: 'utf8', timeout: 5000 }
        ).trim();
        console.log(`[Device] Teléfono físico detectado: ${serial} (Android ${version})`);
        return { serial, platformVersion: version };
      }
    }
  } catch {}
  return null;
}

const physicalDevice = detectPhysicalDevice();
const ALL_SPECS = EMULATORS.flatMap(e => e.specs);

// Construye la lista de emuladores activos según los devices realmente online.
// - Todos los configurados online → distribución original (5 specs c/u)
// - Subconjunto online          → redistribuye ALL_SPECS equitativamente
// - Ninguno configurado online  → usa cualquier emulador detectado (ej: emulator-5560)
// - Sin emuladores              → array vacío (WDIO fallará indicando la causa)
function computeActiveEmulators() {
  const onlineSerials = getOnlineEmulatorSerials();
  const configured    = EMULATORS.filter(e => onlineSerials.includes(e.deviceName));

  if (configured.length === EMULATORS.length) return EMULATORS;

  if (configured.length > 0) {
    const chunk = Math.ceil(ALL_SPECS.length / configured.length);
    return configured.map((e, i) => ({
      ...e,
      specs: ALL_SPECS.slice(i * chunk, (i + 1) * chunk),
    }));
  }

  // Emuladores online que no están en la lista configurada (ej: emulator-5560)
  const unknown = onlineSerials.filter(s => !EMULATORS.some(e => e.deviceName === s));
  if (unknown.length > 0) {
    const chunk = Math.ceil(ALL_SPECS.length / unknown.length);
    return unknown.map((serial, i) => ({
      deviceName:      serial,
      platformVersion: getEmulatorVersion(serial),
      avd:             serial,
      specs:           ALL_SPECS.slice(i * chunk, (i + 1) * chunk),
    })).filter(e => e.specs.length > 0);
  }

  return [];
}

const activeEmulators = physicalDevice ? EMULATORS : computeActiveEmulators();

function adb(cmd) {
  try {
    return execSync(`${ADB} ${cmd}`, { encoding: 'utf8', timeout: 15000 }).trim();
  } catch {
    return '';
  }
}

const appPath     = path.resolve(process.env.APP_PATH     || './app-debug.apk');
const appPackage  = process.env.APP_PACKAGE               || 'com.femmto.app';
const appActivity = process.env.APP_ACTIVITY              || 'com.femmto.app.MainActivity';

exports.config = {
  runner:   'local',
  hostname: process.env.APPIUM_HOST || 'localhost',
  port:     parseInt(process.env.APPIUM_PORT || '4723', 10),

  // Vacío — cada capability define sus propios specs para distribución paralela real
  specs: [],
  exclude: [],

  suites: {
    smoke:      require('./tests/suites/smoke'),
    regression: require('./tests/suites/regression'),
    critical:   require('./tests/suites/critical'),
    auth:       require('./tests/suites/auth'),
  },

  maxInstances: physicalDevice ? 1 : Math.max(1, activeEmulators.length),
  capabilities: physicalDevice
    ? [{
        platformName:              'Android',
        'appium:app':              appPath,
        'appium:appPackage':       appPackage,
        'appium:appActivity':      appActivity,
        'appium:automationName':   'UiAutomator2',
        'appium:deviceName':       physicalDevice.serial,
        'appium:platformVersion':  physicalDevice.platformVersion,
        'appium:noReset':          false,
        'appium:newCommandTimeout': 300,
        maxInstances:              1,
        specs:                     ALL_SPECS,
      }]
    : activeEmulators.map(e => ({
        platformName:              'Android',
        'appium:app':              appPath,
        'appium:appPackage':       appPackage,
        'appium:appActivity':      appActivity,
        'appium:automationName':   'UiAutomator2',
        'appium:deviceName':       e.deviceName,
        'appium:platformVersion':  e.platformVersion,
        'appium:noReset':          false,
        'appium:newCommandTimeout': 300,
        maxInstances:              1,
        specs:                     e.specs,
      })),

  logLevel: 'warn',
  bail: 0,
  waitforTimeout: DEFAULT_TIMEOUT,
  connectionRetryTimeout: 120000,
  connectionRetryCount: 3,

  // Si APPIUM_HOST está seteado el server es remoto — no levantar Appium local
  services: process.env.APPIUM_HOST
    ? []
    : [['appium', {
        command: path.resolve('./node_modules/.bin/appium.cmd'),
        args: { relaxedSecurity: true },
      }]],

  framework: 'mocha',
  reporters: ['spec'],
  mochaOpts: {
    ui:      'bdd',
    timeout: 180000,
    grep:    process.env.WDIO_GREP || undefined,
  },

  // --- Hooks globales ---

  /**
   * Deshabilita WiFi en emuladores para evitar force update checks.
   * En teléfono físico el usuario controla el WiFi manualmente.
   */
  onPrepare() {
    if (physicalDevice) {
      console.log(`\n[Setup] Modo teléfono físico — ${physicalDevice.serial}. WiFi no modificado.`);
      return;
    }
    console.log('\n[Setup] Deshabilitando WiFi en todos los emuladores...');
    for (const e of activeEmulators) {
      adb(`-s ${e.deviceName} shell svc wifi disable`);
    }
    console.log('[Setup] WiFi deshabilitado.');
  },

  /**
   * Rehabilita WiFi para el dispositivo de esta sesión una vez que la app cargó.
   * `driver` está bound al device de la sesión actual — no necesita -s.
   */
  async before() {
    await driver.pause(3000);
    console.log('\n[Setup] Rehabilitando WiFi...');
    await driver.execute('mobile: shell', { command: 'svc', args: ['wifi', 'enable'] });
    try {
      await driver.execute('mobile: shell', {
        command: 'ime',
        args: ['disable', 'com.google.android.apps.handwriting.ime/.HandwritingIme'],
      });
    } catch {}
    console.log('[Setup] WiFi habilitado.');
  },

  beforeSuite(suite) {
    console.log(`\n[Suite] ${suite.name}`);
  },

  // Skip tests that don't match WDIO_GREP. mochaOpts.grep is unreliable across
  // WDIO worker processes; this hook runs inside the Mocha worker where context.skip() works.
  beforeTest(test, context) {
    const pattern = process.env.WDIO_GREP;
    if (!pattern) return;
    const parts = pattern.split('|').map(s => s.trim()).filter(Boolean);
    const title = (test.title || '').trim();
    if (!parts.some(p => title.includes(p))) context.skip();
  },

  async afterTest(test, _context, { error, passed, duration }) {
    if (error) {
      try {
        const timestamp  = new Date().toISOString().replace(/[:.]/g, '-');
        const safeName   = (test.fullName || test.title || 'unknown').replace(/\s+/g, '_').replace(/[^a-zA-Z0-9_-]/g, '');
        const screensDir = path.resolve('./screenshots');
        const fs         = require('fs');
        if (!fs.existsSync(screensDir)) fs.mkdirSync(screensDir, { recursive: true });
        const filePath = path.join(screensDir, `FAIL_${safeName}_${timestamp}.png`);
        await driver.saveScreenshot(filePath);
        console.log(`[Screenshot] ${filePath}`);
      } catch {
        // La pantalla puede tener FLAG_SECURE — screenshot no disponible
      }
    }

    // Report real-time result to qa-monitor (fire-and-forget — does not block test execution)
    try {
      const http = require('http');
      const body = JSON.stringify({
        fullName: test.fullName || test.title || '',
        title:    test.title    || '',
        passed:   !error && passed !== false,
        duration: Math.round(duration || 0),
      });
      const req = http.request({
        hostname: 'localhost',
        port:     parseInt(process.env.MONITOR_PORT || 3001),
        path:     '/api/test-event',
        method:   'POST',
        headers:  { 'Content-Type': 'application/json', 'Content-Length': Buffer.byteLength(body) },
      });
      req.on('error', function() {});
      req.setTimeout(500, function() { req.destroy(); });
      req.write(body);
      req.end();
    } catch (_) {}
  },

  async afterEach() {
    try {
      await driver.execute('mobile: shell', { command: 'am', args: ['force-stop', appPackage] });
    } catch {}
  },

  /**
   * Rehabilita WiFi en emuladores al finalizar la suite.
   * En teléfono físico no se toca.
   */
  onComplete() {
    if (physicalDevice) return;
    console.log('\n[Cleanup] Rehabilitando WiFi...');
    for (const e of activeEmulators) {
      adb(`-s ${e.deviceName} shell svc wifi enable`);
    }
    console.log('[Cleanup] WiFi habilitado.');
  },
};
