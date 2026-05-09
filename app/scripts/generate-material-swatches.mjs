// Generates realistic-looking solid-color fabric swatches for the 5 yarn tiers
// shown on /design/material. Replaces the rainbow placeholder JPGs with
// SVG files that read like actual knit fabric — radial gradient base,
// subtle weave hatching, and a vignette — so the Material step matches
// knitup.io visually without shipping any binary photo assets.
//
// Run from the `app/` directory:
//   node scripts/generate-material-swatches.mjs
//
// Output: app/public/materials/{bliss,vibes,dreams,desires,luxe}.svg
//
// Notes:
// - SVG is intentional: zero binary deps, scales perfectly, < 2 KB each.
// - Colors mirror src/mocks/fixtures/materials.ts baseColorHex values, with
//   a saturated knitup-style highlight palette so cards aren't bland.
// - The weave pattern is two diagonal hatch sets at 60 deg to suggest knit.

import { writeFileSync, mkdirSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const outDir = resolve(__dirname, '..', 'public', 'materials');
mkdirSync(outDir, { recursive: true });

// Tiers + a richer "knitup-style" hero colour for the swatch image (the
// Material list shows vibrant fabrics — orange BCI cotton, magenta viscose,
// orange merino, blue extrafine, beige cashmere). The 3D mesh still uses
// the muted baseColorHex from materials.ts for realism.
const tiers = [
  { id: 'bliss',   base: '#f4a93a', highlight: '#ffd17a', shadow: '#b86a10' },
  { id: 'vibes',   base: '#c3328c', highlight: '#ff7fc1', shadow: '#7a1854' },
  { id: 'dreams',  base: '#e8501c', highlight: '#ffa168', shadow: '#9a2f0d' },
  { id: 'desires', base: '#3aa3e8', highlight: '#8fd1ff', shadow: '#1a5e93' },
  { id: 'luxe',    base: '#ece2cf', highlight: '#fff8eb', shadow: '#b6a98a' },
];

const W = 600;
const H = 600;

function svgFor({ id, base, highlight, shadow }) {
  // Two diagonal hatch sets at +30 and −30 degrees mimic knit interlock.
  // strokes are translucent so they ride the underlying gradient.
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}" role="img" aria-label="${id} fabric swatch">
  <defs>
    <radialGradient id="g-${id}" cx="35%" cy="30%" r="85%">
      <stop offset="0%"  stop-color="${highlight}" stop-opacity="1"/>
      <stop offset="55%" stop-color="${base}"      stop-opacity="1"/>
      <stop offset="100%" stop-color="${shadow}"   stop-opacity="1"/>
    </radialGradient>
    <pattern id="weave-a-${id}" width="14" height="14" patternUnits="userSpaceOnUse" patternTransform="rotate(30)">
      <line x1="0" y1="0" x2="0" y2="14" stroke="${shadow}" stroke-opacity="0.18" stroke-width="2"/>
    </pattern>
    <pattern id="weave-b-${id}" width="14" height="14" patternUnits="userSpaceOnUse" patternTransform="rotate(-30)">
      <line x1="0" y1="0" x2="0" y2="14" stroke="${highlight}" stroke-opacity="0.22" stroke-width="2"/>
    </pattern>
    <radialGradient id="vignette-${id}" cx="50%" cy="55%" r="75%">
      <stop offset="60%" stop-color="#000" stop-opacity="0"/>
      <stop offset="100%" stop-color="#000" stop-opacity="0.35"/>
    </radialGradient>
  </defs>
  <rect width="100%" height="100%" fill="url(#g-${id})"/>
  <rect width="100%" height="100%" fill="url(#weave-a-${id})"/>
  <rect width="100%" height="100%" fill="url(#weave-b-${id})"/>
  <rect width="100%" height="100%" fill="url(#vignette-${id})"/>
</svg>
`;
}

for (const tier of tiers) {
  const file = resolve(outDir, `${tier.id}.svg`);
  writeFileSync(file, svgFor(tier), 'utf8');
  console.log(`✓ wrote ${file}`);
}

console.log(`\nGenerated ${tiers.length} swatches in ${outDir}`);
