import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

// Auth store. Per PRD §17 Q3, v0 skips auth entirely. We still keep an
// authUser slot so account pages can render with a name. A dev-only
// `?devAuth=1` URL flag flips this on for review/screenshots.

export interface AuthUser {
  id: string;
  name: string;
  email: string;
}

interface AuthStore {
  guestId: string;
  authUser: AuthUser | null;
  setAuthUser: (u: AuthUser | null) => void;
  ensureGuestId: () => string;
}

const newGuestId = () =>
  // Compact UUIDv4-ish id; not cryptographically critical.
  crypto.randomUUID?.() ?? `g-${Math.random().toString(36).slice(2)}-${Date.now()}`;

export const useAuthStore = create<AuthStore>()(
  persist(
    (set, get) => ({
      guestId: '',
      authUser: null,
      setAuthUser: (u) => set({ authUser: u }),
      ensureGuestId: () => {
        const cur = get().guestId;
        if (cur) return cur;
        const id = newGuestId();
        set({ guestId: id });
        return id;
      },
    }),
    {
      name: 'knitup.replica.v1.auth',
      storage: createJSONStorage(() => localStorage),
      version: 1,
    },
  ),
);
