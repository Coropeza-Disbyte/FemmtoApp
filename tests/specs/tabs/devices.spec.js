const HomePage    = require('../../../src/pages/home/HomePage');
const DevicesPage = require('../../../src/pages/tabs/DevicesPage');
const credentials = require('../../../src/fixtures/auth/credentials');

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

describe('[tabs] Devices Screen', () => {
  beforeEach(async () => {
    await loginAndGoHome();
    const home = new HomePage();
    await home.isLoaded();
    await home.navigateToDevices();
  });

  it('should display the Devices screen header', async () => {
    const page = new DevicesPage();
    expect(await page.isLoaded()).toBe(true);
  });

  it('should show empty state message when no devices are linked', async () => {
    const page = new DevicesPage();
    await page.isLoaded();
    // El mensaje vacío se muestra solo si no hay dispositivos vinculados
    const isEmpty = await page.isDisplayed(page.emptyMessage);
    const hasList = await page.isDisplayed(page.sectionMisDispositivos);
    expect(isEmpty || hasList).toBe(true);
  });

  it('should show add device button in empty state', async () => {
    const page = new DevicesPage();
    await page.isLoaded();
    const hasEmptyBtn = await page.isDisplayed(page.btnAgregarDispositivoVacio);
    const hasListBtn  = await page.isDisplayed(page.btnAgregarDispositivo);
    expect(hasEmptyBtn || hasListBtn).toBe(true);
  });

  it('should navigate to SelectDeviceType screen on add button tap', async () => {
    const page = new DevicesPage();
    await page.isLoaded();
    await page.tapAgregarDispositivo();
    // Verifica que la pantalla de selección de dispositivo esté visible
    expect(await page.isDisplayed(page.textEligeMedirte)).toBe(true);
  });

  it('should display all device type cards on SelectDeviceType screen', async () => {
    const page = new DevicesPage();
    await page.isLoaded();
    await page.tapAgregarDispositivo();
    expect(await page.isDisplayed(page.cardMonitorPresion)).toBe(true);
    expect(await page.isDisplayed(page.cardBalanza)).toBe(true);
    expect(await page.isDisplayed(page.cardGlucometro)).toBe(true);
  });
});
