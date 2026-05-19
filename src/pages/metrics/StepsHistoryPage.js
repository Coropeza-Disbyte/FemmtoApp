const BasePage = require('../BasePage');

// Historial de pasos
class StepsHistoryPage extends BasePage {
  // El header de Steps usa el componente Header estándar con título fijo
  get screenTitle()         { return this.$text('Historial de mediciones'); }
  get backButton()          { return $('~Atrás'); }

  // Modal de confirmación de borrado
  get deleteModalTitle()    { return this.$contains('Estás seguro de que deseas eliminar'); }
  get btnEliminar()         { return this.$text('Eliminar'); }
  get btnCancelar()         { return this.$text('Cancelar'); }

  async isLoaded() {
    await this.waitForScreen(this.screenTitle);
    return true;
  }

  async tapEliminar()       { await this.tap(this.btnEliminar); }
  async tapCancelar()       { await this.tap(this.btnCancelar); }
}

module.exports = StepsHistoryPage;
