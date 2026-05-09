import { useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Drawer, Button, Empty } from 'antd';
import { FilterOutlined } from '@ant-design/icons';
import { useSilhouettes } from '@/hooks/useSilhouettes';
import { SilhouetteCard } from '@/components/studio/SilhouetteCard';
import { StudioFilters } from '@/components/studio/StudioFilters';
import { useResponsive } from '@/hooks/useResponsive';

// PRD §6.1 — Studio (silhouette grid).
// Desktop: 248px sidebar + 4-col grid. Mobile: Filters drawer + 2-col grid.
export default function StudioPage() {
  const [category, setCategory] = useState('all');
  const [query, setQuery] = useState('');
  const [drawerOpen, setDrawerOpen] = useState(false);
  const { isMobile } = useResponsive();
  const { data, loading } = useSilhouettes(category);

  const filtered = useMemo(() => {
    if (!data) return [];
    const q = query.trim().toLowerCase();
    return q ? data.filter((s) => s.name.toLowerCase().includes(q)) : data;
  }, [data, query]);

  const filters = (
    <StudioFilters
      query={query}
      onQueryChange={setQuery}
      category={category}
      onCategoryChange={(c) => {
        setCategory(c);
        setDrawerOpen(false);
      }}
    />
  );

  return (
    <div className="max-w-container mx-auto px-5 py-6 lg:py-8">
      {isMobile && (
        <div className="mb-4 flex items-center gap-2">
          <Button
            icon={<FilterOutlined />}
            onClick={() => setDrawerOpen(true)}
            aria-label="Open filters"
          >
            Filters
          </Button>
          {category !== 'all' && (
            <span className="text-knitup-light text-sm">Category: {category}</span>
          )}
        </div>
      )}

      <div className="grid grid-cols-12 gap-6">
        {!isMobile && (
          <aside className="col-span-12 md:col-span-3 lg:col-span-2" aria-label="Filters">
            {filters}
          </aside>
        )}

        <section
          className="col-span-12 md:col-span-9 lg:col-span-10"
          aria-label="Silhouette catalogue"
          aria-busy={loading}
        >
          {loading ? (
            <div
              className="grid gap-6 grid-cols-2 md:grid-cols-3 lg:grid-cols-4"
              aria-hidden="true"
            >
              {Array.from({ length: 8 }).map((_, i) => (
                <div
                  key={i}
                  className="rounded-card bg-knitup-bgSoft animate-pulse"
                  style={{ aspectRatio: '1 / 1' }}
                />
              ))}
            </div>
          ) : filtered.length === 0 ? (
            <Empty description="No silhouettes match your filters." />
          ) : (
            <motion.div
              className="grid gap-6 grid-cols-2 md:grid-cols-3 lg:grid-cols-4"
              initial="hidden"
              animate="show"
              variants={{
                hidden: { opacity: 1 },
                show: { opacity: 1, transition: { staggerChildren: 0.04 } },
              }}
            >
              <AnimatePresence>
                {filtered.map((s) => (
                  <motion.div
                    key={s.uuid}
                    variants={{
                      hidden: { opacity: 0, y: 12 },
                      show: { opacity: 1, y: 0 },
                    }}
                    transition={{ duration: 0.35, ease: [0.645, 0.045, 0.355, 1] }}
                    layout
                  >
                    <SilhouetteCard silhouette={s} />
                  </motion.div>
                ))}
              </AnimatePresence>
            </motion.div>
          )}
        </section>
      </div>

      <Drawer
        title="Filters"
        placement="left"
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        width={300}
      >
        {filters}
      </Drawer>
    </div>
  );
}
