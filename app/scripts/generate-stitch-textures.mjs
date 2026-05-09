// Generates 20 stitch-pattern texture SVGs for /design/stitch.
// Each one is a tileable monochrome (light-grey on white) pattern that
// suggests its stitch family — plain, rib, cable, lace, etc.
// SVG so each is < 2KB and scales sharply.
//
// Run from app/:  node scripts/generate-stitch-textures.mjs

import { writeFileSync, mkdirSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const outDir = resolve(__dirname, '..', 'public', 'textures', 'stitch');
mkdirSync(outDir, { recursive: true });

const W = 400, H = 400;
const FG = '#9aa1a8';   // light pencil grey
const BG = '#fafaf7';   // soft cream white

// Each entry: a pattern fragment that fills the canvas. Designed to LOOK
// like the named stitch family and be tile-friendly.
const stitches = [
  // 1. Plain — small uniform V's (stockinette)
  () => svg(`<defs><pattern id="p" width="20" height="22" patternUnits="userSpaceOnUse">
    <path d="M0 0 L10 11 L20 0 M0 22 L10 11 L20 22" stroke="${FG}" stroke-width="1.6" fill="none"/>
  </pattern></defs><rect width="100%" height="100%" fill="${BG}"/><rect width="100%" height="100%" fill="url(#p)"/>`),

  // 2. Rib 1x1 — vertical pairs
  () => svg(`<defs><pattern id="p" width="14" height="20" patternUnits="userSpaceOnUse">
    <rect x="0" y="0" width="6" height="20" fill="${FG}" opacity="0.45"/>
  </pattern></defs><rect width="100%" height="100%" fill="${BG}"/><rect width="100%" height="100%" fill="url(#p)"/>`),

  // 3. Rib 2x2 — wider columns
  () => svg(`<defs><pattern id="p" width="28" height="20" patternUnits="userSpaceOnUse">
    <rect x="0" y="0" width="14" height="20" fill="${FG}" opacity="0.4"/>
  </pattern></defs><rect width="100%" height="100%" fill="${BG}"/><rect width="100%" height="100%" fill="url(#p)"/>`),

  // 4. Cable Classic — twisted rope columns
  () => svg(`<defs><pattern id="p" width="40" height="60" patternUnits="userSpaceOnUse">
    <path d="M10 0 Q20 15 30 30 Q20 45 10 60 M30 0 Q20 15 10 30 Q20 45 30 60" stroke="${FG}" stroke-width="3" fill="none"/>
  </pattern></defs><rect width="100%" height="100%" fill="${BG}"/><rect width="100%" height="100%" fill="url(#p)"/>`),

  // 5. Cable Twist — denser braid
  () => svg(`<defs><pattern id="p" width="32" height="48" patternUnits="userSpaceOnUse">
    <path d="M5 0 C 25 12, 25 36, 5 48 M27 0 C 7 12, 7 36, 27 48" stroke="${FG}" stroke-width="2.5" fill="none"/>
  </pattern></defs><rect width="100%" height="100%" fill="${BG}"/><rect width="100%" height="100%" fill="url(#p)"/>`),

  // 6. Tuck — slanted dashes
  () => svg(`<defs><pattern id="p" width="20" height="20" patternUnits="userSpaceOnUse">
    <line x1="2" y1="16" x2="18" y2="4" stroke="${FG}" stroke-width="2.4"/>
  </pattern></defs><rect width="100%" height="100%" fill="${BG}"/><rect width="100%" height="100%" fill="url(#p)"/>`),

  // 7. Half Cardigan — alternating long/short verts
  () => svg(`<defs><pattern id="p" width="16" height="20" patternUnits="userSpaceOnUse">
    <line x1="4" y1="2" x2="4" y2="18" stroke="${FG}" stroke-width="2"/>
    <line x1="12" y1="6" x2="12" y2="14" stroke="${FG}" stroke-width="2"/>
  </pattern></defs><rect width="100%" height="100%" fill="${BG}"/><rect width="100%" height="100%" fill="url(#p)"/>`),

  // 8. Full Cardigan — denser interlock
  () => svg(`<defs><pattern id="p" width="14" height="14" patternUnits="userSpaceOnUse">
    <path d="M0 7 L7 0 L14 7 L7 14 Z" fill="none" stroke="${FG}" stroke-width="1.8"/>
  </pattern></defs><rect width="100%" height="100%" fill="${BG}"/><rect width="100%" height="100%" fill="url(#p)"/>`),

  // 9. Birdseye — tiny dots in grid
  () => svg(`<defs><pattern id="p" width="14" height="14" patternUnits="userSpaceOnUse">
    <circle cx="3" cy="3" r="2" fill="${FG}"/>
    <circle cx="10" cy="10" r="1.5" fill="${FG}" opacity="0.6"/>
  </pattern></defs><rect width="100%" height="100%" fill="${BG}"/><rect width="100%" height="100%" fill="url(#p)"/>`),

  // 10. Diamond — diamond grid
  () => svg(`<defs><pattern id="p" width="40" height="40" patternUnits="userSpaceOnUse">
    <path d="M20 2 L38 20 L20 38 L2 20 Z" fill="none" stroke="${FG}" stroke-width="1.8"/>
  </pattern></defs><rect width="100%" height="100%" fill="${BG}"/><rect width="100%" height="100%" fill="url(#p)"/>`),

  // 11. Honeycomb — hexes
  () => svg(`<defs><pattern id="p" width="34" height="40" patternUnits="userSpaceOnUse">
    <path d="M17 0 L34 10 L34 30 L17 40 L0 30 L0 10 Z" fill="none" stroke="${FG}" stroke-width="1.6"/>
  </pattern></defs><rect width="100%" height="100%" fill="${BG}"/><rect width="100%" height="100%" fill="url(#p)"/>`),

  // 12. Basket Weave — alternating rectangles
  () => svg(`<defs><pattern id="p" width="40" height="40" patternUnits="userSpaceOnUse">
    <rect x="0" y="0" width="20" height="20" fill="${FG}" opacity="0.45"/>
    <rect x="20" y="20" width="20" height="20" fill="${FG}" opacity="0.45"/>
  </pattern></defs><rect width="100%" height="100%" fill="${BG}"/><rect width="100%" height="100%" fill="url(#p)"/>`),

  // 13. Lace Eyelet — open holes
  () => svg(`<defs><pattern id="p" width="22" height="22" patternUnits="userSpaceOnUse">
    <circle cx="11" cy="11" r="5" fill="none" stroke="${FG}" stroke-width="1.5"/>
  </pattern></defs><rect width="100%" height="100%" fill="${BG}"/><rect width="100%" height="100%" fill="url(#p)"/>`),

  // 14. Lace Diamond — diamond holes
  () => svg(`<defs><pattern id="p" width="36" height="36" patternUnits="userSpaceOnUse">
    <path d="M18 6 L30 18 L18 30 L6 18 Z" fill="none" stroke="${FG}" stroke-width="1.5"/>
    <circle cx="18" cy="18" r="3" fill="none" stroke="${FG}" stroke-width="1.2"/>
  </pattern></defs><rect width="100%" height="100%" fill="${BG}"/><rect width="100%" height="100%" fill="url(#p)"/>`),

  // 15. Pointelle — paired droplets
  () => svg(`<defs><pattern id="p" width="22" height="28" patternUnits="userSpaceOnUse">
    <ellipse cx="6" cy="10" rx="3" ry="6" fill="${FG}" opacity="0.5"/>
    <ellipse cx="16" cy="20" rx="3" ry="6" fill="${FG}" opacity="0.5"/>
  </pattern></defs><rect width="100%" height="100%" fill="${BG}"/><rect width="100%" height="100%" fill="url(#p)"/>`),

  // 16. Mosaic — interlocking L-shapes
  () => svg(`<defs><pattern id="p" width="30" height="30" patternUnits="userSpaceOnUse">
    <path d="M0 0 H15 V15 H30 V30 H15 V15 H0 Z" fill="${FG}" opacity="0.4"/>
  </pattern></defs><rect width="100%" height="100%" fill="${BG}"/><rect width="100%" height="100%" fill="url(#p)"/>`),

  // 17. Slip Stitch — broken horizontal lines
  () => svg(`<defs><pattern id="p" width="20" height="14" patternUnits="userSpaceOnUse">
    <line x1="0" y1="7" x2="14" y2="7" stroke="${FG}" stroke-width="2" stroke-dasharray="6 4"/>
  </pattern></defs><rect width="100%" height="100%" fill="${BG}"/><rect width="100%" height="100%" fill="url(#p)"/>`),

  // 18. Garter — dense horizontal ridges
  () => svg(`<defs><pattern id="p" width="20" height="10" patternUnits="userSpaceOnUse">
    <line x1="0" y1="3" x2="20" y2="3" stroke="${FG}" stroke-width="2" opacity="0.55"/>
  </pattern></defs><rect width="100%" height="100%" fill="${BG}"/><rect width="100%" height="100%" fill="url(#p)"/>`),

  // 19. Seed — alternating dots
  () => svg(`<defs><pattern id="p" width="12" height="12" patternUnits="userSpaceOnUse">
    <circle cx="3" cy="3" r="1.6" fill="${FG}"/>
    <circle cx="9" cy="9" r="1.6" fill="${FG}"/>
  </pattern></defs><rect width="100%" height="100%" fill="${BG}"/><rect width="100%" height="100%" fill="url(#p)"/>`),

  // 20. Moss — slightly larger seed
  () => svg(`<defs><pattern id="p" width="14" height="14" patternUnits="userSpaceOnUse">
    <circle cx="3" cy="3" r="2" fill="${FG}" opacity="0.7"/>
    <circle cx="11" cy="11" r="2" fill="${FG}" opacity="0.7"/>
  </pattern></defs><rect width="100%" height="100%" fill="${BG}"/><rect width="100%" height="100%" fill="url(#p)"/>`),
];

function svg(body) {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}">${body}</svg>`;
}

stitches.forEach((make, i) => {
  const num = String(i + 1).padStart(3, '0');
  writeFileSync(resolve(outDir, `st-${num}.svg`), make(), 'utf8');
});
console.log(`Generated ${stitches.length} stitch SVGs in ${outDir}`);
