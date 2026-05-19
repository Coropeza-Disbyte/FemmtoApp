const HomePage    = require('../../../src/pages/home/HomePage');
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

describe('[home] Home Screen', () => {
  beforeEach(loginAndGoHome);

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
});
