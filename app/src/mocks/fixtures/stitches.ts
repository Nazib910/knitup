import type { Stitch } from '@/types';

// 20 stitch patterns. PRD §6.5: each has a swatch (for the carousel) +
// a tileable texture (mapped onto the 3D mesh) + a default UV repeat.
const STITCH_NAMES = [
  'Plain', 'Rib 1x1', 'Rib 2x2', 'Cable Classic', 'Cable Twist',
  'Tuck', 'Half Cardigan', 'Full Cardigan', 'Birdseye', 'Diamond',
  'Honeycomb', 'Basket Weave', 'Lace Eyelet', 'Lace Diamond', 'Pointelle',
  'Mosaic', 'Slip Stitch', 'Garter', 'Seed', 'Moss',
];

export const stitches: Stitch[] = STITCH_NAMES.map((name, i) => {
  const num = String(i + 1).padStart(3, '0');
  return {
    uuid: `st-${num}`,
    name,
    swatchUrl: `/textures/stitch/st-${num}.jpg`,
    textureUrl: `/textures/stitch/st-${num}.jpg`,
    repeat: { u: 8, v: 8 },
  };
});
