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
const EMULATORS = [
  { deviceName: 'emulator-5554', platformVersion: '17', avd: 'Pixel_7' },
  { deviceName: 'emulator-5556', platformVersion: '14', avd: 'AVD_ARG_Mainstream' },
  { deviceName: 'emulator-5558', platformVersion: '13', avd: 'AVD_ARG_MidRange' },
];

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
  runner: 'local',
  port: 4723,

  specs: ['./tests/specs/**/*.spec.js'],
  exclude: [],

  suites: {
    smoke:      require('./tests/suites/smoke'),
    regression: require('./tests/suites/regression'),
    critical:   require('./tests/suites/critical'),
    auth:       require('./tests/suites/auth'),
  },

  maxInstances: 3,
  capabilities: EMULATORS.map(e => ({
    platformName:              'Android',
    'appium:app':              appPath,
    'appium:appPackage':       appPackage,
    'appium:appActivity':      appActivity,
    'appium:automationName':   'UiAutomator2',
    'appium:deviceName':       e.deviceName,
    'appium:platformVersion':  e.platformVersion,
    'appium:noReset':          false,
    'appium:newCommandTimeout': 300,
  })),

  logLevel: 'warn',
  bail: 0,
  waitforTimeout: DEFAULT_TIMEOUT,
  connectionRetryTimeout: 120000,
  connectionRetryCount: 3,

  services: [
    ['appium', {
      command: 'appium',
      args: { relaxedSecurity: true },
    }],
  ],

  framework: 'mocha',
  reporters: ['spec'],
  mochaOpts: {
    ui: 'bdd',
    timeout: 60000,
  },

  // --- Hooks globales ---

  /**
   * Deshabilita WiFi en TODOS los emuladores ANTES de que Appium lance la app.
   * Evita force update checks en versiones antiguas.
   */
  onPrepare() {
    console.log('\n[Setup] Deshabilitando WiFi en todos los emuladores...');
    for (const e of EMULATORS) {
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

  async afterTest(test, context, { error }) {
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
  },

  async afterEach() {
    try {
      await driver.execute('mobile: shell', { command: 'am', args: ['force-stop', appPackage] });
    } catch {}
  },

  /**
   * Rehabilita WiFi en todos los emuladores al finalizar la suite.
   */
  onComplete() {
    console.log('\n[Cleanup] Rehabilitando WiFi...');
    for (const e of EMULATORS) {
      adb(`-s ${e.deviceName} shell svc wifi enable`);
    }
    console.log('[Cleanup] WiFi habilitado.');
  },
};
