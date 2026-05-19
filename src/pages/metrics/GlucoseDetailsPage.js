const BasePage = require('../BasePage');

class GlucoseDetailsPage extends BasePage {
  // Header
  get screenTitle()           { return this.$text('Glucosa en sangre'); }

  // Sección de valores promedio / por rango
  get cardPorRango()          { return this.$text('Por rango'); }

  // Botón historial
  get btnVerHistorial()       { return this.$contains('historial'); }

  async isLoaded() {
    await this.waitForScreen(this.screenTitle);
    return true;
  }

  async tapVerHistorial()     { await this.tap(this.btnVerHistorial); }
}

module.exports = GlucoseDetailsPage;
