import { NavLink } from 'react-router-dom';

interface NavItem {
  to: string;
  label: string;
  icon: JSX.Element;
}

const iconClass = 'w-5 h-5';

/**
 * Primary navigation for the Super Admin Portal.
 *   Dashboard → /admin/dashboard
 *   Users     → /admin/users
 *   Admins    → /admin/admins         (manage admin teammates — super-admin only)
 *   Support   → /admin/reports        (support ticket center)
 *   Settings  → /admin/settings
 */
const navItems: NavItem[] = [
  {
    to: '/admin/dashboard',
    label: 'Dashboard',
    icon: (
      <svg className={iconClass} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l9-9 9 9M5 10v10h4v-6h6v6h4V10" />
      </svg>
    ),
  },
  {
    to: '/admin/users',
    label: 'Users',
    icon: (
      <svg className={iconClass} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a4 4 0 00-3-3.87M9 20H2v-2a4 4 0 013-3.87m4-3a4 4 0 110-8 4 4 0 010 8zm6-4a3 3 0 110-6 3 3 0 010 6z" />
      </svg>
    ),
  },
  {
    to: '/admin/admins',
    label: 'Admins',
    icon: (
      <svg className={iconClass} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 11a4 4 0 100-8 4 4 0 000 8z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M4 21v-1a6 6 0 016-6h4a6 6 0 016 6v1" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M19 8l1.5 1.5L23 7" />
      </svg>
    ),
  },
  {
    to: '/admin/reports',
    label: 'Support',
    icon: (
      <svg className={iconClass} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M18.364 5.636A9 9 0 105.636 18.364 9 9 0 0018.364 5.636zM9 9h6v6H9z" />
      </svg>
    ),
  },
  {
    to: '/admin/settings',
    label: 'Settings',
    icon: (
      <svg className={iconClass} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 15a3 3 0 100-6 3 3 0 000 6z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M19.4 15a1.7 1.7 0 00.34 1.87l.06.06a2 2 0 11-2.83 2.83l-.06-.06a1.7 1.7 0 00-1.87-.34 1.7 1.7 0 00-1 1.55V21a2 2 0 11-4 0v-.09a1.7 1.7 0 00-1.11-1.55 1.7 1.7 0 00-1.87.34l-.06.06a2 2 0 11-2.83-2.83l.06-.06a1.7 1.7 0 00.34-1.87 1.7 1.7 0 00-1.55-1H3a2 2 0 110-4h.09a1.7 1.7 0 001.55-1.11 1.7 1.7 0 00-.34-1.87l-.06-.06a2 2 0 112.83-2.83l.06.06a1.7 1.7 0 001.87.34H9a1.7 1.7 0 001-1.55V3a2 2 0 114 0v.09a1.7 1.7 0 001 1.55 1.7 1.7 0 001.87-.34l.06-.06a2 2 0 112.83 2.83l-.06.06a1.7 1.7 0 00-.34 1.87V9a1.7 1.7 0 001.55 1H21a2 2 0 110 4h-.09a1.7 1.7 0 00-1.55 1z" />
      </svg>
    ),
  },
];

interface Props {
  open: boolean;
  onClose: () => void;
}

export default function Sidebar({ open, onClose }: Props) {
  return (
    <>
      {open && (
        <div
          className="fixed inset-0 z-30 bg-slate-900/40 lg:hidden"
          onClick={onClose}
          aria-hidden
        />
      )}

      <aside
        className={`fixed lg:sticky top-0 left-0 z-40 h-screen w-64 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 transform transition-transform duration-200 ease-out lg:translate-x-0 ${
          open ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="h-16 flex items-center gap-3 px-6 border-b border-slate-200 dark:border-slate-800">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary-blue to-purple flex items-center justify-center text-white font-bold text-lg shadow-glow">
            IU
          </div>
          <div>
            <div className="font-display font-bold text-text-dark dark:text-white leading-none">
              IU Chat
            </div>
            <div className="text-xs text-text-light dark:text-slate-400 mt-0.5">Super Admin</div>
          </div>
        </div>

        <nav className="px-3 py-4 space-y-1">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              onClick={onClose}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-primary-blue text-white shadow-sm'
                    : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-text-dark dark:hover:text-white'
                }`
              }
            >
              {item.icon}
              <span>{item.label}</span>
            </NavLink>
          ))}
        </nav>

        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-slate-200 dark:border-slate-800">
          <div className="rounded-xl bg-gradient-to-br from-primary-blue/10 to-purple/10 dark:from-primary-blue/20 dark:to-purple/20 p-4">
            <p className="text-xs font-semibold text-text-dark dark:text-white">Need help?</p>
            <p className="text-xs text-text-light dark:text-slate-400 mt-1">
              Read the docs or contact engineering.
            </p>
          </div>
        </div>
      </aside>
    </>
  );
}
