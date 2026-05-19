const WelcomePage      = require('../../../src/pages/welcome/WelcomePage');
const { skipIfBefore } = require('../../../src/helpers/versionGuard');

describe('[welcome] Pantalla de bienvenida', function () {
  before(function () { if (skipIfBefore('3.6.0')) this.skip(); });
  beforeEach(async () => {
    const pkg = process.env.APP_PACKAGE || 'com.femmto.app';
    await driver.execute('mobile: shell', { command: 'pm', args: ['clear', pkg] });
    await driver.execute('mobile: shell', { command: 'am', args: ['start', '-n', `${pkg}/.MainActivity`] });
  });

  it('should display welcome screen on launch', async () => {
    const page = new WelcomePage();
    expect(await page.isLoaded()).toBe(true);
  });

  it('should show "Ingresar por primera vez" button', async () => {
    const page = new WelcomePage();
    await page.isLoaded();
    expect(await page.isDisplayed(page.btnPrimeraVez)).toBe(true);
  });

  it('should show "Ya tengo una cuenta" button', async () => {
    const page = new WelcomePage();
    await page.isLoaded();
    expect(await page.isDisplayed(page.btnYaTengoCuenta)).toBe(true);
  });

  it('should tap "Ya tengo una cuenta" and leave welcome screen', async () => {
    const page = new WelcomePage();
    await page.isLoaded();
    await page.tapYaTengoCuenta();
    await page.btnYaTengoCuenta.waitForDisplayed({ timeout: 5000, reverse: true });
  });
});
