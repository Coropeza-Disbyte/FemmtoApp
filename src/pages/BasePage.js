const { DEFAULT_TIMEOUT, LONG_TIMEOUT } = require('../config/timeouts');

class BasePage {
  // Localizar por accessibility id (content-desc o resource-id)
  $(accessibilityId) {
    return $(`~${accessibilityId}`);
  }

  // Localizar por resource-id completo
  $id(resourceId) {
    return $(`android=new UiSelector().resourceId("${resourceId}")`);
  }

  // Localizar por texto exacto
  $text(text) {
    return $(`android=new UiSelector().text("${text}")`);
  }

  // Localizar por texto parcial
  $contains(text) {
    return $(`android=new UiSelector().textContains("${text}")`);
  }

  async tap(element) {
    await element.waitForDisplayed({ timeout: DEFAULT_TIMEOUT });
    await element.click();
  }

  async typeText(element, text) {
    await element.waitForDisplayed({ timeout: DEFAULT_TIMEOUT });
    await element.click();
    await element.setValue(text);
  }

  async waitForScreen(element, timeout = LONG_TIMEOUT) {
    await element.waitForDisplayed({ timeout });
  }

  async isDisplayed(element) {
    try {
      return await element.isDisplayed();
    } catch {
      return false;
    }
  }

  async hideKeyboard() {
    try {
      await driver.hideKeyboard();
    } catch {
      // El teclado ya estaba oculto
    }
  }

  async scrollToElement(element) {
    await $(`android=new UiScrollable(new UiSelector().scrollable(true)).scrollIntoView(new UiSelector().description("${await element.getAttribute('content-desc')}"))`);
  }
}

module.exports = BasePage;
