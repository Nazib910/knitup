import { useNavigate, useParams } from 'react-router-dom';
import { Button, Result, Spin } from 'antd';
import { motion } from 'framer-motion';
import { Breadcrumb } from '@/components/wizard/Breadcrumb';
import { SizeTable } from '@/components/ui/SizeTable';
import { useSilhouette } from '@/hooks/useSilhouettes';
import { useSelectionStore } from '@/store/selection';

// Step 1: Silhouette overview. PRD §6.2.
// Layout: preview (left) + title/desc/Customise CTA (right) above the fold;
// size table + diagram below.
export default function SilhouetteOverview() {
  const { uuid } = useParams();
  const navigate = useNavigate();
  const { data, error, loading } = useSilhouette(uuid);
  const setSelection = useSelectionStore((s) => s.setSelection);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-32">
        <Spin />
      </div>
    );
  }

  if (error || !data) {
    return (
      <Result
        status="404"
        title="Silhouette not found"
        subTitle={error?.message ?? `No silhouette with id "${uuid}".`}
        extra={<Button onClick={() => navigate('/design/studio')}>Back to Studio</Button>}
      />
    );
  }

  const onCustomise = () => {
    setSelection({ silhouetteUuid: data.uuid });
    navigate('/design/material');
  };

  return (
    <>
      <Breadcrumb productName={data.name} stepName="Silhouette" stepIndex={1} />

      <div className="max-w-container mx-auto px-5 py-6 lg:py-10 grid grid-cols-12 gap-6 lg:gap-10">
        {/* Preview frame */}
        <div className="col-span-12 lg:col-span-7">
          <motion.div
            layoutId={`silhouette-${data.uuid}`}
            className="bg-knitup-bgSoft rounded-card flex items-center justify-center overflow-hidden"
            style={{ aspectRatio: '1 / 1' }}
          >
            <motion.img
              src={data.thumbUrl}
              alt={data.name}
              className="w-3/4 h-auto"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: [0.645, 0.045, 0.355, 1] }}
            />
          </motion.div>
        </div>

        {/* Info column */}
        <div className="col-span-12 lg:col-span-5 lg:pt-8">
          <h1 className="text-h1 font-display text-knitup-gray leading-tight">{data.name}</h1>
          <p className="mt-6 text-knitup-text leading-relaxed">{data.description}</p>
          <Button
            type="primary"
            size="large"
            block
            onClick={onCustomise}
            className="mt-8"
          >
            Customise
          </Button>
        </div>
      </div>

      {/* Below the fold: size table + diagram */}
      <div className="max-w-container mx-auto px-5 pb-16 grid grid-cols-12 gap-6 lg:gap-10">
        <div className="col-span-12 lg:col-span-7">
          <SizeTable sizes={data.sizes} />
        </div>
        <div className="col-span-12 lg:col-span-5">
          <div className="bg-knitup-bgSoft rounded-card p-6 flex flex-col items-center">
            <svg viewBox="0 0 320 240" className="w-full max-w-sm" aria-hidden="true">
              <text x="160" y="20" textAnchor="middle" fontSize="10" fill="#393939">C</text>
              <text x="200" y="34" textAnchor="middle" fontSize="10" fill="#393939">D1</text>
              <path
                d="M90,80 Q60,90 50,130 L80,170 M230,170 L260,130 Q250,90 220,80 L220,60 Q200,50 160,55 Q120,50 100,60 L100,80 Z"
                fill="none"
                stroke="#393939"
                strokeWidth="1.5"
              />
              <path d="M90,80 L100,170 L210,170 L220,80" fill="none" stroke="#393939" strokeWidth="1.5" />
              <path d="M50,130 L80,200 M260,130 L240,200" stroke="#b5b5b5" strokeDasharray="3 3" fill="none" />
              <text x="160" y="135" textAnchor="middle" fontSize="10" fill="#393939">A</text>
              <text x="160" y="180" textAnchor="middle" fontSize="10" fill="#393939">B</text>
              <text x="160" y="210" textAnchor="middle" fontSize="10" fill="#393939">E</text>
              <text x="270" y="160" textAnchor="middle" fontSize="10" fill="#393939">D2</text>
            </svg>
            <p className="mt-4 text-knitup-light text-xs flex items-center gap-2">
              <span aria-hidden="true">ⓘ</span>
              Silhouette illustration is for reference only.
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
