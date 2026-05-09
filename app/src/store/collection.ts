import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type { CartItem, Design } from '@/types';

// Collection + cart store. Designs persist to localStorage so guest sessions
// retain "My Collection" entries across reloads.

interface CollectionStore {
  designs: Design[];
  cart: CartItem[];
  saveDesign: (d: Design) => void;
  removeDesign: (designId: string) => void;
  addToCart: (item: CartItem) => void;
  removeFromCart: (designId: string) => void;
  clearCart: () => void;
}

export const useCollectionStore = create<CollectionStore>()(
  persist(
    (set) => ({
      designs: [],
      cart: [],
      saveDesign: (d) =>
        set((state) => {
          // Replace if same id, else prepend (newest first).
          const others = state.designs.filter((x) => x.designId !== d.designId);
          return { designs: [d, ...others] };
        }),
      removeDesign: (designId) =>
        set((state) => ({ designs: state.designs.filter((d) => d.designId !== designId) })),
      addToCart: (item) =>
        set((state) => {
          const others = state.cart.filter((x) => x.designId !== item.designId);
          return { cart: [...others, item] };
        }),
      removeFromCart: (designId) =>
        set((state) => ({ cart: state.cart.filter((c) => c.designId !== designId) })),
      clearCart: () => set({ cart: [] }),
    }),
    {
      name: 'knitup.replica.v1.collection',
      storage: createJSONStorage(() => localStorage),
      version: 1,
    },
  ),
);
