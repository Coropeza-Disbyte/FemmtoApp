const BasePage = require('../BasePage');

/**
 * SetWeightPage
 * Pantalla de configuración de peso en el flujo de OnBoarding (flujo antiguo).
 * Muestra el título "Peso", un campo de entrada numérica y el botón "Continuar".
 *
 * Uso:
 *   const page = new SetWeightPage();
 *   await page.isLoaded();
 *   await page.enterWeight('70');
 */
class SetWeightPage extends BasePage {

  get screenTitle()      { return this.$text('Peso'); }
  get weightInput()      { return this.$contains('Ingresa tu peso'); }
  /** Etiqueta de unidad "kg" visible en el input */
  get kgLabel()          { return this.$text('kg'); }
  get continueButton()   { return this.$text('Continuar'); }
  /** Mensaje de error cuando el peso no es válido */
  get weightError()      { return this.$contains('Por favor, introduzca un peso válido'); }

  async isLoaded() {
    await this.waitForScreen(this.screenTitle);
    return true;
  }

  /**
   * Ingresa el peso y confirma pulsando Continuar.
   * @param {string} weight - Valor numérico como string, p.ej. '70'
   */
  async enterWeight(weight) {
    await this.typeText(this.weightInput, weight);
    await this.hideKeyboard();
    await this.tap(this.continueButton);
  }
}

module.exports = SetWeightPage;
