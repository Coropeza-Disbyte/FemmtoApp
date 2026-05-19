require('dotenv').config();
const path = require('path');
const { execSync } = require('child_process');
const { androidCapabilities } = require('./src/config/capabilities');
const { DEFAULT_TIMEOUT }     = require('./src/config/timeouts');

// Garantiza que ANDROID_HOME esté disponible para el proceso de Appium
if (!process.env.ANDROID_HOME && !process.env.ANDROID_SDK_ROOT) {
  const sdkPath = process.env.ANDROID_SDK_PATH
    || `${process.env.LOCALAPPDATA}\\Android\\Sdk`;
  process.env.ANDROID_HOME     = sdkPath;
  process.env.ANDROID_SDK_ROOT = sdkPath;
}

const ADB = `"${process.env.ANDROID_HOME}\\platform-tools\\adb.exe"`;

function adb(cmd) {
  try {
    return execSync(`${ADB} ${cmd}`, { encoding: 'utf8', timeout: 15000 }).trim();
  } catch (e) {
    // silencioso — el dispositivo puede no estar listo
    return '';
  }
}

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

  maxInstances: 1,
  capabilities: [androidCapabilities],

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
   * Deshabilita WiFi ANTES de que Appium lance la app.
   * Evita que la versión 3.1.0 muestre el force update check al inicio.
   * WiFi se rehabilita en el hook `before` una vez que la app ya cargó.
   */
  onPrepare() {
    console.log('\n[Setup] Deshabilitando WiFi para bypass de force update check...');
    adb('shell svc wifi disable');
    console.log('[Setup] WiFi deshabilitado.');
  },

  /**
   * Rehabilita WiFi después de que Appium levantó la sesión y la app está activa.
   * Necesario para que los tests que requieren red (login, etc.) funcionen.
   */
  async before() {
    // Pequeña espera para que la app termine de renderizar su pantalla inicial
    await driver.pause(3000);
    console.log('\n[Setup] Rehabilitando WiFi post-launch...');
    adb('shell svc wifi enable');
    console.log('[Setup] WiFi habilitado.');
    // Deshabilita el Handwriting IME (stylus overlay) en emuladores Pixel con stylus
    adb('shell ime disable com.google.android.apps.handwriting.ime/.HandwritingIme');
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
      const pkg = process.env.APP_PACKAGE || 'com.femmto.app';
      await driver.execute('mobile: shell', { command: 'am', args: ['force-stop', pkg] });
    } catch {}
  },

  /**
   * Rehabilita WiFi al finalizar todos los tests (limpieza del entorno).
   */
  onComplete() {
    console.log('\n[Cleanup] Rehabilitando WiFi...');
    adb('shell svc wifi enable');
    console.log('[Cleanup] WiFi habilitado.');
  },
};

