const BasePage = require('../BasePage');

/**
 * SetHeightPage
 * Pantalla de configuración de altura en el flujo de OnBoarding (flujo antiguo).
 * Muestra el título "Altura", un campo de entrada numérica y el botón "Continuar".
 *
 * Uso:
 *   const page = new SetHeightPage();
 *   await page.isLoaded();
 *   await page.enterHeight('170');
 */
class SetHeightPage extends BasePage {

  get screenTitle()    { return this.$text('Altura'); }
  get heightInput()    { return this.$contains('Ingresa tu altura'); }
  /** Etiqueta de unidad "cm" visible en el input */
  get cmLabel()        { return this.$text('cm'); }
  get continueButton() { return this.$text('Continuar'); }
  /** Mensaje de error cuando la altura no es válida */
  get heightError()    { return this.$contains('Por favor, introduzca una altura válida'); }

  async isLoaded() {
    await this.waitForScreen(this.screenTitle);
    return true;
  }

  /**
   * Ingresa la altura y confirma pulsando Continuar.
   * @param {string} height - Valor numérico como string, p.ej. '170'
   */
  async enterHeight(height) {
    await this.typeText(this.heightInput, height);
    await this.hideKeyboard();
    await this.tap(this.continueButton);
  }
}

module.exports = SetHeightPage;
