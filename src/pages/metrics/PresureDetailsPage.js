const BasePage = require('../BasePage');

class PresureDetailsPage extends BasePage {
  // Header
  get screenTitle()           { return this.$text('Presión Arterial'); }

  // Sección de valores promedio
  get labelValoresPromedio()  { return this.$text('Valores promedio'); }

  // Cards de detalle
  get cardPresionSistolica()  { return this.$text('Presión sistólica'); }
  get cardPresionDiastolica() { return this.$text('Presión diastólica'); }
  get cardPulso()             { return this.$contains('Pulso'); }

  // Botón historial
  get btnVerHistorial()       { return this.$contains('historial'); }

  async isLoaded() {
    await this.waitForScreen(this.screenTitle);
    return true;
  }

  async tapVerHistorial()     { await this.tap(this.btnVerHistorial); }
}

module.exports = PresureDetailsPage;
