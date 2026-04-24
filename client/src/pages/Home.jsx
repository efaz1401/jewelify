import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, useScroll, useTransform } from 'framer-motion';
import { ArrowRight, Sparkles, Shield, Truck, Gem } from 'lucide-react';
import { api } from '../api/client.js';
import ProductCard from '../components/ProductCard.jsx';
import PageTransition from '../components/PageTransition.jsx';

function ParallaxHero() {
  const ref = useRef(null);
  const { scrollY } = useScroll();
  const y1 = useTransform(scrollY, [0, 600], [0, -80]);
  const y2 = useTransform(scrollY, [0, 600], [0, -160]);
  const y3 = useTransform(scrollY, [0, 600], [0, -40]);
  const opacity = useTransform(scrollY, [0, 400], [1, 0]);
  const scale = useTransform(scrollY, [0, 600], [1, 1.08]);

  return (
    <section ref={ref} className="relative h-[92vh] min-h-[620px] w-full overflow-hidden bg-gradient-to-b from-ink-50 via-white to-accent-50">
      {/* Background decorative layers */}
      <motion.div
        style={{ y: y2, scale }}
        className="pointer-events-none absolute -top-20 -right-20 h-[600px] w-[600px] rounded-full bg-gradient-to-br from-accent-100 via-accent-200/70 to-transparent blur-3xl"
      />
      <motion.div
        style={{ y: y1 }}
        className="pointer-events-none absolute -bottom-40 -left-20 h-[500px] w-[500px] rounded-full bg-gradient-to-tr from-accent-200/60 to-transparent blur-3xl"
      />

      <motion.img
        src="https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=1600&q=80"
        alt=""
        aria-hidden="true"
        style={{ y: y3, opacity: 0.18 }}
        className="pointer-events-none absolute inset-0 h-full w-full object-cover"
      />

      <motion.div style={{ opacity }} className="relative z-10 mx-auto flex h-full max-w-7xl flex-col items-center justify-center px-4 text-center lg:px-8">
        <motion.span
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="chip mb-6"
        >
          <Sparkles className="h-3.5 w-3.5 text-accent-500" />
          New collection · Spring 2026
        </motion.span>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15, duration: 0.7 }}
          className="font-display text-5xl font-semibold leading-[1.05] sm:text-6xl md:text-7xl lg:text-8xl"
        >
          Earrings that tell<br />
          <span className="shimmer-text italic">your story.</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
          className="mt-6 max-w-2xl text-base text-ink-600 md:text-lg"
        >
          Handcrafted, ethically sourced, and made to be worn. From minimalist studs to statement
          chandeliers — discover your signature pair.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35 }}
          className="mt-8 flex flex-wrap items-center justify-center gap-3"
        >
          <Link to="/shop" className="btn-primary">
            Shop the collection
            <ArrowRight className="h-4 w-4" />
          </Link>
          <Link to="/deals" className="btn-outline">
            See deals
          </Link>
        </motion.div>

        {/* Floating earring accents */}
        <motion.div
          style={{ y: y1 }}
          className="pointer-events-none absolute left-8 top-24 hidden lg:block"
          animate={{ rotate: [0, 5, -5, 0] }}
          transition={{ duration: 8, repeat: Infinity }}
        >
          <div className="h-3 w-3 rounded-full bg-accent-500 shadow-glow" />
          <div className="ml-1 mt-16 h-4 w-4 rounded-full bg-gradient-to-br from-accent-300 to-accent-600 shadow-glow" />
        </motion.div>
        <motion.div
          style={{ y: y2 }}
          className="pointer-events-none absolute right-16 top-32 hidden lg:block"
          animate={{ rotate: [0, -8, 8, 0] }}
          transition={{ duration: 10, repeat: Infinity }}
        >
          <div className="h-3 w-3 rounded-full bg-accent-400 shadow-glow" />
          <div className="-mt-0.5 ml-0.5 mt-20 h-5 w-5 rounded-full bg-gradient-to-br from-accent-400 to-accent-700 shadow-glow" />
        </motion.div>
      </motion.div>
    </section>
  );
}

function Feature({ icon: Icon, title, desc }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      className="flex flex-col items-center gap-3 rounded-2xl border border-ink-100 bg-white/60 p-6 text-center backdrop-blur"
    >
      <span className="grid h-11 w-11 place-items-center rounded-full bg-accent-50 text-accent-600">
        <Icon className="h-5 w-5" />
      </span>
      <h3 className="font-display text-lg font-semibold">{title}</h3>
      <p className="text-sm text-ink-600">{desc}</p>
    </motion.div>
  );
}

