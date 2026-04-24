import { NavLink, Outlet } from 'react-router-dom';
import { LayoutDashboard, Package, Folder, ClipboardList, Users } from 'lucide-react';
import PageTransition from '../../components/PageTransition.jsx';

const links = [
  { to: '/admin', label: 'Dashboard', icon: LayoutDashboard, end: true },
  { to: '/admin/products', label: 'Products', icon: Package },
  { to: '/admin/categories', label: 'Categories', icon: Folder },
  { to: '/admin/orders', label: 'Orders', icon: ClipboardList },
  { to: '/admin/users', label: 'Users', icon: Users },
];

export default function AdminLayout() {
  return (
    <PageTransition>
      <div className="mx-auto max-w-7xl px-4 py-10 lg:px-8">
        <div className="grid gap-8 lg:grid-cols-[220px_1fr]">
          <aside className="h-fit rounded-2xl border border-ink-100 bg-white p-3">
            <p className="px-3 py-2 text-xs font-semibold uppercase tracking-widest text-ink-400">Admin</p>
            <nav className="space-y-1">
              {links.map((l) => (
                <NavLink
                  key={l.to}
                  to={l.to}
                  end={l.end}
                  className={({ isActive }) =>
                    `flex items-center gap-2 rounded-lg px-3 py-2 text-sm ${
                      isActive ? 'bg-ink-900 text-white' : 'text-ink-600 hover:bg-ink-50'
                    }`
                  }
                >
                  <l.icon className="h-4 w-4" />
                  {l.label}
                </NavLink>
              ))}
            </nav>
          </aside>
          <div>
            <Outlet />
          </div>
        </div>
      </div>
    </PageTransition>
  );
}
