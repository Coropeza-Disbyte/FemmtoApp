const BasePage = require('../BasePage');

class SetGenderPage extends BasePage {
  get continueButton() { return this.$text('Continuar'); }
  get screenTitle()    { return this.$text('Sexo biológico'); }

  async isLoaded() {
    await this.waitForScreen(this.screenTitle);
    return true;
  }
}

module.exports = SetGenderPage;
