import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { api, apiError } from '../api/client.js';
import { useCart } from '../context/CartContext.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import PageTransition from '../components/PageTransition.jsx';

export default function Checkout() {
  const { user } = useAuth();
  const { items, subtotal, clearCart } = useCart();
  const navigate = useNavigate();
  const [placing, setPlacing] = useState(false);
  const [shipping, setShipping] = useState({
    fullName: user?.name || '',
    line1: user?.address?.line1 || '',
    line2: user?.address?.line2 || '',
    city: user?.address?.city || '',
    state: user?.address?.state || '',
    postalCode: user?.address?.postalCode || '',
    country: user?.address?.country || '',
    phone: '',
  });

  const shippingFee = subtotal > 0 && subtotal < 100 ? 5 : 0;
  const tax = Math.round(subtotal * 0.08 * 100) / 100;
  const total = Math.round((subtotal + shippingFee + tax) * 100) / 100;

  if (items.length === 0) {
    return (
      <PageTransition>
        <div className="mx-auto max-w-xl px-4 py-24 text-center lg:px-8">
          <h1 className="font-display text-3xl font-semibold">Your cart is empty</h1>
          <button onClick={() => navigate('/shop')} className="btn-primary mt-6">Shop earrings</button>
        </div>
      </PageTransition>
    );
  }

  const handle = async (e) => {
    e.preventDefault();
    setPlacing(true);
    try {
      const { data } = await api.post('/orders', {
        items: items.map((i) => ({ product: i.productId, qty: i.qty })),
        shippingAddress: shipping,
      });
      const orderId = data.order._id;
      const pay = await api.post(`/orders/${orderId}/pay`);
      clearCart();
      if (pay.data.url) {
        window.location.href = pay.data.url;
      } else {
        navigate(`/orders/${orderId}`);
      }
    } catch (err) {
      toast.error(apiError(err));
      setPlacing(false);
    }
  };

  const set = (k) => (e) => setShipping((s) => ({ ...s, [k]: e.target.value }));

  return (
    <PageTransition>
      <div className="mx-auto max-w-6xl px-4 py-10 lg:px-8">
        <h1 className="font-display text-4xl font-semibold md:text-5xl">Checkout</h1>

        <form onSubmit={handle} className="mt-8 grid gap-8 lg:grid-cols-[1fr_360px]">
          <div className="space-y-6">
            <section className="rounded-2xl border border-ink-100 bg-white p-6">
              <h2 className="font-medium">Shipping address</h2>
              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                <input required className="input sm:col-span-2" placeholder="Full name" value={shipping.fullName} onChange={set('fullName')} />
                <input required className="input sm:col-span-2" placeholder="Address line 1" value={shipping.line1} onChange={set('line1')} />
                <input className="input sm:col-span-2" placeholder="Address line 2 (optional)" value={shipping.line2} onChange={set('line2')} />
                <input required className="input" placeholder="City" value={shipping.city} onChange={set('city')} />
                <input className="input" placeholder="State / region" value={shipping.state} onChange={set('state')} />
                <input className="input" placeholder="Postal code" value={shipping.postalCode} onChange={set('postalCode')} />
                <input required className="input" placeholder="Country" value={shipping.country} onChange={set('country')} />
                <input className="input sm:col-span-2" placeholder="Phone (optional)" value={shipping.phone} onChange={set('phone')} />
              </div>
            </section>

            <section className="rounded-2xl border border-ink-100 bg-white p-6">
              <h2 className="font-medium">Payment</h2>
              <p className="mt-2 text-sm text-ink-600">
                You will be redirected to Stripe's secure checkout to complete payment. Use test card{' '}
                <code className="rounded bg-ink-50 px-1.5 py-0.5 text-xs">4242 4242 4242 4242</code> with any future date and any CVC.
              </p>
            </section>
          </div>

          <aside className="rounded-2xl border border-ink-100 bg-white p-5 h-fit">
            <h2 className="font-medium">Your order</h2>
            <ul className="mt-4 divide-y divide-ink-100">
              {items.map((i) => (
                <li key={i.productId} className="flex items-center gap-3 py-2 text-sm">
                  <img src={i.image} alt="" className="h-12 w-12 rounded-lg object-cover" />
                  <div className="flex-1">
                    <div>{i.name}</div>
                    <div className="text-xs text-ink-400">× {i.qty}</div>
                  </div>
                  <div>${(i.price * i.qty).toFixed(2)}</div>
                </li>
              ))}
            </ul>
            <dl className="mt-4 space-y-2 text-sm">
              <div className="flex justify-between"><dt className="text-ink-600">Subtotal</dt><dd>${subtotal.toFixed(2)}</dd></div>
              <div className="flex justify-between"><dt className="text-ink-600">Shipping</dt><dd>{shippingFee === 0 ? 'Free' : `$${shippingFee.toFixed(2)}`}</dd></div>
              <div className="flex justify-between"><dt className="text-ink-600">Tax</dt><dd>${tax.toFixed(2)}</dd></div>
              <div className="mt-3 flex justify-between border-t border-ink-100 pt-3 text-base font-medium">
                <dt>Total</dt><dd>${total.toFixed(2)}</dd>
              </div>
            </dl>
            <button disabled={placing} className="btn-primary mt-5 w-full">
              {placing ? 'Placing order…' : `Pay $${total.toFixed(2)}`}
            </button>
          </aside>
        </form>
      </div>
    </PageTransition>
  );
}
