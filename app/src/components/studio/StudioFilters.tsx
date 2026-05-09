import { Input, Radio, type RadioChangeEvent } from 'antd';
import { SearchOutlined } from '@ant-design/icons';

// Sidebar filters for the Studio page. PRD §6.1.
const CATEGORIES = [
  { key: 'all', label: 'All' },
  { key: 'women', label: 'Women' },
  { key: 'womenCurve', label: 'Women (Curve)' },
  { key: 'men', label: 'Men' },
  { key: 'unisex', label: 'Unisex' },
  { key: 'babiesKids', label: 'Babies & Kids' },
  { key: 'accessories', label: 'Accessories' },
  { key: 'petwear', label: 'Petwear' },
  { key: 'homeware', label: 'Homeware' },
] as const;

export interface StudioFiltersProps {
  query: string;
  onQueryChange: (q: string) => void;
  category: string;
  onCategoryChange: (c: string) => void;
}

export function StudioFilters({
  query,
  onQueryChange,
  category,
  onCategoryChange,
}: StudioFiltersProps) {
  const handleCat = (e: RadioChangeEvent) => onCategoryChange(e.target.value);

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-h3 text-knitup-gray font-semibold mb-4">Silhouettes</h2>
        <Input
          prefix={<SearchOutlined className="text-knitup-light" />}
          placeholder="Search"
          value={query}
          onChange={(e) => onQueryChange(e.target.value)}
          allowClear
          aria-label="Search silhouettes"
        />
      </div>
      <div>
        <h3 className="text-knitup-gray font-semibold mb-3">Categories</h3>
        <Radio.Group
          value={category}
          onChange={handleCat}
          className="flex flex-col gap-2"
          aria-label="Filter by category"
        >
          {CATEGORIES.map((c) => (
            <Radio key={c.key} value={c.key} className="text-knitup-text">
              {c.label}
            </Radio>
          ))}
        </Radio.Group>
      </div>
    </div>
  );
}
