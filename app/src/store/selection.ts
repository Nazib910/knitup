import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';
import type { Selection } from '@/types';

// Wizard selection store (PRD §8). Persisted to localStorage so reloads
// resume the wizard at the right step with the right choices.

const initialSelection: Selection = {
  silhouetteUuid: null,
  materialTier: null,
  constructionKey: null,
  stitchUuid: null,
  gauge: null,
  colorUuid: null,
  qtyBySize: {},
  unit: 'cm',
};

interface SelectionStore {
  selection: Selection;
  setSelection: (patch: Partial<Selection>) => void;
  setQty: (size: keyof Selection['qtyBySize'], qty: number) => void;
  toggleUnit: () => void;
  reset: () => void;
}

export const useSelectionStore = create<SelectionStore>()(
  persist(
    immer((set) => ({
      selection: initialSelection,
      setSelection: (patch) =>
        set((state) => {
          Object.assign(state.selection, patch);
        }),
      setQty: (size, qty) =>
        set((state) => {
          if (qty <= 0) {
            delete state.selection.qtyBySize[size];
          } else {
            state.selection.qtyBySize[size] = qty;
          }
        }),
      toggleUnit: () =>
        set((state) => {
          state.selection.unit = state.selection.unit === 'cm' ? 'in' : 'cm';
        }),
      reset: () =>
        set((state) => {
          state.selection = { ...initialSelection };
        }),
    })),
    {
      name: 'knitup.replica.v1.selection',
      storage: createJSONStorage(() => localStorage),
      version: 1,
    },
  ),
);

// Total quantity selector (used for Step 7 Add to Cart enable state).
export const selectTotalQty = (s: SelectionStore) =>
  Object.values(s.selection.qtyBySize).reduce((a, b) => a + (b ?? 0), 0);
