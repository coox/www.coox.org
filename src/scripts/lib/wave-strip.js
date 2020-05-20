const doesBrowserSupportCanvas = (function initializeDoesBrowserSupportCanvas() {
  const elem = document.createElement('canvas');
  return !!(elem.getContext && elem.getContext('2d'));
})();

const doesBrowserSupportRequestAnimationFrame = (function initializeDoesBrowserSupportRequestAnimationFrame() {
  return !!window.requestAnimationFrame;
})();

function initializeContext(canvasId) {
  const canvas = document.getElementById(canvasId);

  // Setting the `alpha` 2d context attribute to false as an attempt to
  // achieve faster performance.
  return canvas.getContext('2d', { alpha: false });
}

function initializeDrawWaveStripFrame(context) {
  const heroTitleElement = document.getElementById('hero-title');
  const waveStripColorComputerElement = document.getElementById(
    'wave-strip-color-computer'
  );

  return function drawWaveStripFrame() {
    const canvasWidth = heroTitleElement.clientWidth;
    const canvasHeight = heroTitleElement.clientHeight;

    const halfCanvasHeight = Math.floor(canvasHeight / 2);

    // Override logical canvas DOM element width and height properties
    context.canvas.width = canvasWidth;
    context.canvas.height = canvasHeight;

    // Canvas styled width always remains 100%
    // Canvas styled height is overridden to trigger CSS transition on resize
    context.canvas.style.height = `${canvasHeight}px`;

    // Read colors from computed style to honor color scheme CSS transitions
    const waveStripColorComputerElementStyle = window.getComputedStyle(
      waveStripColorComputerElement
    );

    context.fillStyle = waveStripColorComputerElementStyle.backgroundColor;
    context.fillRect(0, 0, canvasWidth, canvasHeight);

    context.beginPath();
    context.moveTo(0, halfCanvasHeight);
    for (
      let i = 8 + Math.ceil(16 * Math.random());
      i < canvasWidth - 8;
      i += 8 + Math.ceil(16 * Math.random())
    ) {
      context.lineTo(i, Math.ceil(canvasHeight * Math.random()));
    }
    context.lineTo(canvasWidth - 1, halfCanvasHeight);

    context.lineWidth = 4;
    context.strokeStyle = waveStripColorComputerElementStyle.color;
    context.stroke();
  };
}

export function drawStillWaveStrip(canvasId) {
  if (!(doesBrowserSupportCanvas && doesBrowserSupportRequestAnimationFrame)) {
    return;
  }
  const context = initializeContext(canvasId);
  const drawWaveStripFrame = initializeDrawWaveStripFrame(context);

  drawWaveStripFrame();
}

export function drawAnimatedWaveStrip(canvasId) {
  if (!(doesBrowserSupportCanvas && doesBrowserSupportRequestAnimationFrame)) {
    return;
  }
  const context = initializeContext(canvasId);
  const drawWaveStripFrame = initializeDrawWaveStripFrame(context);

  function animateWaveStrip() {
    drawWaveStripFrame();
    window.requestAnimationFrame(animateWaveStrip);
  }
  animateWaveStrip();
}
