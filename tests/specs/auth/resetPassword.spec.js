const LoginPage         = require('../../../src/pages/auth/LoginPage');
const ResetPasswordPage = require('../../../src/pages/auth/ResetPasswordPage');
const { launchClean }   = require('../../../src/flows/auth.flow');

describe('[auth] Reset Password', () => {
  beforeEach(async () => {
    await launchClean();
    const login = new LoginPage();
    await login.isLoaded();
    await login.tap(login.forgotPassword);
  });

  it('should display reset password screen', async () => {
    const page = new ResetPasswordPage();
    expect(await page.isLoaded()).toBe(true);
  });

  it('should show email field and send button', async () => {
    const page = new ResetPasswordPage();
    await page.isLoaded();
    expect(await page.isDisplayed(page.emailInput)).toBe(true);
    expect(await page.isDisplayed(page.sendButton)).toBe(true);
  });

  it('should not send with empty email', async () => {
    const page = new ResetPasswordPage();
    await page.isLoaded();
    await page.tap(page.sendButton);
    expect(await page.isDisplayed(page.sendButton)).toBe(true);
  });
});
