import { useState } from 'react';
import toast from 'react-hot-toast';
import { Mail, MapPin, Phone } from 'lucide-react';
import PageTransition from '../components/PageTransition.jsx';
import Seo from '../seo/Seo.jsx';

export default function Contact() {
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const submit = (e) => {
    e.preventDefault();
    toast.success("Thanks! We'll be in touch shortly.");
    setForm({ name: '', email: '', message: '' });
  };
  return (
    <PageTransition>
      <Seo
        title="Contact Us"
        description="Questions about an order, sizing or a gift? Message the Jewelify team — we reply fast and deliver all over Bangladesh."
        path="/contact"
      />
      <div className="mx-auto max-w-5xl px-4 py-16 lg:px-8">
        <p className="text-xs uppercase tracking-widest text-accent-600">We're here</p>
        <h1 className="font-display text-4xl font-semibold md:text-5xl">Say hello</h1>
        <p className="mt-2 max-w-xl text-ink-600">
          Questions about sizing, a custom order, or a gift? We'd love to hear from you.
        </p>

        <div className="mt-10 grid gap-10 lg:grid-cols-[1fr_360px]">
          <form onSubmit={submit} className="rounded-3xl border border-ink-100 bg-white p-6 space-y-3">
            <div className="grid gap-3 sm:grid-cols-2">
              <input required className="input" placeholder="Your name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
              <input required type="email" className="input" placeholder="Email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
            </div>
            <textarea required className="input h-40" placeholder="How can we help?" value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} />
            <button className="btn-primary">Send message</button>
          </form>
          <aside className="space-y-4 text-sm text-ink-600">
            <div className="rounded-2xl bg-ink-50 p-5">
              <Mail className="h-5 w-5 text-accent-600" />
              <p className="mt-2 font-medium text-ink-900">Email</p>
              <p>hello@jewelify.example</p>
            </div>
            <div className="rounded-2xl bg-ink-50 p-5">
              <Phone className="h-5 w-5 text-accent-600" />
              <p className="mt-2 font-medium text-ink-900">Phone</p>
              <p>+1 (555) 0-JEWEL</p>
            </div>
            <div className="rounded-2xl bg-ink-50 p-5">
              <MapPin className="h-5 w-5 text-accent-600" />
              <p className="mt-2 font-medium text-ink-900">Studio</p>
              <p>Made with love, shipped worldwide</p>
            </div>
          </aside>
        </div>
      </div>
    </PageTransition>
  );
}
