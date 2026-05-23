const MeditionPage = require('../../../src/pages/tabs/MeditionPage');
const { goToMeditionOptions } = require('../../../src/flows/medition.flow');

describe('[tabs] New Medition Screen', () => {
  beforeEach(async () => {
    await goToMeditionOptions();
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

  it('should navigate away from MeditionOptions on Monitor de presión tap', async () => {
    const page = new MeditionPage();
    await page.isLoaded();
    await page.tapMonitorPresion();
    const stillOnMedition = await page.isDisplayed(page.headerTitle);
    expect(stillOnMedition).toBe(false);
  });
});
