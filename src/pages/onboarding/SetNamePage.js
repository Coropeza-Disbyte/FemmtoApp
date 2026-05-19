const BasePage = require('../BasePage');

class SetNamePage extends BasePage {
  get nameInput()      { return this.$text('Tu nombre'); }
  get continueButton() { return this.$text('Continuar'); }
  get screenTitle()    { return this.$text('Completa tu nombre'); }

  async isLoaded() {
    await this.waitForScreen(this.screenTitle);
    return true;
  }
}

module.exports = SetNamePage;
