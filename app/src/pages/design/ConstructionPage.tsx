import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { Spin } from 'antd';
import { CheckOutlined } from '@ant-design/icons';
import { useConstructions } from '@/hooks/useMaterials';
import { useSelectionStore } from '@/store/selection';
import { useWizardGuard } from '@/hooks/useWizardGuard';
import type { Construction } from '@/types';

// Step 3: Construction. PRD §6.4.
// Three large image cards. Clicking advances to Stitch step.
// We show a clear selected state for an instant before navigating, mirroring
// knitup's brief tactile confirmation.
export default function ConstructionPage() {
  useWizardGuard(['silhouetteUuid', 'materialTier']);
  const navigate = useNavigate();
  const { data, loading } = useConstructions();
  const constructionKey = useSelectionStore((s) => s.selection.constructionKey);
  const setSelection = useSelectionStore((s) => s.setSelection);
  const [pending, setPending] = useState<string | null>(null);

  const onPick = (c: Construction) => {
    setSelection({ constructionKey: c.key });
    setPending(c.key);
    // Brief confirmation flash before advancing.
    window.setTimeout(() => navigate('/design/stitch'), 280);
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
            {data?.map((c, i) => {
              const isSelected = pending === c.key || constructionKey === c.key;
              return (
                <motion.button
                  key={c.key}
                  type="button"
                  onClick={() => onPick(c)}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: i * 0.08 }}
                  whileHover={{ y: -6 }}
                  className={`group text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-knitup-gray rounded-card transition-all duration-300 ${
                    isSelected
                      ? 'ring-2 ring-knitup-gray shadow-xl'
                      : 'ring-1 ring-transparent hover:ring-knitup-lighter shadow-sm hover:shadow-md'
                  }`}
                  aria-label={`Choose ${c.label}`}
                  aria-pressed={isSelected}
                >
                  <div
                    className="overflow-hidden rounded-card bg-knitup-bgSoft mb-4 relative"
                    style={{ aspectRatio: '1 / 1' }}
                  >
                    <motion.img
                      src={c.imageUrl}
                      alt={c.label}
                      className="w-full h-full object-cover"
                      whileHover={{ scale: 1.04 }}
                      transition={{ duration: 0.4 }}
                      onError={(e) => {
                        // Graceful fallback if construction asset is missing.
                        (e.currentTarget as HTMLImageElement).style.display = 'none';
                      }}
                    />
                    <AnimatePresence>
                      {isSelected && (
                        <motion.div
                          key="check"
                          initial={{ opacity: 0, scale: 0.6 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0 }}
                          transition={{ duration: 0.25 }}
                          className="absolute top-3 right-3 w-9 h-9 rounded-full bg-knitup-gray text-white flex items-center justify-center shadow-md"
                          aria-hidden="true"
                        >
                          <CheckOutlined />
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                  <h3 className="text-h3 font-semibold text-knitup-gray text-center mb-2">
                    {c.label}
                  </h3>
                  <p className="text-knitup-text text-sm leading-relaxed">{c.description}</p>
                </motion.button>
              );
            })}
          </div>
        )}
      </div>
    </>
  );
}
