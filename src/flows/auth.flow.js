const WelcomePage = require('../pages/welcome/WelcomePage');
const LoginPage   = require('../pages/auth/LoginPage');
const credentials = require('../fixtures/auth/credentials');

/**
 * Limpia el estado de la app y lanza desde cero.
 * Maneja la Welcome screen (presente desde v3.6.0) antes de llegar al Login.
 */
async function launchClean() {
  const pkg = process.env.APP_PACKAGE || 'com.femmto.app';
  await driver.execute('mobile: shell', { command: 'pm',  args: ['clear', pkg] });
  await driver.execute('mobile: shell', { command: 'am',  args: ['start', '-n', `${pkg}/.MainActivity`] });

  // Welcome screen existe desde v3.6.0 — detectar por el botón (más fiable que la imagen)
  try {
    const btnYaTengoCuenta = $('android=new UiSelector().text("Ya tengo una cuenta")');
    await btnYaTengoCuenta.waitForDisplayed({ timeout: 15000 });
    await btnYaTengoCuenta.click();
  } catch {
    // APK < 3.6.0 o app ya está en Login — continuar
  }
}

async function loginAs(user = credentials.validUser) {
  const page = new LoginPage();
  await page.isLoaded();
  await page.login(user.email, user.password);
}

/**
 * v4.0.0: el tour guiado (4 pasos) arranca en el primer Home tras pm clear.
 * Toca "Omitir" si aparece — silencioso si el tour ya fue visto o no aplica al APK.
 */
async function dismissTourIfPresent() {
  const { ANIMATION_TIMEOUT } = require('../config/timeouts');
  try {
    const btnOmitir = $('android=new UiSelector().text("Omitir")');
    await btnOmitir.waitForDisplayed({ timeout: 20000 });
    await btnOmitir.click();
    await driver.pause(ANIMATION_TIMEOUT);
  } catch {
    // Tour no presente (key ya seteada) o versión anterior a 4.0.0
  }
}

async function launchAndLogin(user = credentials.validUser) {
  await launchClean();
  await loginAs(user);
  await dismissTourIfPresent();
}

module.exports = { launchClean, loginAs, launchAndLogin };
