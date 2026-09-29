import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { api } from '../api/client.js';
import ProductCard from '../components/ProductCard.jsx';
import PageTransition from '../components/PageTransition.jsx';
import Loader from '../components/Loader.jsx';
import Seo from '../seo/Seo.jsx';
import { breadcrumbSchema, faqSchema } from '../seo/jsonLd.js';
import { CATEGORY_CONTENT, defaultCategoryContent } from '../content/categoryContent.js';

/**
 * Category landing page — /category/:slug
 * These are the SEO "money pages": each one targets a keyword like
 * "stud earrings price in bangladesh" with unique H1, copy, FAQ and schema.
 */
export default function Category() {
  const { slug } = useParams();
  const [category, setCategory] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [missing, setMissing] = useState(false);

  useEffect(() => {
    setLoading(true);
    setMissing(false);
    Promise.all([api.get('/categories'), api.get(`/products?category=${slug}&limit=48`)])
      .then(([catsRes, productsRes]) => {
        const cat = catsRes.data.categories.find((c) => c.slug === slug);
        if (!cat) setMissing(true);
        setCategory(cat || null);
        setProducts(productsRes.data.products);
      })
      .catch(() => setMissing(true))
      .finally(() => setLoading(false));
  }, [slug]);

  if (loading) return <Loader label="Loading collection" />;

  if (missing || !category) {
    return (
      <PageTransition>
        <Seo title="Collection not found" path={`/category/${slug}`} robots="noindex" />
        <div className="mx-auto max-w-xl px-4 py-24 text-center">
          <h1 className="font-display text-3xl font-semibold">Collection not found</h1>
          <p className="mt-2 text-ink-600">This category doesn’t exist — but plenty of pretty ones do.</p>
          <Link to="/categories" className="btn-primary mt-6 inline-flex">Browse categories</Link>
        </div>
      </PageTransition>
    );
  }

  const content = CATEGORY_CONTENT[slug] || defaultCategoryContent(category.name);
  const seoDescription = `${category.description || content.tagline} Trendy, skin-friendly designs with cash on delivery across Bangladesh.`;
  const seoJsonLd = [
    breadcrumbSchema([
      { name: 'Home', path: '/' },
      { name: 'Categories', path: '/categories' },
      { name: content.heading, path: `/category/${slug}` },
    ]),
    faqSchema(content.faqs),
  ];

  return (
    <PageTransition>
      <Seo
        title={`${content.heading} — Price in Bangladesh`}
        description={seoDescription}
        path={`/category/${slug}`}
        image={category.image}
        jsonLd={seoJsonLd}
      />

      <div className="mx-auto max-w-7xl px-4 py-10 lg:px-8">
        <nav className="mb-6 text-xs text-ink-400">
          <Link to="/" className="hover:text-ink-900">Home</Link> /{' '}
          <Link to="/categories" className="hover:text-ink-900">Categories</Link> /{' '}
          <span className="text-ink-900">{content.heading}</span>
        </nav>

        <header className="max-w-3xl">
          <p className="text-xs uppercase tracking-widest text-accent-600">{category.name} · Cash on delivery</p>
          <h1 className="mt-2 font-display text-4xl font-semibold md:text-5xl">{content.heading} in Bangladesh</h1>
          <p className="mt-3 text-lg text-ink-600">{content.tagline}</p>
        </header>

        <section className="mt-8 grid max-w-4xl gap-4 text-ink-600 leading-relaxed">
          {content.paragraphs.map((p, i) => (
            <p key={i}>{p}</p>
          ))}
        </section>

        <section className="mt-12">
          <div className="mb-6 flex items-end justify-between">
            <h2 className="font-display text-2xl font-semibold">Shop {content.heading.toLowerCase()}</h2>
            <Link to={`/shop?category=${slug}`} className="text-sm text-ink-600 hover:text-accent-600">
              Filter &amp; sort →
            </Link>
          </div>
          {products.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-ink-200 p-16 text-center text-ink-400">
              New {content.heading.toLowerCase()} dropping soon — check back!
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
              {products.map((p, i) => (
                <ProductCard key={p._id} product={p} index={i} />
              ))}
            </div>
          )}
        </section>

        <section className="mx-auto mt-16 max-w-3xl">
          <h2 className="font-display text-2xl font-semibold">Common questions about {content.heading.toLowerCase()}</h2>
          <div className="mt-5 space-y-3">
            {content.faqs.map((f, i) => (
              <details key={i} className="group rounded-2xl border border-ink-100 bg-white p-5">
                <summary className="cursor-pointer list-none font-medium text-ink-900 group-open:text-accent-600">
                  {f.q}
                </summary>
                <p className="mt-3 text-sm leading-relaxed text-ink-600">{f.a}</p>
              </details>
            ))}
          </div>
        </section>

        <motion.section
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-16 rounded-3xl bg-gradient-to-br from-ink-900 to-ink-600 p-10 text-center text-white"
        >
          <h2 className="font-display text-3xl">Still deciding?</h2>
          <p className="mx-auto mt-2 max-w-xl text-ink-100/80">
            Browse all earrings from ৳250 — cash on delivery, easy exchange, delivered anywhere in Bangladesh.
          </p>
          <Link to="/shop" className="btn-accent mt-6 inline-flex">
            Shop all earrings <ArrowRight className="h-4 w-4" />
          </Link>
        </motion.section>
      </div>
    </PageTransition>
  );
}
