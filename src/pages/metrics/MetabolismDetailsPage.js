const BasePage = require('../BasePage');

class MetabolismDetailsPage extends BasePage {
  // Header
  get screenTitle()             { return this.$text('Metabolismo'); }

  // Sección de valores promedio
  get labelValoresPromedio()    { return this.$text('Valores promedio'); }

  // Card tasa metabólica basal
  get cardTasaMetabolica()      { return this.$text('Tasa metabólica basal'); }

  // Botón historial
  get btnVerHistorial()         { return this.$contains('historial'); }

  async isLoaded() {
    await this.waitForScreen(this.screenTitle);
    return true;
  }

  async tapVerHistorial()       { await this.tap(this.btnVerHistorial); }
}

module.exports = MetabolismDetailsPage;
