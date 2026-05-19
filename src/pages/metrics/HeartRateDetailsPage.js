const BasePage = require('../BasePage');

class HeartRateDetailsPage extends BasePage {
  // Header
  get screenTitle()       { return this.$text('Frecuencia cardíaca'); }

  async isLoaded() {
    await this.waitForScreen(this.screenTitle);
    return true;
  }
}

module.exports = HeartRateDetailsPage;
