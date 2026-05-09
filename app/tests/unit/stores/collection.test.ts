import { describe, it, expect, beforeEach } from 'vitest';
import { useCollectionStore } from '@/store/collection';
import type { Design } from '@/types';

const sample = (id = 'd-1'): Design => ({
  designId: id,
  name: 'Sample',
  silhouetteUuid: 'si-001',
  materialTier: 'Bliss',
  constructionKey: 'stitchPattern',
  stitchUuid: 'st-001',
  gauge: '12GG',
  colorUuid: 'co-001',
  thumbnails: [],
  createdAt: new Date().toISOString(),
  expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24).toISOString(),
});

describe('useCollectionStore', () => {
  beforeEach(() => {
    useCollectionStore.setState({ designs: [], cart: [] });
  });

  it('saveDesign prepends new designs and replaces existing by id', () => {
    useCollectionStore.getState().saveDesign(sample('d-1'));
    useCollectionStore.getState().saveDesign(sample('d-2'));
    expect(useCollectionStore.getState().designs.map((d) => d.designId)).toEqual(['d-2', 'd-1']);

    // Replace d-1 with same id but different name
    useCollectionStore.getState().saveDesign({ ...sample('d-1'), name: 'Updated' });
    const found = useCollectionStore.getState().designs.find((d) => d.designId === 'd-1');
    expect(found?.name).toBe('Updated');
    expect(useCollectionStore.getState().designs).toHaveLength(2);
  });

  it('removeDesign removes the design by id', () => {
    useCollectionStore.getState().saveDesign(sample('d-1'));
    useCollectionStore.getState().saveDesign(sample('d-2'));
    useCollectionStore.getState().removeDesign('d-1');
    expect(useCollectionStore.getState().designs).toHaveLength(1);
    expect(useCollectionStore.getState().designs[0].designId).toBe('d-2');
  });

  it('addToCart de-duplicates by designId', () => {
    useCollectionStore.getState().addToCart({ designId: 'd-1', qtyBySize: { M: 1 }, totalUsd: 100 });
    useCollectionStore.getState().addToCart({ designId: 'd-1', qtyBySize: { M: 5 }, totalUsd: 500 });
    expect(useCollectionStore.getState().cart).toHaveLength(1);
    expect(useCollectionStore.getState().cart[0].totalUsd).toBe(500);
  });

  it('clearCart empties the cart but preserves designs', () => {
    useCollectionStore.getState().saveDesign(sample());
    useCollectionStore.getState().addToCart({ designId: 'd-1', qtyBySize: { M: 1 }, totalUsd: 100 });
    useCollectionStore.getState().clearCart();
    expect(useCollectionStore.getState().cart).toEqual([]);
    expect(useCollectionStore.getState().designs).toHaveLength(1);
  });
});
