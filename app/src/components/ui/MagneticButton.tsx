import { useRef, type ReactNode, type ButtonHTMLAttributes } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { useReducedMotion } from '@/hooks/useReducedMotion';

// Magnetic button — pointer pulls the label slightly toward the cursor on
// hover, snapping back on leave. Subtle but premium-feeling effect.
//
// PRD §9: applies to primary CTAs across the wizard. Honors prefers-reduced-
// motion (no transform; uses opacity only).

interface MagneticButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  /** Strength of the pull (in pixels at edges). */
  strength?: number;
}

export function MagneticButton({
  children,
  strength = 6,
  className = '',
  ...rest
}: MagneticButtonProps) {
  const ref = useRef<HTMLButtonElement>(null);
  const reduced = useReducedMotion();
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 220, damping: 18, mass: 0.4 });
  const sy = useSpring(y, { stiffness: 220, damping: 18, mass: 0.4 });
  const tx = useTransform(sx, (v) => `${v}px`);
  const ty = useTransform(sy, (v) => `${v}px`);

  const onMove = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (reduced || !ref.current) return;
    const r = ref.current.getBoundingClientRect();
    const dx = (e.clientX - (r.left + r.width / 2)) / (r.width / 2);
    const dy = (e.clientY - (r.top + r.height / 2)) / (r.height / 2);
    x.set(dx * strength);
    y.set(dy * strength);
  };

  const onLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.button
      ref={ref}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      style={{ x: tx, y: ty }}
      whileTap={{ scale: reduced ? 1 : 0.97 }}
      className={`relative overflow-hidden ${className}`}
      {...(rest as object)}
    >
      <span className="relative z-10">{children}</span>
      {/* Shimmer pass — subtle diagonal sheen on hover */}
      {!reduced && (
        <motion.span
          aria-hidden="true"
          initial={{ x: '-120%' }}
          whileHover={{ x: '120%' }}
          transition={{ duration: 0.9, ease: 'easeOut' }}
          className="absolute inset-y-0 w-1/2 bg-gradient-to-r from-transparent via-white/20 to-transparent pointer-events-none"
          style={{ transform: 'skewX(-15deg)' }}
        />
      )}
    </motion.button>
  );
}
