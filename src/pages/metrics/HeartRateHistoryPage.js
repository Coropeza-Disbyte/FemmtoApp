const BasePage = require('../BasePage');

// Historial de mediciones de frecuencia cardíaca
class HeartRateHistoryPage extends BasePage {
  // Modal de confirmación de borrado
  get deleteModalTitle()    { return this.$contains('Estás seguro de que deseas eliminar'); }
  get deleteModalMessage()  { return this.$contains('presión arterial'); }
  get btnEliminar()         { return this.$text('Eliminar'); }
  get btnCancelar()         { return this.$text('Cancelar'); }

  async isLoaded() {
    await driver.pause(2000);
    return true;
  }

  async tapEliminar()       { await this.tap(this.btnEliminar); }
  async tapCancelar()       { await this.tap(this.btnCancelar); }
}

module.exports = HeartRateHistoryPage;
