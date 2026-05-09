import { motion } from 'framer-motion';
import { useReducedMotion } from '@/hooks/useReducedMotion';

// SVG check-mark with a stroke-draw animation — used in the "Design Saved"
// toast at the top of Step 7. Replaces the static green CheckCircleFilled
// icon. Pure SVG (no Lottie) so it's tiny and a11y-friendly.

export function AnimatedCheckmark({ size = 24, color = '#22c55e' }: { size?: number; color?: string }) {
  const reduced = useReducedMotion();

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      role="img"
      aria-label="Success"
    >
      {/* Circle */}
      <motion.circle
        cx="12"
        cy="12"
        r="10"
        stroke={color}
        strokeWidth="2"
        fill="none"
        initial={reduced ? false : { pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: reduced ? 0 : 0.45, ease: 'easeOut' }}
        style={{ originX: '50%', originY: '50%' }}
      />
      {/* Check tick */}
      <motion.path
        d="M7 12.5l3.5 3.5L17 9"
        stroke={color}
        strokeWidth="2.4"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
        initial={reduced ? false : { pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: reduced ? 0 : 0.35, ease: 'easeOut', delay: reduced ? 0 : 0.35 }}
      />
    </svg>
  );
}
