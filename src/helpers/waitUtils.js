const { DEFAULT_TIMEOUT } = require('../config/timeouts');

async function waitForElementToDisappear(element, timeout = DEFAULT_TIMEOUT) {
  await element.waitForDisplayed({ timeout, reverse: true });
}

async function waitForTextInElement(element, text, timeout = DEFAULT_TIMEOUT) {
  await driver.waitUntil(
    async () => (await element.getText()) === text,
    { timeout, interval: 500, timeoutMsg: `Expected text "${text}" not found after ${timeout}ms` }
  );
}

async function waitForCondition(conditionFn, timeout = DEFAULT_TIMEOUT, errorMsg = 'Condition not met') {
  await driver.waitUntil(conditionFn, { timeout, interval: 500, timeoutMsg: errorMsg });
}

module.exports = { waitForElementToDisappear, waitForTextInElement, waitForCondition };
