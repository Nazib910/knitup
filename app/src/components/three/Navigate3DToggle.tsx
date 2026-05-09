import { motion } from 'framer-motion';
import { useSceneStore } from '@/store/scene';

// Top-right pill button on the editor pages. Mirrors the live Knitup UI.
export function Navigate3DToggle() {
  const on = useSceneStore((s) => s.navigate3d);
  const setNavigate3d = useSceneStore((s) => s.setNavigate3d);

  return (
    <motion.button
      type="button"
      onClick={() => setNavigate3d(!on)}
      whileTap={{ scale: 0.96 }}
      className={`flex items-center gap-2 rounded-pill border px-4 py-2 text-sm transition-colors duration-fast ${
        on
          ? 'bg-knitup-gray text-white border-knitup-gray'
          : 'bg-white text-knitup-gray border-knitup-lighter hover:bg-knitup-bgSoft'
      }`}
      aria-pressed={on}
      aria-label={on ? 'Disable 3D navigation' : 'Enable 3D navigation (drag, zoom, pan)'}
    >
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
        <path d="M3 12h4l2-7 4 14 2-7h6" />
      </svg>
      Navigate 3D
    </motion.button>
  );
}
