const LoginPage = require('../pages/auth/LoginPage');
const users     = require('../fixtures/auth/users.json');

async function loginAs(user = users.validUser) {
  const page = new LoginPage();
  await page.isLoaded();
  await page.login(user.email, user.password);
}

async function launchAndLogin(user = users.validUser) {
  await driver.launchApp();
  await loginAs(user);
}

module.exports = { loginAs, launchAndLogin };
