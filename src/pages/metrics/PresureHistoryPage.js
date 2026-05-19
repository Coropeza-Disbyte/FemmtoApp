const BasePage = require('../BasePage');

// Historial de mediciones de presión arterial
class PresureHistoryPage extends BasePage {
  // Modal de confirmación de borrado
  get deleteModalTitle()    { return this.$contains('Estás seguro de que deseas eliminar'); }
  get deleteModalMessage()  { return this.$text('Recuerda que eliminar mediciones correctas puede afectar el seguimiento de tu presión arterial.'); }
  get btnEliminar()         { return this.$text('Eliminar'); }
  get btnCancelar()         { return this.$text('Cancelar'); }

  get backButton()          { return $('~Atrás'); }

  async isLoaded() {
    await this.waitForScreen(this.backButton);
    return true;
  }

  async tapEliminar()       { await this.tap(this.btnEliminar); }
  async tapCancelar()       { await this.tap(this.btnCancelar); }
}

module.exports = PresureHistoryPage;
