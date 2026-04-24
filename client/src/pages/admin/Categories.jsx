import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { Pencil, Trash2, Plus, X } from 'lucide-react';
import { api, apiError } from '../../api/client.js';

export default function AdminCategories() {
  const [cats, setCats] = useState([]);
  const [editing, setEditing] = useState(null);

  const load = () => api.get('/categories').then((r) => setCats(r.data.categories));
  useEffect(() => { load(); }, []);

  const save = async () => {
    try {
      if (editing._id) await api.put(`/categories/${editing._id}`, editing);
      else await api.post('/categories', editing);
      toast.success('Saved');
      setEditing(null);
      load();
    } catch (err) { toast.error(apiError(err)); }
  };
  const remove = async (id) => {
    if (!confirm('Delete category?')) return;
    try {
      await api.delete(`/categories/${id}`);
      toast.success('Deleted');
      load();
    } catch (err) { toast.error(apiError(err)); }
  };

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="font-display text-3xl font-semibold">Categories</h1>
        <button className="btn-primary" onClick={() => setEditing({ name: '', description: '', image: '' })}>
          <Plus className="h-4 w-4" /> New
        </button>
      </div>

      <div className="mt-6 overflow-hidden rounded-2xl border border-ink-100 bg-white">
        <table className="w-full text-sm">
          <thead className="bg-ink-50 text-left text-xs uppercase tracking-wider text-ink-400">
            <tr>
              <th className="px-4 py-3">Name</th>
              <th className="px-4 py-3">Slug</th>
              <th className="px-4 py-3"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-ink-100">
            {cats.map((c) => (
              <tr key={c._id}>
                <td className="px-4 py-3 flex items-center gap-3">
                  {c.image && <img src={c.image} alt="" className="h-8 w-8 rounded object-cover" />}
                  <span className="font-medium">{c.name}</span>
                </td>
                <td className="px-4 py-3 text-ink-400">{c.slug}</td>
                <td className="px-4 py-3 text-right">
                  <button onClick={() => setEditing(c)} className="btn-ghost !p-2"><Pencil className="h-4 w-4" /></button>
                  <button onClick={() => remove(c._id)} className="btn-ghost !p-2 hover:text-red-600"><Trash2 className="h-4 w-4" /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {editing && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-ink-900/50 p-4">
          <div className="w-full max-w-lg rounded-2xl bg-white p-6">
            <div className="flex items-center justify-between">
              <h2 className="font-display text-2xl font-semibold">{editing._id ? 'Edit' : 'New'} category</h2>
              <button onClick={() => setEditing(null)} className="btn-ghost !p-2"><X className="h-4 w-4" /></button>
            </div>
            <div className="mt-4 grid gap-3">
              <input className="input" placeholder="Name" value={editing.name} onChange={(e) => setEditing({ ...editing, name: e.target.value })} />
              <input className="input" placeholder="Image URL" value={editing.image || ''} onChange={(e) => setEditing({ ...editing, image: e.target.value })} />
              <textarea className="input h-24" placeholder="Description" value={editing.description || ''} onChange={(e) => setEditing({ ...editing, description: e.target.value })} />
            </div>
            <div className="mt-6 flex justify-end gap-2">
              <button onClick={() => setEditing(null)} className="btn-ghost">Cancel</button>
              <button onClick={save} className="btn-primary">Save</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
