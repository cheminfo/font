import puppeteer from 'puppeteer';
import { readFileSync, writeFileSync, readdirSync, statSync } from 'node:fs';
import { join, relative } from 'node:path';

const SRC_DIR = join(import.meta.dirname, '..', 'src');
const OUTPUT_FILE = join(import.meta.dirname, 'bbox-results.json');

// Recursively find all .svg files (excluding .ori.svg)
function findSvgFiles(dir) {
  const results = [];
  for (const entry of readdirSync(dir)) {
    const fullPath = join(dir, entry);
    if (statSync(fullPath).isDirectory()) {
      results.push(...findSvgFiles(fullPath));
    } else if (entry.endsWith('.svg') && !entry.includes('.ori.')) {
      results.push(fullPath);
    }
  }
  return results.sort();
}

async function main() {
  const svgFiles = findSvgFiles(SRC_DIR);
  console.log(`Found ${svgFiles.length} SVG files`);

  const browser = await puppeteer.launch({
    headless: true,
    executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
  });
  const page = await browser.newPage();

  // Build an HTML page with all SVGs embedded
  const svgContents = svgFiles.map((file, i) => {
    const svg = readFileSync(file, 'utf-8');
    // Wrap each SVG in a div with a data attribute for identification
    // Make the SVG visible but positioned off-screen with fixed dimensions
    return `<div id="svg-${i}" style="width:1000px;height:1000px;position:absolute;left:${i * 1100}px;top:0">${svg}</div>`;
  });

  const html = `<!DOCTYPE html>
<html>
<head><style>body { margin: 0; } svg { width: 1000px; height: 1000px; }</style></head>
<body>${svgContents.join('\n')}</body>
</html>`;

  await page.setContent(html, { waitUntil: 'networkidle0' });

  // Compute bounding boxes for all SVGs
  const results = await page.evaluate((count) => {
    const bboxes = [];
    for (let i = 0; i < count; i++) {
      const container = document.getElementById(`svg-${i}`);
      const svg = container.querySelector('svg');
      if (!svg) {
        bboxes.push(null);
        continue;
      }
      // Get bbox of all content elements
      try {
        const bbox = svg.getBBox();
        bboxes.push({
          x: bbox.x,
          y: bbox.y,
          width: bbox.width,
          height: bbox.height,
        });
      } catch (e) {
        bboxes.push(null);
      }
    }
    return bboxes;
  }, svgFiles.length);

  await browser.close();

  // Build output with file paths
  const output = svgFiles.map((file, i) => ({
    file: relative(join(import.meta.dirname, '..'), file),
    bbox: results[i],
  }));

  writeFileSync(OUTPUT_FILE, JSON.stringify(output, null, 2));
  console.log(`Results written to ${OUTPUT_FILE}`);

  // Print summary
  let needsRescale = 0;
  for (const entry of output) {
    if (!entry.bbox) {
      console.log(`  SKIP (no bbox): ${entry.file}`);
      continue;
    }
    const { x, y, width, height } = entry.bbox;
    const maxDim = Math.max(width, height);
    const cx = x + width / 2;
    const cy = y + height / 2;
    // Check if content is already well-centered and fills the canvas
    const usage = maxDim / 1000;
    if (usage < 0.90) {
      needsRescale++;
      console.log(`  RESCALE (${(usage * 100).toFixed(0)}% usage): ${entry.file} bbox=[${x.toFixed(1)},${y.toFixed(1)} ${width.toFixed(1)}x${height.toFixed(1)}]`);
    }
  }
  console.log(`\n${needsRescale} icons need rescaling out of ${output.length}`);
}

main().catch(console.error);
