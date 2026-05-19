const BasePage = require('../BasePage');

/**
 * RemindersPage — pantalla "Recordatorios" accesible desde la tab del
 * bottom navigation (RemidersList + AddReminder containers).
 */
class RemindersPage extends BasePage {
  // ── Encabezado ──────────────────────────────────────────────────────────────
  /** Título del header en la lista de recordatorios */
  get headerTitle() { return this.$text('Recordatorios'); }

  // ── Estado vacío ────────────────────────────────────────────────────────────
  /** Título cuando la lista está vacía */
  get emptyTitle() { return this.$text('No tienes recordatorios'); }

  /** Descripción del estado vacío */
  get emptyDescription() {
    return this.$contains('Crea recordatorios para no olvidar');
  }

  /** Botón "Agregar recordatorio" en estado vacío */
  get btnAgregarRecordatorioVacio() { return this.$text('Agregar recordatorio'); }

  // ── Estado con recordatorios ─────────────────────────────────────────────────
  /** Título de la sección cuando hay recordatorios */
  get sectionMisRecordatorios() { return this.$text('Mis recordatorios'); }

  /** Texto de gestión de recordatorios */
  get textGestiona() {
    return this.$text('Gestiona tus recordatorios de mediciones');
  }

  /** Botón "Editar" / "Listo" para el modo edición */
  get btnEditar() { return this.$text('Editar'); }
  get btnListo()  { return this.$text('Listo'); }

  /** Botón al pie de la lista para agregar un nuevo recordatorio */
  get btnAgregarRecordatorio() { return this.$text('Agregar recordatorio'); }

  // ── Pantalla AddReminder ─────────────────────────────────────────────────────
  /** Título del header en el formulario de nuevo recordatorio */
  get headerTitleAdd() { return this.$text('Agregar recordatorios'); }

  /** Etiqueta de tipo de recordatorio */
  get labelTipoRecordatorio() { return this.$text('Tipo de recordatorio'); }

  /** Opciones de tipo de recordatorio */
  get optionPresionArterial()   { return this.$text('Medición de presión arterial'); }
  get optionBalanza()           { return this.$text('Medición de balanza'); }
  get optionGlucosa()           { return this.$text('Medición de glucosa en sangre'); }
  get optionMedicacion()        { return this.$text('Tomar medicación'); }
  get optionOtro()              { return this.$text('Otro recordatorio'); }

  /** Label de la sección horario */
  get labelHorario() { return this.$text('Horario'); }

  /** Botón guardar */
  get btnGuardarRecordatorio() { return this.$text('Guardar recordatorio'); }

  // ── Acciones ─────────────────────────────────────────────────────────────────
  async isLoaded() {
    await this.waitForScreen(this.headerTitle);
    return true;
  }

  async tapAgregarRecordatorio() {
    // Funciona tanto desde el estado vacío como desde el footer de la lista
    await this.tap(this.btnAgregarRecordatorioVacio);
  }

  async tapEditar() {
    await this.tap(this.btnEditar);
  }

  async tapListo() {
    await this.tap(this.btnListo);
  }

  /** Abre el formulario de nuevo recordatorio desde el botón del footer */
  async tapAgregarRecordatorioFooter() {
    await this.tap(this.btnAgregarRecordatorio);
  }

  /** Selecciona un tipo de recordatorio en el formulario de alta */
  async selectTipoRecordatorio(tipo) {
    const opciones = {
      presion:   this.optionPresionArterial,
      balanza:   this.optionBalanza,
      glucosa:   this.optionGlucosa,
      medicacion: this.optionMedicacion,
      otro:      this.optionOtro,
    };
    await this.tap(opciones[tipo]);
  }
}

module.exports = RemindersPage;
