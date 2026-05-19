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
  get btnConectarMonitor()        { return this.$text('Conectar monitor de presión'); }
  get btnMedicionInalambrica()    { return this.$text('Medición inálambrica'); }
  get btnRegistrarManualmente()   { return this.$text('Registrar manualmente'); }
  get btnEscanearPantalla()       { return this.$text('Escanear pantalla'); }

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
