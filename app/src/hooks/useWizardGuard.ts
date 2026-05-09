import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelectionStore } from '@/store/selection';

// PRD §4.1: Direct URL entry to a later step with no upstream selections
// should redirect back to Studio (or the earliest unfilled step).
export function useWizardGuard(requireFields: Array<keyof ReturnType<typeof getSelectionFields>>) {
  const navigate = useNavigate();
  const selection = useSelectionStore((s) => s.selection);

  useEffect(() => {
    const fields = getSelectionFields(selection);
    const missing = requireFields.find((f) => !fields[f]);
    if (missing) {
      // For now: bounce to Studio. P5 will be smarter (route to first unfilled step).
      navigate('/design/studio', { replace: true });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
}

function getSelectionFields(selection: ReturnType<typeof useSelectionStore.getState>['selection']) {
  return {
    silhouetteUuid: selection.silhouetteUuid,
    materialTier: selection.materialTier,
    constructionKey: selection.constructionKey,
    stitchUuid: selection.stitchUuid,
    gauge: selection.gauge,
    colorUuid: selection.colorUuid,
  };
}
