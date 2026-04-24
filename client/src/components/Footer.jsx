import { Link } from 'react-router-dom';
import { Instagram, Facebook, Twitter } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="border-t border-ink-100 bg-ink-50/60">
      <div className="mx-auto max-w-7xl px-4 py-12 lg:px-8">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="inline-block h-7 w-7 rounded-full bg-gradient-to-br from-accent-300 to-accent-600" />
              <span className="font-display text-xl font-semibold">Jewelify</span>
            </div>
            <p className="mt-3 text-sm text-ink-600">
              Handcrafted women's earrings — designed to be worn every day and remembered forever.
            </p>
          </div>
          <div>
            <h4 className="mb-3 text-sm font-semibold">Shop</h4>
            <ul className="space-y-2 text-sm text-ink-600">
              <li><Link to="/shop" className="hover:text-accent-600">All earrings</Link></li>
              <li><Link to="/categories" className="hover:text-accent-600">Categories</Link></li>
              <li><Link to="/deals" className="hover:text-accent-600">Deals</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="mb-3 text-sm font-semibold">Help</h4>
            <ul className="space-y-2 text-sm text-ink-600">
              <li><Link to="/contact" className="hover:text-accent-600">Contact</Link></li>
              <li><Link to="/about" className="hover:text-accent-600">About</Link></li>
              <li><Link to="/orders" className="hover:text-accent-600">Track orders</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="mb-3 text-sm font-semibold">Stay in touch</h4>
            <form onSubmit={(e) => e.preventDefault()} className="flex gap-2">
              <input className="input !py-2 !px-3 text-sm" placeholder="you@example.com" type="email" />
              <button className="btn-primary !py-2 !px-3 text-sm">Join</button>
            </form>
            <div className="mt-4 flex gap-3 text-ink-400">
              <a href="#" aria-label="Instagram" className="hover:text-accent-600"><Instagram className="h-4 w-4" /></a>
              <a href="#" aria-label="Facebook" className="hover:text-accent-600"><Facebook className="h-4 w-4" /></a>
              <a href="#" aria-label="Twitter" className="hover:text-accent-600"><Twitter className="h-4 w-4" /></a>
            </div>
          </div>
        </div>
        <div className="mt-10 flex flex-col items-center justify-between gap-3 border-t border-ink-100 pt-6 text-xs text-ink-400 sm:flex-row">
          <p>© {new Date().getFullYear()} Jewelify. All rights reserved.</p>
          <p>Secure checkout with Stripe · 30-day returns · Free shipping over $100</p>
        </div>
      </div>
    </footer>
  );
}
