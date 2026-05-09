import { useNavigate } from 'react-router-dom';
import { Button, Spin, Tooltip } from 'antd';
import { InfoCircleOutlined, LeftOutlined, RightOutlined } from '@ant-design/icons';
import { motion } from 'framer-motion';
import { useEffect, useRef } from 'react';
import { useMaterials } from '@/hooks/useMaterials';
import { useSelectionStore } from '@/store/selection';
import { useWizardGuard } from '@/hooks/useWizardGuard';
import type { Material, MaterialTier } from '@/types';

// Step 2: Material. PRD §6.3.
// Horizontal carousel of 5 yarn tiers. Click selects + advances to Construction.
export default function MaterialPage() {
  useWizardGuard(['silhouetteUuid']);
  const navigate = useNavigate();
  const { data, loading } = useMaterials();
  const selectedTier = useSelectionStore((s) => s.selection.materialTier);
  const setSelection = useSelectionStore((s) => s.setSelection);
  const scrollRef = useRef<HTMLDivElement>(null);

  const onPick = (tier: MaterialTier) => {
    setSelection({ materialTier: tier });
  };

  const onContinue = () => navigate('/design/construction');

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
  return (
    <motion.button
      type="button"
      data-tier={material.tier}
      onClick={onClick}
      whileHover={{ y: -4 }}
      whileTap={{ scale: 0.98 }}
      transition={{ duration: 0.25, ease: [0.645, 0.045, 0.355, 1] }}
      className={`flex-none w-[280px] snap-center text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-knitup-gray rounded-card transition-shadow ${
        selected ? 'ring-2 ring-knitup-gray' : ''
      }`}
      aria-pressed={selected}
    >
      <div
        className="w-full overflow-hidden rounded-card bg-knitup-bgSoft mb-4"
        style={{ aspectRatio: '1 / 1' }}
      >
        <img
          src={material.swatchUrl}
          alt={material.name}
          className="w-full h-full object-cover"
          loading="lazy"
        />
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
