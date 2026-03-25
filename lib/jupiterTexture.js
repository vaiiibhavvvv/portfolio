import * as THREE from 'three';

// ─────────────────────────────────────────────────────────
// makeJupiterTexture — draws a procedural Jupiter surface
// onto a canvas and returns a THREE.CanvasTexture
// ─────────────────────────────────────────────────────────
export function makeJupiterTexture() {
  const size = 1024;
  const cv = document.createElement('canvas');
  cv.width = size;
  cv.height = size;
  const ctx = cv.getContext('2d');

  // Base warm ochre
  ctx.fillStyle = '#c8894a';
  ctx.fillRect(0, 0, size, size);

  // Band definitions: [yFraction, heightFraction, color, opacity]
  const bands = [
    [0.00, 0.06, '#e8c97a', 0.85],
    [0.06, 0.05, '#b5672e', 0.90],
    [0.11, 0.07, '#d4a45a', 0.75],
    [0.18, 0.06, '#9a4a20', 0.95],
    [0.24, 0.08, '#e8c060', 0.80],
    [0.32, 0.05, '#c07030', 0.90],
    [0.37, 0.09, '#f0d080', 0.70],
    [0.46, 0.07, '#a85030', 0.95],
    [0.53, 0.08, '#d4904a', 0.80],
    [0.61, 0.06, '#8a3818', 0.90],
    [0.67, 0.09, '#e0b060', 0.75],
    [0.76, 0.06, '#b06030', 0.88],
    [0.82, 0.07, '#d8a050', 0.78],
    [0.89, 0.05, '#904020', 0.92],
    [0.94, 0.06, '#e8c070', 0.80],
  ];

  bands.forEach(([yf, hf, col, op]) => {
    const y = yf * size;
    const h = hf * size;
    const grad = ctx.createLinearGradient(0, y, 0, y + h);
    grad.addColorStop(0, col + '00');
    grad.addColorStop(0.2, col);
    grad.addColorStop(0.8, col);
    grad.addColorStop(1, col + '00');
    ctx.globalAlpha = op;
    ctx.fillStyle = grad;
    ctx.fillRect(0, y, size, h);
  });
  ctx.globalAlpha = 1;

  // Turbulence strokes between bands
  for (let i = 0; i < 28; i++) {
    const yBase = Math.random() * size;
    const amp = 4 + Math.random() * 12;
    ctx.beginPath();
    ctx.moveTo(0, yBase);
    for (let x = 0; x < size; x += 40) {
      ctx.bezierCurveTo(
        x + 13, yBase + (Math.random() - 0.5) * amp * 2,
        x + 26, yBase + (Math.random() - 0.5) * amp * 2,
        x + 40, yBase + (Math.random() - 0.5) * amp
      );
    }
    const isWarm = Math.random() > 0.5;
    ctx.strokeStyle = isWarm
      ? `rgba(80,30,10,${0.08 + Math.random() * 0.12})`
      : `rgba(220,160,60,${0.08 + Math.random() * 0.12})`;
    ctx.lineWidth = 1 + Math.random() * 3;
    ctx.stroke();
  }

  // Storm ovals — Great Red Spot + smaller storms
  const storms = [
    { x: 0.28, y: 0.52, rx: 0.055, ry: 0.028, col: '#c03010', opacity: 0.82 },
    { x: 0.72, y: 0.48, rx: 0.022, ry: 0.012, col: '#e8a030', opacity: 0.60 },
    { x: 0.55, y: 0.35, rx: 0.018, ry: 0.010, col: '#d08020', opacity: 0.50 },
    { x: 0.15, y: 0.68, rx: 0.016, ry: 0.009, col: '#b05020', opacity: 0.55 },
    { x: 0.88, y: 0.62, rx: 0.014, ry: 0.008, col: '#d09040', opacity: 0.45 },
  ];

  storms.forEach(s => {
    const cx = s.x * size;
    const cy = s.y * size;
    const rx = s.rx * size;
    const ry = s.ry * size;

    const grd = ctx.createRadialGradient(cx, cy, 0, cx, cy, rx * 1.4);
    grd.addColorStop(0, s.col + 'cc');
    grd.addColorStop(0.5, s.col + '66');
    grd.addColorStop(1, s.col + '00');

    ctx.save();
    ctx.scale(1, ry / rx);
    ctx.beginPath();
    ctx.arc(cx, cy * (rx / ry), rx * 1.4, 0, Math.PI * 2);
    ctx.fillStyle = grd;
    ctx.globalAlpha = s.opacity;
    ctx.fill();

    for (let r = rx; r > rx * 0.15; r -= rx * 0.18) {
      ctx.beginPath();
      ctx.ellipse(cx, cy * (rx / ry), r, r * 0.6, 0, 0, Math.PI * 2);
      ctx.strokeStyle = s.col + '55';
      ctx.lineWidth = 1.5;
      ctx.stroke();
    }
    ctx.restore();
    ctx.globalAlpha = 1;
  });

  // Polar brightening
  const topGrad = ctx.createLinearGradient(0, 0, 0, size * 0.12);
  topGrad.addColorStop(0, 'rgba(200,220,255,0.18)');
  topGrad.addColorStop(1, 'rgba(200,220,255,0)');
  ctx.fillStyle = topGrad;
  ctx.fillRect(0, 0, size, size * 0.12);

  const botGrad = ctx.createLinearGradient(0, size * 0.88, 0, size);
  botGrad.addColorStop(0, 'rgba(150,180,220,0)');
  botGrad.addColorStop(1, 'rgba(150,180,220,0.15)');
  ctx.fillStyle = botGrad;
  ctx.fillRect(0, size * 0.88, size, size * 0.12);

  return new THREE.CanvasTexture(cv);
}

// ─────────────────────────────────────────────────────────
// makeRingTexture — creates a radial ring band texture
// ─────────────────────────────────────────────────────────
export function makeRingTexture(innerAlpha, outerAlpha, baseColor, dustColor) {
  const w = 512;
  const h = 64;
  const cv = document.createElement('canvas');
  cv.width = w;
  cv.height = h;
  const ctx = cv.getContext('2d');

  const grad = ctx.createLinearGradient(0, 0, w, 0);
  grad.addColorStop(0.00, `rgba(${baseColor},0)`);
  grad.addColorStop(0.04, `rgba(${baseColor},${innerAlpha})`);
  grad.addColorStop(0.20, `rgba(${dustColor},${innerAlpha * 0.7})`);
  grad.addColorStop(0.38, `rgba(${baseColor},${innerAlpha * 0.9})`);
  grad.addColorStop(0.55, `rgba(${dustColor},${outerAlpha})`);
  grad.addColorStop(0.70, `rgba(${baseColor},${outerAlpha * 0.8})`);
  grad.addColorStop(0.85, `rgba(${dustColor},${outerAlpha * 0.4})`);
  grad.addColorStop(0.96, `rgba(${baseColor},${outerAlpha * 0.15})`);
  grad.addColorStop(1.00, `rgba(${baseColor},0)`);

  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, w, h);

  // Noise streaks
  for (let i = 0; i < 80; i++) {
    const x = Math.random() * w;
    ctx.fillStyle = `rgba(255,200,120,${Math.random() * 0.04})`;
    ctx.fillRect(x, 0, 1 + Math.random() * 2, h);
  }

  return new THREE.CanvasTexture(cv);
}
