import { useEffect, useState } from 'react';
import { Link, useParams, useSearchParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import { api, apiError } from '../api/client.js';
import PageTransition from '../components/PageTransition.jsx';
import Loader from '../components/Loader.jsx';

export default function OrderDetail() {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [params, setParams] = useSearchParams();

  const load = async () => {
    try {
      const { data } = await api.get(`/orders/${id}`);
      setOrder(data.order);
    } catch (err) {
      toast.error(apiError(err));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, [id]);

  useEffect(() => {
    if (params.get('success')) {
      toast.success('Payment successful — thank you!');
      const t = setTimeout(() => {
        load();
        const next = new URLSearchParams(params);
        next.delete('success');
        setParams(next, { replace: true });
      }, 1500);
      return () => clearTimeout(t);
    }
    if (params.get('canceled')) {
      toast('Payment canceled.', { icon: '⚠️' });
    }
  }, [params]);

  const retryPay = async () => {
    try {
      const { data } = await api.post(`/orders/${id}/pay`);
      if (data.url) window.location.href = data.url;
    } catch (err) {
      toast.error(apiError(err));
    }
  };

  if (loading) return <Loader />;
  if (!order) return <div className="py-24 text-center text-ink-400">Order not found.</div>;

  return (
    <PageTransition>
      <div className="mx-auto max-w-4xl px-4 py-12 lg:px-8">
        <Link to="/orders" className="text-sm text-ink-400 hover:text-ink-900">← Back to orders</Link>
        <h1 className="mt-4 font-display text-4xl font-semibold">Order #{order._id.slice(-8)}</h1>
        <p className="mt-1 text-sm text-ink-600">
          Placed {new Date(order.createdAt).toLocaleString()} · Status: <span className="capitalize font-medium">{order.status}</span>
        </p>

        {!order.isPaid && (
          <div className="mt-5 rounded-2xl border border-accent-200 bg-accent-50 p-4 text-sm">
            <div className="flex items-center justify-between gap-3 flex-wrap">
              <span>This order is awaiting payment.</span>
              <button onClick={retryPay} className="btn-accent !py-2 !px-4">Pay now</button>
            </div>
          </div>
        )}

        <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_340px]">
          <section className="rounded-2xl border border-ink-100 bg-white">
            <div className="p-6">
              <h2 className="font-medium">Items</h2>
              <ul className="mt-4 divide-y divide-ink-100">
                {order.items.map((i, idx) => (
                  <li key={idx} className="flex items-center gap-3 py-3">
                    <img src={i.image} alt={i.name} className="h-14 w-14 rounded-lg object-cover" />
                    <div className="flex-1">
                      <div className="font-medium">{i.name}</div>
                      <div className="text-xs text-ink-400">× {i.qty}</div>
                    </div>
                    <div>${(i.price * i.qty).toFixed(2)}</div>
                  </li>
                ))}
              </ul>
            </div>
          </section>

          <aside className="rounded-2xl border border-ink-100 bg-white p-6 h-fit">
            <h2 className="font-medium">Summary</h2>
            <dl className="mt-4 space-y-2 text-sm">
              <div className="flex justify-between"><dt className="text-ink-600">Subtotal</dt><dd>${order.itemsPrice.toFixed(2)}</dd></div>
              <div className="flex justify-between"><dt className="text-ink-600">Shipping</dt><dd>${order.shippingPrice.toFixed(2)}</dd></div>
              <div className="flex justify-between"><dt className="text-ink-600">Tax</dt><dd>${order.taxPrice.toFixed(2)}</dd></div>
              <div className="mt-3 flex justify-between border-t border-ink-100 pt-3 text-base font-medium">
                <dt>Total</dt><dd>${order.totalPrice.toFixed(2)}</dd>
              </div>
            </dl>
            <div className="mt-4 text-sm">
              <h3 className="font-medium">Shipping to</h3>
              <address className="mt-1 not-italic text-ink-600 text-sm">
                {order.shippingAddress?.fullName}<br />
                {order.shippingAddress?.line1}<br />
                {order.shippingAddress?.line2 && <>{order.shippingAddress.line2}<br /></>}
                {order.shippingAddress?.city}{order.shippingAddress?.state ? `, ${order.shippingAddress.state}` : ''} {order.shippingAddress?.postalCode}<br />
                {order.shippingAddress?.country}
              </address>
            </div>
          </aside>
        </div>
      </div>
    </PageTransition>
  );
}
