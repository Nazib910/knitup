import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Spin } from 'antd';
import { useConstructions } from '@/hooks/useMaterials';
import { useSelectionStore } from '@/store/selection';
import { useWizardGuard } from '@/hooks/useWizardGuard';
import type { Construction } from '@/types';

// Step 3: Construction. PRD §6.4.
// Three large image cards. Clicking advances to Stitch step.
export default function ConstructionPage() {
  useWizardGuard(['silhouetteUuid', 'materialTier']);
  const navigate = useNavigate();
  const { data, loading } = useConstructions();
  const setSelection = useSelectionStore((s) => s.setSelection);

  const onPick = (c: Construction) => {
    setSelection({ constructionKey: c.key });
    navigate('/design/stitch');
  };

  return (
    <>
      {/* Breadcrumb is rendered by EditorLayout. */}
      <div className="max-w-container mx-auto px-5 py-8 lg:py-12">
        <h2 className="text-h2 font-display text-knitup-gray text-center mb-10">
          Choose one of the following types to continue
        </h2>

        {loading ? (
          <div className="flex justify-center py-20">
            <Spin />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {data?.map((c, i) => (
              <motion.button
                key={c.key}
                type="button"
                onClick={() => onPick(c)}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: i * 0.08 }}
                whileHover={{ y: -6 }}
                className="group text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-knitup-gray rounded-card"
                aria-label={`Choose ${c.label}`}
              >
                <div
                  className="overflow-hidden rounded-card bg-knitup-bgSoft mb-4"
                  style={{ aspectRatio: '1 / 1' }}
                >
                  <motion.img
                    src={c.imageUrl}
                    alt={c.label}
                    className="w-full h-full object-cover"
                    whileHover={{ scale: 1.04 }}
                    transition={{ duration: 0.4 }}
                  />
                </div>
                <h3 className="text-h3 font-semibold text-knitup-gray text-center mb-2">
                  {c.label}
                </h3>
                <p className="text-knitup-text text-sm leading-relaxed">{c.description}</p>
              </motion.button>
            ))}
          </div>
        )}
      </div>
    </>
  );
}
