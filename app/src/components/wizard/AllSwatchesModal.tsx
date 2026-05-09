import { useMemo, useState } from 'react';
import { Modal, Input, Empty } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import { motion } from 'framer-motion';
import type { Swatch } from './SwatchCarousel';

// "View all" modal — PRD §6.5 carousel last slot opens this. Renders all
// swatches in a grid with search filter.

export interface AllSwatchesModalProps {
  open: boolean;
  onClose: () => void;
  title: string;
  swatches: Swatch[];
  selectedUuid: string | null;
  onSelect: (s: Swatch) => void;
  columns?: number;
}

export function AllSwatchesModal({
  open,
  onClose,
  title,
  swatches,
  selectedUuid,
  onSelect,
  columns = 6,
}: AllSwatchesModalProps) {
  const [query, setQuery] = useState('');

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return q ? swatches.filter((s) => s.name.toLowerCase().includes(q)) : swatches;
  }, [swatches, query]);

  return (
    <Modal
      open={open}
      onCancel={onClose}
      footer={null}
      title={title}
      width={720}
      destroyOnHidden
    >
      <Input
        prefix={<SearchOutlined className="text-knitup-light" />}
        placeholder={`Search ${title.toLowerCase()}`}
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        allowClear
        className="mb-4"
      />

      {filtered.length === 0 ? (
        <Empty description={`No ${title.toLowerCase()} match "${query}"`} />
      ) : (
        <div
          className="grid gap-3 max-h-[60vh] overflow-y-auto pr-1"
          style={{ gridTemplateColumns: `repeat(${columns}, 1fr)` }}
        >
          {filtered.map((s) => {
            const isColor = !!s.hex && !s.swatchUrl;
            const selected = selectedUuid === s.uuid;
            return (
              <motion.button
                key={s.uuid}
                type="button"
                onClick={() => {
                  onSelect(s);
                  onClose();
                }}
                whileHover={{ y: -2 }}
                whileTap={{ scale: 0.96 }}
                className={`group flex flex-col items-center text-center p-2 rounded-card transition-colors ${
                  selected ? 'bg-knitup-bgSoft' : 'hover:bg-knitup-bgSoft/60'
                }`}
                aria-pressed={selected}
                aria-label={s.name}
              >
                <div
                  className={`w-full rounded-pill overflow-hidden ${
                    selected ? 'ring-2 ring-knitup-gray ring-offset-2' : ''
                  }`}
                  style={{ aspectRatio: '1 / 1', backgroundColor: isColor ? s.hex : undefined }}
                >
                  {!isColor && s.swatchUrl && (
                    <img
                      src={s.swatchUrl}
                      alt=""
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                  )}
                </div>
                <span className="text-xs text-knitup-text mt-2 truncate w-full">{s.name}</span>
              </motion.button>
            );
          })}
        </div>
      )}
    </Modal>
  );
}
