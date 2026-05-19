const BasePage = require('../BasePage');

// Pantalla de medición manual de glucosa en sangre
class AddGlucosePage extends BasePage {
  // Header: título cambia según modo edición o nuevo registro
  get screenTitle()         { return this.$text('Medición de glucosa en sangre'); }
  get screenTitleEdit()     { return this.$text('Editar medición'); }

  // Campo principal de valor de glucosa
  get inputGlucose()        { return this.$contains('glucosa'); }

  // Botón guardar
  get btnGuardar()          { return this.$contains('Guardar'); }

  async isLoaded() {
    await this.waitForScreen(this.screenTitle);
    return true;
  }

  async typeGlucose(value) {
    await this.typeText(this.inputGlucose, value);
    await this.hideKeyboard();
  }

  async save()              { await this.tap(this.btnGuardar); }
}

module.exports = AddGlucosePage;
