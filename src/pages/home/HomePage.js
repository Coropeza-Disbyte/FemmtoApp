const BasePage    = require('../BasePage');
const { swipeDown } = require('../../helpers/gestures');

class HomePage extends BasePage {
  // Bottom tab navigation (v4.0.0: 4 tabs — Medición eliminada del bottom nav)
  get tabHome()        { return this.$('Home'); }
  get tabDevices()     { return this.$('Dispositivos'); }
  get tabReminders()   { return this.$('Recordatorios'); }
  get tabShare()       { return this.$('Compartir métricas'); }

  // HomeHeader — botón "Nueva medición" (reemplaza tab Medición desde v4.0.0)
  get btnNuevaMedicion() { return this.$('Nueva medición'); }

  // "Resumen de hoy" es un TextView plano en y≈136 — más estable que ~Home
  // (bottom nav en y≈2179 puede no ser visible durante animación post-tour en Android 16)
  get widgetTitle() { return this.$text('Resumen de hoy'); }

  async isLoaded() {
    await this.waitForScreen(this.widgetTitle);
    return true;
  }

  async navigateToDevices()    { await this.tap(this.tabDevices); }
  async navigateToReminders()  { await this.tap(this.tabReminders); }
  async navigateToShare()      { await this.tap(this.tabShare); }
  async tapNuevaMedicion() {
    await swipeDown();
    await driver.pause(500);
    // El Image tiene content-desc="Nueva medición" pero clickable=false.
    // Buscamos el ViewGroup (TouchableOpacity) padre que SÍ es clickable=true.
    const clickableBtn = $('android=new UiSelector().className("android.view.ViewGroup").clickable(true).childSelector(new UiSelector().description("Nueva medición"))');
    await clickableBtn.waitForDisplayed({ timeout: 15000 });
    await clickableBtn.click();
  }
}

module.exports = HomePage;
