import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, App as AntdApp } from 'antd';
import { motion, AnimatePresence } from 'framer-motion';
import { CloseOutlined, InfoCircleOutlined } from '@ant-design/icons';
import { AnimatedCheckmark } from '@/components/ui/AnimatedCheckmark';
import { useSelectionStore, selectTotalQty } from '@/store/selection';
import { useCollectionStore } from '@/store/collection';
import { useSilhouette } from '@/hooks/useSilhouettes';
import type { SizeKey } from '@/types';

// Step 7: Size & Quantity. PRD §6.8.
// Left: Measurements / 3D Rendering toggle (3D arrives in P3-P4).
// Right: per-size qty steppers + cm/in toggle + pricing tiers + Add to Cart.

const SIZES: SizeKey[] = ['XXS', 'XS', 'S', 'M', 'L', 'XL', 'XXL', 'XXXL'];

const PRICING_TIERS = [
  { label: '1 - 19 pcs', sub: 'Unlimited colorways & sizes', usd: 118.0, threshold: 1 },
  { label: '20 - 99 pcs', sub: 'Max. 1 colorway & 3 sizes', usd: 56.0, threshold: 20 },
  { label: '100 pcs & up', sub: 'Max. 2 colorway & 6 sizes', usd: 28.0, threshold: 100 },
];

function tierForQty(qty: number) {
  return [...PRICING_TIERS].reverse().find((t) => qty >= t.threshold) ?? PRICING_TIERS[0];
}

