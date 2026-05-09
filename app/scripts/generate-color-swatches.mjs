// Generates 54 colour-swatch SVGs for /design/color carousel.
// Each is a tileable woven-fabric square in the colour's hex with a subtle
// knit overlay so it looks like dyed yarn rather than a flat chip.
//
// Run from app/:  node scripts/generate-color-swatches.mjs

import { writeFileSync, mkdirSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const outDir = resolve(__dirname, '..', 'public', 'textures', 'color');
mkdirSync(outDir, { recursive: true });

// Mirror of fixtures/colors.ts (kept inline so this script has zero deps on
// the TS pipeline — safe to run pre-build).
const palette = [
  { name: 'Snow', hex: '#f4f0e8' }, { name: 'Linen', hex: '#ede4d2' },
  { name: 'Stone', hex: '#d2c5b1' }, { name: 'Dune', hex: '#b8a78d' },
  { name: 'Taupe', hex: '#988370' }, { name: 'Driftwood', hex: '#73604c' },
  { name: 'Espresso', hex: '#3a2f24' }, { name: 'Sand', hex: '#e8d4b8' },
  { name: 'Caramel', hex: '#d4a980' }, { name: 'Hazel', hex: '#b8814f' },
  { name: 'Walnut', hex: '#8a5a30' }, { name: 'Mahogany', hex: '#5c3a1c' },
  { name: 'Apricot', hex: '#cf7d4a' }, { name: 'Tangerine', hex: '#e8651f' },
  { name: 'Persimmon', hex: '#cf3f12' }, { name: 'Rust', hex: '#9c2a08' },
  { name: 'Cocoa', hex: '#6c1c04' }, { name: 'Peach', hex: '#e8b890' },
  { name: 'Honey', hex: '#d49b6e' }, { name: 'Camel', hex: '#b8784a' },
  { name: 'Toffee', hex: '#8a5530' }, { name: 'Blush', hex: '#fce4e1' },
  { name: 'Coral', hex: '#f5b8b1' }, { name: 'Salmon', hex: '#e07a70' },
  { name: 'Brick', hex: '#c84a3a' }, { name: 'Burgundy', hex: '#8a2e22' },
  { name: 'Petal', hex: '#fce0eb' }, { name: 'Bubblegum', hex: '#f0a8c4' },
  { name: 'Fuchsia', hex: '#e07ac0' }, { name: 'Magenta', hex: '#c84a9e' },
  { name: 'Plum', hex: '#8a2e6a' }, { name: 'Lavender', hex: '#dec4e8' },
  { name: 'Lilac', hex: '#c89bd2' }, { name: 'Orchid', hex: '#a76db8' },
  { name: 'Aubergine', hex: '#7a4490' }, { name: 'Midnight', hex: '#4a285c' },
  { name: 'Mist', hex: '#d4e0f5' }, { name: 'Sky', hex: '#7fb8e8' },
  { name: 'Cobalt', hex: '#4a8ad4' }, { name: 'Navy', hex: '#2a5fa3' },
  { name: 'Ink', hex: '#1a3a6a' }, { name: 'Sage', hex: '#c4e0d4' },
  { name: 'Mint', hex: '#7fb8a0' }, { name: 'Forest', hex: '#3a7a4a' },
  { name: 'Pine', hex: '#1c4a2c' }, { name: 'Moss', hex: '#0a2a18' },
  { name: 'Cream', hex: '#f4f0c8' }, { name: 'Lemon', hex: '#e8d870' },
  { name: 'Mustard', hex: '#c8a82e' }, { name: 'Ochre', hex: '#8a6f1a' },
  { name: 'Olive', hex: '#564408' }, { name: 'Pearl', hex: '#e8e8e8' },
  { name: 'Silver', hex: '#a8a8a8' }, { name: 'Charcoal', hex: '#5c5c5c' },
  { name: 'Onyx', hex: '#1a1a1a' },
];

const W = 200, H = 200;

function clamp(n) { return Math.max(0, Math.min(255, Math.round(n))); }
function hexToRgb(h) {
  const v = h.replace('#', '');
  const x = v.length === 3 ? v.split('').map(c => c + c).join('') : v;
  return [parseInt(x.slice(0, 2), 16), parseInt(x.slice(2, 4), 16), parseInt(x.slice(4, 6), 16)];
}
function rgbHex(r, g, b) {
  return `#${[r, g, b].map(n => clamp(n).toString(16).padStart(2, '0')).join('')}`;
}
function lighten(h, a) { const [r, g, b] = hexToRgb(h); return rgbHex(r + (255 - r) * a, g + (255 - g) * a, b + (255 - b) * a); }
function darken(h, a) { const [r, g, b] = hexToRgb(h); return rgbHex(r * (1 - a), g * (1 - a), b * (1 - a)); }

function swatchSvg(c, i) {
  const id = `c${i}`;
  const hi = lighten(c.hex, 0.18);
  const lo = darken(c.hex, 0.22);
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}" role="img" aria-label="${c.name}">
  <defs>
    <radialGradient id="g${id}" cx="35%" cy="30%" r="80%">
      <stop offset="0%" stop-color="${hi}"/>
      <stop offset="60%" stop-color="${c.hex}"/>
      <stop offset="100%" stop-color="${lo}"/>
    </radialGradient>
    <pattern id="w${id}" width="6" height="6" patternUnits="userSpaceOnUse" patternTransform="rotate(30)">
      <line x1="0" y1="0" x2="0" y2="6" stroke="${lo}" stroke-opacity="0.25" stroke-width="1.4"/>
    </pattern>
    <pattern id="w2${id}" width="6" height="6" patternUnits="userSpaceOnUse" patternTransform="rotate(-30)">
      <line x1="0" y1="0" x2="0" y2="6" stroke="${hi}" stroke-opacity="0.30" stroke-width="1.4"/>
    </pattern>
  </defs>
  <rect width="100%" height="100%" fill="url(#g${id})"/>
  <rect width="100%" height="100%" fill="url(#w${id})"/>
  <rect width="100%" height="100%" fill="url(#w2${id})"/>
</svg>
`;
}

palette.forEach((c, i) => {
  const num = String(i + 1).padStart(3, '0');
  writeFileSync(resolve(outDir, `co-${num}.svg`), swatchSvg(c, i), 'utf8');
});
console.log(`Generated ${palette.length} colour SVGs in ${outDir}`);
