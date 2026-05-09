import { useNavigate } from 'react-router-dom';
import { Button } from 'antd';
import { motion } from 'framer-motion';
import { useSelectionStore } from '@/store/selection';
import { useWizardGuard } from '@/hooks/useWizardGuard';
import { useSceneStore } from '@/store/scene';
import type { Gauge } from '@/types';

// Step 5: Gauge. PRD §6.6.
// 12GG / 7GG / 5GG = finer / average / coarser. UV repeat scales with gauge.
const OPTIONS: { gauge: Gauge; label: string; sub: string; uvRepeat: number }[] = [
  { gauge: '12GG', label: '12GG', sub: 'Finer', uvRepeat: 12 },
  { gauge: '7GG', label: '7GG', sub: 'Average', uvRepeat: 8 },
  { gauge: '5GG', label: '5GG', sub: 'Coarser', uvRepeat: 5 },
];

export default function GaugePage() {
  useWizardGuard(['silhouetteUuid', 'materialTier', 'constructionKey', 'stitchUuid']);
  const navigate = useNavigate();
  const gauge = useSelectionStore((s) => s.selection.gauge);
  const setSelection = useSelectionStore((s) => s.setSelection);
  const setUvRepeat = useSceneStore((s) => s.setUvRepeat);

  const onPick = (opt: (typeof OPTIONS)[number]) => {
    setSelection({ gauge: opt.gauge });
    setUvRepeat({ u: opt.uvRepeat, v: opt.uvRepeat });
  };

  return (
    <div className="max-w-container mx-auto px-5 pb-12">
      <div className="flex items-center justify-center gap-4">
        {OPTIONS.map((o) => {
          const selected = gauge === o.gauge;
          return (
            <motion.button
              key={o.gauge}
              type="button"
              onClick={() => onPick(o)}
              whileTap={{ scale: 0.95 }}
              whileHover={{ y: -2 }}
              transition={{ duration: 0.2 }}
              className={`w-24 h-24 rounded-pill border-2 flex flex-col items-center justify-center transition-colors ${
                selected
                  ? 'bg-knitup-gray text-white border-knitup-gray'
                  : 'bg-white text-knitup-gray border-knitup-lighter hover:bg-knitup-bgSoft'
              }`}
              aria-pressed={selected}
              aria-label={`${o.label} ${o.sub}`}
            >
              <span className="font-semibold">{o.label}</span>
              <span className={`text-xs ${selected ? 'text-white/80' : 'text-knitup-light'}`}>
                {o.sub}
              </span>
            </motion.button>
          );
        })}
      </div>

      {gauge && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35 }}
          className="flex justify-center mt-8"
        >
          <Button
            type="primary"
            size="large"
            onClick={() => navigate('/design/color')}
            className="min-w-[408px]"
          >
            Continue
          </Button>
        </motion.div>
      )}
    </div>
  );
}