export default function SizeAndQuantityPage() {
  const navigate = useNavigate();
  const { notification } = AntdApp.useApp();
  const selection = useSelectionStore((s) => s.selection);
  const setQty = useSelectionStore((s) => s.setQty);
  const totalQty = useSelectionStore(selectTotalQty);
  const { data: silhouette } = useSilhouette(selection.silhouetteUuid ?? undefined);
  const saveDesign = useCollectionStore((s) => s.saveDesign);
  const addToCart = useCollectionStore((s) => s.addToCart);
  const [savedToastDismissed, setSavedToastDismissed] = useState(false);

  const tier = tierForQty(totalQty);
  const subtotal = totalQty * tier.usd;

  // Auto-save the design on mount (PRD §6.8 "Design Saved" toast).
  useEffect(() => {
    if (!silhouette || !selection.silhouetteUuid) return;
    const designId = `d-${selection.silhouetteUuid}-${Date.now()}`;
    saveDesign({
      designId,
      name: silhouette.name,
      silhouetteUuid: selection.silhouetteUuid,
      materialTier: selection.materialTier ?? 'Bliss',
      constructionKey: selection.constructionKey ?? 'stitchPattern',
      stitchUuid: selection.stitchUuid ?? 'st-001',
      gauge: selection.gauge ?? '12GG',
      colorUuid: selection.colorUuid ?? 'co-001',
      thumbnails: [silhouette.thumbUrl],
      createdAt: new Date().toISOString(),
      expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 180).toISOString(),
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [silhouette?.uuid]);

  const onAddToCart = () => {
    if (totalQty === 0) return;
    const designId = `d-${selection.silhouetteUuid}-${Date.now()}`;
    addToCart({ designId, qtyBySize: selection.qtyBySize, totalUsd: subtotal });
    notification.success({
      message: 'Added to your cart',
      description: `${totalQty} pcs · $${subtotal.toFixed(2)}`,
      placement: 'topRight',
      duration: 4,
    });
  };

  return (
    <>
      {/* Breadcrumb is rendered by EditorLayout. */}

      {/* Design Saved toast (PRD §6.8) */}
      <AnimatePresence>
        {!savedToastDismissed && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4 }}
            className="fixed top-[100px] left-1/2 -translate-x-1/2 z-40 bg-white border border-knitup-lighter rounded-card shadow-lg px-6 py-4 max-w-md"
            role="status"
            aria-live="polite"
          >
            <div className="flex items-start gap-3">
              <div className="mt-0.5">
                <AnimatedCheckmark size={22} />
              </div>
              <div className="flex-1">
                <p className="font-semibold text-knitup-gray">Design Saved</p>
                <p className="text-sm text-knitup-text mt-1">
                  This design is temporarily stored in <strong>My Collection</strong>. Please{' '}
                  <a href="/auth/signup" className="underline">sign up/log in</a> to your KnitStudio
                  account to have the design saved for production.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setSavedToastDismissed(true)}
                aria-label="Dismiss"
                className="text-knitup-light hover:text-knitup-gray"
              >
                <CloseOutlined />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="max-w-container mx-auto px-5 py-8 lg:py-12 grid grid-cols-12 gap-6 lg:gap-10">
        {/* Left: preview + pricing tiers */}
        <div className="col-span-12 lg:col-span-5">
          <div className="bg-knitup-bgSoft rounded-card p-8 mb-6 flex items-center justify-center" style={{ aspectRatio: '1 / 1' }}>
            <img
              src={silhouette?.thumbUrl ?? '/silhouettes/mens-oversized-crew.svg'}
              alt={silhouette?.name ?? ''}
              className="w-3/4 h-auto"
            />
          </div>
          <p className="text-knitup-light text-xs mb-6 flex items-start gap-2">
            <InfoCircleOutlined className="mt-0.5" />
            <span>
              Silhouette graphic is for reference only. 3D Rendering toggle lands in P3.
            </span>
          </p>

          <div className="space-y-4">
            {PRICING_TIERS.map((t) => (
              <div
                key={t.label}
                className={`border rounded-card p-4 transition-colors ${
                  tier.label === t.label
                    ? 'border-knitup-gray bg-white'
                    : 'border-knitup-lighter'
                }`}
              >
                <p className="font-semibold text-knitup-gray">{t.label}</p>
                <p className="text-knitup-light text-sm">{t.sub}</p>
                <p className="text-knitup-gray font-semibold mt-2">USD {t.usd.toFixed(2)}/pc</p>
              </div>
            ))}
          </div>
        </div>

        {/* Right: size table + cart */}
        <div className="col-span-12 lg:col-span-7">
          <table className="w-full text-sm" role="table" aria-label="Size and quantity">
            <thead>
              <tr className="border-b border-knitup-lighter">
                <th className="py-3 px-2 text-left">
                  <span className="rounded-pill border border-knitup-lighter px-3 py-1 inline-block text-knitup-gray">
                    cm <span className="text-knitup-light">|</span> in
                  </span>
                </th>
                <th className="py-3 px-2 text-left text-knitup-gray font-semibold">Length</th>
                <th className="py-3 px-2 text-left text-knitup-gray font-semibold">Chest</th>
                <th className="py-3 px-2 text-left text-knitup-gray font-semibold">Shoulder</th>
                <th className="py-3 px-2 text-left text-knitup-gray font-semibold">Checkout Qty</th>
              </tr>
            </thead>
            <tbody>
              {SIZES.map((sz, i) => {
                const row = silhouette?.sizes.find((s) => s.size === sz);
                const qty = selection.qtyBySize[sz] ?? 0;
                return (
                  <tr key={sz} className={i % 2 === 1 ? 'bg-knitup-bgSoft/40' : ''}>
                    <td className="py-3 px-2 font-semibold text-knitup-gray">{sz}</td>
                    <td className="py-3 px-2 tabular-nums text-knitup-text">{row?.length ?? '—'}</td>
                    <td className="py-3 px-2 tabular-nums text-knitup-text">{row?.chest ?? '—'}</td>
                    <td className="py-3 px-2 tabular-nums text-knitup-text">{row?.shoulder ?? '—'}</td>
                    <td className="py-3 px-2">
                      <QtyStepper value={qty} onChange={(v) => setQty(sz, v)} ariaLabel={`Quantity for size ${sz}`} />
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>

          {/* Totals */}
          <div className="mt-8 border-t border-knitup-lighter pt-6 space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-knitup-text">Total pieces</span>
              <span className="font-semibold text-knitup-gray tabular-nums">{totalQty} pcs</span>
            </div>
            <div className="flex justify-between">
              <span className="text-knitup-text">Sub-total</span>
              <span className="text-knitup-text tabular-nums">USD {subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-knitup-text">Embroidery Tape</span>
              <span className="text-knitup-text tabular-nums">USD 0.00</span>
            </div>
            <div className="flex justify-between text-base mt-3 pt-3 border-t border-knitup-lighter">
              <span className="font-semibold text-knitup-gray">Total Price</span>
              <motion.span
                key={subtotal}
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                className="font-semibold text-knitup-gray tabular-nums"
              >
                USD {subtotal.toFixed(2)}
              </motion.span>
            </div>
          </div>

          <Button
            type="primary"
            size="large"
            block
            disabled={totalQty === 0}
            onClick={onAddToCart}
            className="mt-6"
          >
            Add to Cart
          </Button>

          <Button
            type="link"
            block
            onClick={() => navigate('/design/collection')}
            className="mt-2 text-knitup-light"
          >
            Save and view in My Collection
          </Button>
        </div>
      </div>
    </>
  );
}

function QtyStepper({
  value,
  onChange,
  ariaLabel,
}: {
  value: number;
  onChange: (v: number) => void;
  ariaLabel: string;
}) {
  return (
    <div
      className="inline-flex items-center border border-knitup-lighter rounded-pill overflow-hidden"
      role="spinbutton"
      aria-valuenow={value}
      aria-valuemin={0}
      aria-label={ariaLabel}
    >
      <button
        type="button"
        onClick={() => onChange(Math.max(0, value - 1))}
        className="w-8 h-8 hover:bg-knitup-bgSoft transition-colors"
        aria-label="Decrease"
      >
        −
      </button>
      <input
        type="number"
        min={0}
        value={value}
        onChange={(e) => onChange(Math.max(0, Number(e.target.value) || 0))}
        className="w-12 text-center bg-transparent border-0 focus:outline-none tabular-nums"
      />
      <button
        type="button"
        onClick={() => onChange(value + 1)}
        className="w-8 h-8 hover:bg-knitup-bgSoft transition-colors"
        aria-label="Increase"
      >
        +
      </button>
    </div>
  );
}
