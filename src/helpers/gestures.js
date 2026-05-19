async function swipeUp(startPercentage = 0.8, endPercentage = 0.2) {
  const { width, height } = await driver.getWindowSize();
  const startY = Math.round(height * startPercentage);
  const endY   = Math.round(height * endPercentage);
  const centerX = Math.round(width / 2);

  await driver.performActions([{
    type: 'pointer',
    id: 'finger1',
    parameters: { pointerType: 'touch' },
    actions: [
      { type: 'pointerMove',  duration: 0,   x: centerX, y: startY },
      { type: 'pointerDown',  button: 0 },
      { type: 'pause',        duration: 300 },
      { type: 'pointerMove',  duration: 600, x: centerX, y: endY },
      { type: 'pointerUp',    button: 0 },
    ],
  }]);
}

async function swipeDown(startPercentage = 0.2, endPercentage = 0.8) {
  const { width, height } = await driver.getWindowSize();
  const startY  = Math.round(height * startPercentage);
  const endY    = Math.round(height * endPercentage);
  const centerX = Math.round(width / 2);

  await driver.performActions([{
    type: 'pointer',
    id: 'finger1',
    parameters: { pointerType: 'touch' },
    actions: [
      { type: 'pointerMove',  duration: 0,   x: centerX, y: startY },
      { type: 'pointerDown',  button: 0 },
      { type: 'pause',        duration: 300 },
      { type: 'pointerMove',  duration: 600, x: centerX, y: endY },
      { type: 'pointerUp',    button: 0 },
    ],
  }]);
}

async function swipeLeft(startPercentage = 0.8, endPercentage = 0.2) {
  const { width, height } = await driver.getWindowSize();
  const centerY  = Math.round(height / 2);

  await driver.performActions([{
    type: 'pointer',
    id: 'finger1',
    parameters: { pointerType: 'touch' },
    actions: [
      { type: 'pointerMove',  duration: 0,   x: Math.round(width * startPercentage), y: centerY },
      { type: 'pointerDown',  button: 0 },
      { type: 'pause',        duration: 300 },
      { type: 'pointerMove',  duration: 600, x: Math.round(width * endPercentage),   y: centerY },
      { type: 'pointerUp',    button: 0 },
    ],
  }]);
}

async function longPress(element, duration = 1500) {
  const location = await element.getLocation();
  const size     = await element.getSize();
  const x = Math.round(location.x + size.width / 2);
  const y = Math.round(location.y + size.height / 2);

  await driver.performActions([{
    type: 'pointer',
    id: 'finger1',
    parameters: { pointerType: 'touch' },
    actions: [
      { type: 'pointerMove', duration: 0,        x, y },
      { type: 'pointerDown', button: 0 },
      { type: 'pause',       duration: duration },
      { type: 'pointerUp',   button: 0 },
    ],
  }]);
}

module.exports = { swipeUp, swipeDown, swipeLeft, longPress };
