import { motion } from 'framer-motion';
import { useReducedMotion } from '@/hooks/useReducedMotion';

// 7-step wizard progress indicator. Renders 7 dots (filled = visited) with
// the active step ringed. Lives at the top of EditorLayout next to the
// breadcrumb.

const STEPS = [
  { index: 1, name: 'Silhouette' },
  { index: 2, name: 'Material' },
  { index: 3, name: 'Construction' },
  { index: 4, name: 'Stitch' },
  { index: 5, name: 'Gauge' },
  { index: 6, name: 'Color' },
  { index: 7, name: 'Size' },
];

export function StepIndicator({ currentStep }: { currentStep: number }) {
  const reduced = useReducedMotion();

  return (
    <ol
      className="hidden sm:flex items-center gap-1.5"
      role="list"
      aria-label={`Wizard progress, step ${currentStep} of 7`}
    >
      {STEPS.map((s) => {
        const visited = s.index < currentStep;
        const active = s.index === currentStep;
        return (
          <li key={s.index} className="flex items-center gap-1.5" title={s.name}>
            <motion.span
              initial={false}
              animate={{
                scale: active ? 1.4 : 1,
                backgroundColor: visited || active ? '#393939' : '#dedede',
              }}
              transition={{ duration: reduced ? 0 : 0.25, ease: 'easeOut' }}
              className="w-2 h-2 rounded-pill block"
              aria-current={active ? 'step' : undefined}
            />
            {s.index < STEPS.length && (
              <span
                className={`w-4 h-px transition-colors duration-300 ${
                  visited ? 'bg-knitup-gray' : 'bg-knitup-lighter'
                }`}
                aria-hidden="true"
              />
            )}
          </li>
        );
      })}
    </ol>
  );
}
