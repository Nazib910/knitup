import { api } from './client';
import type { Silhouette, Material, Construction, Stitch, Color } from '@/types';

// Typed endpoint wrappers (PRD §7). Keep these small so React Query / SWR
// can be added later without rewriting call-sites.

export const silhouetteApi = {
  list: (category?: string) =>
    api<Silhouette[]>(
      `/coreApi/v1/silhouette/list${category && category !== 'all' ? `?category=${category}` : ''}`,
    ),
  get: (uuid: string) => api<Silhouette>(`/coreApi/v1/silhouette/${uuid}`),
};

export const categoryApi = {
  list: () => api<{ key: string; label: string; count: number }[]>('/coreApi/v1/category/list'),
};

export const materialApi = {
  list: () => api<Material[]>('/coreApi/v1/material/list'),
};

export const constructionApi = {
  list: () => api<Construction[]>('/coreApi/v1/construction/list'),
};

export const stitchApi = {
  list: (material?: string) =>
    api<Stitch[]>(`/coreApi/v1/stitch/list${material ? `?material=${material}` : ''}`),
};

export const colorApi = {
  list: (material?: string) =>
    api<Color[]>(`/coreApi/v1/color/list${material ? `?material=${material}` : ''}`),
};

export const guestApi = {
  ensure: () => api<{ guestId: string; token: string }>('/coreApi/v1/user/guestUser', { method: 'POST' }),
};
