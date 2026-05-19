const path = require('path');

const APP_PATH = process.env.APP_PATH
  ? path.resolve(process.env.APP_PATH)
  : path.resolve(__dirname, '../../apps/app-debug.apk');

const androidCapabilities = {
  platformName: 'Android',
  'appium:automationName': 'UiAutomator2',
  'appium:deviceName': process.env.DEVICE_NAME || 'emulator-5554',
  'appium:platformVersion': process.env.PLATFORM_VERSION || '13.0',
  'appium:app': APP_PATH,
  'appium:appPackage': process.env.APP_PACKAGE || 'com.example.app',
  'appium:appActivity': process.env.APP_ACTIVITY || 'com.example.app.MainActivity',
  'appium:noReset': true,           // APK ya instalada manualmente — no reinstalar
  'appium:fullReset': false,
  'appium:newCommandTimeout': 90,
  'appium:autoGrantPermissions': true,
  'appium:adbExecTimeout': 60000,   // evita timeout en pm clear
};

module.exports = { androidCapabilities };
