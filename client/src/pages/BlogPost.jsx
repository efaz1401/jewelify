import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import PageTransition from '../components/PageTransition.jsx';
import Seo from '../seo/Seo.jsx';
import { articleSchema, breadcrumbSchema } from '../seo/jsonLd.js';
import { POSTS } from '../content/posts.js';

function Block({ block }) {
  switch (block.type) {
    case 'h2':
      return <h2 className="mt-10 font-display text-2xl font-semibold text-ink-900">{block.text}</h2>;
    case 'ul':
      return (
        <ul className="mt-4 list-disc space-y-2 pl-6 text-ink-600">
          {block.items.map((item, i) => (
            <li key={i}>{item}</li>
          ))}
        </ul>
      );
    case 'quote':
      return (
        <blockquote className="mt-8 rounded-2xl border-l-4 border-accent-500 bg-accent-50 p-5 text-ink-700">
          {block.text}
        </blockquote>
      );
    default:
      return <p className="mt-5 leading-relaxed text-ink-600">{block.text}</p>;
  }
}

export default function BlogPost() {
  const { slug } = useParams();
  const post = POSTS.find((p) => p.slug === slug);

  if (!post) {
    return (
      <PageTransition>
        <Seo title="Article not found" path={`/blog/${slug}`} robots="noindex" />
        <div className="mx-auto max-w-xl px-4 py-24 text-center">
          <h1 className="font-display text-3xl font-semibold">Article not found</h1>
          <Link to="/blog" className="btn-primary mt-6 inline-flex">Back to blog</Link>
        </div>
      </PageTransition>
    );
  }

  return (
    <PageTransition>
      <Seo
        title={post.title}
        description={post.excerpt}
        path={`/blog/${post.slug}`}
        image={post.cover}
        type="article"
        jsonLd={[
          articleSchema(post),
          breadcrumbSchema([
            { name: 'Home', path: '/' },
            { name: 'Blog', path: '/blog' },
            { name: post.title, path: `/blog/${post.slug}` },
          ]),
        ]}
      />

      <article className="mx-auto max-w-3xl px-4 py-12 lg:px-8">
        <nav className="mb-6 text-xs text-ink-400">
          <Link to="/" className="hover:text-ink-900">Home</Link> /{' '}
          <Link to="/blog" className="hover:text-ink-900">Blog</Link>
        </nav>

        <p className="text-xs text-ink-400">
          {new Date(post.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}
          {' · '}{post.readMinutes} min read
        </p>
        <h1 className="mt-3 font-display text-4xl font-semibold leading-tight md:text-5xl">{post.title}</h1>

        <img
          src={post.cover}
          alt={post.title}
          width="1200"
          height="675"
          fetchPriority="high"
          className="mt-8 aspect-video w-full rounded-3xl object-cover"
        />

        <div className="mt-4">
          {post.content.map((block, i) => (
            <Block key={i} block={block} />
          ))}
        </div>

        <div className="mt-12 rounded-3xl bg-gradient-to-br from-ink-900 to-ink-600 p-8 text-center text-white">
          <h2 className="font-display text-2xl">Ready to find your pair?</h2>
          <p className="mx-auto mt-2 max-w-md text-sm text-ink-100/80">
            Trendy earrings from ৳250 with cash on delivery all over Bangladesh.
          </p>
          <div className="mt-5 flex flex-wrap justify-center gap-3">
            <Link to="/shop" className="btn-accent">Shop earrings <ArrowRight className="h-4 w-4" /></Link>
            <Link to="/blog" className="btn-outline !border-white/30 !text-white hover:!bg-white/10">
              <ArrowLeft className="h-4 w-4" /> More guides
            </Link>
          </div>
        </div>
      </article>
    </PageTransition>
  );
}
