import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { api, apiError } from '../../api/client.js';
import { formatPrice } from '../../utils/format.js';

const STATUSES = ['pending', 'paid', 'processing', 'shipped', 'delivered', 'cancelled'];

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);

  const load = () => api.get('/orders/all').then((r) => setOrders(r.data.orders));
  useEffect(() => { load(); }, []);

  const setStatus = async (id, status) => {
    try {
      await api.put(`/orders/${id}/status`, { status });
      toast.success('Updated');
      load();
    } catch (err) { toast.error(apiError(err)); }
  };

  return (
    <div>
      <h1 className="font-display text-3xl font-semibold">Orders</h1>
      <div className="mt-6 overflow-hidden rounded-2xl border border-ink-100 bg-white">
        <table className="w-full text-sm">
          <thead className="bg-ink-50 text-left text-xs uppercase tracking-wider text-ink-400">
            <tr>
              <th className="px-4 py-3">Order</th>
              <th className="px-4 py-3">Customer</th>
              <th className="px-4 py-3">Total</th>
              <th className="px-4 py-3">Paid</th>
              <th className="px-4 py-3">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-ink-100">
            {orders.map((o) => (
              <tr key={o._id}>
                <td className="px-4 py-3">
                  #{o._id.slice(-8)}
                  <div className="text-xs text-ink-400">{new Date(o.createdAt).toLocaleDateString()}</div>
                </td>
                <td className="px-4 py-3">
                  {o.user?.name}
                  <div className="text-xs text-ink-400">{o.user?.email}</div>
                </td>
                <td className="px-4 py-3">{formatPrice(o.totalPrice)}</td>
                <td className="px-4 py-3">
                  {o.isPaid ? 'Yes' : o.paymentMethod === 'cod' ? 'COD' : 'No'}
                  {o.paymentMethod === 'cod' && (
                    <div className="text-xs text-ink-400">cash on delivery</div>
                  )}
                </td>
                <td className="px-4 py-3">
                  <select value={o.status} onChange={(e) => setStatus(o._id, e.target.value)} className="input !py-1 !pr-8 text-xs capitalize">
                    {STATUSES.map((s) => <option key={s}>{s}</option>)}
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
