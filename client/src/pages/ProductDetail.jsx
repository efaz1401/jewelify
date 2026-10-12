import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ShoppingBag, Heart, Star, Truck, Shield, RotateCcw, Minus, Plus } from 'lucide-react';
import { api, apiError } from '../api/client.js';
import { useCart } from '../context/CartContext.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import PageTransition from '../components/PageTransition.jsx';
import Loader from '../components/Loader.jsx';
import Seo from '../seo/Seo.jsx';
import { productSchema, breadcrumbSchema } from '../seo/jsonLd.js';
import { formatPrice } from '../utils/format.js';
import toast from 'react-hot-toast';

export default function ProductDetail() {
  const { slug } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeImg, setActiveImg] = useState(0);
  const [qty, setQty] = useState(1);
  const [review, setReview] = useState({ rating: 5, comment: '' });
  const { addItem } = useCart();
  const { user } = useAuth();

  useEffect(() => {
    setLoading(true);
    api.get(`/products/${slug}`).then((r) => {
      setProduct(r.data.product);
      setActiveImg(0);
      setQty(1);
    }).finally(() => setLoading(false));
  }, [slug]);

  if (loading) return <Loader />;
  if (!product) return <div className="py-20 text-center text-ink-400">Product not found.</div>;

  const finalPrice = Math.round((product.price - (product.price * (product.discountPercent || 0)) / 100) * 100) / 100;

  const submitReview = async (e) => {
    e.preventDefault();
    try {
      const { data } = await api.post(`/products/${product._id}/reviews`, review);
      setProduct(data.product);
      setReview({ rating: 5, comment: '' });
      toast.success('Thanks for the review!');
    } catch (err) {
      toast.error(apiError(err));
    }
  };

  return (
    <PageTransition>
      <Seo
        title={`${product.name} — Price in Bangladesh`}
        description={`${String(product.description).slice(0, 140)}… Order online with cash on delivery anywhere in Bangladesh.`}
        path={`/product/${product.slug}`}
        image={product.images?.[0]}
        type="product"
        jsonLd={[
          productSchema(product),
          breadcrumbSchema([
            { name: 'Home', path: '/' },
            { name: 'Shop', path: '/shop' },
            ...(product.category?.slug
              ? [{ name: product.category.name, path: `/category/${product.category.slug}` }]
              : []),
            { name: product.name, path: `/product/${product.slug}` },
          ]),
        ]}
      />
      <div className="mx-auto max-w-7xl px-4 py-10 lg:px-8">
        <nav className="mb-6 text-xs text-ink-400">
          <Link to="/" className="hover:text-ink-900">Home</Link> / <Link to="/shop" className="hover:text-ink-900">Shop</Link> /{' '}
          {product.category?.slug && (
            <>
              <Link to={`/category/${product.category.slug}`} className="hover:text-ink-900">{product.category.name}</Link> /{' '}
            </>
          )}
          <span className="text-ink-900">{product.name}</span>
        </nav>

        <div className="grid gap-10 lg:grid-cols-2">
          {/* Images */}
          <div>
            <motion.div
              key={activeImg}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="aspect-square overflow-hidden rounded-3xl bg-ink-50"
            >
              <img
                src={product.images?.[activeImg] || 'https://placehold.co/800'}
                alt={product.name}
                className="h-full w-full object-cover"
              />
            </motion.div>
            {product.images?.length > 1 && (
              <div className="mt-3 flex gap-2 overflow-x-auto">
                {product.images.map((src, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveImg(i)}
                    className={`h-20 w-20 flex-none overflow-hidden rounded-xl border-2 ${
                      i === activeImg ? 'border-accent-500' : 'border-transparent'
                    }`}
                  >
                    <img src={src} alt={`${product.name} — view ${i + 1}`} loading="lazy" decoding="async" className="h-full w-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Info */}
          <div>
            <p className="text-xs uppercase tracking-widest text-accent-600">{product.category?.name}</p>
            <h1 className="mt-2 font-display text-4xl font-semibold leading-tight">{product.name}</h1>

            {product.numReviews > 0 && (
              <div className="mt-3 flex items-center gap-1 text-sm text-ink-600">
                <Star className="h-4 w-4 fill-accent-500 text-accent-500" />
                {product.rating.toFixed(1)} · {product.numReviews} reviews
              </div>
            )}

            <div className="mt-4 flex items-baseline gap-3">
              <span className="font-display text-3xl font-semibold">{formatPrice(finalPrice)}</span>
              {product.discountPercent > 0 && (
                <>
                  <span className="text-ink-400 line-through">{formatPrice(product.price)}</span>
                  <span className="rounded-full bg-accent-50 px-2 py-0.5 text-xs font-semibold text-accent-700">
                    Save {product.discountPercent}%
                  </span>
                </>
              )}
            </div>

            <p className="mt-6 text-ink-600 leading-relaxed">{product.description}</p>

            <div className="mt-5 flex flex-wrap gap-2 text-xs">
              <span className="chip capitalize">Material: {product.material}</span>
              <span className="chip capitalize">Style: {product.style?.replace('-', ' ')}</span>
              {product.stock > 0 ? (
                <span className="chip text-green-700 border-green-200 bg-green-50">In stock</span>
              ) : (
                <span className="chip text-red-700 border-red-200 bg-red-50">Sold out</span>
              )}
            </div>

            <div className="mt-8 flex items-center gap-3">
              <div className="flex items-center rounded-full border border-ink-200">
                <button onClick={() => setQty((q) => Math.max(1, q - 1))} className="h-10 w-10 grid place-items-center hover:text-accent-600">
                  <Minus className="h-4 w-4" />
                </button>
                <span className="w-8 text-center text-sm font-medium">{qty}</span>
                <button onClick={() => setQty((q) => Math.min(20, q + 1))} className="h-10 w-10 grid place-items-center hover:text-accent-600">
                  <Plus className="h-4 w-4" />
                </button>
              </div>
              <button
                disabled={product.stock === 0}
                onClick={() => addItem(product, qty)}
                className="btn-primary flex-1"
              >
                <ShoppingBag className="h-4 w-4" /> Add to cart
              </button>
              <button className="btn-ghost !p-3" aria-label="Wishlist"><Heart className="h-5 w-5" /></button>
            </div>

            <div className="mt-8 grid grid-cols-3 gap-3 text-center">
              <div className="rounded-2xl bg-ink-50 p-4 text-xs">
                <Truck className="mx-auto mb-2 h-5 w-5 text-accent-600" />
                Free delivery over ৳999
              </div>
              <div className="rounded-2xl bg-ink-50 p-4 text-xs">
                <RotateCcw className="mx-auto mb-2 h-5 w-5 text-accent-600" />
                7-day easy exchange
              </div>
              <div className="rounded-2xl bg-ink-50 p-4 text-xs">
                <Shield className="mx-auto mb-2 h-5 w-5 text-accent-600" />
                Cash on delivery
              </div>
            </div>
          </div>
        </div>

        {/* Reviews */}
        <section className="mt-16 max-w-3xl">
          <h2 className="font-display text-2xl font-semibold">Reviews</h2>
          {product.reviews?.length === 0 && <p className="mt-2 text-sm text-ink-400">No reviews yet. Be the first!</p>}
          <ul className="mt-4 space-y-5">
            {product.reviews?.map((r) => (
              <li key={r._id} className="rounded-2xl border border-ink-100 bg-white p-5">
                <div className="flex items-center justify-between">
                  <span className="font-medium">{r.name}</span>
                  <span className="flex items-center gap-0.5 text-xs">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star key={i} className={`h-3.5 w-3.5 ${i < r.rating ? 'fill-accent-500 text-accent-500' : 'text-ink-200'}`} />
                    ))}
                  </span>
                </div>
                {r.comment && <p className="mt-2 text-sm text-ink-600">{r.comment}</p>}
              </li>
            ))}
          </ul>

          {user ? (
            <form onSubmit={submitReview} className="mt-6 rounded-2xl border border-ink-100 p-5">
              <h3 className="font-medium">Write a review</h3>
              <div className="mt-3 flex items-center gap-1">
                {[1, 2, 3, 4, 5].map((n) => (
                  <button
                    type="button"
                    key={n}
                    onClick={() => setReview((r) => ({ ...r, rating: n }))}
                    aria-label={`${n} stars`}
                  >
                    <Star className={`h-5 w-5 ${n <= review.rating ? 'fill-accent-500 text-accent-500' : 'text-ink-200'}`} />
                  </button>
                ))}
              </div>
              <textarea
                className="input mt-3 h-24"
                value={review.comment}
                onChange={(e) => setReview((r) => ({ ...r, comment: e.target.value }))}
                placeholder="Share your thoughts…"
                maxLength={1000}
              />
              <button className="btn-primary mt-3">Submit review</button>
            </form>
          ) : (
            <p className="mt-6 text-sm text-ink-400">
              <Link to="/login" className="text-accent-600 hover:underline">Sign in</Link> to write a review.
            </p>
          )}
        </section>
      </div>
    </PageTransition>
  );
}
