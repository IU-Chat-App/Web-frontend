import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { initials } from '../utils/format';
import DarkModeToggle from './DarkModeToggle';
import NotificationsPopover from './NotificationsPopover';

interface Props {
  onToggleSidebar: () => void;
}

export default function Topbar({ onToggleSidebar }: Props) {
  const { admin, logout } = useAuth();
  const navigate = useNavigate();

  async function handleLogout() {
    await logout();
    navigate('/admin/login', { replace: true });
  }

  return (
    <header className="sticky top-0 z-20 bg-white/90 dark:bg-slate-900/90 backdrop-blur border-b border-slate-200 dark:border-slate-800">
      <div className="h-16 px-4 lg:px-6 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3 min-w-0">
          <button
            type="button"
            className="lg:hidden p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300"
            onClick={onToggleSidebar}
            aria-label="Toggle navigation"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          <h1 className="font-display font-semibold text-text-dark dark:text-white text-lg truncate">
            Super Admin Portal
          </h1>
          <div className="hidden md:flex items-center gap-2 px-2.5 py-1 rounded-full bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/30 ml-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-xs font-medium text-emerald-700 dark:text-emerald-400">Live</span>
          </div>
        </div>

        <div className="flex items-center gap-1 sm:gap-2">
          <NotificationsPopover />
          <DarkModeToggle />

          <div className="flex items-center gap-3 pl-3 ml-1 border-l border-slate-200 dark:border-slate-800">
            <div className="text-right hidden sm:block">
              <p className="text-sm font-semibold text-text-dark dark:text-white leading-tight">
                {admin?.name ?? 'Admin'}
              </p>
              <p className="text-xs text-text-light dark:text-slate-400 leading-tight">
                {admin?.role ?? 'super_admin'}
              </p>
            </div>
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-primary-blue to-purple text-white flex items-center justify-center text-sm font-bold">
              {initials(admin?.name)}
            </div>
            <button
              type="button"
              onClick={handleLogout}
              className="text-sm font-medium text-text-light dark:text-slate-400 hover:text-rose-600 transition-colors px-2 py-1 rounded"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
