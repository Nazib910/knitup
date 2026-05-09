import { useEffect, useState } from 'react';
import { stitchApi, colorApi } from '@/api/endpoints';
import type { Stitch, Color } from '@/types';

export function useStitches() {
  const [data, setData] = useState<Stitch[] | null>(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    stitchApi.list().then(setData).finally(() => setLoading(false));
  }, []);
  return { data, loading };
}

export function useColors() {
  const [data, setData] = useState<Color[] | null>(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    colorApi.list().then(setData).finally(() => setLoading(false));
  }, []);
  return { data, loading };
}
