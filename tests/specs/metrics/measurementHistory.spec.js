const WeightDetailsPage  = require('../../../src/pages/metrics/WeightDetailsPage');
const PresureDetailsPage = require('../../../src/pages/metrics/PresureDetailsPage');
const GlucoseDetailsPage = require('../../../src/pages/metrics/GlucoseDetailsPage');
const StepsDetailsPage   = require('../../../src/pages/metrics/StepsDetailsPage');
const WeightHistoryPage  = require('../../../src/pages/metrics/WeightHistoryPage');
const GlucoseHistoryPage = require('../../../src/pages/metrics/GlucoseHistoryPage');
const PresureHistoryPage = require('../../../src/pages/metrics/PresureHistoryPage');
const StepsHistoryPage   = require('../../../src/pages/metrics/StepsHistoryPage');
const { loginAs }          = require('../../../src/flows/auth.flow');
const { navigateToMetric } = require('../../../src/helpers/metricsNav');
const { skipIfBefore }     = require('../../../src/helpers/versionGuard');

// ─────────────────────────────────────────────
// Historial — Composición corporal
// ─────────────────────────────────────────────
describe('[metrics] Historial — Composición corporal', () => {
  beforeEach(async () => {
    await loginAs();
    await navigateToMetric('Composición corporal');
    const detail = new WeightDetailsPage();
    await detail.isLoaded();
    await detail.tapVerHistorial();
  });

  it('should navigate to weight history screen', async () => {
    const page = new WeightHistoryPage();
    expect(await page.isLoaded()).toBe(true);
  });

  it('should show back button to return to detail', async () => {
    const page = new WeightHistoryPage();
    await page.isLoaded();
    expect(await page.isDisplayed(page.backButton)).toBe(true);
  });

  it('should navigate back to weight detail from history', async () => {
    const page = new WeightHistoryPage();
    await page.isLoaded();
    await page.tap(page.backButton);
    const detail = new WeightDetailsPage();
    expect(await detail.isLoaded()).toBe(true);
  });
});

// ─────────────────────────────────────────────
// Historial — Glucosa en sangre
// ─────────────────────────────────────────────
describe('[metrics] Historial — Glucosa en sangre', () => {
  beforeEach(async () => {
    await loginAs();
    await navigateToMetric('Glucosa en sangre');
    const detail = new GlucoseDetailsPage();
    await detail.isLoaded();
    await detail.tapVerHistorial();
  });

  it('should navigate to glucose history screen', async () => {
    const page = new GlucoseHistoryPage();
    expect(await page.isLoaded()).toBe(true);
  });

  it('should show back button to return to detail', async () => {
    const page = new GlucoseHistoryPage();
    await page.isLoaded();
    expect(await page.isDisplayed(page.backButton)).toBe(true);
  });

  it('should navigate back to glucose detail from history', async () => {
    const page = new GlucoseHistoryPage();
    await page.isLoaded();
    await page.tap(page.backButton);
    const detail = new GlucoseDetailsPage();
    expect(await detail.isLoaded()).toBe(true);
  });
});

// ─────────────────────────────────────────────
// Historial — Presión arterial
// ─────────────────────────────────────────────
describe('[metrics] Historial — Presión arterial', () => {
  beforeEach(async () => {
    await loginAs();
    await navigateToMetric('Presión arterial');
    const detail = new PresureDetailsPage();
    await detail.isLoaded();
    await detail.tapVerHistorial();
  });

  it('should navigate to presure history screen', async () => {
    const page = new PresureHistoryPage();
    expect(await page.isLoaded()).toBe(true);
  });

  it('should show back button to return to detail', async () => {
    const page = new PresureHistoryPage();
    await page.isLoaded();
    expect(await page.isDisplayed(page.backButton)).toBe(true);
  });

  it('should navigate back to presure detail from history', async () => {
    const page = new PresureHistoryPage();
    await page.isLoaded();
    await page.tap(page.backButton);
    const detail = new PresureDetailsPage();
    expect(await detail.isLoaded()).toBe(true);
  });
});

// ─────────────────────────────────────────────
// Historial — Pasos — solo disponible desde v3.4.0
// ─────────────────────────────────────────────
describe('[metrics] Historial — Pasos', function () {
  before(function () { if (skipIfBefore('3.4.0')) this.skip(); });

  beforeEach(async () => {
    await loginAs();
    await navigateToMetric('Pasos');
    const detail = new StepsDetailsPage();
    await detail.isLoaded();
    const historyBtn = $('android=new UiSelector().textContains("historial")');
    await historyBtn.waitForDisplayed({ timeout: 10000 });
    await historyBtn.click();
  });

  it('should navigate to steps history screen', async () => {
    const page = new StepsHistoryPage();
    expect(await page.isLoaded()).toBe(true);
  });

  it('should show screen title Historial de mediciones', async () => {
    const page = new StepsHistoryPage();
    await page.isLoaded();
    expect(await page.isDisplayed(page.screenTitle)).toBe(true);
  });

  it('should navigate back to steps detail from history', async () => {
    const page = new StepsHistoryPage();
    await page.isLoaded();
    await page.tap(page.backButton);
    const detail = new StepsDetailsPage();
    expect(await detail.isLoaded()).toBe(true);
  });
});
