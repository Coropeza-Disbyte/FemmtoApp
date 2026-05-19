const BasePage = require('../BasePage');

/**
 * SharePage — pantalla "Compartir métricas" accesible desde la tab del
 * bottom navigation (ShareContainer).
 */
class SharePage extends BasePage {
  // ── Encabezado ──────────────────────────────────────────────────────────────
  /** Título del header */
  get headerTitle() { return this.$text('Compartir métricas'); }

  // ── Sección destinatario ─────────────────────────────────────────────────────
  /** Título principal de la sección */
  get textSeguimientoCli­nico() { return this.$text('Tu seguimiento clínico'); }

  /** Instrucción del paso 1 */
  get textPaso1() { return this.$contains('1. Selecciona con quién'); }

  /** Opción "Profesional de la salud" */
  get optionDoctor()  { return this.$text('Profesional de la salud'); }

  /** Sub-texto del profesional */
  get textSeguimientoClinico() { return this.$text('Para seguimiento clínico'); }

  /** Opción "Familiar" */
  get optionFamiliar() { return this.$text('Familiar'); }

  /** Sub-texto familiar */
  get textAcompanamiento() { return this.$text('Para acompañamiento'); }

  // ── Sección tipo de reporte ───────────────────────────────────────────────────
  /** Instrucción del paso 2 */
  get textPaso2() { return this.$contains('2. Selecciona los reportes'); }

  /** Checkbox "Presión arterial" */
  get checkPresionArterial()    { return this.$('Presión arterial'); }

  /** Checkbox "Glucosa en sangre" */
  get checkGlucosaEnSangre()    { return this.$('Glucosa en sangre'); }

  /** Checkbox "Composición corporal" (Peso corporal) */
  get checkComposicionCorporal() { return this.$text('Composición corporal'); }

  // ── Sección periodo ───────────────────────────────────────────────────────────
  /** Instrucción del paso 3 */
  get textPaso3() { return this.$contains('3. Elegir periodo'); }

  /** Botón "Editar" del selector de periodo */
  get btnEditarPeriodo() { return this.$text('Editar'); }

  // ── Botón de acción principal ─────────────────────────────────────────────────
  /** Botón "Compartir" — tiene aria-label definido en el componente */
  get btnCompartir() { return this.$('Compartir'); }

  // ── Acciones ─────────────────────────────────────────────────────────────────
  async isLoaded() {
    await this.waitForScreen(this.headerTitle);
    return true;
  }

  async selectDestinatario(destinatario) {
    if (destinatario === 'doctor') {
      await this.tap(this.optionDoctor);
    } else {
      await this.tap(this.optionFamiliar);
    }
  }

  async tapPresionArterial() {
    await this.tap(this.checkPresionArterial);
  }

  async tapGlucosaEnSangre() {
    await this.tap(this.checkGlucosaEnSangre);
  }

  async tapComposicionCorporal() {
    await this.tap(this.checkComposicionCorporal);
  }

  async tapCompartir() {
    await this.tap(this.btnCompartir);
  }
}

module.exports = SharePage;
