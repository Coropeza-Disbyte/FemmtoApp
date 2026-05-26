const MeetUserPage              = require('../../../src/pages/auth/MeetUserPage');
const { goToNewUserGreeting }   = require('../../../src/flows/onboarding.flow');
const { skipIfBefore }          = require('../../../src/helpers/versionGuard');

// ─────────────────────────────────────────────────────────────────────────────
describe('[auth] MeetUser — Greeting Screen', function () {
  before(function () { if (skipIfBefore('3.6.0')) this.skip(); });
  beforeEach(goToNewUserGreeting);

  it('should display greeting screen elements', async () => {
    const page = new MeetUserPage();
    expect(await page.isLoaded()).toBe(true);
    expect(await page.isDisplayed(page.greetingSubtitle)).toBe(true);
    expect(await page.isDisplayed(page.greetingDescription)).toBe(true);
    expect(await page.isDisplayed(page.startButton)).toBe(true);
  });

  it('should navigate to Instructions when tapping Empezar', async () => {
    const page = new MeetUserPage();
    await page.isLoaded();
    await page.tap(page.startButton);
    expect(await page.isLoadedInstructions()).toBe(true);
  });
});

// ─────────────────────────────────────────────────────────────────────────────
describe('[auth] MeetUser — Instructions Screen', () => {
  beforeEach(async () => {
    await goToNewUserGreeting();
    const page = new MeetUserPage();
    await page.isLoaded();
    await page.tap(page.startButton);
    await page.isLoadedInstructions();
  });

  it('should display instructions screen elements', async () => {
    const page = new MeetUserPage();
    expect(await page.isLoadedInstructions()).toBe(true);
    expect(await page.isDisplayed(page.instructionsDescription)).toBe(true);
    expect(await page.isDisplayed(page.continueButton)).toBe(true);
  });

  it('should navigate to Targets when tapping Continuar', async () => {
    const page = new MeetUserPage();
    await page.tap(page.continueButton);
    expect(await page.isLoadedTargets()).toBe(true);
  });
});

// ─────────────────────────────────────────────────────────────────────────────
describe('[auth] MeetUser — Targets Screen', () => {
  beforeEach(async () => {
    await goToNewUserGreeting();
    const page = new MeetUserPage();
    await page.isLoaded();
    await page.tap(page.startButton);
    await page.isLoadedInstructions();
    await page.tap(page.continueButton);
    await page.isLoadedTargets();
  });

  it('should display all target options', async () => {
    const page = new MeetUserPage();
    expect(await page.isLoadedTargets()).toBe(true);
    expect(await page.isDisplayed(page.targetsSubtitle)).toBe(true);
    expect(await page.isDisplayed(page.targetBloodPressure)).toBe(true);
    expect(await page.isDisplayed(page.targetHeartRate)).toBe(true);
    expect(await page.isDisplayed(page.targetWeight)).toBe(true);
    expect(await page.isDisplayed(page.targetGlucose)).toBe(true);
    expect(await page.isDisplayed(page.targetSteps)).toBe(true);
    expect(await page.isDisplayed(page.targetGeneral)).toBe(true);
  });

  it('should select a target option and enable Continuar', async () => {
    const page = new MeetUserPage();
    await page.tap(page.targetWeight);
    expect(await page.isDisplayed(page.continueButton)).toBe(true);
  });

  it('should navigate to Motivations after selecting a target', async () => {
    const page = new MeetUserPage();
    await page.tap(page.targetGeneral);
    await page.tap(page.continueButton);
    expect(await page.isLoadedMotivations()).toBe(true);
  });
});

