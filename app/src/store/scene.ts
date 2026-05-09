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
  color: string; // hex (overrides material base when a color is picked)
  materialBaseColor: string; // hex (per-material default base color)
  materialRoughness: number; // 0..1
  materialTextureUrl: string | null; // material-level fabric weave texture
  stitchTextureUrl: string | null; // stitch pattern texture (overrides material texture in 3D)
  uvRepeat: { u: number; v: number };
  navigate3d: boolean;
  setColor: (hex: string) => void;
  setMaterialPreview: (preview: {
    baseColor?: string;
    roughness?: number;
    textureUrl?: string | null;
  }) => void;
  setStitchTexture: (url: string | null) => void;
  setUvRepeat: (repeat: { u: number; v: number }) => void;
  setNavigate3d: (on: boolean) => void;
}

export const useSceneStore = create<SceneState>((set) => ({
  color: '#ffffff',
  materialBaseColor: '#f4f0e8',
  materialRoughness: 0.85,
  materialTextureUrl: null,
  stitchTextureUrl: null,
  uvRepeat: { u: 8, v: 8 },
  navigate3d: false,
  setColor: (color) => set({ color }),
  setMaterialPreview: ({ baseColor, roughness, textureUrl }) =>
    set((state) => ({
      materialBaseColor: baseColor ?? state.materialBaseColor,
      materialRoughness: roughness ?? state.materialRoughness,
      materialTextureUrl:
        textureUrl === undefined ? state.materialTextureUrl : textureUrl,
      // When changing material and no explicit color has been picked yet,
      // sync the live mesh color to the new material's base color so the
      // 3D preview updates immediately.
      color: baseColor && state.color === state.materialBaseColor ? baseColor : state.color,
    })),
  setStitchTexture: (stitchTextureUrl) => set({ stitchTextureUrl }),
  setUvRepeat: (uvRepeat) => set({ uvRepeat }),
  setNavigate3d: (navigate3d) => set({ navigate3d }),
}));
