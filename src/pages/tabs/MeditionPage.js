const BasePage = require('../BasePage');

/**
 * MeditionPage — pantalla "Nueva medición" accesible desde la tab central
 * del bottom navigation (MeditionOptions container).
 */
class MeditionPage extends BasePage {
  // ── Encabezado ──────────────────────────────────────────────────────────────
  /** Título del header */
  get headerTitle() { return this.$text('Nueva medición'); }

  // ── Instrucción ─────────────────────────────────────────────────────────────
  /** Subtítulo que indica al usuario cómo elegir */
  get textEligeMedirte() { return this.$text('Elige cómo te quieres medir'); }

  /** Descripción secundaria */
  get textSeleccionaDispositivo() {
    return this.$text('Selecciona tu dispositivo para registrar una nueva medición.');
  }

  // ── Tarjetas de dispositivo ─────────────────────────────────────────────────
  /** Tarjeta "Monitor de presión" */
  get cardMonitorPresion() { return this.$text('Monitor de presión'); }

  /** Tarjeta "Balanza" */
  get cardBalanza() { return this.$text('Balanza'); }

  /** Tarjeta "Glucómetro" */
  get cardGlucometro() { return this.$text('Glucómetro'); }

  // ── Badges de tipo de medición ───────────────────────────────────────────────
  /** Badge "Bluetooth" visible en cada tarjeta */
  get badgeBluetooth() { return this.$text('Bluetooth'); }

  /** Badge "Manual" visible en cada tarjeta */
  get badgeManual() { return this.$text('Manual'); }

  // ── Acciones ─────────────────────────────────────────────────────────────────
  async isLoaded() {
    await this.waitForScreen(this.textEligeMedirte);
    return true;
  }

  async tapMonitorPresion() {
    await this.tap(this.cardMonitorPresion);
  }

  async tapBalanza() {
    await this.tap(this.cardBalanza);
  }

  async tapGlucometro() {
    await this.tap(this.cardGlucometro);
  }
}

module.exports = MeditionPage;
