const NewGlucometerPage = require('../../../src/pages/medition/NewGlucometerPage');
const AddGlucosePage = require('../../../src/pages/medition/AddGlucosePage');
const NewPresurePage = require('../../../src/pages/medition/NewPresurePage');
const NewScalePage = require('../../../src/pages/medition/NewScalePage');
const FirstMeasurePage = require('../../../src/pages/medition/FirstMeasurePage');

// Precondición: login limpio y espera la home
const loginAndGoHome = async () => {
  const pkg = process.env.APP_PACKAGE || 'com.femmto.app';
  await driver.execute('mobile: shell', { command: 'pm', args: ['clear', pkg] });
  await driver.execute('mobile: shell', { command: 'am', args: ['start', '-n', `${pkg}/.MainActivity`] });
  await $('~Ya tengo una cuenta').waitForDisplayed({ timeout: 30000 });
  await $('~Ya tengo una cuenta').click();
  const emailField = $('android=new UiSelector().text("Ingrese su email")');
  await emailField.waitForDisplayed({ timeout: 15000 });
  await emailField.click();
  await emailField.setValue(process.env.TEST_USER_EMAIL);
  const passField = $('android=new UiSelector().text("Ingrese su contraseña")');
  await passField.click();
  await passField.setValue(process.env.TEST_USER_PASSWORD);
  await driver.hideKeyboard();
  await $('~Ingresar').waitForDisplayed({ timeout: 10000 });
  await $('~Ingresar').click();
  await $('~Home').waitForDisplayed({ timeout: 30000 });
};

// Helper: acceder a la tab Medición
const goToMeditionTab = async () => {
  const tab = $('~Medición');
  await tab.waitForDisplayed({ timeout: 15000 });
  await tab.click();
};

// ─────────────────────────────────────────────
// Nueva medición glucómetro (introducción)
// ─────────────────────────────────────────────
describe('[medition] New Glucometer Medition - Introduction Screen', () => {
  beforeEach(async () => {
    await loginAndGoHome();
    await goToMeditionTab();
    // Desde la tab Medición seleccionar la opción de glucosa
    const glucosaOption = $('~Glucosa en sangre');
    await glucosaOption.waitForDisplayed({ timeout: 15000 });
    await glucosaOption.click();
  });

  it('should display the glucometer introduction screen', async () => {
    const page = new NewGlucometerPage();
    const loaded = await page.isLoaded();
    expect(loaded).toBe(true);
  });

  it('should show Prepara tu conexión label', async () => {
    const page = new NewGlucometerPage();
    expect(await page.isDisplayed(page.labelPreparaConexion)).toBe(true);
  });

  it('should show bluetooth instruction badge', async () => {
    const page = new NewGlucometerPage();
    expect(await page.isDisplayed(page.badgeBluetooth)).toBe(true);
  });

  it('should show Registrar manualmente button', async () => {
    const page = new NewGlucometerPage();
    expect(await page.isDisplayed(page.btnRegistrarManualmente)).toBe(true);
  });
});

// ─────────────────────────────────────────────
// Nueva medición glucómetro (formulario manual)
// ─────────────────────────────────────────────
describe('[medition] Add Glucose Measure - Manual Form', () => {
  beforeEach(async () => {
    await loginAndGoHome();
    await goToMeditionTab();
    const glucosaOption = $('~Glucosa en sangre');
    await glucosaOption.waitForDisplayed({ timeout: 15000 });
    await glucosaOption.click();
    const intro = new NewGlucometerPage();
    await intro.isLoaded();
    await intro.tapRegistrarManualmente();
  });

  it('should display the glucose measure form', async () => {
    const page = new AddGlucosePage();
    const loaded = await page.isLoaded();
    expect(loaded).toBe(true);
  });

  it('should show the screen title Medición de glucosa en sangre', async () => {
    const page = new AddGlucosePage();
    expect(await page.isDisplayed(page.screenTitle)).toBe(true);
  });
});

