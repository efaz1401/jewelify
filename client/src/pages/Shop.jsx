import { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { SlidersHorizontal, X } from 'lucide-react';
import { api } from '../api/client.js';
import ProductCard from '../components/ProductCard.jsx';
import PageTransition from '../components/PageTransition.jsx';
import Loader from '../components/Loader.jsx';
import Seo from '../seo/Seo.jsx';

const MATERIALS = ['gold', 'silver', 'rose-gold', 'platinum', 'pearl', 'diamond', 'gemstone'];
const STYLES = ['stud', 'hoop', 'drop', 'dangle', 'chandelier', 'huggie', 'threader', 'ear-cuff'];

export default function Shop() {
  const [params, setParams] = useSearchParams();
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [total, setTotal] = useState(0);
  const [pages, setPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [filtersOpen, setFiltersOpen] = useState(false);

  const filters = useMemo(
    () => ({
      q: params.get('q') || '',
      category: params.get('category') || '',
      material: params.get('material') || '',
      style: params.get('style') || '',
      minPrice: params.get('minPrice') || '',
      maxPrice: params.get('maxPrice') || '',
      discounted: params.get('discounted') || '',
      sort: params.get('sort') || 'newest',
      page: Number(params.get('page') || 1),
    }),
    [params]
  );

  const setFilter = (patch) => {
    const next = new URLSearchParams(params);
    Object.entries(patch).forEach(([k, v]) => {
      if (v === '' || v === undefined || v === null) next.delete(k);
      else next.set(k, String(v));
    });
    if (!('page' in patch)) next.delete('page');
    setParams(next);
  };

  const clearFilters = () => setParams({});

  useEffect(() => {
    api.get('/categories').then((r) => setCategories(r.data.categories));
  }, []);

  useEffect(() => {
    setLoading(true);
    const qs = new URLSearchParams(filters).toString();
    api
      .get(`/products?${qs}`)
      .then((r) => {
        setProducts(r.data.products);
        setTotal(r.data.total);
        setPages(r.data.pages);
      })
      .finally(() => setLoading(false));
  }, [filters]);

  const activeCount = Object.entries(filters).filter(([k, v]) => v && !['sort', 'page'].includes(k)).length;

  return (
    <PageTransition>
      {/* Category-filtered views canonicalize to their landing page to avoid duplicate indexing */}
      <Seo
        title="Shop Earrings Online in Bangladesh"
        description="Browse all earrings — studs, hoops, drops, dangles & pearls. Trendy, skin-friendly designs from ৳250 with cash on delivery across Bangladesh."
        path={filters.category ? `/category/${filters.category}` : '/shop'}
      />
      <div className="mx-auto max-w-7xl px-4 py-10 lg:px-8">
        <div className="mb-8">
          <p className="text-xs uppercase tracking-widest text-accent-600">Cash on delivery · Nationwide</p>
          <h1 className="font-display text-4xl font-semibold md:text-5xl">Shop earrings</h1>
        </div>

        <div className="mb-6 flex flex-wrap items-center gap-3">
          <button
            onClick={() => setFiltersOpen((v) => !v)}
            className="btn-outline !py-2 !px-4 text-sm"
          >
            <SlidersHorizontal className="h-4 w-4" />
            Filters {activeCount > 0 && <span className="ml-1 rounded-full bg-accent-500 px-2 text-[11px] text-white">{activeCount}</span>}
          </button>

          <input
            value={filters.q}
            onChange={(e) => setFilter({ q: e.target.value })}
            placeholder="Search earrings…"
            className="input max-w-xs !py-2 text-sm"
          />

          <div className="ml-auto flex items-center gap-2">
            <span className="text-xs text-ink-400">{total} results</span>
            <select
              value={filters.sort}
              onChange={(e) => setFilter({ sort: e.target.value })}
              className="input !py-2 !pr-8 !w-auto text-sm"
            >
              <option value="newest">Newest</option>
              <option value="price-asc">Price: Low to high</option>
              <option value="price-desc">Price: High to low</option>
              <option value="rating-desc">Top rated</option>
            </select>
          </div>
        </div>

        <div className="grid gap-8 lg:grid-cols-[260px_1fr]">
          <motion.aside
            initial={false}
            animate={{ height: filtersOpen ? 'auto' : 0, opacity: filtersOpen ? 1 : 0 }}
            className="lg:!h-auto lg:!opacity-100 overflow-hidden lg:overflow-visible"
          >
            <div className="space-y-6 rounded-2xl border border-ink-100 bg-white p-5">
              <div className="flex items-center justify-between">
                <h3 className="font-medium">Filters</h3>
                {activeCount > 0 && (
                  <button onClick={clearFilters} className="text-xs text-ink-400 hover:text-ink-900 flex items-center gap-1">
                    <X className="h-3 w-3" /> Clear
                  </button>
                )}
              </div>

              <div>
                <h4 className="mb-2 text-xs font-semibold uppercase tracking-wider text-ink-400">Category</h4>
                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() => setFilter({ category: '' })}
                    className={`chip ${!filters.category ? 'bg-ink-900 text-white border-ink-900' : ''}`}
                  >
                    All
                  </button>
                  {categories.map((c) => (
                    <button
                      key={c._id}
                      onClick={() => setFilter({ category: c.slug })}
                      className={`chip ${filters.category === c.slug ? 'bg-ink-900 text-white border-ink-900' : ''}`}
                    >
                      {c.name}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="mb-2 text-xs font-semibold uppercase tracking-wider text-ink-400">Material</h4>
                <div className="flex flex-wrap gap-2">
                  {MATERIALS.map((m) => (
                    <button
                      key={m}
                      onClick={() => setFilter({ material: filters.material === m ? '' : m })}
                      className={`chip capitalize ${filters.material === m ? 'bg-ink-900 text-white border-ink-900' : ''}`}
                    >
                      {m.replace('-', ' ')}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="mb-2 text-xs font-semibold uppercase tracking-wider text-ink-400">Style</h4>
                <div className="flex flex-wrap gap-2">
                  {STYLES.map((s) => (
                    <button
                      key={s}
                      onClick={() => setFilter({ style: filters.style === s ? '' : s })}
                      className={`chip capitalize ${filters.style === s ? 'bg-ink-900 text-white border-ink-900' : ''}`}
                    >
                      {s.replace('-', ' ')}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="mb-2 text-xs font-semibold uppercase tracking-wider text-ink-400">Price</h4>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    min="0"
                    placeholder="Min"
                    value={filters.minPrice}
                    onChange={(e) => setFilter({ minPrice: e.target.value })}
                    className="input !py-1.5 text-sm"
                  />
                  <span className="text-ink-400">–</span>
                  <input
                    type="number"
                    min="0"
                    placeholder="Max"
                    value={filters.maxPrice}
                    onChange={(e) => setFilter({ maxPrice: e.target.value })}
                    className="input !py-1.5 text-sm"
                  />
                </div>
              </div>

              <label className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={filters.discounted === 'true'}
                  onChange={(e) => setFilter({ discounted: e.target.checked ? 'true' : '' })}
                />
                On sale only
              </label>
            </div>
          </motion.aside>

          <div>
            {loading ? (
              <Loader label="Loading products" />
            ) : products.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-ink-200 p-16 text-center text-ink-400">
                No earrings match these filters.
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4">
                {products.map((p, i) => (
                  <ProductCard key={p._id} product={p} index={i} />
                ))}
              </div>
            )}

            {pages > 1 && (
              <div className="mt-10 flex justify-center gap-2">
                {Array.from({ length: pages }).map((_, i) => {
                  const p = i + 1;
                  return (
                    <button
                      key={p}
                      onClick={() => setFilter({ page: p })}
                      className={`h-9 w-9 rounded-full text-sm ${
                        filters.page === p ? 'bg-ink-900 text-white' : 'bg-white border border-ink-200 hover:bg-ink-50'
                      }`}
                    >
                      {p}
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </PageTransition>
  );
}
