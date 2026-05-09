import { useNavigate } from 'react-router-dom';
import { Button, Spin, Tooltip } from 'antd';
import {
  CheckOutlined,
  InfoCircleOutlined,
  LeftOutlined,
  RightOutlined,
} from '@ant-design/icons';
import { AnimatePresence, motion } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';
import { useMaterials } from '@/hooks/useMaterials';
import { useSelectionStore } from '@/store/selection';
import { useSceneStore } from '@/store/scene';
import { useWizardGuard } from '@/hooks/useWizardGuard';
import type { Material, MaterialTier } from '@/types';

// Step 2: Material. PRD §6.3.
// Horizontal carousel of 5 yarn tiers. Click selects + pushes a live preview
// (base color, roughness, weave texture) into the scene store so the persistent
// 3D canvas above instantly reflects the yarn choice — knitup.io style.
export default function MaterialPage() {
  useWizardGuard(['silhouetteUuid']);
  const navigate = useNavigate();
  const { data, loading } = useMaterials();
  const selectedTier = useSelectionStore((s) => s.selection.materialTier);
  const setSelection = useSelectionStore((s) => s.setSelection);
  const setMaterialPreview = useSceneStore((s) => s.setMaterialPreview);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Push the material's preview attributes into the scene store. Helper so
  // both `onPick` and the rehydrate effect use the same logic.
  const applyPreview = (m: Material) => {
    setMaterialPreview({
      baseColor: m.baseColorHex,
      roughness: m.roughness,
      textureUrl: m.swatchUrl,
    });
  };

  const onPick = (tier: MaterialTier) => {
    setSelection({ materialTier: tier });
    const picked = data?.find((m) => m.tier === tier);
    if (picked) applyPreview(picked);
  };

  const onContinue = () => navigate('/design/construction');

  // Sync persisted selection into the scene on mount, so reloading the
  // Material page restores the 3D preview even before any click.
  useEffect(() => {
    if (!data) return;
    const found = selectedTier ? data.find((m) => m.tier === selectedTier) : data[0];
    if (found) applyPreview(found);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data, selectedTier]);

  // Auto-scroll to the selected card on mount.
  useEffect(() => {
    if (!selectedTier || !scrollRef.current) return;
    const el = scrollRef.current.querySelector<HTMLElement>(`[data-tier="${selectedTier}"]`);
    el?.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
  }, [selectedTier]);

  const scroll = (dir: -1 | 1) => {
    if (!scrollRef.current) return;
    scrollRef.current.scrollBy({ left: dir * 350, behavior: 'smooth' });
  };

  return (
    <>
      {/* Breadcrumb is rendered by EditorLayout; we only render content. */}

      <div className="relative mt-8 lg:mt-12">
        {/* Carousel arrows */}
        <button
          type="button"
          aria-label="Previous materials"
          onClick={() => scroll(-1)}
          className="hidden md:flex absolute left-2 top-1/2 -translate-y-1/2 z-10 w-12 h-12 rounded-pill bg-white shadow-md border border-knitup-lighter items-center justify-center hover:bg-knitup-bgSoft transition-colors"
        >
          <LeftOutlined />
        </button>
        <button
          type="button"
          aria-label="Next materials"
          onClick={() => scroll(1)}
          className="hidden md:flex absolute right-2 top-1/2 -translate-y-1/2 z-10 w-12 h-12 rounded-pill bg-white shadow-md border border-knitup-lighter items-center justify-center hover:bg-knitup-bgSoft transition-colors"
        >
          <RightOutlined />
        </button>

        <div
          ref={scrollRef}
          className="flex gap-6 overflow-x-auto px-12 lg:px-20 pb-4 snap-x snap-mandatory scroll-smooth"
          style={{ scrollbarWidth: 'thin' }}
        >
          {loading
            ? Array.from({ length: 5 }).map((_, i) => <CardSkeleton key={i} />)
            : data?.map((m) => (
                <MaterialCard
                  key={m.tier}
                  material={m}
                  selected={selectedTier === m.tier}
                  onClick={() => onPick(m.tier)}
                />
              ))}
        </div>
      </div>

      {selectedTier && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35 }}
          className="flex justify-center mt-12"
        >
          <Button type="primary" size="large" onClick={onContinue} className="min-w-[408px]">
            Continue
          </Button>
        </motion.div>
      )}

      {!data && !loading && (
        <div className="flex justify-center py-32">
          <Spin />
        </div>
      )}
    </>
  );
}

