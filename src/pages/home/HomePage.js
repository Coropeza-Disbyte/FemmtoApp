const BasePage = require('../BasePage');

class HomePage extends BasePage {
  // Bottom tab navigation
  get tabHome()        { return this.$('Home'); }
  get tabDevices()     { return this.$('Dispositivos'); }
  get tabMedition()    { return this.$('Medición'); }
  get tabReminders()   { return this.$('Recordatorios'); }
  get tabShare()       { return this.$('Compartir métricas'); }

  async isLoaded() {
    await this.waitForScreen(this.tabHome);
    return true;
  }

  async navigateToDevices()   { await this.tap(this.tabDevices); }
  async navigateToMedition()  { await this.tap(this.tabMedition); }
  async navigateToReminders() { await this.tap(this.tabReminders); }
  async navigateToShare()     { await this.tap(this.tabShare); }
}

module.exports = HomePage;
