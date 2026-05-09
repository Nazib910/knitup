import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Spin } from 'antd';
import { motion } from 'framer-motion';
import { useSelectionStore } from '@/store/selection';
import { useWizardGuard } from '@/hooks/useWizardGuard';
import { useSceneStore } from '@/store/scene';
import { useColors } from '@/hooks/useStitchesColors';
import { SwatchCarousel } from '@/components/wizard/SwatchCarousel';
import { AllSwatchesModal } from '@/components/wizard/AllSwatchesModal';
import type { Color } from '@/types';

// Step 6: Color — full implementation. PRD §6.7.
// 54 swatches in carousel + "view all" grid modal.
// Selecting tweens the mesh color via GSAP (350 ms power2.out).
export default function ColorPage() {
  useWizardGuard([
    'silhouetteUuid',
    'materialTier',
    'constructionKey',
    'stitchUuid',
    'gauge',
  ]);
  const navigate = useNavigate();
  const colorUuid = useSelectionStore((s) => s.selection.colorUuid);
  const setSelection = useSelectionStore((s) => s.setSelection);
  const setColor = useSceneStore((s) => s.setColor);
  const { data, loading } = useColors();
  const [allOpen, setAllOpen] = useState(false);

  // Sync persisted selection into the live scene state on mount.
  useEffect(() => {
    if (!colorUuid || !data) return;
    const found = data.find((c) => c.uuid === colorUuid);
    if (found) setColor(found.hex);
  }, [colorUuid, data, setColor]);

  const onPick = (s: { uuid: string }) => {
    const c = data?.find((x) => x.uuid === s.uuid);
    if (!c) return;
    setSelection({ colorUuid: c.uuid });
    setColor(c.hex);
  };

  if (loading || !data) {
    return (
      <div className="flex justify-center py-12">
        <Spin />
      </div>
    );
  }

  return (
    <div className="max-w-container mx-auto px-5 pb-12">
      <SwatchCarousel
        swatches={data.map(toSwatch)}
        selectedUuid={colorUuid}
        onSelect={onPick}
        onOpenAll={() => setAllOpen(true)}
        size={56}
        visibleCount={11}
      />

      {colorUuid && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35 }}
          className="flex justify-center mt-10"
        >
          <Button
            type="primary"
            size="large"
            onClick={() => navigate('/design/sizeAndQuantity')}
            className="min-w-[408px]"
          >
            Continue
          </Button>
        </motion.div>
      )}

      <AllSwatchesModal
        open={allOpen}
        onClose={() => setAllOpen(false)}
        title="All Colors"
        swatches={data.map(toSwatch)}
        selectedUuid={colorUuid}
        onSelect={onPick}
        columns={6}
      />
    </div>
  );
}

function toSwatch(c: Color) {
  // Use the fabric texture for visual fidelity in the carousel; if not set,
  // fall back to a flat hex so something always renders.
  return { uuid: c.uuid, name: c.name, swatchUrl: c.swatchUrl, hex: c.hex };
}
