import { useCallback, useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import userService from '../services/userService';
import DataTable, { Column } from '../components/DataTable';
import Pagination from '../components/Pagination';
import SearchBar from '../components/SearchBar';
import UserProfileModal from '../components/UserProfileModal';
import ConfirmationDialog from '../components/ConfirmationDialog';
import { useDebounce } from '../hooks/useDebounce';
import { getSocket, SOCKET_EVENTS } from '../utils/socket';
import { formatDate, initials, timeAgo } from '../utils/format';
import { todayDateInputValue } from '../utils/dateRanges';
import { exportCsv } from '../utils/csv';
import type { AppUser, UserSort, UserStatus } from '../types';

const STATUS_FILTERS: { value: '' | UserStatus; label: string }[] = [
  { value: '', label: 'All statuses' },
  { value: 'active', label: 'Active' },
  { value: 'blocked', label: 'Blocked' },
  { value: 'pending', label: 'Pending' },
];

const SORT_OPTIONS: { value: UserSort; label: string }[] = [
  { value: 'latest', label: 'Latest first' },
  { value: 'oldest', label: 'Oldest first' },
  { value: 'name_asc', label: 'Name A → Z' },
  { value: 'name_desc', label: 'Name Z → A' },
  { value: 'last_active', label: 'Recently active' },
];

export default function Users() {
  const [searchParams, setSearchParams] = useSearchParams();

  const [data, setData] = useState<AppUser[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [pageSize] = useState(20);
  const [search, setSearch] = useState('');
  const debouncedSearch = useDebounce(search, 300);
  const [status, setStatus] = useState<'' | UserStatus>('');
  const [sort, setSort] = useState<UserSort>('latest');
  const [onlineOnly, setOnlineOnly] = useState(false);
  // Date range filter (pre-populated from `/admin/users?registeredFrom=&registeredTo=`).
  const [registeredFrom, setRegisteredFrom] = useState<string>(
    searchParams.get('registeredFrom') ?? '',
  );
  const [registeredTo, setRegisteredTo] = useState<string>(
    searchParams.get('registeredTo') ?? '',
  );
  const [loading, setLoading] = useState(true);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [selected, setSelected] = useState<AppUser | null>(null);
  const [deletingUser, setDeletingUser] = useState<AppUser | null>(null);
  const [exporting, setExporting] = useState(false);

  // Keep the URL in sync with the date filter so the page is shareable and
  // browser back/forward navigates between filtered views.
  useEffect(() => {
    const next = new URLSearchParams(searchParams);
    if (registeredFrom) next.set('registeredFrom', registeredFrom);
    else next.delete('registeredFrom');
    if (registeredTo) next.set('registeredTo', registeredTo);
    else next.delete('registeredTo');
    if (next.toString() !== searchParams.toString()) {
      setSearchParams(next, { replace: true });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [registeredFrom, registeredTo]);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await userService.list({
        page,
        pageSize,
        search: debouncedSearch,
        status,
        sort,
        online: onlineOnly ? true : undefined,
        registeredFrom: registeredFrom || undefined,
        registeredTo: registeredTo || undefined,
      });
      setData(res.data);
      setTotal(res.total);
    } finally {
      setLoading(false);
    }
  }, [page, pageSize, debouncedSearch, status, sort, onlineOnly, registeredFrom, registeredTo]);

  useEffect(() => {
    load();
  }, [load]);

  // Live presence updates.
  useEffect(() => {
    const socket = getSocket();
    function onPresence(payload: { userId?: string; isOnline?: boolean }) {
      if (!payload.userId) return;
      setData((prev) =>
        prev.map((u) =>
          u.id === payload.userId
            ? {
                ...u,
                isOnline: !!payload.isOnline,
                lastSeen: payload.isOnline ? u.lastSeen : new Date().toISOString(),
              }
            : u,
        ),
      );
    }
    socket.on(SOCKET_EVENTS.PRESENCE, onPresence);
    return () => {
      socket.off(SOCKET_EVENTS.PRESENCE, onPresence);
    };
  }, []);

  async function block(u: AppUser) {
    setBusyId(u.id);
    try {
      await userService.block(u.id);
      toast.success(`${u.name} blocked`);
      setSelected(null);
      load();
    } catch (e) {
      toast.error((e as { message?: string }).message ?? 'Failed to block');
    } finally {
      setBusyId(null);
    }
  }

  async function unblock(u: AppUser) {
    setBusyId(u.id);
    try {
      await userService.unblock(u.id);
      toast.success(`${u.name} unblocked`);
      setSelected(null);
      load();
    } catch (e) {
      toast.error((e as { message?: string }).message ?? 'Failed to unblock');
    } finally {
      setBusyId(null);
    }
  }

  async function confirmDelete() {
    if (!deletingUser) return;
    setBusyId(deletingUser.id);
    try {
      await userService.remove(deletingUser.id);
      toast.success(`${deletingUser.name} deleted`);
      setDeletingUser(null);
      setSelected(null);
      load();
    } catch (e) {
      toast.error((e as { message?: string }).message ?? 'Failed to delete');
    } finally {
      setBusyId(null);
    }
  }

  async function exportAllCsv() {
    setExporting(true);
    const t = toast.loading('Preparing CSV…');
    try {
      const users = await userService.exportAll({
        search: debouncedSearch,
        status,
        sort,
        online: onlineOnly ? true : undefined,
        registeredFrom: registeredFrom || undefined,
        registeredTo: registeredTo || undefined,
      });
      exportCsv(`iu-chat-users-${new Date().toISOString().slice(0, 10)}.csv`, users, [
        { key: 'id', header: 'ID' },
        { key: 'name', header: 'Name' },
        { key: 'username', header: 'Username' },
        { key: 'phone', header: 'Phone' },
        { key: 'email', header: 'Email' },
        { key: 'country', header: 'Country' },
        { key: 'status', header: 'Status' },
        { key: 'isOnline', header: 'Online', value: (u) => (u.isOnline ? 'yes' : 'no') },
        { key: 'lastSeen', header: 'Last seen' },
        { key: 'createdAt', header: 'Registered' },
        { key: 'totalMessages', header: 'Messages' },
        { key: 'totalCalls', header: 'Calls' },
      ]);
      toast.success(`Exported ${users.length.toLocaleString()} users`, { id: t });
    } catch (e) {
      toast.error((e as { message?: string }).message ?? 'Export failed', { id: t });
    } finally {
      setExporting(false);
    }
  }

  const columns = useMemo<Column<AppUser>[]>(
    () => [
      {
        key: 'avatar',
        header: '',
        width: '60px',
        render: (u) => (
          <div className="relative">
            {u.avatar ? (
              <img
                src={u.avatar}
                alt={u.name}
                className="w-10 h-10 rounded-full object-cover ring-2 ring-white dark:ring-slate-900"
              />
            ) : (
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary-blue to-purple text-white flex items-center justify-center text-xs font-bold ring-2 ring-white dark:ring-slate-900">
                {initials(u.name)}
              </div>
            )}
            <span
              className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full ring-2 ring-white dark:ring-slate-900 ${
                u.isOnline ? 'bg-emerald-500' : 'bg-slate-300 dark:bg-slate-600'
              }`}
            />
          </div>
        ),
      },
      {
        key: 'username',
        header: 'User',
        render: (u) => (
          <div>
            <p className="font-semibold text-text-dark dark:text-white">{u.name}</p>
            <p className="text-xs text-text-light dark:text-slate-400">
              {u.username ? `@${u.username}` : u.id}
            </p>
          </div>
        ),
      },
      { key: 'phone', header: 'Phone' },
      {
        key: 'email',
        header: 'Email',
        render: (u) => u.email ?? <span className="text-text-light dark:text-slate-500">—</span>,
      },
      {
        key: 'status',
        header: 'Status',
        render: (u) => {
          const cls =
            u.status === 'active'
              ? 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-300 dark:border-emerald-500/30'
              : u.status === 'blocked'
              ? 'bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-500/10 dark:text-rose-300 dark:border-rose-500/30'
              : 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-500/10 dark:text-amber-300 dark:border-amber-500/30';
          return (
            <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border ${cls}`}>
              {u.status}
            </span>
          );
        },
      },
      { key: 'createdAt', header: 'Registered', render: (u) => formatDate(u.createdAt) },
      {
        key: 'lastSeen',
        header: 'Last Active',
        render: (u) =>
          u.isOnline ? (
            <span className="inline-flex items-center gap-1 text-xs font-medium text-emerald-700 dark:text-emerald-400">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              Online
            </span>
          ) : (
            <span className="text-text-light dark:text-slate-400 text-xs">{timeAgo(u.lastSeen)}</span>
          ),
      },
      {
        key: 'actions',
        header: 'Actions',
        className: 'text-right',
        render: (u) => (
          <div className="flex items-center justify-end gap-1.5" onClick={(e) => e.stopPropagation()}>
            <button
              type="button"
              onClick={() => setSelected(u)}
              className="px-2.5 py-1 rounded-md text-xs font-medium border border-slate-300 dark:border-slate-700 text-text-dark dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800"
            >
              View
            </button>
            {u.status === 'blocked' ? (
              <button
                type="button"
                disabled={busyId === u.id}
                onClick={() => unblock(u)}
                className="px-2.5 py-1 rounded-md text-xs font-medium border border-emerald-300 text-emerald-700 dark:text-emerald-300 hover:bg-emerald-50 dark:hover:bg-emerald-500/10 disabled:opacity-50"
              >
                Unblock
              </button>
            ) : (
              <button
                type="button"
                disabled={busyId === u.id}
                onClick={() => block(u)}
                className="px-2.5 py-1 rounded-md text-xs font-medium border border-amber-300 text-amber-700 dark:text-amber-300 hover:bg-amber-50 dark:hover:bg-amber-500/10 disabled:opacity-50"
              >
                Block
              </button>
            )}
            <button
              type="button"
              disabled={busyId === u.id}
              onClick={() => setDeletingUser(u)}
              className="px-2.5 py-1 rounded-md text-xs font-medium border border-rose-300 text-rose-700 dark:text-rose-300 hover:bg-rose-50 dark:hover:bg-rose-500/10 disabled:opacity-50"
            >
              Delete
            </button>
          </div>
        ),
      },
    ],
    [busyId],
  );

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h2 className="font-display text-2xl font-bold text-text-dark dark:text-white">Users</h2>
          <p className="text-sm text-text-light dark:text-slate-400 mt-1">
            Search, filter and manage every user on the platform.
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
            onClick={exportAllCsv}
            disabled={exporting}
            className="px-3 py-2 rounded-lg text-sm font-medium border border-slate-300 dark:border-slate-700 text-text-dark dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 disabled:opacity-50 inline-flex items-center gap-1.5"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 10v6m0 0l-3-3m3 3l3-3M20 13v6a2 2 0 01-2 2H6a2 2 0 01-2-2v-6" />
            </svg>
            {exporting ? 'Exporting…' : 'Export CSV'}
          </button>
        </div>
      </div>

      <div className="flex flex-wrap gap-3 items-center">
        <SearchBar
          value={search}
          onChange={(v) => {
            setSearch(v);
            setPage(1);
          }}
          placeholder="Search by name, email, phone…"
        />
        <select
          value={status}
          onChange={(e) => {
            setStatus(e.target.value as '' | UserStatus);
            setPage(1);
          }}
          className="px-3 py-2.5 border border-slate-300 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-900 text-text-dark dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-blue/30 focus:border-primary-blue"
        >
          {STATUS_FILTERS.map((s) => (
            <option key={s.value} value={s.value}>
              {s.label}
            </option>
          ))}
        </select>
        <select
          value={sort}
          onChange={(e) => {
            setSort(e.target.value as UserSort);
            setPage(1);
          }}
          className="px-3 py-2.5 border border-slate-300 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-900 text-text-dark dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-blue/30 focus:border-primary-blue"
        >
          {SORT_OPTIONS.map((s) => (
            <option key={s.value} value={s.value}>
              {s.label}
            </option>
          ))}
        </select>
        <div className="inline-flex items-center gap-2 px-3 py-2 border border-slate-300 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-900">
          <label
            htmlFor="reg-from"
            className="text-xs font-medium text-text-light dark:text-slate-400"
          >
            Registered
          </label>
          <input
            id="reg-from"
            type="date"
            value={registeredFrom}
            max={registeredTo || todayDateInputValue()}
            onChange={(e) => {
              setRegisteredFrom(e.target.value);
              setPage(1);
            }}
            className="bg-transparent text-sm text-text-dark dark:text-white focus:outline-none"
          />
          <span className="text-text-light dark:text-slate-500 text-sm">→</span>
          <input
            type="date"
            value={registeredTo}
            min={registeredFrom || undefined}
            max={todayDateInputValue()}
            onChange={(e) => {
              setRegisteredTo(e.target.value);
              setPage(1);
            }}
            className="bg-transparent text-sm text-text-dark dark:text-white focus:outline-none"
          />
          {(registeredFrom || registeredTo) && (
            <button
              type="button"
              onClick={() => {
                setRegisteredFrom('');
                setRegisteredTo('');
                setPage(1);
              }}
              aria-label="Clear date filter"
              className="text-text-light dark:text-slate-400 hover:text-rose-600"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>
        <label className="inline-flex items-center gap-2 px-3 py-2.5 border border-slate-300 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-900 cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800">
          <input
            type="checkbox"
            checked={onlineOnly}
            onChange={(e) => {
              setOnlineOnly(e.target.checked);
              setPage(1);
            }}
            className="accent-primary-blue"
          />
          <span className="text-sm text-text-dark dark:text-slate-200">Online only</span>
        </label>
      </div>

      <DataTable
        columns={columns}
        data={data}
        loading={loading}
        rowKey={(u) => u.id}
        onRowClick={(u) => setSelected(u)}
        emptyMessage="No users found for the current filters."
      />
      <Pagination page={page} pageSize={pageSize} total={total} onChange={setPage} />

      <UserProfileModal
        user={selected}
        onClose={() => setSelected(null)}
        onBlock={block}
        onUnblock={unblock}
        onDelete={(u) => setDeletingUser(u)}
      />

      <ConfirmationDialog
        open={!!deletingUser}
        title="Delete user?"
        description={deletingUser ? `${deletingUser.name} will lose access to IU Chat permanently.` : undefined}
        confirmLabel="Delete user"
        variant="danger"
        loading={!!busyId && deletingUser?.id === busyId}
        onConfirm={confirmDelete}
        onClose={() => setDeletingUser(null)}
      />
    </div>
  );
}
