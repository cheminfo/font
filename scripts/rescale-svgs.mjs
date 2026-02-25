import { readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

const ROOT = join(import.meta.dirname, '..');
const BBOX_FILE = join(import.meta.dirname, 'bbox-results.json');

// Target: content fills 900x900 of the 1000x1000 viewport (50px margin each side)
const VIEWPORT = 1000;
const MARGIN = 50;
const USABLE = VIEWPORT - 2 * MARGIN; // 900
const THRESHOLD = 0.88; // Only rescale if usage < 88%

const bboxData = JSON.parse(readFileSync(BBOX_FILE, 'utf-8'));

let rescaledCount = 0;
let skippedCount = 0;

for (const entry of bboxData) {
  if (!entry.bbox) {
    console.log(`SKIP (no bbox): ${entry.file}`);
    skippedCount++;
    continue;
  }

  const { x, y, width, height } = entry.bbox;
  if (width === 0 || height === 0) {
    console.log(`SKIP (zero dimension): ${entry.file}`);
    skippedCount++;
    continue;
  }

  const maxDim = Math.max(width, height);
  const usage = maxDim / VIEWPORT;

  if (usage >= THRESHOLD) {
    skippedCount++;
    continue;
  }

  // Calculate new viewBox
  // viewBox_side is how much SVG coordinate space maps to the full viewport
  // We want maxDim to map to USABLE pixels, so:
  // viewBox_side / VIEWPORT = maxDim / USABLE
  const viewBoxSide = (maxDim * VIEWPORT) / USABLE;

  // Center on the content
  const cx = x + width / 2;
  const cy = y + height / 2;
  const vx = cx - viewBoxSide / 2;
  const vy = cy - viewBoxSide / 2;

  // Round to 1 decimal
  const newViewBox = `${round(vx)} ${round(vy)} ${round(viewBoxSide)} ${round(viewBoxSide)}`;

  // Read and modify the SVG
  const filePath = join(ROOT, entry.file);
  let svg = readFileSync(filePath, 'utf-8');

  // Replace viewBox attribute
  const viewBoxRegex = /viewBox="[^"]*"/;
  if (!viewBoxRegex.test(svg)) {
    console.log(`SKIP (no viewBox attr): ${entry.file}`);
    skippedCount++;
    continue;
  }

  const oldViewBox = svg.match(viewBoxRegex)[0];
  svg = svg.replace(viewBoxRegex, `viewBox="${newViewBox}"`);

  writeFileSync(filePath, svg);
  rescaledCount++;
  console.log(
    `RESCALE ${entry.file}: ${oldViewBox} → viewBox="${newViewBox}" (${(usage * 100).toFixed(0)}% → ~94%)`,
  );
}

console.log(`\nDone: ${rescaledCount} rescaled, ${skippedCount} skipped`);

function round(n) {
  return Math.round(n * 10) / 10;
}
