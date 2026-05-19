const BasePage = require('../BasePage');
const { DEFAULT_TIMEOUT } = require('../../config/timeouts');

/**
 * SaveOnboardingProgressPage
 * Cubre el flujo completo de registro (FirstMessage + pasos del formulario):
 *   FirstMessage → Email → Name → BirthDate → Gender → Weight → Height → ProfilePicture → Password
 *
 * Uso:
 *   const page = new SaveOnboardingProgressPage();
 *   await page.isLoaded();           // espera FirstMessage
 *   await page.isLoadedEmail();      // espera paso Email del formulario
 */
class SaveOnboardingProgressPage extends BasePage {

  // ── FirstMessage ──────────────────────────────────────────────────────────
  get firstMessageTitle()       { return this.$text('No pierdas tu progreso.'); }
  get firstMessageSubtitle()    { return this.$text('Vamos a terminar de crear tu perfil.'); }
  get continueButton()          { return this.$text('Continuar'); }

  // ── Email (paso 1) ────────────────────────────────────────────────────────
  get emailTitle()              { return this.$text('¿Cuál es tu correo electrónico?'); }
  get emailInput()              { return this.$contains('nombre@email.com'); }
  // aria-label del Checkbox component → toca el container (onChange), no el texto anidado (onPress=openBrowser)
  get termsCheckbox()           { return this.$('Aceptar términos y condiciones'); }
  get privacyCheckbox()         { return this.$('Aceptar políticas de privacidad'); }
  // El link está embebido en el texto del checkbox — textContains lo encuentra en el nodo padre
  get termsLink()               { return this.$contains('términos de uso.'); }
  get privacyLink()             { return this.$contains('políticas de privacidad.'); }
  get googleButton()            { return this.$text('Continuar con Google'); }
  get socialDividerLabel()      { return this.$text('ingresar con'); }

  // ── Name (paso 2) ─────────────────────────────────────────────────────────
  get nameTitle()               { return this.$text('¿Cuál es tu nombre?'); }
  // className: estable antes y después del foco — placeholder desaparece del text attr al enfocar
  get nameInput()               { return $('android=new UiSelector().className("android.widget.EditText")'); }

  // ── BirthDate (paso 3) ────────────────────────────────────────────────────
  get birthDateTitle()          { return this.$text('¿Cuál es tu fecha de nacimiento?'); }
  get birthDatePicker()         { return this.$contains('Selecciona tu fecha de nacimiento'); }

  // ── Gender (paso 4) ───────────────────────────────────────────────────────
  get genderTitle()             { return this.$text('¿Cuál es tu sexo biológico?'); }
  get genderInfoTitle()         { return this.$text('¿Por qué pedimos tu sexo biológico?'); }
  get genderInfoDescription()   { return this.$contains('rangos y valores estándar'); }

  // ── Weight (paso 5) ───────────────────────────────────────────────────────
  get weightTitle()             { return this.$text('¿Cuál es tu peso?'); }
  get weightInfoTitle()         { return this.$text('¿Por qué pedimos tu peso?'); }
  get weightInfoDescription()   { return this.$contains('personalizar tus metas y calcular tu IMC'); }

  // ── Height (paso 6) ───────────────────────────────────────────────────────
  get heightTitle()             { return this.$text('¿Cuál es tu altura?'); }
  get heightInfoTitle()         { return this.$text('¿Por qué pedimos tu altura?'); }
  get heightInfoDescription()   { return this.$contains('personalizar tus metas y calcular tu IMC'); }

  // ── ProfilePicture (paso 7) ───────────────────────────────────────────────
  get profilePictureTitle()     { return this.$text('¿Agregamos una foto de perfil?'); }
  get editPictureButton()       { return this.$text('Editar'); }
  // Modal de edición de foto
  get editPictureModalTitle()   { return this.$text('Edita la foto de perfil'); }
  get takePictureButton()       { return this.$text('Tomar foto'); }
  get pickFromGalleryButton()   { return this.$text('Elegir foto de la galería'); }
  get modalDoneButton()         { return this.$text('Listo'); }

  // ── Password (paso 8) ─────────────────────────────────────────────────────
  get passwordTitle()           { return this.$text('Crea una contraseña'); }
  get passwordInput()           { return this.$contains('Crear contraseña'); }
  get retryPasswordInput()      { return this.$contains('Repita su contraseña'); }

  // ── Checkbox helpers ─────────────────────────────────────────────────────
  // El label del checkbox contiene un <Text onPress={openWebBrowser}> anidado.
  // Un tap en el centro del elemento activa el link. Se toca el icono (izquierda) mediante coordenadas.
  async tapTermsCheckbox() {
    const el = this.$('Aceptar términos y condiciones');
    await el.waitForDisplayed({ timeout: DEFAULT_TIMEOUT });
    const loc  = await el.getLocation();
    const size = await el.getSize();
    await driver.performActions([{
      type: 'pointer', id: 'touch', parameters: { pointerType: 'touch' },
      actions: [
        { type: 'pointerMove', duration: 0, x: Math.round(loc.x + 50), y: Math.round(loc.y + size.height / 2) },
        { type: 'pointerDown', button: 0 },
        { type: 'pause', duration: 80 },
        { type: 'pointerUp', button: 0 },
      ],
    }]);
    await driver.releaseActions();
  }

  async tapPrivacyCheckbox() {
    const el = this.$('Aceptar políticas de privacidad');
    await el.waitForDisplayed({ timeout: DEFAULT_TIMEOUT });
    const loc  = await el.getLocation();
    const size = await el.getSize();
    await driver.performActions([{
      type: 'pointer', id: 'touch', parameters: { pointerType: 'touch' },
      actions: [
        { type: 'pointerMove', duration: 0, x: Math.round(loc.x + 50), y: Math.round(loc.y + size.height / 2) },
        { type: 'pointerDown', button: 0 },
        { type: 'pause', duration: 80 },
        { type: 'pointerUp', button: 0 },
      ],
    }]);
    await driver.releaseActions();
  }

  // ── isLoaded helpers ──────────────────────────────────────────────────────
  /** Espera la pantalla FirstMessage */
  async isLoaded() {
    await this.waitForScreen(this.firstMessageTitle);
    return true;
  }

  /** Espera el paso de Email del formulario */
  async isLoadedEmail() {
    await this.waitForScreen(this.emailTitle);
    return true;
  }

  /** Espera el paso de Name */
  async isLoadedName() {
    await this.waitForScreen(this.nameTitle);
    return true;
  }

  /** Espera el paso de BirthDate */
  async isLoadedBirthDate() {
    await this.waitForScreen(this.birthDateTitle);
    return true;
  }

  /** Espera el paso de Gender */
  async isLoadedGender() {
    await this.waitForScreen(this.genderTitle);
    return true;
  }

  /** Espera el paso de Weight */
  async isLoadedWeight() {
    await this.waitForScreen(this.weightTitle);
    return true;
  }

  /** Espera el paso de Height */
  async isLoadedHeight() {
    await this.waitForScreen(this.heightTitle);
    return true;
  }

  /** Espera el paso de ProfilePicture */
  async isLoadedProfilePicture() {
    await this.waitForScreen(this.profilePictureTitle);
    return true;
  }

  /** Espera el paso de Password */
  async isLoadedPassword() {
    await this.waitForScreen(this.passwordTitle);
    return true;
  }
}

module.exports = SaveOnboardingProgressPage;