function MaterialCard({
  material,
  selected,
  onClick,
}: {
  material: Material;
  selected: boolean;
  onClick: () => void;
}) {
  // The bundled material swatches can sometimes 404 or be too small to read.
  // Track load failures so we can fall back to a smooth gradient built from
  // the material's known baseColorHex — guarantees the preview tile always
  // looks intentional.
  const [imgFailed, setImgFailed] = useState(false);

  const fallbackBg = {
    background: `radial-gradient(120% 120% at 30% 20%, ${lighten(material.baseColorHex, 0.18)} 0%, ${material.baseColorHex} 55%, ${darken(material.baseColorHex, 0.18)} 100%)`,
  } as const;

  return (
    <motion.button
      type="button"
      data-tier={material.tier}
      onClick={onClick}
      whileHover={{ y: -4 }}
      whileTap={{ scale: 0.98 }}
      transition={{ duration: 0.25, ease: [0.645, 0.045, 0.355, 1] }}
      className={`flex-none w-[280px] snap-center text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-knitup-gray rounded-card transition-all duration-300 ${
        selected
          ? 'ring-2 ring-knitup-gray shadow-xl scale-[1.02]'
          : 'shadow-sm hover:shadow-md ring-1 ring-transparent hover:ring-knitup-lighter'
      }`}
      aria-pressed={selected}
    >
      <div
        className="w-full overflow-hidden rounded-card bg-knitup-bgSoft mb-4 relative"
        style={{ aspectRatio: '1 / 1', ...(imgFailed ? fallbackBg : {}) }}
      >
        {!imgFailed && (
          <img
            src={material.swatchUrl}
            alt={material.name}
            className="w-full h-full object-cover"
            loading="lazy"
            onError={() => setImgFailed(true)}
          />
        )}
        {/* Tier badge so the card reads even with a bland swatch */}
        <div
          className="absolute top-3 left-3 px-2.5 py-1 rounded-pill bg-white/90 backdrop-blur text-xs font-semibold text-knitup-gray shadow-sm"
          aria-hidden="true"
        >
          {material.priceTier}
        </div>

        {/* Animated "Selected" check overlay — gives clear feedback now that
            the 3D canvas isn't on this step (matches knitup behaviour). */}
        <AnimatePresence>
          {selected && (
            <motion.div
              key="check"
              initial={{ opacity: 0, scale: 0.6 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.6 }}
              transition={{ duration: 0.25, ease: [0.645, 0.045, 0.355, 1] }}
              className="absolute top-3 right-3 w-8 h-8 rounded-full bg-knitup-gray text-white flex items-center justify-center shadow-md"
              aria-hidden="true"
            >
              <CheckOutlined style={{ fontSize: 14 }} />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Subtle bottom gradient + "Selected" pill on hover/selected for clarity */}
        {selected && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="absolute inset-x-0 bottom-0 px-4 py-2 bg-gradient-to-t from-black/45 to-transparent text-white text-xs font-semibold tracking-wide"
          >
            SELECTED
          </motion.div>
        )}
      </div>
      <div className="text-center">
        <p className="font-semibold text-knitup-gray text-base flex items-center justify-center gap-1">
          {material.name}
          <Tooltip title={material.description}>
            <InfoCircleOutlined className="text-knitup-light" />
          </Tooltip>
        </p>
        <p className="text-knitup-text text-sm mt-1">{material.subName}</p>
        <div className="flex items-center justify-center gap-3 mt-3 text-sm">
          <span className="text-knitup-gray font-semibold">{material.priceTier}</span>
          <span className="text-knitup-light">{material.colorMode}</span>
        </div>
      </div>
    </motion.button>
  );
}

// --- tiny color helpers (no extra deps) -----------------------------------

function clampByte(n: number) {
  return Math.max(0, Math.min(255, Math.round(n)));
}
function hexToRgb(hex: string): [number, number, number] {
  const h = hex.replace('#', '');
  const v = h.length === 3 ? h.split('').map((c) => c + c).join('') : h;
  return [parseInt(v.slice(0, 2), 16), parseInt(v.slice(2, 4), 16), parseInt(v.slice(4, 6), 16)];
}
function rgbToHex(r: number, g: number, b: number) {
  return `#${[r, g, b].map((n) => clampByte(n).toString(16).padStart(2, '0')).join('')}`;
}
function lighten(hex: string, amt: number) {
  const [r, g, b] = hexToRgb(hex);
  return rgbToHex(r + (255 - r) * amt, g + (255 - g) * amt, b + (255 - b) * amt);
}
function darken(hex: string, amt: number) {
  const [r, g, b] = hexToRgb(hex);
  return rgbToHex(r * (1 - amt), g * (1 - amt), b * (1 - amt));
}

function CardSkeleton() {
  return (
    <div
      className="flex-none w-[280px] snap-center"
      aria-hidden="true"
    >
      <div
        className="w-full bg-knitup-bgSoft rounded-card animate-pulse"
        style={{ aspectRatio: '1 / 1' }}
      />
      <div className="h-4 bg-knitup-bgSoft rounded animate-pulse mt-4 w-2/3 mx-auto" />
    </div>
  );
}
