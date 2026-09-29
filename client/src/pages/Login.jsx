import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext.jsx';
import PageTransition from '../components/PageTransition.jsx';
import Seo from '../seo/Seo.jsx';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [busy, setBusy] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || '/';

  const submit = async (e) => {
    e.preventDefault();
    setBusy(true);
    const res = await login(email, password);
    setBusy(false);
    if (res.ok) {
      toast.success('Welcome back');
      navigate(from, { replace: true });
    } else toast.error(res.error);
  };

  return (
    <PageTransition>
      <Seo title="Sign In" robots="noindex,nofollow" />
      <div className="mx-auto grid max-w-5xl gap-10 px-4 py-12 lg:grid-cols-2 lg:px-8">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="hidden rounded-3xl bg-gradient-to-br from-ink-900 to-ink-600 p-10 text-white lg:block"
        >
          <p className="text-xs uppercase tracking-widest opacity-80">Jewelify</p>
          <h1 className="mt-3 font-display text-4xl font-semibold leading-tight">
            Welcome back.<br />Your earrings missed you.
          </h1>
          <p className="mt-4 text-ink-100/80">
            Sign in to track orders, save favorites and check out faster.
          </p>
        </motion.div>

        <form onSubmit={submit} className="rounded-3xl border border-ink-100 bg-white p-8">
          <h2 className="font-display text-3xl font-semibold">Sign in</h2>
          <p className="mt-1 text-sm text-ink-600">Welcome back to Jewelify.</p>
          <div className="mt-6 space-y-3">
            <input
              type="email"
              autoComplete="email"
              required
              className="input"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <input
              type="password"
              autoComplete="current-password"
              required
              className="input"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <button disabled={busy} className="btn-primary mt-5 w-full">
            {busy ? 'Signing in…' : 'Sign in'}
          </button>
          <p className="mt-4 text-center text-sm text-ink-600">
            New to Jewelify? <Link to="/register" className="text-accent-600 hover:underline">Create an account</Link>
          </p>
        </form>
      </div>
    </PageTransition>
  );
}
