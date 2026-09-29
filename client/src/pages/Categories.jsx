import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { api } from '../api/client.js';
import PageTransition from '../components/PageTransition.jsx';
import Seo from '../seo/Seo.jsx';

export default function Categories() {
  const [cats, setCats] = useState([]);
  useEffect(() => {
    api.get('/categories').then((r) => setCats(r.data.categories));
  }, []);

  return (
    <PageTransition>
      <Seo
        title="Earring Categories — Studs, Hoops, Drops & More"
        description="Shop earrings by category: stud, hoop, drop, dangle, chandelier and pearl earrings, curated for girls and women in Bangladesh."
        path="/categories"
      />
      <div className="mx-auto max-w-7xl px-4 py-12 lg:px-8">
        <p className="text-xs uppercase tracking-widest text-accent-600">Browse</p>
        <h1 className="font-display text-4xl font-semibold md:text-5xl">Earring categories</h1>
        <p className="mt-2 max-w-xl text-ink-600">Pick a silhouette and let us do the rest.</p>

        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {cats.map((c, i) => (
            <motion.div
              key={c._id}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
            >
              <Link to={`/category/${c.slug}`} className="card-lift group block overflow-hidden rounded-3xl bg-ink-50">
                <div className="relative aspect-[4/5] overflow-hidden">
                  <img src={c.image} alt={c.name} className="h-full w-full object-cover transition group-hover:scale-105" />
                  <div className="absolute inset-0 bg-gradient-to-t from-ink-900/70 to-transparent" />
                  <div className="absolute bottom-5 left-5 text-white">
                    <h3 className="font-display text-3xl font-semibold">{c.name}</h3>
                    {c.description && <p className="mt-1 max-w-xs text-sm opacity-90">{c.description}</p>}
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </PageTransition>
  );
}
