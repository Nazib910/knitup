// Account-area domain types. Per PRD §17 Q3 these forms are visual stubs in
// v0 — submissions persist to localStorage via accountStore, no real backend.

export interface AccountProfile {
  fullName: string;
  email: string;
  phone: string;
  brandName: string;
  avatarUrl?: string;
}

export interface Address {
  id: string;
  label: string;       // "Home" / "Studio" / "Manufacturing partner"
  recipient: string;
  line1: string;
  line2?: string;
  city: string;
  region: string;
  postalCode: string;
  country: string;
  phone: string;
  isDefault: boolean;
}

export interface OrderLine {
  designId: string;
  designName: string;
  qty: number;
  unitPriceUsd: number;
}

export interface Order {
  orderId: string;
  placedAt: string;          // ISO
  status: 'pending' | 'in-production' | 'shipped' | 'delivered' | 'cancelled';
  totalUsd: number;
  lines: OrderLine[];
  trackingUrl?: string;
}

export interface StoreConnection {
  provider: 'shopify' | 'woocommerce' | 'custom';
  storeUrl: string;
  connectedAt: string;       // ISO
  productCount: number;
}
