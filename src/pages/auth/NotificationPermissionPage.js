const BasePage = require('../BasePage');

class NotificationPermissionPage extends BasePage {
  get allowButton() { return this.$text('Recibir notificaciones'); }
  get skipButton()  { return this.$text('Ahora no'); }
  get screenTitle() { return this.$text('Te ayudamos a sostener tu hábito de salud día a día.'); }

  async isLoaded() {
    await this.waitForScreen(this.screenTitle);
    return true;
  }
}

module.exports = NotificationPermissionPage;
