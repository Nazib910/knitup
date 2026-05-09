// Domain types — mirror the live API shapes inferred during the audit.
// PRD §7 (Mock API Contract) and §8 (State Model).

export type Category =
  | 'all'
  | 'women'
  | 'womenCurve'
  | 'men'
  | 'unisex'
  | 'babiesKids'
  | 'accessories'
  | 'petwear'
  | 'homeware';

export type MaterialTier = 'Bliss' | 'Vibes' | 'Dreams' | 'Desires' | 'Luxe';
export type ConstructionKey = 'graphicJacquard' | 'stitchPattern' | 'embroidery';
export type Gauge = '12GG' | '7GG' | '5GG';
export type SizeKey = 'XXS' | 'XS' | 'S' | 'M' | 'L' | 'XL' | 'XXL' | 'XXXL';
export type Unit = 'cm' | 'in';

export interface SilhouetteSize {
  size: SizeKey;
  length: number;
  chest: number;
  shoulder: number;
  sleeveLength: number;
  bottomOpening: number;
}

export interface Silhouette {
  uuid: string;
  name: string;
  category: Exclude<Category, 'all'>;
  description: string;
  thumbUrl: string;
  glbUrl: string; // 3D model
  sizes: SilhouetteSize[];
}

export interface Material {
  tier: MaterialTier;
  name: string;
  subName: string;
  priceTier: '$' | '$$' | '$$$' | '$$$$' | '$$$$$';
  swatchUrl: string;
  description: string;
  colorMode: '5-Color Jacquard' | '3-Color Jacquard' | '2-Color Stitch';
}

export interface Construction {
  key: ConstructionKey;
  label: string;
  description: string;
  imageUrl: string;
}

export interface Stitch {
  uuid: string;
  name: string;
  swatchUrl: string;
  textureUrl: string;
  repeat: { u: number; v: number };
}

export interface Color {
  uuid: string;
  name: string;
  hex: string;
  swatchUrl: string;
  fabricTextureUrl: string;
}

export interface Selection {
  silhouetteUuid: string | null;
  materialTier: MaterialTier | null;
  constructionKey: ConstructionKey | null;
  stitchUuid: string | null;
  gauge: Gauge | null;
  colorUuid: string | null;
  qtyBySize: Partial<Record<SizeKey, number>>;
  unit: Unit;
}

export interface Design {
  designId: string;
  name: string; // derived from silhouette
  silhouetteUuid: string;
  materialTier: MaterialTier;
  constructionKey: ConstructionKey;
  stitchUuid: string;
  gauge: Gauge;
  colorUuid: string;
  thumbnails: string[]; // multi-view
  createdAt: string; // ISO
  expiresAt: string; // ISO (~6 months)
}

export interface CartItem {
  designId: string;
  qtyBySize: Partial<Record<SizeKey, number>>;
  totalUsd: number;
}

export interface Notice {
  id: string;
  type: 'info' | 'warning' | 'success';
  message: string;
  dismissible: boolean;
}
