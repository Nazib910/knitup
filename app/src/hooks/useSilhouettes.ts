import { useEffect, useState } from 'react';
import { silhouetteApi } from '@/api/endpoints';
import type { Silhouette } from '@/types';

// Lightweight fetcher hook (P1). React Query will replace this in P2 if needed.
export function useSilhouettes(category?: string) {
  const [data, setData] = useState<Silhouette[] | null>(null);
  const [error, setError] = useState<Error | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    silhouetteApi
      .list(category)
      .then((d) => {
        if (!cancelled) setData(d);
      })
      .catch((e) => {
        if (!cancelled) setError(e as Error);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [category]);

  return { data, error, loading };
}

export function useSilhouette(uuid: string | undefined) {
  const [data, setData] = useState<Silhouette | null>(null);
  const [error, setError] = useState<Error | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!uuid) return;
    let cancelled = false;
    setLoading(true);
    silhouetteApi
      .get(uuid)
      .then((d) => !cancelled && setData(d))
      .catch((e) => !cancelled && setError(e as Error))
      .finally(() => !cancelled && setLoading(false));
    return () => {
      cancelled = true;
    };
  }, [uuid]);

  return { data, error, loading };
}
