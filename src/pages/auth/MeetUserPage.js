const BasePage = require('../BasePage');

/**
 * MeetUserPage
 * Cubre todas las sub-pantallas del flujo MeetUser:
 *   Greeting → Instructions → Questions (Targets / Motivations / HowKnow / Frequency) → CompleteProfileSuccess
 *
 * Uso:
 *   const page = new MeetUserPage();
 *   await page.isLoaded();                    // espera pantalla Greeting
 *   await page.isLoadedInstructions();        // espera pantalla Instructions
 *   await page.isLoadedTargets();             // espera pantalla Targets
 */
class MeetUserPage extends BasePage {

  // ── Greeting ──────────────────────────────────────────────────────────────
  get greetingTitle() { return this.$text('¡Hola!'); }
  get greetingSubtitle() { return this.$text('Somos Femmto.'); }
  get greetingDescription() { return this.$contains('Te acompañamos en el camino'); }
  get startButton() { return this.$text('Empezar'); }

  // ── Instructions ──────────────────────────────────────────────────────────
  get instructionsTitle() { return this.$text('Queremos conocerte.'); }
  get instructionsDescription() { return this.$contains('4 preguntas rápidas'); }
  get continueButton() { return this.$text('Continuar'); }

  // ── Questions: Targets (paso 1) ────────────────────────────────────────────
  get targetsTitle() { return this.$text('Elige tus objetivos'); }
  get targetsSubtitle() { return this.$text('¿Cuál es tu meta principal hoy?'); }

  // Opciones de objetivos
  get targetBloodPressure() { return this.$text('Controlar mi presión arterial'); }
  get targetHeartRate() { return this.$text('Controlar mi frecuencia cardíaca'); }
  get targetWeight() { return this.$text('Hacer seguimiento de mi peso'); }
  get targetGlucose() { return this.$text('Monitorear mi glucosa en sangre'); }
  get targetSteps() { return this.$text('Controlar mi actividad física/pasos'); }
  get targetGeneral() { return this.$text('Llevar control general'); }

  // ── Questions: Motivations (paso 2) ───────────────────────────────────────
  get motivationsTitle() { return this.$text('¿Qué te motiva a lograrlo?'); }
  get motivationsSubtitle() { return this.$contains('Conocer tu propósito'); }

  // Opciones de motivaciones
  get motivationMedical() { return this.$text('Recomendación médica'); }
  get motivationCondition() { return this.$text('Controlar una condición existente'); }
  get motivationImprove() { return this.$text('Mejorar mis hábitos'); }
  get motivationNew() { return this.$text('Incorporar nuevos hábitos'); }
  get motivationQuality() { return this.$text('Mejorar mi calidad de vida'); }
  get motivationAll() { return this.$text('Todas las anteriores'); }

  // ── Questions: HowKnow (paso 3) ───────────────────────────────────────────
  get howKnowTitle() { return this.$text('¿Cómo supiste de Femmto?'); }
  get howKnowSubtitle() { return this.$contains('Queremos saber qué canal'); }

  // Opciones de cómo conoció Femmto
  get howKnowBought() { return this.$text('Compré un producto Femmto'); }
  get howKnowMedical() { return this.$text('Recomendación médica'); }
  get howKnowFriends() { return this.$text('Amigos/Familiares'); }
  get howKnowAppStore() { return this.$text('App store/Play store'); }
  get howKnowSocialMedia() { return this.$text('Redes sociales/Publicidad'); }

  // ── Questions: Frequency (paso 4) ─────────────────────────────────────────
  get frequencyTitle() { return this.$text('¿Con qué frecuencia planeas cuidarte?'); }
  get frequencySubtitle() { return this.$contains('recordatorios que se adapten'); }

  // Opciones de frecuencia
  get frequencySeveralDay() { return this.$text('Varias veces al día'); }
  get frequencyOnceDay() { return this.$text('Una vez al día'); }
  get frequencySomeWeek() { return this.$text('Algunas veces a la semana'); }
  get frequencyWhenNeeded() { return this.$text('Solo cuando lo necesite'); }

  // ── CompleteProfileSuccess ─────────────────────────────────────────────────
  get successTitle() { return this.$text('¡Todo listo!'); }
  get successDescription() { return this.$contains('adaptaremos tu experiencia'); }
  get finishButton() { return this.$text('Finalizar'); }

  // ── isLoaded helpers ──────────────────────────────────────────────────────
  /** Espera la pantalla de bienvenida Greeting */
  async isLoaded() {
    await this.waitForScreen(this.greetingTitle);
    return true;
  }

  /** Espera la pantalla de instrucciones */
  async isLoadedInstructions() {
    await this.waitForScreen(this.instructionsTitle);
    return true;
  }

  /** Espera la pantalla de selección de objetivos */
  async isLoadedTargets() {
    await this.waitForScreen(this.targetsTitle);
    return true;
  }

  /** Espera la pantalla de motivaciones */
  async isLoadedMotivations() {
    await this.waitForScreen(this.motivationsTitle);
    return true;
  }

  /** Espera la pantalla de cómo conoció Femmto */
  async isLoadedHowKnow() {
    await this.waitForScreen(this.howKnowTitle);
    return true;
  }

  /** Espera la pantalla de frecuencia de uso */
  async isLoadedFrequency() {
    await this.waitForScreen(this.frequencyTitle);
    return true;
  }

  /** Espera la pantalla de éxito final */
  async isLoadedSuccess() {
    await this.waitForScreen(this.successTitle);
    return true;
  }
}

module.exports = MeetUserPage;
