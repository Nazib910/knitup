import { useState } from 'react';
import { Button, Tooltip, App as AntdApp } from 'antd';
import {
  ShoppingCartOutlined,
  ShopOutlined,
  EditOutlined,
  DollarOutlined,
  DeleteOutlined,
} from '@ant-design/icons';
import { motion, AnimatePresence } from 'framer-motion';
import dayjs from 'dayjs';
import { useNavigate } from 'react-router-dom';
import type { Design } from '@/types';
import { useCollectionStore } from '@/store/collection';
import { useSelectionStore } from '@/store/selection';

// Single design card on the My Collection page. PRD §6.9.
// Header: name + $ icon + edit (✏️) icon
// Sub: material | construction | color | gauge breadcrumb
// Body: image carousel (4 dots paginator)
// Footer: [🛒 Add to Cart] [🛍️ Add to Store]
// Meta: created/expires dates

export function CollectionCard({ design }: { design: Design }) {
  const navigate = useNavigate();
  const { notification, modal } = AntdApp.useApp();
  const removeDesign = useCollectionStore((s) => s.removeDesign);
  const addToCart = useCollectionStore((s) => s.addToCart);
  const setSelection = useSelectionStore((s) => s.setSelection);

  const thumbs = design.thumbnails.length > 0 ? design.thumbnails : [
    '/silhouettes/mens-oversized-crew.svg',
  ];
  const [activeThumb, setActiveThumb] = useState(0);

  const onAddToCart = () => {
    addToCart({
      designId: design.designId,
      qtyBySize: { M: 1 },
      totalUsd: 118,
    });
    notification.success({
      message: 'Added to your cart',
      description: design.name,
      placement: 'topRight',
    });
  };

  const onAddToStore = () => {
    notification.success({
      message: 'Added to your store',
      description: 'Visual stub — Shopify integration is mocked in v0 (PRD §17 Q4).',
      placement: 'topRight',
    });
  };

  const onEdit = () => {
    setSelection({
      silhouetteUuid: design.silhouetteUuid,
      materialTier: design.materialTier,
      constructionKey: design.constructionKey,
      stitchUuid: design.stitchUuid,
      gauge: design.gauge,
      colorUuid: design.colorUuid,
    });
    navigate('/design/sizeAndQuantity');
  };

  const onDelete = () => {
    modal.confirm({
      title: 'Remove this design?',
      content: 'This cannot be undone — the design will be permanently removed from your Collection.',
      okText: 'Remove',
      okButtonProps: { danger: true },
      cancelText: 'Cancel',
      onOk: () => {
        removeDesign(design.designId);
        notification.info({
          message: 'Design removed',
          description: design.name,
          placement: 'topRight',
        });
      },
    });
  };

  const expires = dayjs(design.expiresAt);
  const created = dayjs(design.createdAt);

  return (
    <motion.article
      layout
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.96 }}
      transition={{ duration: 0.3, ease: [0.645, 0.045, 0.355, 1] }}
      className="bg-white rounded-card overflow-hidden border border-knitup-lighter/60 hover:shadow-md transition-shadow duration-300"
    >
      {/* Top row: name + $ + edit + delete */}
      <header className="flex items-start justify-between gap-2 px-4 pt-4">
        <div className="min-w-0">
          <h3 className="font-semibold text-knitup-gray text-sm leading-tight truncate" title={design.name}>
            {design.name}
          </h3>
          <p className="text-knitup-light text-xs mt-1 truncate">
            {design.materialTier} | {prettyConstruction(design.constructionKey)} | {colorName(design.colorUuid)} | {design.gauge}
          </p>
        </div>
        <div className="flex items-center gap-1 flex-none">
          <Tooltip title="Pricing details">
            <button type="button" aria-label="View pricing details" className="w-7 h-7 rounded-pill text-knitup-gray hover:bg-knitup-bgSoft transition-colors flex items-center justify-center">
              <DollarOutlined />
            </button>
          </Tooltip>
          <Tooltip title="Edit design">
            <button type="button" onClick={onEdit} aria-label="Edit design" className="w-7 h-7 rounded-pill text-knitup-gray hover:bg-knitup-bgSoft transition-colors flex items-center justify-center">
              <EditOutlined />
            </button>
          </Tooltip>
          <Tooltip title="Delete">
            <button type="button" onClick={onDelete} aria-label="Delete design" className="w-7 h-7 rounded-pill text-knitup-gray hover:bg-red-50 hover:text-red-500 transition-colors flex items-center justify-center">
              <DeleteOutlined />
            </button>
          </Tooltip>
        </div>
      </header>

      {/* Image carousel */}
      <div className="relative aspect-square bg-knitup-bgSoft mt-3 overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.img
            key={activeThumb}
            src={thumbs[activeThumb]}
            alt={`${design.name} — view ${activeThumb + 1}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="w-3/4 h-3/4 absolute inset-0 m-auto object-contain"
          />
        </AnimatePresence>
        {/* Color tint overlay using selected color hex */}
        <div
          className="absolute inset-0 mix-blend-multiply pointer-events-none opacity-60"
          style={{ backgroundColor: hexFromColorUuid(design.colorUuid) }}
          aria-hidden="true"
        />
        {/* Pagination dots */}
        <div className="absolute bottom-3 inset-x-0 flex items-center justify-center gap-1.5">
          {Array.from({ length: 4 }).map((_, i) => (
            <button
              key={i}
              type="button"
              onClick={() => setActiveThumb(i % thumbs.length)}
              aria-label={`View ${i + 1}`}
              className={`w-1.5 h-1.5 rounded-pill transition-all ${
                activeThumb === i % thumbs.length
                  ? 'bg-knitup-gray w-4'
                  : 'bg-knitup-light/50'
              }`}
            />
          ))}
        </div>
      </div>

      {/* Action row */}
      <div className="flex gap-2 px-4 py-3 border-b border-knitup-lighter/60">
        <Button
          icon={<ShoppingCartOutlined />}
          onClick={onAddToCart}
          className="flex-1"
        >
          Add to Cart
        </Button>
        <Button
          icon={<ShopOutlined />}
          onClick={onAddToStore}
          className="flex-1"
        >
          Add to Store
        </Button>
      </div>

      {/* Meta */}
      <footer className="px-4 py-3 text-knitup-light text-xs space-y-0.5">
        <div>Expires: {expires.format('D MMM, YYYY')}</div>
        <div>Created: {created.format('D MMM, YYYY')}</div>
      </footer>
    </motion.article>
  );
}

// -- Small helpers (visual-only labels) -------------------------------------

function prettyConstruction(k: string) {
  switch (k) {
    case 'graphicJacquard': return 'Jacquard';
    case 'stitchPattern': return 'Cable';
    case 'embroidery': return 'Embroidery';
    default: return k;
  }
}

// We don't have access to the colors fixture here without an import.
// For label purposes we keep a minimal lookup; falling back to the uuid is ok.
function colorName(uuid: string) {
  const map: Record<string, string> = {
    'co-029': 'Fuchsia',
    'co-024': 'Salmon',
    'co-038': 'Cobalt',
    'co-043': 'Forest',
  };
  return map[uuid] ?? uuid;
}

function hexFromColorUuid(uuid: string): string {
  // Approximate hex per uuid for the tint overlay; falls back to neutral.
  const map: Record<string, string> = {
    'co-029': '#e07ac0',
    'co-006': '#73604c',
    'co-024': '#e07a70',
    'co-038': '#4a8ad4',
    'co-043': '#3a7a4a',
  };
  return map[uuid] ?? '#dedede';
}
