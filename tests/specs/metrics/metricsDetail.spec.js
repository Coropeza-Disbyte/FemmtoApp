const WeightDetailsPage     = require('../../../src/pages/metrics/WeightDetailsPage');
const PresureDetailsPage    = require('../../../src/pages/metrics/PresureDetailsPage');
const GlucoseDetailsPage    = require('../../../src/pages/metrics/GlucoseDetailsPage');
const HeartRateDetailsPage  = require('../../../src/pages/metrics/HeartRateDetailsPage');
const StepsDetailsPage      = require('../../../src/pages/metrics/StepsDetailsPage');
const MetabolismDetailsPage = require('../../../src/pages/metrics/MetabolismDetailsPage');
const { loginAs }           = require('../../../src/flows/auth.flow');
const { skipIfBefore }      = require('../../../src/helpers/versionGuard');

const navigateToMetric = async (cardTitle) => {
  const card = $(`android=new UiSelector().text("${cardTitle}")`);
  await card.waitForDisplayed({ timeout: 15000 });
  await card.click();
};

// ─────────────────────────────────────────────
// Composición corporal (Weight)
// ─────────────────────────────────────────────
describe('[metrics] Composición corporal — detalle', () => {
  beforeEach(async () => {
    await loginAs();
    await navigateToMetric('Composición corporal');
  });

  it('should display the weight detail screen', async () => {
    const page = new WeightDetailsPage();
    expect(await page.isLoaded()).toBe(true);
  });

  it('should show period selector Día / Semana / Mes', async () => {
    const page = new WeightDetailsPage();
    await page.isLoaded();
    expect(await page.isDisplayed(page.selectorDia)).toBe(true);
    expect(await page.isDisplayed(page.selectorSemana)).toBe(true);
    expect(await page.isDisplayed(page.selectorMes)).toBe(true);
  });

  it('should show tabs General and Segmentada', async () => {
    const page = new WeightDetailsPage();
    await page.isLoaded();
    expect(await page.isDisplayed(page.tabGeneral)).toBe(true);
    expect(await page.isDisplayed(page.tabSegmentada)).toBe(true);
  });

  it('should show Valores promedio label', async () => {
    const page = new WeightDetailsPage();
    await page.isLoaded();
    expect(await page.isDisplayed(page.labelValoresPromedio)).toBe(true);
  });

  it('should show Ver historial button', async () => {
    const page = new WeightDetailsPage();
    await page.isLoaded();
    expect(await page.isDisplayed(page.btnVerHistorial)).toBe(true);
  });

  it('should switch period to Semana', async () => {
    const page = new WeightDetailsPage();
    await page.isLoaded();
    await page.selectPeriodSemana();
    expect(await page.isDisplayed(page.selectorSemana)).toBe(true);
  });

  it('should switch period to Mes', async () => {
    const page = new WeightDetailsPage();
    await page.isLoaded();
    await page.selectPeriodMes();
    expect(await page.isDisplayed(page.selectorMes)).toBe(true);
  });
});

// ─────────────────────────────────────────────
// Presión arterial
// ─────────────────────────────────────────────
describe('[metrics] Presión arterial — detalle', () => {
  beforeEach(async () => {
    await loginAs();
    await navigateToMetric('Presión arterial');
  });

  it('should display the presion arterial detail screen', async () => {
    const page = new PresureDetailsPage();
    expect(await page.isLoaded()).toBe(true);
  });

  it('should show cards Sistólica, Diastólica y Pulso', async () => {
    const page = new PresureDetailsPage();
    await page.isLoaded();
    expect(await page.isDisplayed(page.cardPresionSistolica)).toBe(true);
    expect(await page.isDisplayed(page.cardPresionDiastolica)).toBe(true);
    expect(await page.isDisplayed(page.cardPulso)).toBe(true);
  });

  it('should show Valores promedio label', async () => {
    const page = new PresureDetailsPage();
    await page.isLoaded();
    expect(await page.isDisplayed(page.labelValoresPromedio)).toBe(true);
  });

  it('should show Ver historial button', async () => {
    const page = new PresureDetailsPage();
    await page.isLoaded();
    expect(await page.isDisplayed(page.btnVerHistorial)).toBe(true);
  });
});

// ─────────────────────────────────────────────
// Glucosa en sangre
// ─────────────────────────────────────────────
describe('[metrics] Glucosa en sangre — detalle', () => {
  beforeEach(async () => {
    await loginAs();
    await navigateToMetric('Glucosa en sangre');
  });

  it('should display the glucose detail screen', async () => {
    const page = new GlucoseDetailsPage();
    expect(await page.isLoaded()).toBe(true);
  });

  it('should show card Por rango', async () => {
    const page = new GlucoseDetailsPage();
    await page.isLoaded();
    expect(await page.isDisplayed(page.cardPorRango)).toBe(true);
  });

  it('should show Ver historial button', async () => {
    const page = new GlucoseDetailsPage();
    await page.isLoaded();
    expect(await page.isDisplayed(page.btnVerHistorial)).toBe(true);
  });
});

// ─────────────────────────────────────────────
// Frecuencia cardíaca — solo disponible desde v3.4.0
// ─────────────────────────────────────────────
describe('[metrics] Frecuencia cardíaca — detalle', function () {
  before(function () { if (skipIfBefore('3.4.0')) this.skip(); });

  beforeEach(async () => {
    await loginAs();
    await navigateToMetric('Frecuencia cardíaca');
  });

  it('should display the heart rate detail screen', async () => {
    const page = new HeartRateDetailsPage();
    expect(await page.isLoaded()).toBe(true);
  });

  it('should show screen title Frecuencia cardíaca', async () => {
    const page = new HeartRateDetailsPage();
    await page.isLoaded();
    expect(await page.isDisplayed(page.screenTitle)).toBe(true);
  });
});

// ─────────────────────────────────────────────
// Pasos — solo disponible desde v3.4.0
// ─────────────────────────────────────────────
describe('[metrics] Pasos — detalle', function () {
  before(function () { if (skipIfBefore('3.4.0')) this.skip(); });

  beforeEach(async () => {
    await loginAs();
    await navigateToMetric('Pasos');
  });

  it('should display the steps detail screen', async () => {
    const page = new StepsDetailsPage();
    expect(await page.isLoaded()).toBe(true);
  });

  it('should show screen title Pasos', async () => {
    const page = new StepsDetailsPage();
    await page.isLoaded();
    expect(await page.isDisplayed(page.screenTitle)).toBe(true);
  });
});

// ─────────────────────────────────────────────
// Metabolismo
// ─────────────────────────────────────────────
describe('[metrics] Metabolismo — detalle', () => {
  beforeEach(async () => {
    await loginAs();
    await navigateToMetric('Metabolismo');
  });

  it('should display the metabolism detail screen', async () => {
    const page = new MetabolismDetailsPage();
    expect(await page.isLoaded()).toBe(true);
  });

  it('should show Valores promedio label', async () => {
    const page = new MetabolismDetailsPage();
    await page.isLoaded();
    expect(await page.isDisplayed(page.labelValoresPromedio)).toBe(true);
  });

  it('should show Tasa metabólica basal card', async () => {
    const page = new MetabolismDetailsPage();
    await page.isLoaded();
    expect(await page.isDisplayed(page.cardTasaMetabolica)).toBe(true);
  });

  it('should show Ver historial button', async () => {
    const page = new MetabolismDetailsPage();
    await page.isLoaded();
    expect(await page.isDisplayed(page.btnVerHistorial)).toBe(true);
  });
});
