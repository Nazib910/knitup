import { useEffect, useState } from 'react';
import { materialApi, constructionApi } from '@/api/endpoints';
import type { Material, Construction } from '@/types';

export function useMaterials() {
  const [data, setData] = useState<Material[] | null>(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    materialApi.list().then(setData).finally(() => setLoading(false));
  }, []);
  return { data, loading };
}

export function useConstructions() {
  const [data, setData] = useState<Construction[] | null>(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    constructionApi.list().then(setData).finally(() => setLoading(false));
  }, []);
  return { data, loading };
}
