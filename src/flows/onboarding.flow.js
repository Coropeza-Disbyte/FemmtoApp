const { launchToWelcome } = require('./auth.flow');

/**
 * Navega hasta la pantalla Greeting (MeetUser) del flujo de nuevo usuario.
 * Ruta: pm clear → Welcome → "Ingresar por primera vez" → Greeting ("¡Hola!")
 */
async function goToNewUserGreeting() {
  await launchToWelcome();
  await $('~Ingresar por primera vez').waitForDisplayed({ timeout: 30000 });
  await $('~Ingresar por primera vez').click();
  await $('android=new UiSelector().text("¡Hola!")').waitForDisplayed({ timeout: 15000 });
}

/**
 * Navega hasta la pantalla FirstMessage del flujo SaveOnboardingProgress.
 * Ruta completa de nuevo usuario:
 *   Welcome → Greeting → Instructions → Targets → Motivations
 *   → HowKnow → Frequency → NotificationPermission → FirstMeasure → FirstMessage
 */
async function goToSaveOnboardingFirstMessage() {
  await launchToWelcome();
  await $('~Ingresar por primera vez').waitForDisplayed({ timeout: 30000 });
  await $('~Ingresar por primera vez').click();
  await $('android=new UiSelector().text("Empezar")').waitForDisplayed({ timeout: 15000 });
  await $('android=new UiSelector().text("Empezar")').click();
  await $('android=new UiSelector().text("Queremos conocerte.")').waitForDisplayed({ timeout: 10000 });
  await $('android=new UiSelector().text("Continuar")').click();
  await $('android=new UiSelector().text("Elige tus objetivos")').waitForDisplayed({ timeout: 10000 });
  await $('android=new UiSelector().text("Llevar control general")').click();
  await $('android=new UiSelector().text("Continuar")').click();
  await $('android=new UiSelector().text("¿Qué te motiva a lograrlo?")').waitForDisplayed({ timeout: 10000 });
  await $('android=new UiSelector().text("Mejorar mis hábitos")').click();
  await $('android=new UiSelector().text("Continuar")').click();
  await $('android=new UiSelector().text("¿Cómo supiste de Femmto?")').waitForDisplayed({ timeout: 10000 });
  await $('android=new UiSelector().text("App store/Play store")').click();
  await $('android=new UiSelector().text("Continuar")').click();
  await $('android=new UiSelector().text("¿Con qué frecuencia planeas cuidarte?")').waitForDisplayed({ timeout: 10000 });
  await $('android=new UiSelector().text("Una vez al día")').click();
  await $('android=new UiSelector().text("Continuar")').click();
  await $('android=new UiSelector().text("Ahora no")').waitForDisplayed({ timeout: 15000 });
  await $('android=new UiSelector().text("Ahora no")').click();
  await $('android=new UiSelector().text("¡Comencemos con tu primera medición!")').waitForDisplayed({ timeout: 15000 });
  await $('android=new UiSelector().text("Ahora no")').waitForDisplayed({ timeout: 10000 });
  await $('android=new UiSelector().text("Ahora no")').click();
  await $('android=new UiSelector().text("No pierdas tu progreso.")').waitForDisplayed({ timeout: 20000 });
}

module.exports = { goToNewUserGreeting, goToSaveOnboardingFirstMessage };
