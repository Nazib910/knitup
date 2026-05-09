import { useAuthStore } from '@/store/auth';

// Tiny fetch wrapper. PRD §7: every request carries X-Guest-Id (or
// Authorization once we add real auth in v0.2). MSW intercepts these in dev.
export async function api<T = unknown>(
  path: string,
  init: RequestInit & { json?: unknown } = {},
): Promise<T> {
  const { json, headers, ...rest } = init;
  const auth = useAuthStore.getState();
  const guestId = auth.ensureGuestId();

  const finalHeaders: Record<string, string> = {
    Accept: 'application/json',
    'X-Guest-Id': guestId,
    ...(json !== undefined ? { 'Content-Type': 'application/json' } : {}),
    ...((headers as Record<string, string>) ?? {}),
  };
  if (auth.authUser) {
    finalHeaders.Authorization = `Bearer mock-${auth.authUser.id}`;
  }

  const res = await fetch(path, {
    ...rest,
    headers: finalHeaders,
    body: json !== undefined ? JSON.stringify(json) : rest.body,
  });

  if (!res.ok) {
    throw new Error(`API ${res.status} ${res.statusText} @ ${path}`);
  }
  if (res.status === 204) return undefined as T;
  return (await res.json()) as T;
}
