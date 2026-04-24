import { useState, useEffect } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ShoppingBag, User, Menu, X, Search, LogOut, LayoutDashboard } from 'lucide-react';
import { useAuth } from '../context/AuthContext.jsx';
import { useCart } from '../context/CartContext.jsx';

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { user, logout } = useAuth();
  const { totalItems } = useCart();
  const navigate = useNavigate();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    onScroll();
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const links = [
    { to: '/shop', label: 'Shop' },
    { to: '/categories', label: 'Categories' },
    { to: '/deals', label: 'Deals' },
    { to: '/about', label: 'About' },
    { to: '/contact', label: 'Contact' },
  ];

  return (
    <motion.header
      style={{
        backgroundColor: `rgba(255,255,255, ${scrolled ? 0.92 : 0.7})`,
        backdropFilter: `blur(${scrolled ? 14 : 8}px)`,
        WebkitBackdropFilter: `blur(${scrolled ? 14 : 8}px)`,
      }}
      className="sticky top-0 z-40 border-b border-ink-100/60"
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 lg:px-8">
        <Link to="/" className="flex items-center gap-2">
          <span className="inline-block h-8 w-8 rounded-full bg-gradient-to-br from-accent-300 to-accent-600 shadow-glow" />
          <span className="font-display text-2xl font-semibold tracking-tight">Jewelify</span>
        </Link>

        <nav className="hidden items-center gap-8 md:flex">
          {links.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              className={({ isActive }) =>
                `text-sm transition hover:text-accent-600 ${isActive ? 'text-accent-600 font-medium' : 'text-ink-600'}`
              }
            >
              {l.label}
            </NavLink>
          ))}
        </nav>

        <div className="flex items-center gap-1">
          <button
            onClick={() => navigate('/shop')}
            className="hidden md:inline-flex p-2 text-ink-600 hover:text-ink-900 rounded-full hover:bg-ink-50"
            aria-label="Search"
          >
            <Search className="h-5 w-5" />
          </button>

          {user ? (
            <div className="hidden md:flex items-center gap-1">
              <Link to="/profile" className="btn-ghost !py-2 !px-3" aria-label="Profile">
                <User className="h-5 w-5" />
              </Link>
              {user.role === 'admin' && (
                <Link to="/admin" className="btn-ghost !py-2 !px-3" aria-label="Admin">
                  <LayoutDashboard className="h-5 w-5" />
                </Link>
              )}
              <button onClick={logout} className="btn-ghost !py-2 !px-3" aria-label="Logout">
                <LogOut className="h-5 w-5" />
              </button>
            </div>
          ) : (
            <Link to="/login" className="hidden md:inline-flex btn-ghost !py-2 !px-3 text-sm">
              Sign in
            </Link>
          )}

          <Link to="/cart" className="relative btn-ghost !py-2 !px-3" aria-label="Cart">
            <ShoppingBag className="h-5 w-5" />
            {totalItems > 0 && (
              <span className="absolute -top-0.5 -right-0.5 flex h-5 min-w-[20px] items-center justify-center rounded-full bg-ink-900 px-1 text-[10px] font-semibold text-white">
                {totalItems}
              </span>
            )}
          </Link>

          <button className="md:hidden p-2" onClick={() => setOpen((o) => !o)} aria-label="Toggle menu">
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {open && (
        <motion.nav
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          className="md:hidden border-t border-ink-100 bg-white"
        >
          <div className="flex flex-col gap-1 px-4 py-3">
            {links.map((l) => (
              <NavLink
                key={l.to}
                to={l.to}
                onClick={() => setOpen(false)}
                className={({ isActive }) =>
                  `px-2 py-2 rounded-md text-sm ${isActive ? 'bg-ink-50 text-accent-600 font-medium' : 'text-ink-600 hover:bg-ink-50'}`
                }
              >
                {l.label}
              </NavLink>
            ))}
            <div className="mt-2 border-t border-ink-100 pt-2 flex flex-wrap gap-2">
              {user ? (
                <>
                  <Link to="/profile" onClick={() => setOpen(false)} className="btn-ghost">Profile</Link>
                  <Link to="/orders" onClick={() => setOpen(false)} className="btn-ghost">My Orders</Link>
                  {user.role === 'admin' && <Link to="/admin" onClick={() => setOpen(false)} className="btn-ghost">Admin</Link>}
                  <button onClick={() => { logout(); setOpen(false); }} className="btn-ghost">Sign out</button>
                </>
              ) : (
                <>
                  <Link to="/login" onClick={() => setOpen(false)} className="btn-outline">Sign in</Link>
                  <Link to="/register" onClick={() => setOpen(false)} className="btn-primary">Create account</Link>
                </>
              )}
            </div>
          </div>
        </motion.nav>
      )}
    </motion.header>
  );
}
