const BasePage = require('../BasePage');

class LoginPage extends BasePage {
  get emailInput()        { return this.$text('Ingrese su email'); }
  get passwordInput()     { return this.$text('Ingrese su contraseña'); }
  get loginButton()       { return this.$('Ingresar'); }
  get forgotPassword()    { return this.$text('Olvidaste tu contraseña?'); }
  get googleButton()      { return this.$('Continuar con Google'); }
  get createAccountLink() { return this.$('¿No tenés cuenta?  Crear cuenta'); }
  get screenTitle()       { return this.$text('Ingresa a tu cuenta'); }

  async isLoaded() {
    await this.waitForScreen(this.screenTitle);
    return true;
  }

  async login(email, password) {
    await this.typeText(this.emailInput, email);
    await this.typeText(this.passwordInput, password);
    await this.hideKeyboard();
    await this.loginButton.waitForDisplayed({ timeout: 10000 });
    await this.tap(this.loginButton);
  }
}

module.exports = LoginPage;
