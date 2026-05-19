const HomePage     = require('../../../src/pages/home/HomePage');
const MeditionPage = require('../../../src/pages/tabs/MeditionPage');
const credentials  = require('../../../src/fixtures/auth/credentials');

const loginAndGoHome = async () => {
  const pkg = process.env.APP_PACKAGE || 'com.femmto.app';
  await driver.execute('mobile: shell', { command: 'pm',  args: ['clear', pkg] });
  await driver.execute('mobile: shell', { command: 'am',  args: ['start', '-n', `${pkg}/.MainActivity`] });
  await $('~Ya tengo una cuenta').waitForDisplayed({ timeout: 30000 });
  await $('~Ya tengo una cuenta').click();
  await $('android=new UiSelector().text("Ingrese su email")').waitForDisplayed({ timeout: 15000 });
  const emailField = $('android=new UiSelector().text("Ingrese su email")');
  const passField  = $('android=new UiSelector().text("Ingrese su contraseña")');
  await emailField.click();
  await emailField.setValue(credentials.validUser.email);
  await passField.click();
  await passField.setValue(credentials.validUser.password);
  await driver.hideKeyboard();
  await $('~Ingresar').waitForDisplayed({ timeout: 10000 });
  await $('~Ingresar').click();
  await $('~Home').waitForDisplayed({ timeout: 30000 });
};

describe('[tabs] New Medition Screen', () => {
  beforeEach(async () => {
    await loginAndGoHome();
    const home = new HomePage();
    await home.isLoaded();
    await home.navigateToMedition();
  });

  it('should display the Nueva medición screen', async () => {
    const page = new MeditionPage();
    expect(await page.isLoaded()).toBe(true);
  });

  it('should show the device selection instruction text', async () => {
    const page = new MeditionPage();
    await page.isLoaded();
    expect(await page.isDisplayed(page.textEligeMedirte)).toBe(true);
    expect(await page.isDisplayed(page.textSeleccionaDispositivo)).toBe(true);
  });

  it('should display all three device type cards', async () => {
    const page = new MeditionPage();
    await page.isLoaded();
    expect(await page.isDisplayed(page.cardMonitorPresion)).toBe(true);
    expect(await page.isDisplayed(page.cardBalanza)).toBe(true);
    expect(await page.isDisplayed(page.cardGlucometro)).toBe(true);
  });

  it('should display Bluetooth and Manual measurement type badges', async () => {
    const page = new MeditionPage();
    await page.isLoaded();
    expect(await page.isDisplayed(page.badgeBluetooth)).toBe(true);
    expect(await page.isDisplayed(page.badgeManual)).toBe(true);
  });

  it('should navigate to blood pressure flow on Monitor de presión tap', async () => {
    const page = new MeditionPage();
    await page.isLoaded();
    await page.tapMonitorPresion();
    // La app navega a la pantalla OCR/Bluetooth de presión; validamos
    // que ya no estamos en MeditionOptions comprobando que el header cambió
    const stillOnMedition = await page.isDisplayed(page.headerTitle);
    expect(stillOnMedition).toBe(false);
  });
});
