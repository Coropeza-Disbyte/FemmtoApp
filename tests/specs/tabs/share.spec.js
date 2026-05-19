const HomePage  = require('../../../src/pages/home/HomePage');
const SharePage = require('../../../src/pages/tabs/SharePage');
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

describe('[tabs] Share Metrics Screen', () => {
  beforeEach(async () => {
    await loginAndGoHome();
    const home = new HomePage();
    await home.isLoaded();
    await home.navigateToShare();
  });

  it('should display the Compartir métricas screen', async () => {
    const page = new SharePage();
    expect(await page.isLoaded()).toBe(true);
  });

  it('should show step 1 recipient selection section', async () => {
    const page = new SharePage();
    await page.isLoaded();
    expect(await page.isDisplayed(page.textPaso1)).toBe(true);
    expect(await page.isDisplayed(page.optionDoctor)).toBe(true);
    expect(await page.isDisplayed(page.optionFamiliar)).toBe(true);
  });

  it('should show step 2 report type selection section', async () => {
    const page = new SharePage();
    await page.isLoaded();
    expect(await page.isDisplayed(page.textPaso2)).toBe(true);
    expect(await page.isDisplayed(page.checkPresionArterial)).toBe(true);
    expect(await page.isDisplayed(page.checkGlucosaEnSangre)).toBe(true);
    expect(await page.isDisplayed(page.checkComposicionCorporal)).toBe(true);
  });

  it('should show step 3 period selection section', async () => {
    const page = new SharePage();
    await page.isLoaded();
    expect(await page.isDisplayed(page.textPaso3)).toBe(true);
  });

  it('should display the Compartir action button', async () => {
    const page = new SharePage();
    await page.isLoaded();
    expect(await page.isDisplayed(page.btnCompartir)).toBe(true);
  });

  it('should select doctor as recipient', async () => {
    const page = new SharePage();
    await page.isLoaded();
    await page.selectDestinatario('doctor');
    expect(await page.isDisplayed(page.textSeguimientoClinico)).toBe(true);
  });

  it('should select family as recipient', async () => {
    const page = new SharePage();
    await page.isLoaded();
    await page.selectDestinatario('familiar');
    expect(await page.isDisplayed(page.textAcompanamiento)).toBe(true);
  });

  it('should toggle blood pressure report checkbox', async () => {
    const page = new SharePage();
    await page.isLoaded();
    await page.tapPresionArterial();
    // Verificar que el elemento sigue visible después de la interacción
    expect(await page.isDisplayed(page.checkPresionArterial)).toBe(true);
  });

  it('should toggle glucose report checkbox', async () => {
    const page = new SharePage();
    await page.isLoaded();
    await page.tapGlucosaEnSangre();
    expect(await page.isDisplayed(page.checkGlucosaEnSangre)).toBe(true);
  });
});
