import type { Construction } from '@/types';

// Construction types — matches the live audit (Step 3 has exactly 3 cards).
export const constructions: Construction[] = [
  {
    key: 'graphicJacquard',
    label: 'Graphic Jacquard',
    description:
      'Incorporate your graphic design. Your image file will be knitted using a 12-Gauge Birdseye Jacquard stitch.',
    imageUrl: '/construction/graphic-jacquard.svg',
  },
  {
    key: 'stitchPattern',
    label: 'Stitch Pattern',
    description:
      'Pick from a variety of stitch constructions, such as cable, tuck, needle transfer, half cardigan and many more. The selected stitch will be knitted in solid colors.',
    imageUrl: '/construction/stitch-pattern.svg',
  },
  {
    key: 'embroidery',
    label: 'Embroidery',
    description:
      'Pick from a variety of stitch constructions that support embroidery and knitted in solid colors. Make that distinctive mark to add premium and unique touches to your collection with embroidery.',
    imageUrl: '/construction/embroidery.svg',
  },
];
