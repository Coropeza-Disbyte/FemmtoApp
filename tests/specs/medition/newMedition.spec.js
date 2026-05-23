const NewGlucometerPage = require('../../../src/pages/medition/NewGlucometerPage');
const AddGlucosePage    = require('../../../src/pages/medition/AddGlucosePage');
const NewPresurePage    = require('../../../src/pages/medition/NewPresurePage');
const NewScalePage      = require('../../../src/pages/medition/NewScalePage');
const FirstMeasurePage  = require('../../../src/pages/medition/FirstMeasurePage');
const {
  goToGlucoseIntro,
  goToPressureIntro,
  goToScaleIntro,
} = require('../../../src/flows/medition.flow');

// ─────────────────────────────────────────────
// Nueva medición glucómetro (introducción)
// ─────────────────────────────────────────────
describe('[medition] New Glucometer Medition - Introduction Screen', () => {
  beforeEach(async () => {
    await goToGlucoseIntro();
  });

  it('should display the glucometer introduction screen', async () => {
    const page = new NewGlucometerPage();
    expect(await page.isLoaded()).toBe(true);
  });

  it('should show connection setup label on glucometer intro', async () => {
    const page = new NewGlucometerPage();
    expect(await page.isDisplayed(page.labelPreparaConexion)).toBe(true);
  });

  it('should show bluetooth active badge on glucometer intro', async () => {
    const page = new NewGlucometerPage();
    expect(await page.isDisplayed(page.badgeBluetooth)).toBe(true);
  });

  it('should show glucometer powered on badge', async () => {
    const page = new NewGlucometerPage();
    expect(await page.isDisplayed(page.badgeGlucometroEncendido)).toBe(true);
  });

  it('should show link glucometer button', async () => {
    const page = new NewGlucometerPage();
    expect(await page.isDisplayed(page.btnVincularGlucometro)).toBe(true);
  });

  it('should show manual glucose entry button', async () => {
    const page = new NewGlucometerPage();
    expect(await page.isDisplayed(page.btnRegistrarManualmente)).toBe(true);
  });
});

// ─────────────────────────────────────────────
// Nueva medición glucómetro (formulario manual)
// ─────────────────────────────────────────────
describe('[medition] Add Glucose Measure - Manual Form', () => {
  beforeEach(async () => {
    await goToGlucoseIntro();
    const intro = new NewGlucometerPage();
    await intro.isLoaded();
    await intro.tapRegistrarManualmente();
  });

  it('should display the manual glucose measure form', async () => {
    const page = new AddGlucosePage();
    expect(await page.isLoaded()).toBe(true);
  });

  it('should show Medición de glucosa en sangre title on manual glucose form', async () => {
    const page = new AddGlucosePage();
    expect(await page.isDisplayed(page.screenTitle)).toBe(true);
  });
});

// ─────────────────────────────────────────────
// Nueva medición presión arterial (introducción)
// ─────────────────────────────────────────────
describe('[medition] New Presure OCR Medition - Introduction Screen', () => {
  beforeEach(async () => {
    await goToPressureIntro();
  });

  it('should display the blood pressure introduction screen', async () => {
    const page = new NewPresurePage();
    expect(await page.isLoaded()).toBe(true);
  });

  it('should show connection setup label on blood pressure intro', async () => {
    const page = new NewPresurePage();
    expect(await page.isDisplayed(page.labelPreparaConexion)).toBe(true);
  });

  it('should show bluetooth active badge on blood pressure intro', async () => {
    const page = new NewPresurePage();
    expect(await page.isDisplayed(page.badgeBluetooth)).toBe(true);
  });

  it('should show blood pressure monitor powered on badge', async () => {
    const page = new NewPresurePage();
    expect(await page.isDisplayed(page.badgeMonitorEncendido)).toBe(true);
  });

  it('should show connect blood pressure monitor button', async () => {
    const page = new NewPresurePage();
    expect(await page.isDisplayed(page.btnConectarMonitor)).toBe(true);
  });

  it('should show scan screen button on blood pressure intro', async () => {
    const page = new NewPresurePage();
    expect(await page.isDisplayed(page.btnEscanearPantalla)).toBe(true);
  });

  it('should show manual blood pressure entry button', async () => {
    const page = new NewPresurePage();
    expect(await page.isDisplayed(page.btnRegistrarManualmente)).toBe(true);
  });
});

// ─────────────────────────────────────────────
// Nueva medición balanza (introducción)
// ─────────────────────────────────────────────
describe('[medition] New Scale Medition - Introduction Screen', () => {
  beforeEach(async () => {
    await goToScaleIntro();
  });

  it('should display the scale introduction screen', async () => {
    const page = new NewScalePage();
    expect(await page.isLoaded()).toBe(true);
  });

  it('should show Nueva medición title on scale intro', async () => {
    const page = new NewScalePage();
    expect(await page.isDisplayed(page.screenTitle)).toBe(true);
  });

  it('should show keep devices close instruction on scale intro', async () => {
    const page = new NewScalePage();
    expect(await page.isDisplayed(page.textMantenerCerca)).toBe(true);
  });

  it('should show primary connect button on scale intro (Conectar balanza or Medición inalámbrica)', async () => {
    const page = new NewScalePage();
    const hasConectar = await page.isDisplayed(page.btnConectarBalanza);
    const hasMedicion = await page.isDisplayed(page.btnMedicionInalambrica);
    expect(hasConectar || hasMedicion).toBe(true);
  });

  it('should show manual weight entry button', async () => {
    const page = new NewScalePage();
    expect(await page.isDisplayed(page.btnRegistrarManualmente)).toBe(true);
  });
});

// ─────────────────────────────────────────────
// Nueva medición balanza (formulario manual de peso)
// ─────────────────────────────────────────────
describe('[medition] New Scale Manual Measure - Weight Form', () => {
  beforeEach(async () => {
    await goToScaleIntro();
    const intro = new NewScalePage();
    await intro.isLoaded();
    const addManualBtn = $('android=new UiSelector().textContains("manual")');
    await addManualBtn.waitForDisplayed({ timeout: 10000 });
    await addManualBtn.click();
  });

  it('should display the manual weight form', async () => {
    const page = new FirstMeasurePage();
    expect(await page.isLoaded()).toBe(true);
  });

  it('should show PESO label on manual weight form', async () => {
    const page = new FirstMeasurePage();
    expect(await page.isDisplayed(page.labelPeso)).toBe(true);
  });

  it('should show Confirmar button on manual weight form', async () => {
    const page = new FirstMeasurePage();
    expect(await page.isDisplayed(page.btnConfirmar)).toBe(true);
  });

  it('should show Descartar button on manual weight form', async () => {
    const page = new FirstMeasurePage();
    expect(await page.isDisplayed(page.btnDescartar)).toBe(true);
  });
});
