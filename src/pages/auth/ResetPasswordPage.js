const BasePage = require('../BasePage');

class ResetPasswordPage extends BasePage {
  get emailInput()  { return this.$text('Email'); }
  get sendButton()  { return this.$text('Enviar'); }
  get screenTitle() { return this.$text('Restablecer Contraseña'); }

  async isLoaded() {
    await this.waitForScreen(this.screenTitle);
    return true;
  }
}

module.exports = ResetPasswordPage;
