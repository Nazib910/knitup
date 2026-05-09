import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import type { Silhouette } from '@/types';

// Studio grid card. Shows a product image of the garment on a soft neutral
// surface. The bundled placeholder PNGs vary wildly in quality, so the card:
//   1. Frames every thumbnail inside a centered, padded "stage" on a soft
//      gradient (so small + large images both look intentional).
//   2. Falls back to a clean SVG silhouette icon if the image fails to load.
//   3. Hides the broken-image glyph with onError handling.
//
// PRD §6.1: hover scales image, click navigates to overview with a
// shared-element layoutId so the image morphs into the preview slot.
export function SilhouetteCard({ silhouette }: { silhouette: Silhouette }) {
  const [failed, setFailed] = useState(false);

  return (
    <Link
      to={`/design/silhouette/${silhouette.uuid}`}
      className="group block focus:outline-none focus-visible:ring-2 focus-visible:ring-knitup-gray rounded-card"
      aria-label={silhouette.name}
    >
      <motion.div
        className="overflow-hidden rounded-card flex items-center justify-center relative"
        whileHover={{ scale: 1.04 }}
        transition={{ duration: 0.25, ease: [0.645, 0.045, 0.355, 1] }}
        layoutId={`silhouette-${silhouette.uuid}`}
        style={{
          aspectRatio: '1 / 1',
          background:
            'radial-gradient(120% 120% at 30% 20%, #ffffff 0%, #f4f1ec 60%, #e8e3d8 100%)',
        }}
      >
        {!failed ? (
          <img
            src={silhouette.thumbUrl}
            alt={silhouette.name}
            className="w-[78%] h-[78%] object-contain transition-transform duration-300 group-hover:scale-[1.03]"
            loading="lazy"
            decoding="async"
            onError={() => setFailed(true)}
          />
        ) : (
          <FallbackGarmentIcon label={silhouette.name} />
        )}
      </motion.div>
      <p className="mt-3 text-knitup-gray font-semibold text-sm">{silhouette.name}</p>
    </Link>
  );
}

function FallbackGarmentIcon({ label }: { label: string }) {
  return (
    <svg
      viewBox="0 0 100 100"
      className="w-3/5 h-3/5 text-knitup-light"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      role="img"
      aria-label={label}
    >
      <path d="M30 22 L20 32 L26 42 L34 38 L34 80 L66 80 L66 38 L74 42 L80 32 L70 22 L60 18 Q50 26 40 18 Z" />
      <path d="M40 18 Q50 28 60 18" />
    </svg>
  );
}
