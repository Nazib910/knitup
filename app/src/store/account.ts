import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type { AccountProfile, Address, Order, StoreConnection } from '@/types/account';

// Persisted account-area state. v0 visual stubs (PRD §17 Q3).

interface AccountStore {
  profile: AccountProfile;
  addresses: Address[];
  orders: Order[];
  store: StoreConnection | null;

  setProfile: (patch: Partial<AccountProfile>) => void;
  upsertAddress: (a: Address) => void;
  removeAddress: (id: string) => void;
  setDefaultAddress: (id: string) => void;
  connectStore: (s: StoreConnection) => void;
  disconnectStore: () => void;
}

const defaultProfile: AccountProfile = {
  fullName: '',
  email: '',
  phone: '',
  brandName: '',
};

export const useAccountStore = create<AccountStore>()(
  persist(
    (set) => ({
      profile: defaultProfile,
      addresses: [],
      orders: [],
      store: null,

      setProfile: (patch) =>
        set((state) => ({ profile: { ...state.profile, ...patch } })),

      upsertAddress: (a) =>
        set((state) => {
          const others = state.addresses.filter((x) => x.id !== a.id);
          // Enforce single default.
          const cleaned = a.isDefault
            ? others.map((x) => ({ ...x, isDefault: false }))
            : others;
          return { addresses: [...cleaned, a] };
        }),

      removeAddress: (id) =>
        set((state) => ({ addresses: state.addresses.filter((a) => a.id !== id) })),

      setDefaultAddress: (id) =>
        set((state) => ({
          addresses: state.addresses.map((a) => ({ ...a, isDefault: a.id === id })),
        })),

      connectStore: (s) => set({ store: s }),
      disconnectStore: () => set({ store: null }),
    }),
    {
      name: 'knitup.replica.v1.account',
      storage: createJSONStorage(() => localStorage),
      version: 1,
    },
  ),
);
