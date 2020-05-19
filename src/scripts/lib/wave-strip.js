const doesBrowserSupportCanvas = (function initializeDoesBrowserSupportCanvas() {
  const elem = document.createElement('canvas');
  return !!(elem.getContext && elem.getContext('2d'));
})();

const doesBrowserSupportRequestAnimationFrame = (function initializeDoesBrowserSupportRequestAnimationFrame() {
  return !!window.requestAnimationFrame;
})();

// TODO: dark mode support
// if (window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches) {
// }

function initializeContext(canvasId) {
  const canvas = document.getElementById(canvasId);

  // Setting the `alpha` 2d context attribute to false as an attempt to
  // achieve faster performance.
  return canvas.getContext('2d', { alpha: false });
}

function drawWaveStripFrame(context) {
  const heroTitleElement = document.getElementById('hero-title');

  const canvasWidth = heroTitleElement.clientWidth;
  const canvasHeight = heroTitleElement.clientHeight;

  const halfCanvasHeight = Math.floor(canvasHeight / 2);

  context.canvas.width = canvasWidth;
  context.canvas.height = canvasHeight;

  // Canvas styled width always remains 100%
  // Canvas styled height is recalculated for CSS transition to happen
  context.canvas.style.height = `${canvasHeight}px`;

  context.fillStyle = '#111';
  context.fillRect(0, 0, canvasWidth, canvasHeight);

  context.beginPath();
  context.moveTo(0, halfCanvasHeight);
  for (
    let i = 8 + Math.ceil(16 * Math.random());
    i < canvasWidth;
    i += 8 + Math.ceil(16 * Math.random())
  ) {
    context.lineTo(i, Math.ceil(canvasHeight * Math.random()));
  }
  context.lineTo(canvasWidth - 1, halfCanvasHeight);

  context.lineWidth = 4;
  context.strokeStyle = '#777';
  context.stroke();
}

export function drawStillWaveStrip(canvasId) {
  if (!(doesBrowserSupportCanvas && doesBrowserSupportRequestAnimationFrame)) {
    return;
  }
  const context = initializeContext(canvasId);

  drawWaveStripFrame(context);
}

export function drawAnimatedWaveStrip(canvasId) {
  if (!(doesBrowserSupportCanvas && doesBrowserSupportRequestAnimationFrame)) {
    return;
  }
  const context = initializeContext(canvasId);

  function animateWaveStrip() {
    drawWaveStripFrame(context);
    window.requestAnimationFrame(animateWaveStrip);
  }
  animateWaveStrip();
}
