import { useCallback, useEffect, useMemo, useState } from 'react';
import toast from 'react-hot-toast';
import adminService from '../services/adminService';
import DataTable, { Column } from '../components/DataTable';
import Pagination from '../components/Pagination';
import SearchBar from '../components/SearchBar';
import ConfirmationDialog from '../components/ConfirmationDialog';
import AdminFormModal from '../components/AdminFormModal';
import { useDebounce } from '../hooks/useDebounce';
import { useAuth } from '../hooks/useAuth';
import { formatDate, initials, timeAgo } from '../utils/format';
import { getApiErrorMessage } from '../utils/apiDebug';
import { isDevMockToken, tokenStorage } from '../services/api';
import type { AdminAccount, AdminRole } from '../types';

const ROLE_FILTERS: { value: '' | AdminRole; label: string }[] = [
  { value: '', label: 'All roles' },
  { value: 'super_admin', label: 'Super admin' },
  { value: 'admin', label: 'Admin' },
  { value: 'moderator', label: 'Moderator' },
];

const ROLE_LABEL: Record<AdminRole, string> = {
  super_admin: 'Super admin',
  admin: 'Admin',
  moderator: 'Moderator',
};

const ROLE_BADGE: Record<AdminRole, string> = {
  super_admin:
    'bg-violet-50 text-violet-700 border-violet-200 dark:bg-violet-500/10 dark:text-violet-300 dark:border-violet-500/30',
  admin:
    'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-500/10 dark:text-blue-300 dark:border-blue-500/30',
  moderator:
    'bg-slate-50 text-slate-700 border-slate-200 dark:bg-slate-500/10 dark:text-slate-300 dark:border-slate-500/30',
};

/**
 * Admins page — only visible to super admins. Provides CRUD over the team
 * members who can access the Super Admin Portal:
 *   • invite / create new admins (with optional temp password or invite-link)
 *   • change role
 *   • suspend / activate
 *   • delete
 */
