const LoginPage   = require('../../../src/pages/auth/LoginPage');
const WelcomePage = require('../../../src/pages/welcome/WelcomePage');
const credentials = require('../../../src/fixtures/auth/credentials');

const navigateToLogin = async () => {
  const pkg = process.env.APP_PACKAGE || 'com.femmto.app';
  await driver.execute('mobile: shell', { command: 'pm',  args: ['clear', pkg] });
  await driver.execute('mobile: shell', { command: 'am',  args: ['start', '-n', `${pkg}/.MainActivity`] });
  await $('~Ya tengo una cuenta').waitForDisplayed({ timeout: 30000 });
  await $('~Ya tengo una cuenta').click();
  await $('android=new UiSelector().text("Ingresa a tu cuenta")').waitForDisplayed({ timeout: 15000 });
};

describe('[auth] Login — validaciones de campos', () => {
  beforeEach(navigateToLogin);

  it('should display all login fields', async () => {
    const page = new LoginPage();
    expect(await page.isLoaded()).toBe(true);
    expect(await page.isDisplayed(page.emailInput)).toBe(true);
    expect(await page.isDisplayed(page.passwordInput)).toBe(true);
    expect(await page.isDisplayed(page.loginButton)).toBe(true);
  });

  it('should not login with empty fields', async () => {
    const page = new LoginPage();
    await page.isLoaded();
    await page.tap(page.loginButton);
    expect(await page.isDisplayed(page.loginButton)).toBe(true);
  });

  it('should not login with email only', async () => {
    const page = new LoginPage();
    await page.isLoaded();
    await page.typeText(page.emailInput, 'test@test.com');
    await page.hideKeyboard();
    await page.loginButton.waitForDisplayed({ timeout: 10000 });
    await page.tap(page.loginButton);
    expect(await page.isDisplayed(page.loginButton)).toBe(true);
  });

  it('should not login with password only', async () => {
    const page = new LoginPage();
    await page.isLoaded();
    await page.typeText(page.passwordInput, 'password123');
    await page.hideKeyboard();
    await page.loginButton.waitForDisplayed({ timeout: 10000 });
    await page.tap(page.loginButton);
    expect(await page.isDisplayed(page.loginButton)).toBe(true);
  });

  it('should show forgot password link', async () => {
    const page = new LoginPage();
    await page.isLoaded();
    expect(await page.isDisplayed(page.forgotPassword)).toBe(true);
  });

  it('should show Google login option', async () => {
    const page = new LoginPage();
    await page.isLoaded();
    expect(await page.isDisplayed(page.googleButton)).toBe(true);
  });

  it('should show create account link', async () => {
    const page = new LoginPage();
    await page.isLoaded();
    expect(await page.isDisplayed(page.createAccountLink)).toBe(true);
  });
});

describe('[auth] Login — credenciales válidas', () => {
  beforeEach(navigateToLogin);

  it('should login successfully and leave login screen', async () => {
    const page = new LoginPage();
    await page.isLoaded();
    await page.login(credentials.validUser.email, credentials.validUser.password);
    await page.loginButton.waitForDisplayed({ timeout: 20000, reverse: true });
  });
});
