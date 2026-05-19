const ProfilePage = require('../../../src/pages/profile/ProfilePage');
const MenuPage = require('../../../src/pages/profile/MenuPage');

// Precondición: hace login limpio y espera la home
const loginAndGoHome = async () => {
  const pkg = process.env.APP_PACKAGE || 'com.femmto.app';
  await driver.execute('mobile: shell', { command: 'pm', args: ['clear', pkg] });
  await driver.execute('mobile: shell', { command: 'am', args: ['start', '-n', `${pkg}/.MainActivity`] });
  await $('~Ya tengo una cuenta').waitForDisplayed({ timeout: 30000 });
  await $('~Ya tengo una cuenta').click();
  const emailField = $('android=new UiSelector().text("Ingrese su email")');
  await emailField.waitForDisplayed({ timeout: 15000 });
  await emailField.click();
  await emailField.setValue(process.env.TEST_USER_EMAIL);
  const passField = $('android=new UiSelector().text("Ingrese su contraseña")');
  await passField.click();
  await passField.setValue(process.env.TEST_USER_PASSWORD);
  await driver.hideKeyboard();
  await $('~Ingresar').waitForDisplayed({ timeout: 10000 });
  await $('~Ingresar').click();
  await $('~Home').waitForDisplayed({ timeout: 30000 });
};

describe('[profile] Menu Screen', () => {
  before(async () => {
    await loginAndGoHome();
    // El menú se abre desde un botón en la home (ícono de usuario / hamburguesa)
    // Esperar el botón del menú lateral y tocarlo
    const menuBtn = $('~Menu');
    await menuBtn.waitForDisplayed({ timeout: 15000 });
    await menuBtn.click();
  });

  it('should display the menu screen with all main items', async () => {
    const page = new MenuPage();
    const loaded = await page.isLoaded();
    expect(loaded).toBe(true);
  });

  it('should show Mi cuenta menu item', async () => {
    const page = new MenuPage();
    const displayed = await page.isDisplayed(page.itemMiCuenta);
    expect(displayed).toBe(true);
  });

  it('should show Agregar dispositivo menu item', async () => {
    const page = new MenuPage();
    const displayed = await page.isDisplayed(page.itemAgregarDispositivo);
    expect(displayed).toBe(true);
  });

  it('should show Cerrar sesión menu item', async () => {
    const page = new MenuPage();
    const displayed = await page.isDisplayed(page.itemCerrarSesion);
    expect(displayed).toBe(true);
  });

  it('should navigate to profile screen from Mi cuenta', async () => {
    const menu = new MenuPage();
    await menu.tapMiCuenta();
    const profile = new ProfilePage();
    const loaded = await profile.isLoaded();
    expect(loaded).toBe(true);
  });
});

describe('[profile] Profile Screen', () => {
  before(async () => {
    await loginAndGoHome();
    const menuBtn = $('~Menu');
    await menuBtn.waitForDisplayed({ timeout: 15000 });
    await menuBtn.click();
    const menu = new MenuPage();
    await menu.tapMiCuenta();
  });

  it('should display profile screen title', async () => {
    const page = new ProfilePage();
    const loaded = await page.isLoaded();
    expect(loaded).toBe(true);
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
