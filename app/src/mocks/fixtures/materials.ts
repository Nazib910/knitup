import type { Material } from '@/types';

// 5 yarn tiers from $ to $$$$$ — mirrors the live audit.
// baseColorHex + roughness drive the live 3D preview on /design/material so
// picking a material visibly updates the garment in the canvas above.
export const materials: Material[] = [
  {
    tier: 'Bliss',
    name: 'Bliss',
    subName: 'BCI Cotton',
    priceTier: '$',
    swatchUrl: '/materials/bliss.svg',
    description: 'Soft, breathable everyday cotton.',
    colorMode: '5-Color Jacquard',
    baseColorHex: '#f4f0e8',
    roughness: 0.92,
  },
  {
    tier: 'Vibes',
    name: 'Vibes',
    subName: 'Recycled Viscose Nylon',
    priceTier: '$$',
    swatchUrl: '/materials/vibes.svg',
    description: 'Vibrant, sustainable, recycled.',
    colorMode: '5-Color Jacquard',
    baseColorHex: '#dec4b8',
    roughness: 0.75,
  },
  {
    tier: 'Dreams',
    name: 'Dreams',
    subName: 'Total Easy Care Merino Wool',
    priceTier: '$$$',
    swatchUrl: '/materials/dreams.svg',
    description: 'Machine-washable merino, year-round comfort.',
    colorMode: '5-Color Jacquard',
    baseColorHex: '#c8b8a0',
    roughness: 0.85,
  },
  {
    tier: 'Desires',
    name: 'Desires',
    subName: 'Extrafine Merino Wool',
    priceTier: '$$$$',
    swatchUrl: '/materials/desires.svg',
    description: 'Luxurious extrafine wool, smooth hand-feel.',
    colorMode: '3-Color Jacquard',
    baseColorHex: '#b8a890',
    roughness: 0.7,
  },
  {
    tier: 'Luxe',
    name: 'Luxe',
    subName: 'The Good Cashmere',
    priceTier: '$$$$$',
    swatchUrl: '/materials/luxe.svg',
    description: 'Ethically-sourced cashmere, the pinnacle.',
    colorMode: '2-Color Stitch',
    baseColorHex: '#e8e0d2',
    roughness: 0.55,
  },
];
