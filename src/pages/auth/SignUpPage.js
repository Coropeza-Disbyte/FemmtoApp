const BasePage = require('../BasePage');

class SignUpPage extends BasePage {
  get emailInput()           { return this.$text('Email'); }
  get nameInput()            { return this.$text('Nombre completo'); }
  get passwordInput()        { return this.$text('Crear contraseña'); }
  get confirmPasswordInput() { return this.$text('Repita su contraseña'); }
  get termsCheckbox()        { return $('android=new UiSelector().description("Aceptar términos y condiciones")'); }
  get privacyCheckbox()      { return $('android=new UiSelector().description("Aceptar políticas de privacidad")'); }
  get createAccountButton()  { return this.$text('Crear cuenta'); }
  get googleButton()         { return this.$('Continuar con Google'); }
  get screenTitle()          { return this.$text('Completa tus datos'); }

  async isLoaded() {
    await this.waitForScreen(this.screenTitle);
    return true;
  }

  async fillForm(email, name, password) {
    await this.typeText(this.emailInput, email);
    await this.typeText(this.nameInput, name);
    await this.typeText(this.passwordInput, password);
    await this.typeText(this.confirmPasswordInput, password);
    await this.hideKeyboard();
  }
}

module.exports = SignUpPage;
