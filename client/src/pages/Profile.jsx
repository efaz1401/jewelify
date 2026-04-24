import { useState } from 'react';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext.jsx';
import PageTransition from '../components/PageTransition.jsx';

export default function Profile() {
  const { user, updateProfile } = useAuth();
  const [form, setForm] = useState({
    name: user?.name || '',
    password: '',
    address: {
      line1: user?.address?.line1 || '',
      line2: user?.address?.line2 || '',
      city: user?.address?.city || '',
      state: user?.address?.state || '',
      postalCode: user?.address?.postalCode || '',
      country: user?.address?.country || '',
    },
  });
  const [busy, setBusy] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setBusy(true);
    const payload = { name: form.name, address: form.address };
    if (form.password) payload.password = form.password;
    const res = await updateProfile(payload);
    setBusy(false);
    if (res.ok) {
      toast.success('Profile updated');
      setForm((f) => ({ ...f, password: '' }));
    } else toast.error(res.error);
  };

  return (
    <PageTransition>
      <div className="mx-auto max-w-3xl px-4 py-12 lg:px-8">
        <h1 className="font-display text-4xl font-semibold">Your profile</h1>
        <p className="mt-1 text-sm text-ink-600">Signed in as {user?.email}</p>

        <form onSubmit={submit} className="mt-8 space-y-6">
          <section className="rounded-2xl border border-ink-100 bg-white p-6">
            <h2 className="font-medium">Account</h2>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              <input className="input" placeholder="Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
              <input className="input" type="password" placeholder="New password (optional)" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
            </div>
          </section>

          <section className="rounded-2xl border border-ink-100 bg-white p-6">
            <h2 className="font-medium">Default shipping address</h2>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              <input className="input sm:col-span-2" placeholder="Address line 1" value={form.address.line1} onChange={(e) => setForm({ ...form, address: { ...form.address, line1: e.target.value } })} />
              <input className="input sm:col-span-2" placeholder="Address line 2" value={form.address.line2} onChange={(e) => setForm({ ...form, address: { ...form.address, line2: e.target.value } })} />
              <input className="input" placeholder="City" value={form.address.city} onChange={(e) => setForm({ ...form, address: { ...form.address, city: e.target.value } })} />
              <input className="input" placeholder="State / region" value={form.address.state} onChange={(e) => setForm({ ...form, address: { ...form.address, state: e.target.value } })} />
              <input className="input" placeholder="Postal code" value={form.address.postalCode} onChange={(e) => setForm({ ...form, address: { ...form.address, postalCode: e.target.value } })} />
              <input className="input" placeholder="Country" value={form.address.country} onChange={(e) => setForm({ ...form, address: { ...form.address, country: e.target.value } })} />
            </div>
          </section>

          <button disabled={busy} className="btn-primary">Save changes</button>
        </form>
      </div>
    </PageTransition>
  );
}
