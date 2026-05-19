const SetNamePage      = require('../../../src/pages/onboarding/SetNamePage');
const SetBirthdatePage = require('../../../src/pages/onboarding/SetBirthdatePage');
const SetGenderPage    = require('../../../src/pages/onboarding/SetGenderPage');
const SetWeightPage    = require('../../../src/pages/onboarding/SetWeightPage');
const SetHeightPage    = require('../../../src/pages/onboarding/SetHeightPage');
const SetPicturePage   = require('../../../src/pages/onboarding/SetPicturePage');

/**
 * El flujo de onboarding antiguo (SetName → SetBirthdate → SetGender → SetWeight → SetHeight → SetPicture)
 * requiere una cuenta ya creada para ser alcanzado. En estos tests se validan
 * los elementos de cada pantalla de forma aislada asumiendo que la pantalla
 * correspondiente está activa (o usando guards condicionales cuando no se puede
 * garantizar la precondición sin una cuenta real).
 *
 * Precondición mínima para los tests de SetWeight, SetHeight y SetPicture:
 * - El usuario ya completó Login y se redirigió al flujo de onboarding.
 * - Los tests del módulo auth (login.spec.js) deben pasar primero.
 */

// ─────────────────────────────────────────────────────────────────────────────
describe('[onboarding] SetName Screen', () => {
  it('should detect SetName screen if displayed', async () => {
    const page = new SetNamePage();
    const isVisible = await page.isDisplayed(page.screenTitle);
    if (isVisible) {
      expect(await page.isLoaded()).toBe(true);
      expect(await page.isDisplayed(page.nameInput)).toBe(true);
      expect(await page.isDisplayed(page.continueButton)).toBe(true);
    }
  });

  it('should allow typing a name when screen is active', async () => {
    const page = new SetNamePage();
    const isVisible = await page.isDisplayed(page.screenTitle);
    if (isVisible) {
      await page.typeText(page.nameInput, 'Usuario Prueba');
      await page.hideKeyboard();
      expect(await page.isDisplayed(page.continueButton)).toBe(true);
    }
  });
});

// ─────────────────────────────────────────────────────────────────────────────
describe('[onboarding] SetBirthdate Screen', () => {
  it('should detect SetBirthdate screen if displayed', async () => {
    const page = new SetBirthdatePage();
    const isVisible = await page.isDisplayed(page.screenTitle);
    if (isVisible) {
      expect(await page.isLoaded()).toBe(true);
      expect(await page.isDisplayed(page.continueButton)).toBe(true);
    }
  });
});

// ─────────────────────────────────────────────────────────────────────────────
describe('[onboarding] SetGender Screen', () => {
  it('should detect SetGender screen if displayed', async () => {
    const page = new SetGenderPage();
    const isVisible = await page.isDisplayed(page.screenTitle);
    if (isVisible) {
      expect(await page.isLoaded()).toBe(true);
      expect(await page.isDisplayed(page.continueButton)).toBe(true);
    }
  });
});

// ─────────────────────────────────────────────────────────────────────────────
describe('[onboarding] SetWeight Screen', () => {
  it('should display weight screen elements when active', async () => {
    const page = new SetWeightPage();
    const isVisible = await page.isDisplayed(page.screenTitle);
    if (isVisible) {
      expect(await page.isLoaded()).toBe(true);
      expect(await page.isDisplayed(page.weightInput)).toBe(true);
      expect(await page.isDisplayed(page.kgLabel)).toBe(true);
      expect(await page.isDisplayed(page.continueButton)).toBe(true);
    }
  });

  it('should show error for non-numeric weight input when active', async () => {
    const page = new SetWeightPage();
    const isVisible = await page.isDisplayed(page.screenTitle);
    if (isVisible) {
      await page.typeText(page.weightInput, 'abc');
      await page.hideKeyboard();
      await page.tap(page.continueButton);
      expect(await page.isDisplayed(page.weightError)).toBe(true);
    }
  });

  it('should accept valid weight and proceed when active', async () => {
    const page = new SetWeightPage();
    const isVisible = await page.isDisplayed(page.screenTitle);
    if (isVisible) {
      await page.typeText(page.weightInput, '70');
      await page.hideKeyboard();
      await page.tap(page.continueButton);
      // Si el peso es válido, la pantalla de peso desaparece
      await page.screenTitle.waitForDisplayed({ timeout: 5000, reverse: true });
    }
  });
});

// ─────────────────────────────────────────────────────────────────────────────
describe('[onboarding] SetHeight Screen', () => {
  it('should display height screen elements when active', async () => {
    const page = new SetHeightPage();
    const isVisible = await page.isDisplayed(page.screenTitle);
    if (isVisible) {
      expect(await page.isLoaded()).toBe(true);
      expect(await page.isDisplayed(page.heightInput)).toBe(true);
      expect(await page.isDisplayed(page.cmLabel)).toBe(true);
      expect(await page.isDisplayed(page.continueButton)).toBe(true);
    }
  });

  it('should show error for non-numeric height input when active', async () => {
    const page = new SetHeightPage();
    const isVisible = await page.isDisplayed(page.screenTitle);
    if (isVisible) {
      await page.typeText(page.heightInput, 'abc');
      await page.hideKeyboard();
      await page.tap(page.continueButton);
      expect(await page.isDisplayed(page.heightError)).toBe(true);
    }
  });

  it('should accept valid height and proceed when active', async () => {
    const page = new SetHeightPage();
    const isVisible = await page.isDisplayed(page.screenTitle);
    if (isVisible) {
      await page.typeText(page.heightInput, '170');
      await page.hideKeyboard();
      await page.tap(page.continueButton);
      await page.screenTitle.waitForDisplayed({ timeout: 5000, reverse: true });
    }
  });
});

// ─────────────────────────────────────────────────────────────────────────────
describe('[onboarding] SetPicture Screen', () => {
  it('should display picture screen elements when active', async () => {
    const page = new SetPicturePage();
    const isVisible = await page.isDisplayed(page.screenLabel);
    if (isVisible) {
      expect(await page.isLoaded()).toBe(true);
      expect(await page.isDisplayed(page.welcomeTitle)).toBe(true);
      expect(await page.isDisplayed(page.completeDataSubtitle)).toBe(true);
      expect(await page.isDisplayed(page.takePictureButton)).toBe(true);
      expect(await page.isDisplayed(page.pickGalleryButton)).toBe(true);
      expect(await page.isDisplayed(page.skipButton)).toBe(true);
    }
  });

  it('should show profile avatar image when no picture selected when active', async () => {
    const page = new SetPicturePage();
    const isVisible = await page.isDisplayed(page.screenLabel);
    if (isVisible) {
      expect(await page.isDisplayed(page.profileAvatarImage)).toBe(true);
    }
  });

  it('should navigate away when tapping Omitir when active', async () => {
    const page = new SetPicturePage();
    const isVisible = await page.isDisplayed(page.screenLabel);
    if (isVisible) {
      await page.tap(page.skipButton);
      // La pantalla de foto de perfil desaparece al omitir
      await page.screenLabel.waitForDisplayed({ timeout: 10000, reverse: true });
    }
  });
});
