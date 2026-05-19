const BasePage = require('../BasePage');

class SetBirthdatePage extends BasePage {
  get datePicker()     { return this.$text('Selecciona tu fecha de nacimiento'); }
  get continueButton() { return this.$text('Continuar'); }
  get screenTitle()    { return this.$text('Fecha de nacimiento'); }

  async isLoaded() {
    await this.waitForScreen(this.screenTitle);
    return true;
  }
}

module.exports = SetBirthdatePage;
