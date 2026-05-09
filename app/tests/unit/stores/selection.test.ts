import { describe, it, expect, beforeEach } from 'vitest';
import { useSelectionStore, selectTotalQty } from '@/store/selection';

describe('useSelectionStore', () => {
  beforeEach(() => {
    useSelectionStore.getState().reset();
  });

  it('starts with all selection fields null', () => {
    const s = useSelectionStore.getState().selection;
    expect(s.silhouetteUuid).toBeNull();
    expect(s.materialTier).toBeNull();
    expect(s.qtyBySize).toEqual({});
    expect(s.unit).toBe('cm');
  });

  it('setSelection patches fields without nuking others', () => {
    useSelectionStore.getState().setSelection({ silhouetteUuid: 'si-001', materialTier: 'Bliss' });
    useSelectionStore.getState().setSelection({ stitchUuid: 'st-001' });
    const s = useSelectionStore.getState().selection;
    expect(s.silhouetteUuid).toBe('si-001');
    expect(s.materialTier).toBe('Bliss');
    expect(s.stitchUuid).toBe('st-001');
  });

  it('setQty stores positive quantities and removes zero quantities', () => {
    useSelectionStore.getState().setQty('M', 3);
    expect(useSelectionStore.getState().selection.qtyBySize.M).toBe(3);
    useSelectionStore.getState().setQty('M', 0);
    expect(useSelectionStore.getState().selection.qtyBySize.M).toBeUndefined();
  });

  it('toggleUnit flips cm <-> in', () => {
    expect(useSelectionStore.getState().selection.unit).toBe('cm');
    useSelectionStore.getState().toggleUnit();
    expect(useSelectionStore.getState().selection.unit).toBe('in');
    useSelectionStore.getState().toggleUnit();
    expect(useSelectionStore.getState().selection.unit).toBe('cm');
  });

  it('selectTotalQty sums qtyBySize across all sizes', () => {
    useSelectionStore.getState().setQty('S', 2);
    useSelectionStore.getState().setQty('M', 3);
    useSelectionStore.getState().setQty('L', 5);
    expect(selectTotalQty(useSelectionStore.getState())).toBe(10);
  });

  it('reset returns selection to initial state', () => {
    useSelectionStore.getState().setSelection({ silhouetteUuid: 'si-001' });
    useSelectionStore.getState().setQty('M', 1);
    useSelectionStore.getState().reset();
    const s = useSelectionStore.getState().selection;
    expect(s.silhouetteUuid).toBeNull();
    expect(s.qtyBySize).toEqual({});
  });
});
