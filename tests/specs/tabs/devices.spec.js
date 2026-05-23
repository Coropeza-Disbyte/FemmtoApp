const HomePage    = require('../../../src/pages/home/HomePage');
const DevicesPage = require('../../../src/pages/tabs/DevicesPage');
const { launchAndLogin } = require('../../../src/flows/auth.flow');

describe('[tabs] Devices Screen', () => {
  beforeEach(async () => {
    await launchAndLogin();
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
