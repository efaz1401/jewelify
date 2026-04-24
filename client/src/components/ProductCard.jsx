import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ShoppingBag, Star } from 'lucide-react';
import { useCart } from '../context/CartContext.jsx';

export default function ProductCard({ product, index = 0 }) {
  const { addItem } = useCart();
  const hasDiscount = product.discountPercent > 0;
  const finalPrice = Math.round((product.price - (product.price * (product.discountPercent || 0)) / 100) * 100) / 100;

  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.5, delay: Math.min(index * 0.04, 0.3) }}
      className="card-lift group relative flex flex-col overflow-hidden rounded-2xl bg-white shadow-soft"
    >
      <Link to={`/product/${product.slug}`} className="block aspect-square overflow-hidden bg-ink-50">
        <motion.img
          src={product.images?.[0] || 'https://placehold.co/600x600?text=Jewelify'}
          alt={product.name}
          loading="lazy"
          className="h-full w-full object-cover"
          whileHover={{ scale: 1.06 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        />
        {hasDiscount && (
          <span className="absolute left-3 top-3 rounded-full bg-accent-500 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-white">
            -{product.discountPercent}%
          </span>
        )}
        {product.stock === 0 && (
          <span className="absolute right-3 top-3 rounded-full bg-ink-900 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-white">
            Sold out
          </span>
        )}
      </Link>

      <div className="flex flex-1 flex-col p-4">
        <div className="flex items-start justify-between gap-2">
          <div>
            <Link to={`/product/${product.slug}`} className="font-display text-base leading-tight hover:text-accent-600">
              {product.name}
            </Link>
            {product.category?.name && (
              <p className="mt-0.5 text-xs uppercase tracking-wider text-ink-400">{product.category.name}</p>
            )}
          </div>
          {product.rating > 0 && (
            <span className="flex items-center gap-0.5 text-xs text-ink-600">
              <Star className="h-3 w-3 fill-accent-500 text-accent-500" />
              {product.rating.toFixed(1)}
            </span>
          )}
        </div>

        <div className="mt-auto pt-4 flex items-end justify-between">
          <div>
            {hasDiscount ? (
              <div className="flex items-baseline gap-2">
                <span className="font-semibold text-ink-900">${finalPrice.toFixed(2)}</span>
                <span className="text-xs line-through text-ink-400">${product.price.toFixed(2)}</span>
              </div>
            ) : (
              <span className="font-semibold text-ink-900">${product.price.toFixed(2)}</span>
            )}
          </div>
          <button
            onClick={(e) => {
              e.preventDefault();
              addItem(product, 1);
            }}
            disabled={product.stock === 0}
            className="btn-accent !py-2 !px-3 text-xs"
          >
            <ShoppingBag className="h-3.5 w-3.5" />
            Add
          </button>
        </div>
      </div>
    </motion.article>
  );
}
