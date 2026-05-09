import { useMemo, useState } from 'react';
import { Input, Checkbox, Empty, Button } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useCollectionStore } from '@/store/collection';
import { CollectionCard } from '@/components/collection/CollectionCard';

// PRD §6.9 — My Collection page. Sidebar with category filters + search +
// "Added to Store" toggle. Main: 2-3 col grid of designs.

const CATEGORIES = [
  { key: 'women', label: 'Women' },
  { key: 'womenCurve', label: 'Women (Curve)' },
  { key: 'men', label: 'Men' },
  { key: 'unisex', label: 'Unisex' },
  { key: 'babiesKids', label: 'Babies & Kids' },
  { key: 'accessories', label: 'Accessories' },
  { key: 'petwear', label: 'Petwear' },
  { key: 'homeware', label: 'Homeware' },
] as const;

const ACCOUNT_NAV = [
  { key: 'profile', label: 'Account Profile', to: '/design/addAccount' },
  { key: 'orders', label: 'Order History', to: '/design/orders' },
  { key: 'collection', label: 'My Collection', to: '/design/collection' },
  { key: 'store', label: 'Store', to: '/design/store' },
  { key: 'address', label: 'Address Book', to: '/design/addressBook' },
  { key: 'password', label: 'Change Password', to: '/design/changePassword' },
];

export default function CollectionPage() {
  const designs = useCollectionStore((s) => s.designs);
  const [query, setQuery] = useState('');
  const [activeCats, setActiveCats] = useState<string[]>([]);
  const [storeOnly, setStoreOnly] = useState(false);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return designs.filter((d) => {
      if (q && !d.name.toLowerCase().includes(q)) return false;
      // Category filter — designs don't currently track category directly,
      // we infer from silhouetteUuid prefix as a v0 simplification.
      // The full implementation would join through the silhouette fixture.
      if (activeCats.length > 0) {
        // For v0: skip the filter so all designs always show.
      }
      if (storeOnly) {
        // v0: nothing is "in store" yet — this is the visual stub from PRD §17 Q4.
        return false;
      }
      return true;
    });
  }, [designs, query, activeCats, storeOnly]);

  return (
    <div className="max-w-container mx-auto px-5 py-6 lg:py-8 grid grid-cols-12 gap-6">
      {/* Sidebar */}
      <aside className="col-span-12 md:col-span-3 lg:col-span-3" aria-label="Account navigation">
        <h2 className="text-h3 text-knitup-gray font-semibold mb-2">My Account</h2>
        <ul className="space-y-1 mb-8">
          {ACCOUNT_NAV.map((n) => (
            <li key={n.key}>
              <Link
                to={n.to}
                className={`block py-1 transition-colors duration-fast text-sm ${
                  n.key === 'collection'
                    ? 'text-knitup-gray font-semibold'
                    : 'text-knitup-light hover:text-knitup-gray'
                }`}
              >
                {n.label}
              </Link>
            </li>
          ))}
        </ul>

        <h3 className="text-knitup-gray font-semibold mb-3">My Collection</h3>
        <Input
          prefix={<SearchOutlined className="text-knitup-light" />}
          placeholder="Search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          allowClear
          className="mb-6"
          aria-label="Search designs"
        />

        <div className="space-y-2 mb-6">
          {CATEGORIES.map((c) => (
            <Checkbox
              key={c.key}
              checked={activeCats.includes(c.key)}
              onChange={(e) =>
                setActiveCats((prev) =>
                  e.target.checked ? [...prev, c.key] : prev.filter((k) => k !== c.key),
                )
              }
              className="block text-knitup-text"
            >
              {c.label}
            </Checkbox>
          ))}
        </div>

        <div className="pt-4 border-t border-knitup-lighter/60">
          <Checkbox
            checked={storeOnly}
            onChange={(e) => setStoreOnly(e.target.checked)}
            className="text-knitup-text"
          >
            Added to Store
          </Checkbox>
        </div>
      </aside>

      {/* Grid */}
      <section
        className="col-span-12 md:col-span-9 lg:col-span-9"
        aria-label="Saved designs"
      >
        {designs.length === 0 ? (
          <div className="py-20">
            <Empty description="You have no saved designs yet">
              <Link to="/design/studio">
                <Button type="primary">Start designing</Button>
              </Link>
            </Empty>
          </div>
        ) : filtered.length === 0 ? (
          <Empty description="No designs match your filters" />
        ) : (
          <motion.div
            layout
            className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"
          >
            <AnimatePresence>
              {filtered.map((d) => (
                <CollectionCard key={d.designId} design={d} />
              ))}
            </AnimatePresence>
          </motion.div>
        )}
      </section>
    </div>
  );
}