function ParallaxStrip() {
  const { scrollY } = useScroll();
  const y = useTransform(scrollY, [800, 1800], [40, -80]);

  return (
    <section className="relative my-20 overflow-hidden">
      <motion.div style={{ y }} className="relative">
        <div className="relative h-[60vh] min-h-[380px] w-full overflow-hidden rounded-3xl bg-ink-900">
          <img
            src="https://images.unsplash.com/photo-1587467442604-5b1f05e5a81b?w=1600&q=80"
            alt=""
            aria-hidden="true"
            className="absolute inset-0 h-full w-full object-cover opacity-60"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-ink-900/70 via-ink-900/10 to-transparent" />
          <div className="relative z-10 flex h-full flex-col items-start justify-end p-8 text-white md:p-14">
            <h2 className="font-display text-4xl font-semibold md:text-6xl">
              Made to move<br />with you.
            </h2>
            <p className="mt-4 max-w-xl text-ink-100/90">
              Every pair is hand-finished. Hypoallergenic materials. Lifetime polishing. Because
              great earrings shouldn't just sit in a box.
            </p>
            <Link to="/about" className="mt-6 btn-accent">
              Our story <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </motion.div>
    </section>
  );
}

export default function Home() {
  const [featured, setFeatured] = useState([]);
  const [deals, setDeals] = useState([]);
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    (async () => {
      try {
        const [f, d, c] = await Promise.all([
          api.get('/products?featured=true&limit=8'),
          api.get('/products?discounted=true&limit=8'),
          api.get('/categories'),
        ]);
        setFeatured(f.data.products);
        setDeals(d.data.products);
        setCategories(c.data.categories);
      } catch {
        /* empty state */
      }
    })();
  }, []);

  return (
    <PageTransition>
      <ParallaxHero />

      <section className="mx-auto max-w-7xl px-4 py-16 lg:px-8">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Feature icon={Sparkles} title="Handcrafted" desc="Each pair made by hand by skilled artisans." />
          <Feature icon={Gem} title="Ethically sourced" desc="Conflict-free stones, recycled metals." />
          <Feature icon={Truck} title="Free shipping $100+" desc="Fast, tracked delivery worldwide." />
          <Feature icon={Shield} title="Secure checkout" desc="PCI-compliant payments via Stripe." />
        </div>
      </section>

      {/* Categories */}
      <section className="mx-auto max-w-7xl px-4 py-8 lg:px-8">
        <div className="mb-8 flex items-end justify-between">
          <div>
            <p className="text-xs uppercase tracking-widest text-accent-600">Shop by style</p>
            <h2 className="font-display text-3xl font-semibold md:text-4xl">Find your silhouette</h2>
          </div>
          <Link to="/categories" className="text-sm text-ink-600 hover:text-accent-600">View all →</Link>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {categories.slice(0, 6).map((c, i) => (
            <motion.div
              key={c._id}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
            >
              <Link to={`/shop?category=${c.slug}`} className="card-lift group block overflow-hidden rounded-2xl bg-ink-50">
                <div className="relative aspect-[4/3] overflow-hidden">
                  <motion.img
                    src={c.image || 'https://placehold.co/800x600'}
                    alt={c.name}
                    className="h-full w-full object-cover"
                    whileHover={{ scale: 1.05 }}
                    transition={{ duration: 0.6 }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-ink-900/60 to-transparent" />
                  <div className="absolute bottom-4 left-4 text-white">
                    <h3 className="font-display text-2xl font-semibold">{c.name}</h3>
                    <p className="text-xs uppercase tracking-wider opacity-80">Shop {c.name.toLowerCase()} →</p>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </section>

      <ParallaxStrip />

      {/* Featured */}
      <section className="mx-auto max-w-7xl px-4 py-8 lg:px-8">
        <div className="mb-8 flex items-end justify-between">
          <div>
            <p className="text-xs uppercase tracking-widest text-accent-600">Bestsellers</p>
            <h2 className="font-display text-3xl font-semibold md:text-4xl">Featured earrings</h2>
          </div>
          <Link to="/shop" className="text-sm text-ink-600 hover:text-accent-600">Shop all →</Link>
        </div>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {featured.map((p, i) => (
            <ProductCard key={p._id} product={p} index={i} />
          ))}
        </div>
      </section>

      {/* Deals */}
      {deals.length > 0 && (
        <section className="mx-auto max-w-7xl px-4 py-16 lg:px-8">
          <div className="mb-8 flex items-end justify-between">
            <div>
              <p className="text-xs uppercase tracking-widest text-accent-600">Limited time</p>
              <h2 className="font-display text-3xl font-semibold md:text-4xl">Discounted earrings</h2>
            </div>
            <Link to="/deals" className="text-sm text-ink-600 hover:text-accent-600">All deals →</Link>
          </div>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {deals.map((p, i) => (
              <ProductCard key={p._id} product={p} index={i} />
            ))}
          </div>
        </section>
      )}

      {/* Newsletter */}
      <section className="mx-auto my-16 max-w-5xl px-4 lg:px-8">
        <div className="rounded-3xl bg-gradient-to-br from-ink-900 to-ink-600 p-10 text-center text-white md:p-14">
          <h3 className="font-display text-3xl md:text-4xl">Get 10% off your first pair</h3>
          <p className="mx-auto mt-2 max-w-xl text-ink-100/80">
            Join the Jewelify list for new arrivals, early access to sales, and styling tips.
          </p>
          <form onSubmit={(e) => e.preventDefault()} className="mx-auto mt-6 flex max-w-md gap-2">
            <input type="email" required placeholder="you@example.com" className="input !bg-white/90" />
            <button className="btn-accent">Join</button>
          </form>
        </div>
      </section>
    </PageTransition>
  );
}
