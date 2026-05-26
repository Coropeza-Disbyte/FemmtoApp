const { launchAndLogin } = require('../../../src/flows/auth.flow');
const ProfilePage        = require('../../../src/pages/profile/ProfilePage');
const MenuPage           = require('../../../src/pages/profile/MenuPage');

describe('[profile] Menu Screen', () => {
  beforeEach(async () => {
    await launchAndLogin();
    const menuBtn = $('~Menu');
    await menuBtn.waitForDisplayed({ timeout: 15000 });
    await menuBtn.click();
  });

  it('should display the menu screen with all main items', async () => {
    const page = new MenuPage();
    expect(await page.isLoaded()).toBe(true);
  });

  it('should show Mi cuenta menu item', async () => {
    const page = new MenuPage();
    expect(await page.isDisplayed(page.itemMiCuenta)).toBe(true);
  });

  it('should show Agregar dispositivo menu item', async () => {
    const page = new MenuPage();
    expect(await page.isDisplayed(page.itemAgregarDispositivo)).toBe(true);
  });

  it('should show Cerrar sesión menu item', async () => {
    const page = new MenuPage();
    expect(await page.isDisplayed(page.itemCerrarSesion)).toBe(true);
  });

  it('should navigate to profile screen from Mi cuenta', async () => {
    const menu = new MenuPage();
    await menu.tapMiCuenta();
    const profile = new ProfilePage();
    expect(await profile.isLoaded()).toBe(true);
  });
});

describe('[profile] Profile Screen', () => {
  beforeEach(async () => {
    await launchAndLogin();
    const menuBtn = $('~Menu');
    await menuBtn.waitForDisplayed({ timeout: 15000 });
    await menuBtn.click();
    const menu = new MenuPage();
    await menu.tapMiCuenta();
  });

  it('should display profile screen title', async () => {
    const page = new ProfilePage();
    expect(await page.isLoaded()).toBe(true);
  });

  it('should show all main data fields', async () => {
    const page = new ProfilePage();
    expect(await page.isDisplayed(page.sectionMisDatos)).toBe(true);
    expect(await page.isDisplayed(page.fieldNombre)).toBe(true);
    expect(await page.isDisplayed(page.fieldEmail)).toBe(true);
    expect(await page.isDisplayed(page.fieldContrasena)).toBe(true);
  });

  it('should show biological fields', async () => {
    const page = new ProfilePage();
    expect(await page.isDisplayed(page.fieldSexo)).toBe(true);
    expect(await page.isDisplayed(page.fieldFechaNacimiento)).toBe(true);
    expect(await page.isDisplayed(page.fieldAltura)).toBe(true);
    expect(await page.isDisplayed(page.fieldPeso)).toBe(true);
  });

  it('should show Metas section', async () => {
    const page = new ProfilePage();
    expect(await page.isDisplayed(page.sectionMetas)).toBe(true);
  });
});
