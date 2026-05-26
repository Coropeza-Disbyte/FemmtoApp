const BasePage = require('../BasePage');

// Pantalla de introducción al flujo de medición con balanza
// Título varía: "Nueva medición" siempre en este flujo de introducción
class NewScalePage extends BasePage {
  get screenTitle()               { return this.$text('Nueva medición'); }

  // Texto descriptivo de instrucciones
  get textMantenerCerca()         { return this.$contains('Mantén los dispositivos cerca'); }
  get textEligeOpcion()           { return this.$contains('Elige la opción que se adapte'); }

  // Botones
  get btnConectarBalanza()        { return this.$('Conectar balanza'); }
  get btnMedicionInalambrica()    { return this.$('Medición inalámbrica'); }
  get btnRegistrarManualmente()   { return $('android=new UiScrollable(new UiSelector().scrollable(true)).scrollIntoView(new UiSelector().description("Registrar manualmente"))'); }

  async isLoaded() {
    await this.waitForScreen(this.screenTitle);
    return true;
  }

  async tapConectarBalanza()      { await this.tap(this.btnConectarBalanza); }
  async tapMedicionInalambrica()  { await this.tap(this.btnMedicionInalambrica); }
  async tapRegistrarManualmente() { await this.tap(this.btnRegistrarManualmente); }
}

module.exports = NewScalePage;
