import { useEffect, useState } from 'react';
import { api } from '../api/client.js';
import ProductCard from '../components/ProductCard.jsx';
import PageTransition from '../components/PageTransition.jsx';
import Loader from '../components/Loader.jsx';
import Seo from '../seo/Seo.jsx';

export default function Deals() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get('/products?discounted=true&limit=60&sort=price-asc')
      .then((r) => setProducts(r.data.products))
      .finally(() => setLoading(false));
  }, []);

  return (
    <PageTransition>
      <Seo
        title="Earring Deals & Discounts in Bangladesh"
        description="Earrings on sale in Bangladesh — grab trendy studs, hoops and drops at discounted prices. Limited stock, cash on delivery available."
        path="/deals"
      />
      <div className="mx-auto max-w-7xl px-4 py-12 lg:px-8">
        <div className="rounded-3xl bg-gradient-to-r from-accent-50 via-white to-accent-50 p-10 text-center">
          <p className="text-xs uppercase tracking-widest text-accent-600">Limited time</p>
          <h1 className="mt-2 font-display text-4xl font-semibold md:text-5xl">Earring deals & discounts</h1>
          <p className="mx-auto mt-3 max-w-xl text-ink-600">
            Save on our most-loved pairs. New markdowns every week.
          </p>
        </div>

        {loading ? (
          <Loader label="Finding deals" />
        ) : products.length === 0 ? (
          <p className="py-16 text-center text-ink-400">No current deals — check back soon.</p>
        ) : (
          <div className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {products.map((p, i) => (
              <ProductCard key={p._id} product={p} index={i} />
            ))}
          </div>
        )}
      </div>
    </PageTransition>
  );
}
