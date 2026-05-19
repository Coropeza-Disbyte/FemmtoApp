const BasePage = require('../BasePage');

class StepsDetailsPage extends BasePage {
  // Header
  get screenTitle()       { return this.$text('Pasos'); }

  async isLoaded() {
    await this.waitForScreen(this.screenTitle);
    return true;
  }
}

module.exports = StepsDetailsPage;
