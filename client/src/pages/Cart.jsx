import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Minus, Plus, Trash2, ShoppingBag } from 'lucide-react';
import { useCart } from '../context/CartContext.jsx';
import PageTransition from '../components/PageTransition.jsx';

export default function Cart() {
  const { items, updateQty, removeItem, subtotal, clearCart } = useCart();
  const navigate = useNavigate();

  const shipping = subtotal > 0 && subtotal < 100 ? 5 : 0;
  const tax = Math.round(subtotal * 0.08 * 100) / 100;
  const total = Math.round((subtotal + shipping + tax) * 100) / 100;

  if (items.length === 0) {
    return (
      <PageTransition>
        <div className="mx-auto max-w-3xl px-4 py-24 text-center lg:px-8">
          <ShoppingBag className="mx-auto h-10 w-10 text-ink-300" />
          <h1 className="mt-4 font-display text-3xl font-semibold">Your cart is empty</h1>
          <p className="mt-2 text-ink-600">Discover earrings you'll wear forever.</p>
          <Link to="/shop" className="btn-primary mt-6 inline-flex">Start shopping</Link>
        </div>
      </PageTransition>
    );
  }

  return (
    <PageTransition>
      <div className="mx-auto max-w-6xl px-4 py-10 lg:px-8">
        <h1 className="font-display text-4xl font-semibold md:text-5xl">Your cart</h1>

        <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_360px]">
          <ul className="divide-y divide-ink-100 rounded-2xl border border-ink-100 bg-white">
            <AnimatePresence>
              {items.map((i) => (
                <motion.li
                  key={i.productId}
                  layout
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="flex gap-4 p-4"
                >
                  <Link to={`/product/${i.slug}`} className="h-24 w-24 flex-none overflow-hidden rounded-xl bg-ink-50">
                    <img src={i.image} alt={i.name} className="h-full w-full object-cover" />
                  </Link>
                  <div className="flex flex-1 flex-col">
                    <div className="flex items-start justify-between">
                      <div>
                        <Link to={`/product/${i.slug}`} className="font-medium hover:text-accent-600">{i.name}</Link>
                        <p className="mt-1 text-sm text-ink-400">${i.price.toFixed(2)} each</p>
                      </div>
                      <button onClick={() => removeItem(i.productId)} className="text-ink-400 hover:text-red-600" aria-label="Remove">
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                    <div className="mt-auto flex items-center justify-between pt-3">
                      <div className="flex items-center rounded-full border border-ink-200">
                        <button onClick={() => updateQty(i.productId, i.qty - 1)} className="h-8 w-8 grid place-items-center">
                          <Minus className="h-3.5 w-3.5" />
                        </button>
                        <span className="w-7 text-center text-sm">{i.qty}</span>
                        <button onClick={() => updateQty(i.productId, i.qty + 1)} className="h-8 w-8 grid place-items-center">
                          <Plus className="h-3.5 w-3.5" />
                        </button>
                      </div>
                      <span className="font-medium">${(i.price * i.qty).toFixed(2)}</span>
                    </div>
                  </div>
                </motion.li>
              ))}
            </AnimatePresence>
          </ul>

          <aside className="rounded-2xl border border-ink-100 bg-white p-5 h-fit">
            <h2 className="font-medium">Order summary</h2>
            <dl className="mt-4 space-y-2 text-sm">
              <div className="flex justify-between"><dt className="text-ink-600">Subtotal</dt><dd>${subtotal.toFixed(2)}</dd></div>
              <div className="flex justify-between"><dt className="text-ink-600">Shipping</dt><dd>{shipping === 0 ? 'Free' : `$${shipping.toFixed(2)}`}</dd></div>
              <div className="flex justify-between"><dt className="text-ink-600">Tax (est.)</dt><dd>${tax.toFixed(2)}</dd></div>
              <div className="mt-3 flex justify-between border-t border-ink-100 pt-3 text-base font-medium">
                <dt>Total</dt><dd>${total.toFixed(2)}</dd>
              </div>
            </dl>
            <button onClick={() => navigate('/checkout')} className="btn-primary mt-5 w-full">Checkout</button>
            <button onClick={clearCart} className="btn-ghost mt-2 w-full text-sm">Clear cart</button>
          </aside>
        </div>
      </div>
    </PageTransition>
  );
}