export default function Admins() {
  const { admin: currentAdmin, logout } = useAuth();
  const isDevMockSession = import.meta.env.DEV && isDevMockToken(tokenStorage.get());

  const [data, setData] = useState<AdminAccount[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [pageSize] = useState(20);
  const [search, setSearch] = useState('');
  const debouncedSearch = useDebounce(search, 300);
  const [role, setRole] = useState<'' | AdminRole>('');
  const [loading, setLoading] = useState(true);
  const [busyId, setBusyId] = useState<string | null>(null);

  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<AdminAccount | null>(null);
  const [deleting, setDeleting] = useState<AdminAccount | null>(null);

  const isSuperAdmin = currentAdmin?.role === 'super_admin';

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await adminService.list({
        page,
        pageSize,
        search: debouncedSearch,
        role,
      });
      setData(res.data);
      setTotal(res.total);
    } catch (e) {
      toast.error(getApiErrorMessage(e));
    } finally {
      setLoading(false);
    }
  }, [page, pageSize, debouncedSearch, role]);

  useEffect(() => {
    load();
  }, [load]);

  async function suspend(a: AdminAccount) {
    setBusyId(a.id);
    try {
      await adminService.suspend(a.id);
      toast.success(`${a.name} suspended`);
      load();
    } catch (e) {
      toast.error((e as { message?: string }).message ?? 'Failed to suspend');
    } finally {
      setBusyId(null);
    }
  }

  async function activate(a: AdminAccount) {
    setBusyId(a.id);
    try {
      await adminService.activate(a.id);
      toast.success(`${a.name} activated`);
      load();
    } catch (e) {
      toast.error((e as { message?: string }).message ?? 'Failed to activate');
    } finally {
      setBusyId(null);
    }
  }

  async function confirmDelete() {
    if (!deleting) return;
    setBusyId(deleting.id);
    try {
      await adminService.remove(deleting.id);
      toast.success(`${deleting.name} removed`);
      setDeleting(null);
      load();
    } catch (e) {
      toast.error((e as { message?: string }).message ?? 'Failed to remove');
    } finally {
      setBusyId(null);
    }
  }

  const columns = useMemo<Column<AdminAccount>[]>(
    () => [
      {
        key: 'avatar',
        header: '',
        width: '60px',
        render: (a) =>
          a.avatar ? (
            <img
              src={a.avatar}
              alt={a.name}
              className="w-10 h-10 rounded-full object-cover ring-2 ring-white dark:ring-slate-900"
            />
          ) : (
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary-blue to-purple text-white flex items-center justify-center text-xs font-bold ring-2 ring-white dark:ring-slate-900">
              {initials(a.name)}
            </div>
          ),
      },
      {
        key: 'name',
        header: 'Admin',
        render: (a) => (
          <div>
            <p className="font-semibold text-text-dark dark:text-white flex items-center gap-2">
              {a.name}
              {currentAdmin?.id === a.id && (
                <span className="px-1.5 py-0.5 rounded text-[10px] uppercase tracking-wide font-bold bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-300">
                  you
                </span>
              )}
            </p>
            <p className="text-xs text-text-light dark:text-slate-400">{a.email}</p>
          </div>
        ),
      },
      {
        key: 'role',
        header: 'Role',
        render: (a) => (
          <span
            className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border ${ROLE_BADGE[a.role]}`}
          >
            {ROLE_LABEL[a.role]}
          </span>
        ),
      },
      {
        key: 'status',
        header: 'Status',
        render: (a) => {
          const cls =
            a.status === 'active'
              ? 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-300 dark:border-emerald-500/30'
              : 'bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-500/10 dark:text-rose-300 dark:border-rose-500/30';
          return (
            <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border ${cls}`}>
              {a.status}
            </span>
          );
        },
      },
      {
        key: 'lastLoginAt',
        header: 'Last login',
        render: (a) => (
          <span className="text-text-light dark:text-slate-400 text-xs">
            {a.lastLoginAt ? timeAgo(a.lastLoginAt) : 'Never'}
          </span>
        ),
      },
      {
        key: 'createdAt',
        header: 'Added',
        render: (a) => formatDate(a.createdAt),
      },
      {
        key: 'actions',
        header: 'Actions',
        className: 'text-right',
        render: (a) => {
          const isSelf = currentAdmin?.id === a.id;
          const canManage = isSuperAdmin && !isSelf;
          return (
            <div className="flex items-center justify-end gap-1.5">
              <button
                type="button"
                disabled={!canManage}
                onClick={() => setEditing(a)}
                className="px-2.5 py-1 rounded-md text-xs font-medium border border-slate-300 dark:border-slate-700 text-text-dark dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 disabled:opacity-40 disabled:cursor-not-allowed"
                title={isSelf ? "You can't edit your own role here." : 'Edit role'}
              >
                Edit role
              </button>
              {a.status === 'active' ? (
                <button
                  type="button"
                  disabled={!canManage || busyId === a.id}
                  onClick={() => suspend(a)}
                  className="px-2.5 py-1 rounded-md text-xs font-medium border border-amber-300 text-amber-700 dark:text-amber-300 hover:bg-amber-50 dark:hover:bg-amber-500/10 disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  Suspend
                </button>
              ) : (
                <button
                  type="button"
                  disabled={!canManage || busyId === a.id}
                  onClick={() => activate(a)}
                  className="px-2.5 py-1 rounded-md text-xs font-medium border border-emerald-300 text-emerald-700 dark:text-emerald-300 hover:bg-emerald-50 dark:hover:bg-emerald-500/10 disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  Activate
                </button>
              )}
              <button
                type="button"
                disabled={!canManage || busyId === a.id}
                onClick={() => setDeleting(a)}
                className="px-2.5 py-1 rounded-md text-xs font-medium border border-rose-300 text-rose-700 dark:text-rose-300 hover:bg-rose-50 dark:hover:bg-rose-500/10 disabled:opacity-40 disabled:cursor-not-allowed"
              >
                Remove
              </button>
            </div>
          );
        },
      },
    ],
    [busyId, currentAdmin?.id, isSuperAdmin],
  );

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h2 className="font-display text-2xl font-bold text-text-dark dark:text-white">
            Admins
          </h2>
          <p className="text-sm text-text-light dark:text-slate-400 mt-1">
            Manage the teammates who can access the Super Admin Portal.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-sm text-text-light dark:text-slate-400">
            Total:{' '}
            <span className="font-semibold text-text-dark dark:text-white">
              {total.toLocaleString()}
            </span>
          </span>
          <button
            type="button"
            disabled={!isSuperAdmin}
            onClick={() => {
              setEditing(null);
              setShowForm(true);
            }}
            title={
              isSuperAdmin
                ? 'Invite a new admin'
                : 'Only super admins can add new admins.'
            }
            className="px-4 py-2 rounded-lg bg-gradient-to-r from-primary-blue to-purple text-white text-sm font-semibold shadow-glow hover:shadow-glow-lg disabled:opacity-50 disabled:cursor-not-allowed inline-flex items-center gap-1.5"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
            </svg>
            Add admin
          </button>
        </div>
      </div>

      {!isSuperAdmin && (
        <div className="rounded-xl border border-amber-200 dark:border-amber-500/30 bg-amber-50 dark:bg-amber-500/10 px-4 py-3 text-sm text-amber-800 dark:text-amber-200">
          You're viewing this page in read-only mode. Only{' '}
          <span className="font-semibold">super admins</span> can add or modify admin
          accounts.
        </div>
      )}

      {isDevMockSession && (
        <div className="rounded-xl border border-amber-200 dark:border-amber-500/30 bg-amber-50 dark:bg-amber-500/10 px-4 py-3 text-sm text-amber-800 dark:text-amber-200 flex items-start gap-3">
          <svg
            className="w-5 h-5 flex-shrink-0 mt-0.5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 9v2m0 4h.01M5.07 19h13.86a2 2 0 001.74-3L13.74 4a2 2 0 00-3.48 0L3.34 16a2 2 0 001.73 3z"
            />
          </svg>
          <div className="flex-1">
            <p className="font-semibold">You're using a local DEV mock session.</p>
            <p className="mt-0.5">
              The backend was unreachable when you signed in, so a fake token was issued.
              Admin changes are saved to your browser only, not the API. Log out and sign in
              again to use the real backend.
            </p>
          </div>
          <button
            type="button"
            onClick={() => logout()}
            className="px-3 py-1.5 rounded-lg text-xs font-semibold border border-amber-300 dark:border-amber-500/40 bg-white/60 dark:bg-amber-500/10 hover:bg-white dark:hover:bg-amber-500/20"
          >
            Log out
          </button>
        </div>
      )}

      <div className="flex flex-wrap gap-3 items-center">
        <SearchBar
          value={search}
          onChange={(v) => {
            setSearch(v);
            setPage(1);
          }}
          placeholder="Search by name or email…"
        />
        <select
          value={role}
          onChange={(e) => {
            setRole(e.target.value as '' | AdminRole);
            setPage(1);
          }}
          className="px-3 py-2.5 border border-slate-300 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-900 text-text-dark dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-blue/30 focus:border-primary-blue"
        >
          {ROLE_FILTERS.map((r) => (
            <option key={r.value} value={r.value}>
              {r.label}
            </option>
          ))}
        </select>
      </div>

      <DataTable
        columns={columns}
        data={data}
        loading={loading}
        rowKey={(a) => a.id}
        emptyMessage="No admins match the current filters."
      />
      <Pagination page={page} pageSize={pageSize} total={total} onChange={setPage} />

      <AdminFormModal
        open={showForm || !!editing}
        admin={editing}
        onClose={() => {
          setShowForm(false);
          setEditing(null);
        }}
        onSaved={() => {
          setShowForm(false);
          setEditing(null);
          load();
        }}
      />

      <ConfirmationDialog
        open={!!deleting}
        title="Remove admin?"
        description={
          deleting
            ? `${deleting.name} will immediately lose access to the Super Admin Portal.`
            : undefined
        }
        confirmLabel="Remove admin"
        variant="danger"
        loading={!!busyId && deleting?.id === busyId}
        onConfirm={confirmDelete}
        onClose={() => setDeleting(null)}
      />
    </div>
  );
}
