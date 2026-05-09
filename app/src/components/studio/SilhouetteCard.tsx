import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import type { Silhouette } from '@/types';

// Studio grid card. PRD §6.1: hover scales image, click navigates to overview
// with a shared-element layoutId so the image morphs into the preview slot.
export function SilhouetteCard({ silhouette }: { silhouette: Silhouette }) {
  return (
    <Link
      to={`/design/silhouette/${silhouette.uuid}`}
      className="group block focus:outline-none focus-visible:ring-2 focus-visible:ring-knitup-gray rounded-card"
      aria-label={silhouette.name}
    >
      <motion.div
        className="overflow-hidden rounded-card bg-knitup-bgSoft"
        whileHover={{ scale: 1.04 }}
        transition={{ duration: 0.25, ease: [0.645, 0.045, 0.355, 1] }}
        layoutId={`silhouette-${silhouette.uuid}`}
      >
        <img
          src={silhouette.thumbUrl}
          alt={silhouette.name}
          width={186}
          height={186}
          className="w-full h-auto block"
          loading="lazy"
        />
      </motion.div>
      <p className="mt-3 text-knitup-gray font-semibold text-sm">{silhouette.name}</p>
    </Link>
  );
}
