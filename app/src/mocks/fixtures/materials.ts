import type { Material } from '@/types';

// 5 yarn tiers from $ to $$$$$ — mirrors the live audit.
export const materials: Material[] = [
  {
    tier: 'Bliss',
    name: 'Bliss',
    subName: 'BCI Cotton',
    priceTier: '$',
    swatchUrl: '/materials/bliss.jpg',
    description: 'Soft, breathable everyday cotton.',
    colorMode: '5-Color Jacquard',
  },
  {
    tier: 'Vibes',
    name: 'Vibes',
    subName: 'Recycled Viscose Nylon',
    priceTier: '$$',
    swatchUrl: '/materials/vibes.jpg',
    description: 'Vibrant, sustainable, recycled.',
    colorMode: '5-Color Jacquard',
  },
  {
    tier: 'Dreams',
    name: 'Dreams',
    subName: 'Total Easy Care Merino Wool',
    priceTier: '$$$',
    swatchUrl: '/materials/dreams.jpg',
    description: 'Machine-washable merino, year-round comfort.',
    colorMode: '5-Color Jacquard',
  },
  {
    tier: 'Desires',
    name: 'Desires',
    subName: 'Extrafine Merino Wool',
    priceTier: '$$$$',
    swatchUrl: '/materials/desires.jpg',
    description: 'Luxurious extrafine wool, smooth hand-feel.',
    colorMode: '3-Color Jacquard',
  },
  {
    tier: 'Luxe',
    name: 'Luxe',
    subName: 'The Good Cashmere',
    priceTier: '$$$$$',
    swatchUrl: '/materials/luxe.jpg',
    description: 'Ethically-sourced cashmere, the pinnacle.',
    colorMode: '2-Color Stitch',
  },
];