// ─────────────────────────────────────────────────────────────────────────────
describe('[auth] MeetUser — Motivations Screen', () => {
  beforeEach(async () => {
    await goToNewUserGreeting();
    const page = new MeetUserPage();
    await page.isLoaded();
    await page.tap(page.startButton);
    await page.isLoadedInstructions();
    await page.tap(page.continueButton);
    await page.isLoadedTargets();
    await page.tap(page.targetGeneral);
    await page.tap(page.continueButton);
    await page.isLoadedMotivations();
  });

  it('should display all motivation options', async () => {
    const page = new MeetUserPage();
    expect(await page.isLoadedMotivations()).toBe(true);
    expect(await page.isDisplayed(page.motivationsSubtitle)).toBe(true);
    expect(await page.isDisplayed(page.motivationMedical)).toBe(true);
    expect(await page.isDisplayed(page.motivationCondition)).toBe(true);
    expect(await page.isDisplayed(page.motivationImprove)).toBe(true);
    expect(await page.isDisplayed(page.motivationNew)).toBe(true);
    expect(await page.isDisplayed(page.motivationQuality)).toBe(true);
    expect(await page.isDisplayed(page.motivationAll)).toBe(true);
  });

  it('should navigate to HowKnow after selecting a motivation', async () => {
    const page = new MeetUserPage();
    await page.tap(page.motivationImprove);
    await page.tap(page.continueButton);
    expect(await page.isLoadedHowKnow()).toBe(true);
  });
});

// ─────────────────────────────────────────────────────────────────────────────
describe('[auth] MeetUser — HowKnow Screen', () => {
  beforeEach(async () => {
    await goToNewUserGreeting();
    const page = new MeetUserPage();
    await page.isLoaded();
    await page.tap(page.startButton);
    await page.isLoadedInstructions();
    await page.tap(page.continueButton);
    await page.isLoadedTargets();
    await page.tap(page.targetGeneral);
    await page.tap(page.continueButton);
    await page.isLoadedMotivations();
    await page.tap(page.motivationImprove);
    await page.tap(page.continueButton);
    await page.isLoadedHowKnow();
  });

  it('should display all how-know options', async () => {
    const page = new MeetUserPage();
    expect(await page.isLoadedHowKnow()).toBe(true);
    expect(await page.isDisplayed(page.howKnowSubtitle)).toBe(true);
    expect(await page.isDisplayed(page.howKnowBought)).toBe(true);
    expect(await page.isDisplayed(page.howKnowMedical)).toBe(true);
    expect(await page.isDisplayed(page.howKnowFriends)).toBe(true);
    expect(await page.isDisplayed(page.howKnowAppStore)).toBe(true);
    expect(await page.isDisplayed(page.howKnowSocialMedia)).toBe(true);
  });

  it('should navigate to Frequency after selecting an option', async () => {
    const page = new MeetUserPage();
    await page.tap(page.howKnowAppStore);
    await page.tap(page.continueButton);
    expect(await page.isLoadedFrequency()).toBe(true);
  });
});

// ─────────────────────────────────────────────────────────────────────────────
describe('[auth] MeetUser — Frequency Screen', () => {
  beforeEach(async () => {
    await goToNewUserGreeting();
    const page = new MeetUserPage();
    await page.isLoaded();
    await page.tap(page.startButton);
    await page.isLoadedInstructions();
    await page.tap(page.continueButton);
    await page.isLoadedTargets();
    await page.tap(page.targetGeneral);
    await page.tap(page.continueButton);
    await page.isLoadedMotivations();
    await page.tap(page.motivationImprove);
    await page.tap(page.continueButton);
    await page.isLoadedHowKnow();
    await page.tap(page.howKnowAppStore);
    await page.tap(page.continueButton);
    await page.isLoadedFrequency();
  });

  it('should display all frequency options', async () => {
    const page = new MeetUserPage();
    expect(await page.isLoadedFrequency()).toBe(true);
    expect(await page.isDisplayed(page.frequencySubtitle)).toBe(true);
    expect(await page.isDisplayed(page.frequencySeveralDay)).toBe(true);
    expect(await page.isDisplayed(page.frequencyOnceDay)).toBe(true);
    expect(await page.isDisplayed(page.frequencySomeWeek)).toBe(true);
    expect(await page.isDisplayed(page.frequencyWhenNeeded)).toBe(true);
  });

  it('should select a frequency option', async () => {
    const page = new MeetUserPage();
    await page.tap(page.frequencyOnceDay);
    expect(await page.isDisplayed(page.continueButton)).toBe(true);
  });
});
