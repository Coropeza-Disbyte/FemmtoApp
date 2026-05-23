const HomePage     = require('../../../src/pages/home/HomePage');
const MeditionPage = require('../../../src/pages/tabs/MeditionPage');
const { launchAndLogin } = require('../../../src/flows/auth.flow');

describe('[home] Home Screen', () => {
  beforeEach(async () => {
    await launchAndLogin();
  });

  it('should display home screen after login', async () => {
    const page = new HomePage();
    expect(await page.isLoaded()).toBe(true);
  });

  it('should show all bottom tabs', async () => {
    const page = new HomePage();
    await page.isLoaded();
    expect(await page.isDisplayed(page.tabHome)).toBe(true);
    expect(await page.isDisplayed(page.tabDevices)).toBe(true);
    expect(await page.isDisplayed(page.tabReminders)).toBe(true);
    expect(await page.isDisplayed(page.tabShare)).toBe(true);
  });

  it('should navigate to Devices tab', async () => {
    const page = new HomePage();
    await page.isLoaded();
    await page.navigateToDevices();
    expect(await page.isDisplayed(page.tabDevices)).toBe(true);
  });

  it('should navigate to Reminders tab', async () => {
    const page = new HomePage();
    await page.isLoaded();
    await page.navigateToReminders();
    expect(await page.isDisplayed(page.tabReminders)).toBe(true);
  });

  it('should navigate to Share tab', async () => {
    const page = new HomePage();
    await page.isLoaded();
    await page.navigateToShare();
    expect(await page.isDisplayed(page.tabShare)).toBe(true);
  });

  it('should open Nueva medición screen via HomeHeader button', async () => {
    const home = new HomePage();
    await home.isLoaded();
    await home.tapNuevaMedicion();
    const medition = new MeditionPage();
    expect(await medition.isLoaded()).toBe(true);
  });
});
