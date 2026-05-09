import { useMemo } from 'react';
import { useSelectionStore } from '@/store/selection';
import type { SilhouetteSize } from '@/types';

// Size table with cm/in toggle. PRD §6.2 / §6.8.
// Conversion: 1 cm = 0.393700787 in.

const CM_TO_IN = 0.393700787;
const COLS = [
  { key: 'length', label: 'Length', tag: 'A' },
  { key: 'chest', label: 'Chest', tag: 'B' },
  { key: 'shoulder', label: 'Shoulder', tag: 'C' },
  { key: 'sleeveLength', label: 'Sleeve length', tag: 'D1+D2' },
  { key: 'bottomOpening', label: 'Bottom opening', tag: 'E' },
] as const;

function fmt(value: number, unit: 'cm' | 'in') {
  const v = unit === 'in' ? value * CM_TO_IN : value;
  return v.toFixed(unit === 'in' ? 2 : 1);
}

export function SizeTable({ sizes }: { sizes: SilhouetteSize[] }) {
  const unit = useSelectionStore((s) => s.selection.unit);
  const toggleUnit = useSelectionStore((s) => s.toggleUnit);

  const rows = useMemo(() => sizes, [sizes]);

  return (
    <div className="overflow-x-auto" role="region" aria-label="Size measurements">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-knitup-lighter">
            <th className="py-3 px-3 text-left">
              <button
                type="button"
                onClick={toggleUnit}
                className="rounded-pill border border-knitup-lighter px-3 py-1 text-knitup-gray hover:bg-knitup-bgSoft transition-colors duration-fast"
                aria-label={`Switch unit to ${unit === 'cm' ? 'inches' : 'centimeters'}`}
              >
                <span className={unit === 'cm' ? 'font-semibold' : 'text-knitup-light'}>cm</span>
                <span className="px-1 text-knitup-light">|</span>
                <span className={unit === 'in' ? 'font-semibold' : 'text-knitup-light'}>in</span>
              </button>
            </th>
            {COLS.map((c) => (
              <th key={c.key} className="py-3 px-3 text-left font-semibold text-knitup-gray">
                <div>{c.label}</div>
                <div className="text-knitup-light text-xs font-normal">{c.tag}</div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr
              key={row.size}
              className={i % 2 === 1 ? 'bg-knitup-bgSoft/40' : ''}
            >
              <td className="py-3 px-3 font-semibold text-knitup-gray">{row.size}</td>
              {COLS.map((c) => (
                <td key={c.key} className="py-3 px-3 text-knitup-text tabular-nums">
                  {fmt(row[c.key], unit)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
