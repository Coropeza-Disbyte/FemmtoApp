const BasePage = require('../BasePage');

class WelcomePage extends BasePage {
  get logo()              { return this.$('Logo'); }
  get btnPrimeraVez()     { return this.$('Ingresar por primera vez'); }
  get btnYaTengoCuenta()  { return this.$('Ya tengo una cuenta'); }

  async isLoaded() {
    await this.waitForScreen(this.logo);
    return true;
  }

  async tapIngresarPrimeraVez() {
    await this.tap(this.btnPrimeraVez);
  }

  async tapYaTengoCuenta() {
    await this.tap(this.btnYaTengoCuenta);
  }
}

module.exports = WelcomePage;
