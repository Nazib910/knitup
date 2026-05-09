// Generates the 3 Construction-step preview images shown on /design/construction.
// SVG, no binary deps. Each image visually evokes its construction type:
//   - Graphic Jacquard: a colorful checker/print collage
//   - Stitch Pattern:   horizontal bands of different yarn colours (cable / rib / tuck / lace look)
//   - Embroidery:       dark fabric with bold golden stitched curve + needle hint
//
// Run from app/:  node scripts/generate-construction-images.mjs

import { writeFileSync, mkdirSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const outDir = resolve(__dirname, '..', 'public', 'construction');
mkdirSync(outDir, { recursive: true });

const W = 800, H = 800;

function svgWrap(body, title) {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}" role="img" aria-label="${title}">
${body}
</svg>
`;
}

// 1. Graphic Jacquard ── colourful checker collage with a knit overlay
function graphicJacquard() {
  const palette = ['#f4a93a', '#e8501c', '#c3328c', '#3aa3e8', '#3a7a4a', '#f0d72a', '#1a1a1a', '#fcfcfc'];
  let cells = '';
  const cols = 8, rows = 8;
  const cw = W / cols, ch = H / rows;
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      // pseudo-random but deterministic colour pick
      const idx = (r * 31 + c * 17 + r * c) % palette.length;
      cells += `<rect x="${c * cw}" y="${r * ch}" width="${cw}" height="${ch}" fill="${palette[idx]}"/>`;
    }
  }
  // Cluster of larger painterly blobs over the checker for "graphic" feel
  const blobs = `
    <circle cx="280" cy="320" r="120" fill="#e8501c" opacity="0.85"/>
    <circle cx="540" cy="200" r="90"  fill="#3aa3e8" opacity="0.9"/>
    <circle cx="640" cy="580" r="110" fill="#f0d72a" opacity="0.85"/>
    <path d="M 80 600 Q 250 480 420 620 T 760 700" stroke="#1a1a1a" stroke-width="22" fill="none" opacity="0.85"/>`;
  // Knit weave overlay so it looks fabric-printed not painted
  const overlay = `
    <defs><pattern id="gj-w" width="14" height="14" patternUnits="userSpaceOnUse" patternTransform="rotate(30)">
      <line x1="0" y1="0" x2="0" y2="14" stroke="#000" stroke-opacity="0.18" stroke-width="2"/>
    </pattern></defs>
    <rect width="100%" height="100%" fill="url(#gj-w)"/>`;
  return svgWrap(cells + blobs + overlay, 'Graphic Jacquard');
}

// 2. Stitch Pattern ── 6 horizontal bands of different yarn colours, each
//    band hatched in the direction that suggests its stitch family.
function stitchPattern() {
  const bands = [
    { color: '#7a8c2e', angle: 0,   label: 'olive' },     // rib
    { color: '#a85a2a', angle: 30,  label: 'rust' },      // cable
    { color: '#c83e3e', angle: 90,  label: 'red' },       // moss
    { color: '#a3568b', angle: -30, label: 'mauve' },     // tuck
    { color: '#5a8c3a', angle: 60,  label: 'green' },     // honeycomb
    { color: '#e8501c', angle: 0,   label: 'orange' },    // garter
    { color: '#1a4a2c', angle: 90,  label: 'forest' },    // basketweave
  ];
  const bh = H / bands.length;
  let body = '';
  let defs = '<defs>';
  bands.forEach((b, i) => {
    defs += `<pattern id="sp-${i}" width="12" height="12" patternUnits="userSpaceOnUse" patternTransform="rotate(${b.angle})">
      <line x1="0" y1="0" x2="0" y2="12" stroke="#000" stroke-opacity="0.30" stroke-width="2.5"/>
    </pattern>`;
    body += `<rect x="0" y="${i * bh}" width="${W}" height="${bh}" fill="${b.color}"/>`;
    body += `<rect x="0" y="${i * bh}" width="${W}" height="${bh}" fill="url(#sp-${i})"/>`;
  });
  defs += '</defs>';
  return svgWrap(defs + body, 'Stitch Pattern');
}

// 3. Embroidery ── dark heather fabric with bold yellow embroidered curve + needle.
function embroidery() {
  const fabric = `
    <defs>
      <pattern id="emb-fabric" width="6" height="6" patternUnits="userSpaceOnUse">
        <rect width="6" height="6" fill="#1a1a1a"/>
        <circle cx="3" cy="3" r="1" fill="#3a3a3a"/>
      </pattern>
    </defs>
    <rect width="100%" height="100%" fill="url(#emb-fabric)"/>`;
  // Embroidered yellow curve made of dashed stitches
  const stitched = `
    <path d="M 120 560 Q 320 200 560 480 T 740 240"
          stroke="#f0c020" stroke-width="14" fill="none"
          stroke-linecap="round" stroke-dasharray="22 10" />
    <path d="M 120 560 Q 320 200 560 480 T 740 240"
          stroke="#fff5b8" stroke-width="3" fill="none"
          stroke-linecap="round" stroke-dasharray="22 10" />`;
  // Needle hint top-right
  const needle = `
    <g transform="translate(620,120) rotate(35)">
      <rect x="0" y="0" width="8" height="160" fill="#c0c0c0"/>
      <ellipse cx="4" cy="0" rx="6" ry="10" fill="#a0a0a0"/>
      <ellipse cx="4" cy="0" rx="3" ry="6" fill="#1a1a1a"/>
    </g>`;
  return svgWrap(fabric + stitched + needle, 'Embroidery');
}

const items = [
  { file: 'graphic-jacquard.svg', body: graphicJacquard() },
  { file: 'stitch-pattern.svg',   body: stitchPattern()   },
  { file: 'embroidery.svg',       body: embroidery()      },
];

for (const it of items) {
  writeFileSync(resolve(outDir, it.file), it.body, 'utf8');
  console.log(`✓ wrote ${it.file}`);
}
console.log(`\nGenerated ${items.length} construction images in ${outDir}`);
