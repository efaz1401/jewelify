import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { api } from '../../api/client.js';
import { Package, Users, ClipboardList, DollarSign } from 'lucide-react';

const cards = [
  { key: 'revenue', label: 'Revenue', icon: DollarSign, prefix: '$' },
  { key: 'orders', label: 'Orders', icon: ClipboardList },
  { key: 'products', label: 'Products', icon: Package },
  { key: 'users', label: 'Users', icon: Users },
];

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  useEffect(() => {
    api.get('/admin/stats').then((r) => setStats(r.data));
  }, []);
  return (
    <div>
      <h1 className="font-display text-3xl font-semibold">Dashboard</h1>
      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {cards.map((c, i) => (
          <motion.div
            key={c.key}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className="rounded-2xl border border-ink-100 bg-white p-5"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs uppercase tracking-widest text-ink-400">{c.label}</span>
              <c.icon className="h-4 w-4 text-accent-600" />
            </div>
            <div className="mt-2 font-display text-3xl font-semibold">
              {stats ? `${c.prefix || ''}${Number(stats[c.key] || 0).toLocaleString()}` : '…'}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
