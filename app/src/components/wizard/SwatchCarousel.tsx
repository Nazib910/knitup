import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { LeftOutlined, RightOutlined, AppstoreOutlined } from '@ant-design/icons';

// Reusable horizontal swatch carousel for Stitch and Color steps.
// PRD §6.5 / §6.7. Snap-scroll with arrow nav + a "view all" grid icon
// at the right end that opens the AllSwatchesModal.

export interface Swatch {
  uuid: string;
  name: string;
  /** Either an image URL or a CSS color (auto-detected by leading "#"). */
  swatchUrl?: string;
  hex?: string;
}

export interface SwatchCarouselProps {
  swatches: Swatch[];
  selectedUuid: string | null;
  onSelect: (s: Swatch) => void;
  onOpenAll?: () => void;
  size?: number;          // diameter in px
  visibleCount?: number;  // how many to fit before arrows scroll
}

export function SwatchCarousel({
  swatches,
  selectedUuid,
  onSelect,
  onOpenAll,
  size = 64,
  visibleCount = 9,
}: SwatchCarouselProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const updateScrollState = () => {
    const el = scrollRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 4);
    setCanScrollRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 4);
  };

  useEffect(() => {
    updateScrollState();
    const el = scrollRef.current;
    if (!el) return;
    el.addEventListener('scroll', updateScrollState, { passive: true });
    return () => el.removeEventListener('scroll', updateScrollState);
  }, [swatches.length]);

  // Auto-scroll selected into view.
  useEffect(() => {
    if (!selectedUuid || !scrollRef.current) return;
    const el = scrollRef.current.querySelector<HTMLElement>(`[data-uuid="${selectedUuid}"]`);
    el?.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
  }, [selectedUuid]);

  const scrollBy = (dir: -1 | 1) => {
    if (!scrollRef.current) return;
    scrollRef.current.scrollBy({ left: dir * (size + 12) * 5, behavior: 'smooth' });
  };

  return (
    <div
      className="relative w-full max-w-3xl mx-auto"
      role="listbox"
      aria-label="Swatches"
    >
      <button
        type="button"
        aria-label="Previous swatches"
        onClick={() => scrollBy(-1)}
        disabled={!canScrollLeft}
        className="absolute -left-2 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-pill bg-white border border-knitup-lighter shadow-sm flex items-center justify-center transition-opacity disabled:opacity-30 disabled:cursor-not-allowed hover:bg-knitup-bgSoft"
      >
        <LeftOutlined />
      </button>

      <div
        ref={scrollRef}
        className="flex gap-3 overflow-x-auto px-12 py-2 scroll-smooth snap-x snap-mandatory"
        style={{ scrollbarWidth: 'none' }}
      >
        {swatches.slice(0, Math.max(visibleCount * 2, swatches.length)).map((s) => (
          <SwatchButton
            key={s.uuid}
            swatch={s}
            selected={selectedUuid === s.uuid}
            onClick={() => onSelect(s)}
            size={size}
          />
        ))}
      </div>

      <button
        type="button"
        aria-label="Next swatches"
        onClick={() => scrollBy(1)}
        disabled={!canScrollRight}
        className="absolute -right-2 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-pill bg-white border border-knitup-lighter shadow-sm flex items-center justify-center transition-opacity disabled:opacity-30 disabled:cursor-not-allowed hover:bg-knitup-bgSoft"
      >
        <RightOutlined />
      </button>

      {onOpenAll && (
        <button
          type="button"
          aria-label="View all swatches"
          onClick={onOpenAll}
          className="absolute right-12 top-1/2 -translate-y-1/2 z-10 rounded-pill bg-white border-2 border-knitup-gray flex items-center justify-center hover:bg-knitup-bgSoft transition-colors"
          style={{ width: size, height: size }}
        >
          <AppstoreOutlined style={{ fontSize: 22 }} />
        </button>
      )}
    </div>
  );
}

function SwatchButton({
  swatch,
  selected,
  onClick,
  size,
}: {
  swatch: Swatch;
  selected: boolean;
  onClick: () => void;
  size: number;
}) {
  const isColor = !!swatch.hex && !swatch.swatchUrl;
  return (
    <motion.button
      type="button"
      data-uuid={swatch.uuid}
      onClick={onClick}
      whileHover={{ scale: 1.08 }}
      whileTap={{ scale: 0.94 }}
      transition={{ duration: 0.18 }}
      className={`flex-none rounded-pill overflow-hidden snap-center transition-all ${
        selected
          ? 'ring-2 ring-knitup-gray ring-offset-2'
          : 'ring-0 ring-transparent'
      }`}
      style={{ width: size, height: size, backgroundColor: isColor ? swatch.hex : undefined }}
      aria-pressed={selected}
      aria-label={swatch.name}
      role="option"
      aria-selected={selected}
      title={swatch.name}
    >
      {!isColor && swatch.swatchUrl && (
        <img src={swatch.swatchUrl} alt="" className="w-full h-full object-cover" loading="lazy" />
      )}
    </motion.button>
  );
}
