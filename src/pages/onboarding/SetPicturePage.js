const BasePage = require('../BasePage');

/**
 * SetPicturePage
 * Pantalla de foto de perfil en el flujo de OnBoarding (flujo antiguo).
 * Muestra el título "Foto de perfil" con opciones para tomar foto,
 * elegir de galería u omitir.
 *
 * Uso:
 *   const page = new SetPicturePage();
 *   await page.isLoaded();
 *   await page.tap(page.skipButton);
 */
class SetPicturePage extends BasePage {

  /** Título principal de la pantalla */
  get welcomeTitle()         { return this.$text('Te damos la bienvenida'); }
  get completeDataSubtitle() { return this.$text('Completa tus datos'); }
  get screenLabel()          { return this.$text('Foto de perfil'); }

  /** Imagen de avatar por defecto (accessibility label) */
  get profileAvatarImage()   { return this.$('foto de perfil'); }

  get takePictureButton()    { return this.$text('Tomar foto'); }
  get pickGalleryButton()    { return this.$text('Elegir foto de la galería'); }
  /** El botón muestra "Continuar" si hay foto, "Omitir" si no */
  get skipButton()           { return this.$text('Omitir'); }
  get continueButton()       { return this.$text('Continuar'); }

  async isLoaded() {
    await this.waitForScreen(this.screenLabel);
    return true;
  }
}

module.exports = SetPicturePage;
