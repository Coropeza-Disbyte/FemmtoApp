const { launchAndLogin } = require('./auth.flow');
const HomePage    = require('../pages/home/HomePage');
const MeditionPage = require('../pages/tabs/MeditionPage');

/**
 * Navega hasta la pantalla de opciones de medición (MeditionOptions).
 * Ruta v4.0.0: launch → login → Home → HomeHeader "Nueva medición" → MeditionPage
 */
async function goToMeditionOptions() {
  await launchAndLogin();
  const home = new HomePage();
  await home.isLoaded();
  await home.tapNuevaMedicion();
  const medition = new MeditionPage();
  await medition.isLoaded();
}

async function goToGlucoseIntro() {
  await goToMeditionOptions();
  const medition = new MeditionPage();
  await medition.tapGlucometro();
}

async function goToPressureIntro() {
  await goToMeditionOptions();
  const medition = new MeditionPage();
  await medition.tapMonitorPresion();
}

async function goToScaleIntro() {
  await goToMeditionOptions();
  const medition = new MeditionPage();
  await medition.tapBalanza();
}

module.exports = { goToMeditionOptions, goToGlucoseIntro, goToPressureIntro, goToScaleIntro };
