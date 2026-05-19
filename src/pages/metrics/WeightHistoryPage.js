const BasePage = require('../BasePage');

// Historial de mediciones de composición corporal (balanza)
class WeightHistoryPage extends BasePage {
  // El header usa MeasurementsHeader (sin texto fijo de título propio);
  // el modal de confirmación de borrado tiene textos identificables.
  get deleteModalTitle()    { return this.$contains('Estás seguro de que deseas eliminar'); }
  get deleteModalMessage()  { return this.$text('Recuerda que eliminar mediciones correctas puede afectar el seguimiento de tu composición corporal.'); }
  get btnEliminar()         { return this.$text('Eliminar'); }
  get btnCancelar()         { return this.$text('Cancelar'); }

  // Elemento que confirma que la lista de mediciones está visible
  // (el scroll-list aparece cuando hay datos)
  get listContainer()       { return this.$contains('composición corporal'); }
  get backButton()          { return $('~Atrás'); }

  async isLoaded() {
    await this.waitForScreen(this.backButton);
    return true;
  }

  async tapEliminar()       { await this.tap(this.btnEliminar); }
  async tapCancelar()       { await this.tap(this.btnCancelar); }
}

module.exports = WeightHistoryPage;
