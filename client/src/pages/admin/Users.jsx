import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { Trash2 } from 'lucide-react';
import { api, apiError } from '../../api/client.js';

export default function AdminUsers() {
  const [users, setUsers] = useState([]);

  const load = () => api.get('/admin/users').then((r) => setUsers(r.data.users));
  useEffect(() => { load(); }, []);

  const remove = async (id) => {
    if (!confirm('Delete user?')) return;
    try {
      await api.delete(`/admin/users/${id}`);
      toast.success('Deleted');
      load();
    } catch (err) { toast.error(apiError(err)); }
  };

  return (
    <div>
      <h1 className="font-display text-3xl font-semibold">Users</h1>
      <div className="mt-6 overflow-hidden rounded-2xl border border-ink-100 bg-white">
        <table className="w-full text-sm">
          <thead className="bg-ink-50 text-left text-xs uppercase tracking-wider text-ink-400">
            <tr>
              <th className="px-4 py-3">Name</th>
              <th className="px-4 py-3">Email</th>
              <th className="px-4 py-3">Role</th>
              <th className="px-4 py-3">Joined</th>
              <th className="px-4 py-3"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-ink-100">
            {users.map((u) => (
              <tr key={u._id}>
                <td className="px-4 py-3 font-medium">{u.name}</td>
                <td className="px-4 py-3">{u.email}</td>
                <td className="px-4 py-3 capitalize">
                  <span className={`chip ${u.role === 'admin' ? 'bg-accent-50 text-accent-700 border-accent-200' : ''}`}>{u.role}</span>
                </td>
                <td className="px-4 py-3 text-ink-400">{new Date(u.createdAt).toLocaleDateString()}</td>
                <td className="px-4 py-3 text-right">
                  <button onClick={() => remove(u._id)} className="btn-ghost !p-2 hover:text-red-600"><Trash2 className="h-4 w-4" /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
