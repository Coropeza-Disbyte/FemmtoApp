const BasePage = require('../BasePage');

// Pantalla de ingreso manual de peso (balanza manual)
// Se accede desde NewScalePage -> "Medición inalámbrica" -> "Agregar medición manual"
// o directamente desde NewMedition en algunos flujos
class FirstMeasurePage extends BasePage {
  get screenTitle()       { return this.$text('Nueva medición'); }

  // Campo de peso
  get labelPeso()         { return this.$text('PESO'); }
  get inputPeso()         { return this.$text('0'); }

  // Botones
  get btnConfirmar()      { return this.$text('Confirmar'); }
  get btnDescartar()      { return this.$text('Descartar'); }

  async isLoaded() {
    await this.waitForScreen(this.labelPeso);
    return true;
  }

  async typePeso(value) {
    await this.typeText(this.inputPeso, value);
    await this.hideKeyboard();
  }

  async tapConfirmar()    { await this.tap(this.btnConfirmar); }
  async tapDescartar()    { await this.tap(this.btnDescartar); }
}

module.exports = FirstMeasurePage;
