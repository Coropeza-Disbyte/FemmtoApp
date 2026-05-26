const { launchAndLogin } = require('../../../src/flows/auth.flow');
const HomePage  = require('../../../src/pages/home/HomePage');
const SharePage = require('../../../src/pages/tabs/SharePage');

describe('[tabs] Share Metrics Screen', () => {
  beforeEach(async () => {
    await launchAndLogin();
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
    expect(await page.isDisplayed(page.checkPresionArterial)).toBe(true);
  });

  it('should toggle glucose report checkbox', async () => {
    const page = new SharePage();
    await page.isLoaded();
    await page.tapGlucosaEnSangre();
    expect(await page.isDisplayed(page.checkGlucosaEnSangre)).toBe(true);
  });
});
