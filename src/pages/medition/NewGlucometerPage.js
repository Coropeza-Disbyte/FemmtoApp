const BasePage = require('../BasePage');

// Pantalla de introducción al flujo de medición por glucómetro
// Título varía: "Vincula tu glucómetro" (sin dispositivo) o "Nueva medición" (con dispositivo)
class NewGlucometerPage extends BasePage {
  get screenTitleLink()           { return this.$text('Vincula tu glucómetro'); }
  get screenTitleNueva()          { return this.$text('Nueva medición'); }

  // Instrucciones de conexión
  get labelPreparaConexion()      { return this.$text('Prepara tu conexión'); }
  get badgeBluetooth()            { return this.$text('Bluetooth activado'); }
  get badgeGlucometroEncendido()  { return this.$text('Glucómetro encendido'); }

  // Botones de acción
  // Texto varía según si hay dispositivo vinculado o no
  get btnVincularGlucometro()     { return this.$text('Vincular glucómetro'); }
  get btnMedicionInalambrica()    { return this.$text('Medición inálambrica'); }
  get btnRegistrarManualmente()   { return this.$text('Registrar manualmente'); }

  async isLoaded() {
    // Esperar cualquiera de los dos títulos posibles
    try {
      await this.waitForScreen(this.screenTitleLink);
    } catch {
      await this.waitForScreen(this.screenTitleNueva);
    }
    return true;
  }

  async tapRegistrarManualmente() { await this.tap(this.btnRegistrarManualmente); }
  async tapMedicionInalambrica()  { await this.tap(this.btnMedicionInalambrica); }
  async tapVincularGlucometro()   { await this.tap(this.btnVincularGlucometro); }
}

module.exports = NewGlucometerPage;
