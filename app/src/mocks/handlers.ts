import { http, HttpResponse } from 'msw';
import { silhouettes } from './fixtures/silhouettes';
import { materials } from './fixtures/materials';
import { constructions } from './fixtures/construction';
import { stitches } from './fixtures/stitches';
import { colors } from './fixtures/colors';

// MSW handlers mirror the live /coreApi/v1/* shape inferred during audit.
// PRD §7 Mock API Contract.
export const handlers = [
  http.post('/coreApi/v1/user/guestUser', () => {
    const guestId = crypto.randomUUID?.() ?? `g-${Date.now()}`;
    return HttpResponse.json({ guestId, token: `mock-${guestId}` });
  }),

  http.get('/coreApi/v1/silhouette/list', ({ request }) => {
    const url = new URL(request.url);
    const cat = url.searchParams.get('category');
    const list = cat && cat !== 'all' ? silhouettes.filter((s) => s.category === cat) : silhouettes;
    return HttpResponse.json(list);
  }),

  http.get('/coreApi/v1/silhouette/:uuid', ({ params }) => {
    const s = silhouettes.find((x) => x.uuid === params.uuid);
    return s ? HttpResponse.json(s) : new HttpResponse(null, { status: 404 });
  }),

  http.get('/coreApi/v1/category/list', () => {
    const counts: Record<string, number> = {};
    silhouettes.forEach((s) => {
      counts[s.category] = (counts[s.category] ?? 0) + 1;
    });
    return HttpResponse.json([
      { key: 'all', label: 'All', count: silhouettes.length },
      ...Object.entries(counts).map(([key, count]) => ({ key, label: key, count })),
    ]);
  }),

  http.get('/coreApi/v1/material/list', () => HttpResponse.json(materials)),

  http.get('/coreApi/v1/construction/list', () => HttpResponse.json(constructions)),

  http.get('/coreApi/v1/stitch/list', () => HttpResponse.json(stitches)),

  http.get('/coreApi/v1/color/list', () => HttpResponse.json(colors)),

  http.get('/coreApi/v1/notice/list', () => HttpResponse.json([])),
];
