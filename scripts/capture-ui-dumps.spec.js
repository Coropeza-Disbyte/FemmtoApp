/**
 * Script temporal — captura UIAutomator XML dumps de pantallas clave.
 * Correr con: npx wdio run wdio.conf.js --spec scripts/capture-ui-dumps.spec.js
 * Los archivos se guardan en docs/uiautomator/
 */
const path = require('path');
const fs   = require('fs');
const { launchAndLogin }  = require('../src/flows/auth.flow');
const { goToMeditionOptions, goToGlucoseIntro, goToPressureIntro, goToScaleIntro } = require('../src/flows/medition.flow');
const HomePage     = require('../src/pages/home/HomePage');
const MeditionPage = require('../src/pages/tabs/MeditionPage');
const NewGlucometerPage = require('../src/pages/medition/NewGlucometerPage');
const NewPresurePage    = require('../src/pages/medition/NewPresurePage');
const NewScalePage      = require('../src/pages/medition/NewScalePage');

const OUT_DIR = path.resolve('./docs/uiautomator');
if (!fs.existsSync(OUT_DIR)) fs.mkdirSync(OUT_DIR, { recursive: true });

async function dumpScreen(name) {
  const local = path.join(OUT_DIR, `${name}.xml`);
  // getPageSource() devuelve el árbol UIAutomator2 sin conflicto con el accessibility service
  const source = await driver.getPageSource();
  fs.writeFileSync(local, source, 'utf8');
  console.log(`[Dump] ${name}.xml guardado (${source.length} chars)`);
}

describe('[dumps] UIAutomator XML captures', () => {

  it('home — post-login post-tour', async () => {
    await launchAndLogin();
    const home = new HomePage();
    await home.isLoaded();
    await dumpScreen('home');
  });

  it('medition-options', async () => {
    await goToMeditionOptions();
    const page = new MeditionPage();
    await page.isLoaded();
    await dumpScreen('medition-options');
  });

  it('glucometer-intro', async () => {
    await goToGlucoseIntro();
    const page = new NewGlucometerPage();
    await page.isLoaded();
    await dumpScreen('glucometer-intro');
  });

  it('presure-intro', async () => {
    await goToPressureIntro();
    const page = new NewPresurePage();
    await page.isLoaded();
    await dumpScreen('presure-intro');
  });

  it('scale-intro', async () => {
    await goToScaleIntro();
    const page = new NewScalePage();
    await page.isLoaded();
    await dumpScreen('scale-intro');
  });

});