// ─────────────────────────────────────────────
// Nueva medición presión arterial (introducción)
// ─────────────────────────────────────────────
describe('[medition] New Presure OCR Medition - Introduction Screen', () => {
  beforeEach(async () => {
    await loginAndGoHome();
    await goToMeditionTab();
    const presureOption = $('~Presión Arterial');
    await presureOption.waitForDisplayed({ timeout: 15000 });
    await presureOption.click();
  });

  it('should display the presure introduction screen', async () => {
    const page = new NewPresurePage();
    const loaded = await page.isLoaded();
    expect(loaded).toBe(true);
  });

  it('should show Prepara tu conexión label', async () => {
    const page = new NewPresurePage();
    expect(await page.isDisplayed(page.labelPreparaConexion)).toBe(true);
  });

  it('should show bluetooth instruction badge', async () => {
    const page = new NewPresurePage();
    expect(await page.isDisplayed(page.badgeBluetooth)).toBe(true);
  });

  it('should show monitor encendido badge', async () => {
    const page = new NewPresurePage();
    expect(await page.isDisplayed(page.badgeMonitorEncendido)).toBe(true);
  });

  it('should show Registrar manualmente button', async () => {
    const page = new NewPresurePage();
    expect(await page.isDisplayed(page.btnRegistrarManualmente)).toBe(true);
  });

  it('should show Escanear pantalla button (Android)', async () => {
    const page = new NewPresurePage();
    // Este botón solo aparece en Android
    expect(await page.isDisplayed(page.btnEscanearPantalla)).toBe(true);
  });
});

// ─────────────────────────────────────────────
// Nueva medición balanza (introducción)
// ─────────────────────────────────────────────
describe('[medition] New Scale Medition - Introduction Screen', () => {
  beforeEach(async () => {
    await loginAndGoHome();
    await goToMeditionTab();
    const scaleOption = $('~Composición corporal');
    await scaleOption.waitForDisplayed({ timeout: 15000 });
    await scaleOption.click();
  });

  it('should display the scale introduction screen', async () => {
    const page = new NewScalePage();
    const loaded = await page.isLoaded();
    expect(loaded).toBe(true);
  });

  it('should show the title Nueva medición', async () => {
    const page = new NewScalePage();
    expect(await page.isDisplayed(page.screenTitle)).toBe(true);
  });

  it('should show a primary action button (Conectar balanza or Medición inalámbrica)', async () => {
    const page = new NewScalePage();
    const hasConectar = await page.isDisplayed(page.btnConectarBalanza);
    const hasMedicion = await page.isDisplayed(page.btnMedicionInalambrica);
    expect(hasConectar || hasMedicion).toBe(true);
  });
});

// ─────────────────────────────────────────────
// Nueva medición balanza (formulario manual de peso)
// ─────────────────────────────────────────────
describe('[medition] New Scale Manual Measure - Weight Form', () => {
  beforeEach(async () => {
    await loginAndGoHome();
    await goToMeditionTab();
    const scaleOption = $('~Composición corporal');
    await scaleOption.waitForDisplayed({ timeout: 15000 });
    await scaleOption.click();
    const intro = new NewScalePage();
    await intro.isLoaded();
    // Si hay balanza vinculada aparece "Medición inalámbrica";
    // buscar el botón de medición manual
    const addManualBtn = $('android=new UiSelector().textContains("manual")');
    await addManualBtn.waitForDisplayed({ timeout: 10000 });
    await addManualBtn.click();
  });

  it('should display the manual weight form', async () => {
    const page = new FirstMeasurePage();
    const loaded = await page.isLoaded();
    expect(loaded).toBe(true);
  });

  it('should show PESO label', async () => {
    const page = new FirstMeasurePage();
    expect(await page.isDisplayed(page.labelPeso)).toBe(true);
  });

  it('should show Confirmar button', async () => {
    const page = new FirstMeasurePage();
    expect(await page.isDisplayed(page.btnConfirmar)).toBe(true);
  });

  it('should show Descartar button', async () => {
    const page = new FirstMeasurePage();
    expect(await page.isDisplayed(page.btnDescartar)).toBe(true);
  });
});
