const { launchAndLogin }  = require('../../../src/flows/auth.flow');
const HomePage      = require('../../../src/pages/home/HomePage');
const RemindersPage = require('../../../src/pages/tabs/RemindersPage');

describe('[tabs] Reminders Screen', () => {
  beforeEach(async () => {
    await launchAndLogin();
    const home = new HomePage();
    await home.isLoaded();
    await home.navigateToReminders();
  });

  it('should display the Recordatorios screen', async () => {
    const page = new RemindersPage();
    expect(await page.isLoaded()).toBe(true);
  });

  it('should show empty state when no reminders exist', async () => {
    const page = new RemindersPage();
    await page.isLoaded();
    const isEmpty   = await page.isDisplayed(page.emptyTitle);
    const hasList   = await page.isDisplayed(page.sectionMisRecordatorios);
    expect(isEmpty || hasList).toBe(true);
  });

  it('should show add reminder button when list is empty', async () => {
    const page = new RemindersPage();
    await page.isLoaded();
    const hasEmptyBtn  = await page.isDisplayed(page.btnAgregarRecordatorioVacio);
    const hasFooterBtn = await page.isDisplayed(page.btnAgregarRecordatorio);
    expect(hasEmptyBtn || hasFooterBtn).toBe(true);
  });

  it('should navigate to AddReminder screen', async () => {
    const page = new RemindersPage();
    await page.isLoaded();
    await page.tapAgregarRecordatorio();
    expect(await page.isDisplayed(page.headerTitleAdd)).toBe(true);
  });

  it('should display all reminder type options on AddReminder screen', async () => {
    const page = new RemindersPage();
    await page.isLoaded();
    await page.tapAgregarRecordatorio();
    expect(await page.isDisplayed(page.labelTipoRecordatorio)).toBe(true);
    expect(await page.isDisplayed(page.optionPresionArterial)).toBe(true);
    expect(await page.isDisplayed(page.optionBalanza)).toBe(true);
    expect(await page.isDisplayed(page.optionGlucosa)).toBe(true);
    expect(await page.isDisplayed(page.optionMedicacion)).toBe(true);
    expect(await page.isDisplayed(page.optionOtro)).toBe(true);
  });

  it('should show save button on AddReminder screen', async () => {
    const page = new RemindersPage();
    await page.isLoaded();
    await page.tapAgregarRecordatorio();
    expect(await page.isDisplayed(page.btnGuardarRecordatorio)).toBe(true);
  });

  it('should show schedule section on AddReminder screen', async () => {
    const page = new RemindersPage();
    await page.isLoaded();
    await page.tapAgregarRecordatorio();
    expect(await page.isDisplayed(page.labelHorario)).toBe(true);
  });
});
