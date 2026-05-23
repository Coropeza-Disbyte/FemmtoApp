const BasePage = require('../BasePage');

// Pantalla de introducción al flujo de medición de presión arterial
// Título varía: "Vincula tu monitor de presión" (sin dispositivo) o "Nueva medición" (con dispositivo)
class NewPresurePage extends BasePage {
  get screenTitleLink()           { return this.$text('Vincula tu monitor de presión'); }
  get screenTitleNueva()          { return this.$text('Nueva medición'); }

  // Instrucciones de conexión
  get labelPreparaConexion()      { return this.$text('Prepara tu conexión'); }
  get badgeBluetooth()            { return this.$text('Bluetooth activado'); }
  get badgeMonitorEncendido()     { return this.$text('Monitor encendido'); }

  // Botones de acción
  get btnConectarMonitor()        { return this.$('Conectar monitor de presión'); }
  get btnMedicionInalambrica()    { return this.$('Medición inálambrica'); }
  get btnRegistrarManualmente()   { return $('android=new UiScrollable(new UiSelector().scrollable(true)).scrollIntoView(new UiSelector().description("Registrar manualmente"))'); }
  get btnEscanearPantalla()       { return this.$('Escanear pantalla'); }

  async isLoaded() {
    try {
      await this.waitForScreen(this.screenTitleLink);
    } catch {
      await this.waitForScreen(this.screenTitleNueva);
    }
    return true;
  }

  async tapRegistrarManualmente() { await this.tap(this.btnRegistrarManualmente); }
  async tapEscanearPantalla()     { await this.tap(this.btnEscanearPantalla); }
  async tapMedicionInalambrica()  { await this.tap(this.btnMedicionInalambrica); }
}

module.exports = NewPresurePage;
