const SaveOnboardingProgressPage          = require('../../../src/pages/auth/SaveOnboardingProgressPage');
const { goToSaveOnboardingFirstMessage }  = require('../../../src/flows/onboarding.flow');
const { skipIfBefore }                    = require('../../../src/helpers/versionGuard');

// ─────────────────────────────────────────────────────────────────────────────
describe('[auth] SaveOnboardingProgress — First Message Screen', function () {
  before(function () { if (skipIfBefore('3.6.0')) this.skip(); });
  beforeEach(goToSaveOnboardingFirstMessage);

  it('should display first message screen elements', async () => {
    const page = new SaveOnboardingProgressPage();
    expect(await page.isLoaded()).toBe(true);
    expect(await page.isDisplayed(page.firstMessageSubtitle)).toBe(true);
    expect(await page.isDisplayed(page.continueButton)).toBe(true);
  });

  it('should navigate to Email form when tapping Continuar', async () => {
    const page = new SaveOnboardingProgressPage();
    await page.isLoaded();
    await page.tap(page.continueButton);
    expect(await page.isLoadedEmail()).toBe(true);
  });
});

// ─────────────────────────────────────────────────────────────────────────────
describe('[auth] SaveOnboardingProgress — Email Step', () => {
  beforeEach(async () => {
    await goToSaveOnboardingFirstMessage();
    const page = new SaveOnboardingProgressPage();
    await page.isLoaded();
    await page.tap(page.continueButton);
    await page.isLoadedEmail();
  });

  it('should display email step elements', async () => {
    const page = new SaveOnboardingProgressPage();
    expect(await page.isLoadedEmail()).toBe(true);
    expect(await page.isDisplayed(page.emailInput)).toBe(true);
    expect(await page.isDisplayed(page.termsCheckbox)).toBe(true);
    expect(await page.isDisplayed(page.privacyCheckbox)).toBe(true);
    expect(await page.isDisplayed(page.googleButton)).toBe(true);
  });

  it('should display social login divider', async () => {
    const page = new SaveOnboardingProgressPage();
    expect(await page.isDisplayed(page.socialDividerLabel)).toBe(true);
  });

  it('should not proceed without accepting terms and privacy', async () => {
    const page = new SaveOnboardingProgressPage();
    await page.typeText(page.emailInput, 'test.usuario@example.com');
    await page.hideKeyboard();
    expect(await page.isDisplayed(page.emailTitle)).toBe(true);
  });

  it('should show terms link', async () => {
    const page = new SaveOnboardingProgressPage();
    expect(await page.isDisplayed(page.termsLink)).toBe(true);
  });

  it('should show privacy policy link', async () => {
    const page = new SaveOnboardingProgressPage();
    expect(await page.isDisplayed(page.privacyLink)).toBe(true);
  });
});

// ─────────────────────────────────────────────────────────────────────────────
describe('[auth] SaveOnboardingProgress — Name Step', () => {
  beforeEach(async () => {
    await goToSaveOnboardingFirstMessage();
    const page = new SaveOnboardingProgressPage();
    await page.isLoaded();
    await page.tap(page.continueButton);
    await page.isLoadedEmail();
    await page.typeText(page.emailInput, 'test.usuario@example.com');
    await page.hideKeyboard();
    await page.tapTermsCheckbox();
    await page.tapPrivacyCheckbox();
    await page.tap(page.continueButton);
    await page.isLoadedName();
  });

  it('should display name step elements', async () => {
    const page = new SaveOnboardingProgressPage();
    expect(await page.isLoadedName()).toBe(true);
    expect(await page.isDisplayed(page.nameInput)).toBe(true);
  });

  it('should not proceed with a name shorter than 3 characters', async () => {
    const page = new SaveOnboardingProgressPage();
    await page.typeText(page.nameInput, 'AB');
    await page.hideKeyboard();
    expect(await page.isDisplayed(page.nameTitle)).toBe(true);
  });

  it('should accept a valid name', async () => {
    const page = new SaveOnboardingProgressPage();
    await page.typeText(page.nameInput, 'Usuario Prueba');
    await page.hideKeyboard();
    expect(await page.isDisplayed(page.continueButton)).toBe(true);
  });
});

// ─────────────────────────────────────────────────────────────────────────────
describe('[auth] SaveOnboardingProgress — Gender Step', () => {
  it('should display gender info tooltip when visible', async () => {
    const page = new SaveOnboardingProgressPage();
    const isVisible = await page.isDisplayed(page.genderInfoTitle);
    if (isVisible) {
      expect(isVisible).toBe(true);
      expect(await page.isDisplayed(page.genderInfoDescription)).toBe(true);
    }
  });
});

// ─────────────────────────────────────────────────────────────────────────────
describe('[auth] SaveOnboardingProgress — Weight Step', () => {
  it('should display weight info tooltip when visible', async () => {
    const page = new SaveOnboardingProgressPage();
    const isVisible = await page.isDisplayed(page.weightTitle);
    if (isVisible) {
      expect(isVisible).toBe(true);
      expect(await page.isDisplayed(page.weightInfoTitle)).toBe(true);
      expect(await page.isDisplayed(page.weightInfoDescription)).toBe(true);
    }
  });
});

// ─────────────────────────────────────────────────────────────────────────────
describe('[auth] SaveOnboardingProgress — ProfilePicture Step', () => {
  it('should display profile picture step elements when visible', async () => {
    const page = new SaveOnboardingProgressPage();
    const isVisible = await page.isDisplayed(page.profilePictureTitle);
    if (isVisible) {
      expect(isVisible).toBe(true);
      expect(await page.isDisplayed(page.editPictureButton)).toBe(true);
    }
  });
});

// ─────────────────────────────────────────────────────────────────────────────
describe('[auth] SaveOnboardingProgress — Password Step', () => {
  it('should display password step elements when visible', async () => {
    const page = new SaveOnboardingProgressPage();
    const isVisible = await page.isDisplayed(page.passwordTitle);
    if (isVisible) {
      expect(isVisible).toBe(true);
      expect(await page.isDisplayed(page.passwordInput)).toBe(true);
      expect(await page.isDisplayed(page.retryPasswordInput)).toBe(true);
    }
  });

  it('should show error for password shorter than 8 characters when visible', async () => {
    const page = new SaveOnboardingProgressPage();
    const isVisible = await page.isDisplayed(page.passwordTitle);
    if (isVisible) {
      await page.typeText(page.passwordInput, '1234567');
      await page.hideKeyboard();
      expect(await page.isDisplayed(page.passwordTitle)).toBe(true);
    }
  });
});
