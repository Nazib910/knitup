import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Spin } from 'antd';
import { motion } from 'framer-motion';
import { useSelectionStore } from '@/store/selection';
import { useWizardGuard } from '@/hooks/useWizardGuard';
import { useSceneStore } from '@/store/scene';
import { useStitches } from '@/hooks/useStitchesColors';
import { SwatchCarousel } from '@/components/wizard/SwatchCarousel';
import { AllSwatchesModal } from '@/components/wizard/AllSwatchesModal';
import type { Stitch } from '@/types';

// Step 4: Stitch — full implementation. PRD §6.5.
// 20 swatches in carousel + "view all" grid modal.
// Selecting applies the texture to the 3D mesh material in real time.
export default function StitchPage() {
  useWizardGuard(['silhouetteUuid', 'materialTier', 'constructionKey']);
  const navigate = useNavigate();
  const stitchUuid = useSelectionStore((s) => s.selection.stitchUuid);
  const setSelection = useSelectionStore((s) => s.setSelection);
  const setStitchTexture = useSceneStore((s) => s.setStitchTexture);
  const { data, loading } = useStitches();
  const [allOpen, setAllOpen] = useState(false);

  // Sync persisted selection into the live scene state on mount.
  useEffect(() => {
    if (!stitchUuid || !data) return;
    const found = data.find((s) => s.uuid === stitchUuid);
    if (found) setStitchTexture(found.textureUrl);
  }, [stitchUuid, data, setStitchTexture]);

  const onPick = (s: { uuid: string }) => {
    const stitch = data?.find((x) => x.uuid === s.uuid);
    if (!stitch) return;
    setSelection({ stitchUuid: stitch.uuid });
    setStitchTexture(stitch.textureUrl);
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
        selectedUuid={stitchUuid}
        onSelect={onPick}
        onOpenAll={() => setAllOpen(true)}
        size={64}
        visibleCount={9}
      />

      {stitchUuid && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35 }}
          className="flex justify-center mt-10"
        >
          <Button
            type="primary"
            size="large"
            onClick={() => navigate('/design/gauge')}
            className="min-w-[408px]"
          >
            Continue
          </Button>
        </motion.div>
      )}

      <AllSwatchesModal
        open={allOpen}
        onClose={() => setAllOpen(false)}
        title="All Stitches"
        swatches={data.map(toSwatch)}
        selectedUuid={stitchUuid}
        onSelect={onPick}
        columns={6}
      />
    </div>
  );
}

function toSwatch(s: Stitch) {
  return { uuid: s.uuid, name: s.name, swatchUrl: s.swatchUrl };
}
