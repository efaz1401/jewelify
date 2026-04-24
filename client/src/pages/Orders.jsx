import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../api/client.js';
import PageTransition from '../components/PageTransition.jsx';
import Loader from '../components/Loader.jsx';

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/orders/me').then((r) => setOrders(r.data.orders)).finally(() => setLoading(false));
  }, []);

  if (loading) return <Loader />;

  return (
    <PageTransition>
      <div className="mx-auto max-w-5xl px-4 py-12 lg:px-8">
        <h1 className="font-display text-4xl font-semibold">My orders</h1>
        {orders.length === 0 ? (
          <p className="mt-8 text-ink-400">You haven't placed any orders yet.</p>
        ) : (
          <ul className="mt-8 space-y-4">
            {orders.map((o) => (
              <li key={o._id} className="rounded-2xl border border-ink-100 bg-white p-5">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <p className="text-xs uppercase tracking-widest text-ink-400">Order #{o._id.slice(-8)}</p>
                    <p className="mt-1 text-sm">Placed {new Date(o.createdAt).toLocaleDateString()}</p>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className={`chip capitalize ${
                      o.status === 'delivered' ? 'text-green-700 bg-green-50 border-green-200' :
                      o.status === 'paid' || o.status === 'processing' || o.status === 'shipped' ? 'text-accent-700 bg-accent-50 border-accent-200' :
                      o.status === 'cancelled' ? 'text-red-700 bg-red-50 border-red-200' : ''
                    }`}>{o.status}</span>
                    <span className="font-medium">${o.totalPrice.toFixed(2)}</span>
                    <Link to={`/orders/${o._id}`} className="text-sm text-accent-600 hover:underline">View</Link>
                  </div>
                </div>
                <div className="mt-3 flex flex-wrap gap-2">
                  {o.items.slice(0, 5).map((i, idx) => (
                    <img key={idx} src={i.image} alt={i.name} className="h-12 w-12 rounded-lg object-cover" />
                  ))}
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </PageTransition>
  );
}
