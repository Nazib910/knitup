import { create } from 'zustand';

// Ephemeral UI state (not persisted). Drawer open/close, modal toggles,
// global toast queues, etc. Keeping this separate from selection/auth/
// collection means we never accidentally persist a "drawer open" flag.

interface UIStore {
  cartDrawerOpen: boolean;
  setCartDrawerOpen: (open: boolean) => void;
  toggleCartDrawer: () => void;
}

export const useUIStore = create<UIStore>((set, get) => ({
  cartDrawerOpen: false,
  setCartDrawerOpen: (cartDrawerOpen) => set({ cartDrawerOpen }),
  toggleCartDrawer: () => set({ cartDrawerOpen: !get().cartDrawerOpen }),
}));
