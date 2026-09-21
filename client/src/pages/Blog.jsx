import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import PageTransition from '../components/PageTransition.jsx';
import Seo from '../seo/Seo.jsx';
import { POSTS } from '../content/posts.js';

export default function Blog() {
  return (
    <PageTransition>
      <Seo
        title="Earring Guides, Styling Tips & Care"
        description="Guides for girls in Bangladesh: choose earrings for your face shape, stop tarnishing in humid weather, and style Korean earrings on a student budget."
        path="/blog"
      />
      <div className="mx-auto max-w-5xl px-4 py-12 lg:px-8">
        <p className="text-xs uppercase tracking-widest text-accent-600">The Jewelify Blog</p>
        <h1 className="font-display text-4xl font-semibold md:text-5xl">Earring guides & styling tips</h1>
        <p className="mt-2 max-w-xl text-ink-600">
          Real talk for girls in Bangladesh: what to buy, how to style it, and how to make it last.
        </p>

        <div className="mt-10 grid gap-6 md:grid-cols-2">
          {POSTS.map((post, i) => (
            <motion.article
              key={post.slug}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.06 }}
              className="card-lift group overflow-hidden rounded-3xl border border-ink-100 bg-white"
            >
              <Link to={`/blog/${post.slug}`}>
                <div className="aspect-[16/9] overflow-hidden bg-ink-50">
                  <img
                    src={post.cover}
                    alt={post.title}
                    loading="lazy"
                    decoding="async"
                    className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                  />
                </div>
                <div className="p-6">
                  <p className="text-xs text-ink-400">
                    {new Date(post.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}
                    {' · '}{post.readMinutes} min read
                  </p>
                  <h2 className="mt-2 font-display text-xl font-semibold leading-snug group-hover:text-accent-600">
                    {post.title}
                  </h2>
                  <p className="mt-2 text-sm text-ink-600">{post.excerpt}</p>
                </div>
              </Link>
            </motion.article>
          ))}
        </div>
      </div>
    </PageTransition>
  );
}
