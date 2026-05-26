async function navigateToMetric(cardTitle) {
  const card = $(`android=new UiSelector().text("${cardTitle}")`);
  await card.waitForDisplayed({ timeout: 15000 });
  await card.click();
}

module.exports = { navigateToMetric };
