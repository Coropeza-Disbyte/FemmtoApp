const BasePage = require('../BasePage');

class MenuPage extends BasePage {
  // Menu items
  get itemMiCuenta()              { return this.$text('Mi cuenta'); }
  get itemAgregarDispositivo()    { return this.$text('Agregar dispositivo inálambrico'); }
  get itemSoporte()               { return this.$text('Soporte'); }
  get itemNuestraTienda()         { return this.$text('Nuestra tienda'); }
  get itemCalificarApp()          { return this.$text('Calificar app'); }
  get itemTerminos()              { return this.$text('Términos y Condiciones'); }
  get itemPoliticas()             { return this.$text('Políticas de Privacidad'); }
  get itemVersion()               { return this.$text('Versión de Aplicación'); }
  get itemCerrarSesion()          { return this.$text('Cerrar sesión'); }

  // Elemento representativo para verificar que el menú está cargado:
  // El header usa un componente UserHeader sin texto fijo; usamos el primer item visible
  async isLoaded() {
    await this.waitForScreen(this.itemMiCuenta);
    return true;
  }

  async tapMiCuenta()             { await this.tap(this.itemMiCuenta); }
  async tapAgregarDispositivo()   { await this.tap(this.itemAgregarDispositivo); }
  async tapSoporte()              { await this.tap(this.itemSoporte); }
  async tapNuestraTienda()        { await this.tap(this.itemNuestraTienda); }
  async tapCalificarApp()         { await this.tap(this.itemCalificarApp); }
  async tapTerminos()             { await this.tap(this.itemTerminos); }
  async tapPoliticas()            { await this.tap(this.itemPoliticas); }
  async tapVersion()              { await this.tap(this.itemVersion); }
  async tapCerrarSesion()         { await this.tap(this.itemCerrarSesion); }
}

module.exports = MenuPage;
