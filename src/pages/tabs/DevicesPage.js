const BasePage = require('../BasePage');

/**
 * DevicesPage — pantalla "Dispositivos" accesible desde la tab de bottom navigation.
 * Cubre tanto el listado de dispositivos vinculados (DeviceList) como la pantalla
 * de selección de tipo de dispositivo (SelectDeviceType).
 */
class DevicesPage extends BasePage {
  // ── Encabezado ──────────────────────────────────────────────────────────────
  /** Título del header en la pantalla de lista */
  get headerTitle() { return this.$text('Dispositivos'); }

  // ── Estado vacío ────────────────────────────────────────────────────────────
  /** Mensaje cuando no hay ningún dispositivo vinculado */
  get emptyMessage() { return this.$text('No tienes ningún dispositivo vinculado'); }

  /** Botón principal en estado vacío */
  get btnAgregarDispositivoVacio() { return this.$text('Agregar dispositivo inálambrico'); }

  // ── Estado con dispositivos ─────────────────────────────────────────────────
  /** Título de la sección cuando ya hay dispositivos */
  get sectionMisDispositivos() { return this.$text('Mis dispositivos'); }

  /** Botón "Editar" / "Listo" para activar el modo edición */
  get btnEditar() { return this.$text('Editar'); }
  get btnListo()  { return this.$text('Listo'); }

  /** Botón para agregar un nuevo dispositivo cuando la lista tiene items */
  get btnAgregarDispositivo() { return this.$text('Agregar dispositivo inálambrico'); }

  // ── Pantalla SelectDeviceType ────────────────────────────────────────────────
  /** Instrucción de la pantalla de selección */
  get textEligeMedirte() { return this.$text('Elige cómo te quieres medir'); }

  /** Tarjetas de tipo de dispositivo */
  get cardMonitorPresion() { return this.$text('Monitor de presión'); }
  get cardBalanza()        { return this.$text('Balanza'); }
  get cardGlucometro()     { return this.$text('Glucómetro'); }

  // ── Acciones ─────────────────────────────────────────────────────────────────
  async isLoaded() {
    await this.waitForScreen(this.headerTitle);
    return true;
  }

  async tapAgregarDispositivo() {
    await this.tap(this.btnAgregarDispositivo);
  }

  async tapEditar() {
    await this.tap(this.btnEditar);
  }

  async tapListo() {
    await this.tap(this.btnListo);
  }
}

module.exports = DevicesPage;
