import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { Pencil, Trash2, Plus, X } from 'lucide-react';
import { api, apiError } from '../../api/client.js';

const MATERIALS = ['gold', 'silver', 'rose-gold', 'platinum', 'pearl', 'diamond', 'gemstone', 'other'];
const STYLES = ['stud', 'hoop', 'drop', 'dangle', 'chandelier', 'huggie', 'threader', 'ear-cuff', 'other'];

const empty = {
  name: '',
  description: '',
  price: 0,
  discountPercent: 0,
  images: [''],
  category: '',
  material: 'gold',
  style: 'stud',
  stock: 0,
  featured: false,
};

export default function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [editing, setEditing] = useState(null); // null | {} | product

  const load = async () => {
    const [p, c] = await Promise.all([api.get('/products?limit=60'), api.get('/categories')]);
    setProducts(p.data.products);
    setCategories(c.data.categories);
  };

  useEffect(() => {
    load();
  }, []);

  const open = (p = null) =>
    setEditing(
      p
        ? {
            ...p,
            category: p.category?._id || p.category,
            images: p.images?.length ? p.images : [''],
          }
        : { ...empty, category: categories[0]?._id || '' }
    );
  const close = () => setEditing(null);

  const save = async () => {
    try {
      const payload = {
        ...editing,
        images: editing.images.filter(Boolean),
        price: Number(editing.price),
        discountPercent: Number(editing.discountPercent),
        stock: Number(editing.stock),
      };
      if (editing._id) await api.put(`/products/${editing._id}`, payload);
      else await api.post('/products', payload);
      toast.success('Saved');
      close();
      load();
    } catch (err) {
      toast.error(apiError(err));
    }
  };

  const remove = async (id) => {
    if (!confirm('Delete this product?')) return;
    try {
      await api.delete(`/products/${id}`);
      toast.success('Deleted');
      load();
    } catch (err) {
      toast.error(apiError(err));
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="font-display text-3xl font-semibold">Products</h1>
        <button className="btn-primary" onClick={() => open()}><Plus className="h-4 w-4" /> New product</button>
      </div>

      <div className="mt-6 overflow-hidden rounded-2xl border border-ink-100 bg-white">
        <table className="w-full text-sm">
          <thead className="bg-ink-50 text-left text-xs uppercase tracking-wider text-ink-400">
            <tr>
              <th className="px-4 py-3">Product</th>
              <th className="px-4 py-3">Category</th>
              <th className="px-4 py-3">Price</th>
              <th className="px-4 py-3">Stock</th>
              <th className="px-4 py-3"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-ink-100">
            {products.map((p) => (
              <tr key={p._id}>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <img src={p.images?.[0]} alt="" className="h-10 w-10 rounded-lg object-cover" />
                    <div>
                      <div className="font-medium">{p.name}</div>
                      <div className="text-xs text-ink-400">{p.slug}</div>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3">{p.category?.name}</td>
                <td className="px-4 py-3">
                  ${p.price.toFixed(2)}
                  {p.discountPercent > 0 && <span className="ml-1 text-xs text-accent-600">-{p.discountPercent}%</span>}
                </td>
                <td className="px-4 py-3">{p.stock}</td>
                <td className="px-4 py-3 text-right">
                  <button onClick={() => open(p)} className="btn-ghost !p-2" aria-label="Edit"><Pencil className="h-4 w-4" /></button>
                  <button onClick={() => remove(p._id)} className="btn-ghost !p-2 hover:text-red-600" aria-label="Delete"><Trash2 className="h-4 w-4" /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {editing && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-ink-900/50 p-4">
          <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white p-6">
            <div className="flex items-center justify-between">
              <h2 className="font-display text-2xl font-semibold">{editing._id ? 'Edit' : 'New'} product</h2>
              <button onClick={close} className="btn-ghost !p-2"><X className="h-4 w-4" /></button>
            </div>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              <input className="input sm:col-span-2" placeholder="Name" value={editing.name} onChange={(e) => setEditing({ ...editing, name: e.target.value })} />
              <textarea className="input sm:col-span-2 h-28" placeholder="Description" value={editing.description} onChange={(e) => setEditing({ ...editing, description: e.target.value })} />
              <input className="input" type="number" min="0" step="0.01" placeholder="Price" value={editing.price} onChange={(e) => setEditing({ ...editing, price: e.target.value })} />
              <input className="input" type="number" min="0" max="90" placeholder="Discount %" value={editing.discountPercent} onChange={(e) => setEditing({ ...editing, discountPercent: e.target.value })} />
              <input className="input" type="number" min="0" placeholder="Stock" value={editing.stock} onChange={(e) => setEditing({ ...editing, stock: e.target.value })} />
              <select className="input" value={editing.category} onChange={(e) => setEditing({ ...editing, category: e.target.value })}>
                <option value="">Category…</option>
                {categories.map((c) => <option key={c._id} value={c._id}>{c.name}</option>)}
              </select>
              <select className="input" value={editing.material} onChange={(e) => setEditing({ ...editing, material: e.target.value })}>
                {MATERIALS.map((m) => <option key={m}>{m}</option>)}
              </select>
              <select className="input" value={editing.style} onChange={(e) => setEditing({ ...editing, style: e.target.value })}>
                {STYLES.map((s) => <option key={s}>{s}</option>)}
              </select>
              <label className="flex items-center gap-2 text-sm">
                <input type="checkbox" checked={editing.featured} onChange={(e) => setEditing({ ...editing, featured: e.target.checked })} />
                Featured
              </label>
              <div className="sm:col-span-2">
                <label className="text-xs text-ink-400">Image URLs</label>
                {editing.images.map((img, i) => (
                  <div key={i} className="mt-1 flex gap-2">
                    <input
                      className="input"
                      placeholder="https://…"
                      value={img}
                      onChange={(e) => {
                        const next = [...editing.images];
                        next[i] = e.target.value;
                        setEditing({ ...editing, images: next });
                      }}
                    />
                    <button
                      type="button"
                      onClick={() => setEditing({ ...editing, images: editing.images.filter((_, idx) => idx !== i) })}
                      className="btn-ghost !p-2"
                      aria-label="Remove"
                    ><X className="h-4 w-4" /></button>
                  </div>
                ))}
                <button
                  type="button"
                  className="btn-ghost mt-2 !py-1.5 text-xs"
                  onClick={() => setEditing({ ...editing, images: [...editing.images, ''] })}
                >+ Add image</button>
              </div>
            </div>
            <div className="mt-6 flex justify-end gap-2">
              <button onClick={close} className="btn-ghost">Cancel</button>
              <button onClick={save} className="btn-primary">Save</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
