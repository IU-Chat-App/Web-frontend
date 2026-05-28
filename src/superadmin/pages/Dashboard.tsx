import { useCallback, useEffect, useState } from 'react';
import dashboardService from '../services/dashboardService';
import { getSocket, SOCKET_EVENTS } from '../utils/socket';
import StatCard from '../components/StatCard';
import RecentActivity from '../components/RecentActivity';
import RecentUsersTable from '../components/RecentUsersTable';
import RegistrationsPanel from '../components/RegistrationsPanel';
import { formatNumber } from '../utils/format';
import type { ActivityItem, AppUser, DashboardOverview } from '../types';

const REFRESH_MS = 60_000;
const ACTIVITY_LIMIT = 20;
const RECENT_USERS_LIMIT = 6;

/**
 * Super Admin dashboard. Pulls every metric from the live backend; if an
 * endpoint isn't implemented yet the corresponding card just stays empty
 * (the StatCard component handles `undefined` gracefully).
 *
 * Real-time updates piggy-back on the socket.io connection emitted by the
 * backend on the `admin:*` channels.
 */
export default function Dashboard() {
  const [overview, setOverview] = useState<DashboardOverview | null>(null);
  const [recent, setRecent] = useState<ActivityItem[]>([]);
  const [recentUsers, setRecentUsers] = useState<AppUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingRecent, setLoadingRecent] = useState(true);

  const loadAll = useCallback(async () => {
    const results = await Promise.allSettled([
      dashboardService.overview(),
      dashboardService.recentUsers(RECENT_USERS_LIMIT),
    ]);
    if (results[0].status === 'fulfilled') setOverview(results[0].value);
    if (results[1].status === 'fulfilled') setRecentUsers(results[1].value);
  }, []);

  const loadRecent = useCallback(async () => {
    try {
      setRecent(await dashboardService.recentActivity(ACTIVITY_LIMIT));
    } catch {
      setRecent([]);
    }
  }, []);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoading(true);
      try {
        await loadAll();
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    (async () => {
      setLoadingRecent(true);
      try {
        await loadRecent();
      } finally {
        if (!cancelled) setLoadingRecent(false);
      }
    })();

    const t = setInterval(() => loadAll(), REFRESH_MS);
    return () => {
      cancelled = true;
      clearInterval(t);
    };
  }, [loadAll, loadRecent]);

  // Real-time updates via socket.io.
  useEffect(() => {
    const socket = getSocket();

    function onStats(payload: Partial<DashboardOverview>) {
      setOverview((prev) => (prev ? { ...prev, ...payload } : (payload as DashboardOverview)));
    }
    function onPresence(payload: { onlineUsers: number }) {
      setOverview((prev) => (prev ? { ...prev, onlineUsers: payload.onlineUsers } : prev));
    }
    function onActivity(item: ActivityItem) {
      setRecent((prev) => [item, ...prev].slice(0, ACTIVITY_LIMIT));
    }
    function onRegistration() {
      setOverview((prev) =>
        prev
          ? {
              ...prev,
              totalUsers: prev.totalUsers + 1,
              usersToday: prev.usersToday + 1,
              usersThisWeek: prev.usersThisWeek + 1,
              usersThisMonth: prev.usersThisMonth + 1,
            }
          : prev,
      );
    }

    socket.on(SOCKET_EVENTS.STATS, onStats);
    socket.on(SOCKET_EVENTS.PRESENCE, onPresence);
    socket.on(SOCKET_EVENTS.ACTIVITY, onActivity);
    socket.on(SOCKET_EVENTS.REGISTRATION, onRegistration);

    return () => {
      socket.off(SOCKET_EVENTS.STATS, onStats);
      socket.off(SOCKET_EVENTS.PRESENCE, onPresence);
      socket.off(SOCKET_EVENTS.ACTIVITY, onActivity);
      socket.off(SOCKET_EVENTS.REGISTRATION, onRegistration);
    };
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex items-end justify-between flex-wrap gap-3">
        <div>
          <h2 className="font-display text-2xl font-bold text-text-dark dark:text-white">
            Dashboard
          </h2>
          <p className="text-sm text-text-light dark:text-slate-400 mt-1">
            Real-time overview of your IU Chat platform.
          </p>
        </div>
        <span className="text-xs text-text-light dark:text-slate-500">
          Auto-refresh every 60s
        </span>
      </div>

      {/* User-centric KPI cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-4">
        <StatCard
          label="Total Users"
          value={formatNumber(overview?.totalUsers)}
          delta={overview?.growthRate ? `${overview.growthRate.toFixed(1)}% growth` : 'All-time'}
          trend="up"
          tint="blue"
          loading={loading}
        />
        <StatCard
          label="Today's Registrations"
          value={formatNumber(overview?.usersToday)}
          delta="Last 24h"
          trend="up"
          tint="emerald"
          loading={loading}
        />
        <StatCard
          label="Weekly Registrations"
          value={formatNumber(overview?.usersThisWeek)}
          delta="Last 7 days"
          trend="up"
          tint="sky"
          loading={loading}
        />
        <StatCard
          label="Monthly Registrations"
          value={formatNumber(overview?.usersThisMonth)}
          delta="Last 30 days"
          trend="up"
          tint="purple"
          loading={loading}
        />
        <StatCard
          label="Active Users"
          value={formatNumber(overview?.activeUsers)}
          delta={`${formatNumber(overview?.onlineUsers)} online now`}
          trend="up"
          tint="indigo"
          loading={loading}
        />
        <StatCard
          label="Support Tickets"
          value={formatNumber(overview?.totalReports ?? overview?.reportedUsers)}
          delta={(overview?.totalReports ?? overview?.reportedUsers) ? 'Needs attention' : 'All clear'}
          trend={(overview?.totalReports ?? overview?.reportedUsers) ? 'down' : 'flat'}
          tint="rose"
          loading={loading}
        />
      </div>

      {/* Interactive registrations explorer + recent users */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
        <div className="xl:col-span-2">
          <RegistrationsPanel />
        </div>
        <RecentUsersTable users={recentUsers} loading={loading} />
      </div>

      <RecentActivity items={recent} loading={loadingRecent} />
    </div>
  );
}
