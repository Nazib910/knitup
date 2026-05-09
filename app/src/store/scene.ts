import { create } from 'zustand';

// 3D scene store. Lives separately from the wizard selection store because
// (a) it's not persisted (re-derived from selection on mount), and
// (b) it changes at frame-rate (e.g. while a color tween is mid-flight) and
// we don't want to thrash localStorage.
//
// The Stitch/Gauge/Color step pages call setColor/setStitchTexture/etc.
// in response to user selections, and the GarmentScene component subscribes
// to render the 3D mesh accordingly. PRD §6.5–§6.7.

export interface SceneState {
  color: string; // hex
  stitchTextureUrl: string | null;
  uvRepeat: { u: number; v: number };
  navigate3d: boolean;
  setColor: (hex: string) => void;
  setStitchTexture: (url: string | null) => void;
  setUvRepeat: (repeat: { u: number; v: number }) => void;
  setNavigate3d: (on: boolean) => void;
}

export const useSceneStore = create<SceneState>((set) => ({
  color: '#ffffff',
  stitchTextureUrl: null,
  uvRepeat: { u: 8, v: 8 },
  navigate3d: false,
  setColor: (color) => set({ color }),
  setStitchTexture: (stitchTextureUrl) => set({ stitchTextureUrl }),
  setUvRepeat: (uvRepeat) => set({ uvRepeat }),
  setNavigate3d: (navigate3d) => set({ navigate3d }),
}));
