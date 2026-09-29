import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext.jsx';
import PageTransition from '../components/PageTransition.jsx';
import Seo from '../seo/Seo.jsx';

export default function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [busy, setBusy] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const submit = async (e) => {
    e.preventDefault();
    setBusy(true);
    const res = await register(name, email, password);
    setBusy(false);
    if (res.ok) {
      toast.success('Welcome to Jewelify!');
      navigate('/');
    } else toast.error(res.error);
  };

  return (
    <PageTransition>
      <Seo title="Create Account" robots="noindex,nofollow" />
      <div className="mx-auto max-w-md px-4 py-16 lg:px-8">
        <div className="rounded-3xl border border-ink-100 bg-white p-8">
          <h1 className="font-display text-3xl font-semibold">Create your account</h1>
          <p className="mt-1 text-sm text-ink-600">Join Jewelify — takes less than a minute.</p>
          <form onSubmit={submit} className="mt-6 space-y-3">
            <input required className="input" placeholder="Full name" value={name} onChange={(e) => setName(e.target.value)} />
            <input required type="email" autoComplete="email" className="input" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
            <input required type="password" autoComplete="new-password" minLength={6} className="input" placeholder="Password (min 6 chars)" value={password} onChange={(e) => setPassword(e.target.value)} />
            <button disabled={busy} className="btn-primary w-full">
              {busy ? 'Creating…' : 'Create account'}
            </button>
          </form>
          <p className="mt-4 text-center text-sm text-ink-600">
            Already have an account? <Link to="/login" className="text-accent-600 hover:underline">Sign in</Link>
          </p>
        </div>
      </div>
    </PageTransition>
  );
}
