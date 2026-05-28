import api, { unwrap } from './api';
import type {
  ActivityItem,
  AppUser,
  DashboardOverview,
  Paginated,
  RegistrationsRangeResponse,
} from '../types';

export interface RegistrationsRangeParams {
  /** ISO datetime, inclusive. */
  from: string;
  /** ISO datetime, inclusive. */
  to: string;
}

/**
 * Dashboard data service. Every method talks directly to the backend; if the
 * endpoint isn't implemented yet the call rejects and the calling page should
 * render its empty / error state.
 *
 * Backend endpoints (mounted under `VITE_API_URL`):
 *   GET /admin/dashboard/overview
 *   GET /admin/dashboard/activity?limit=
 *   GET /admin/users?page=1&pageSize=&sort=latest      (used for the "Recent users" panel)
 *   GET /admin/analytics/registrations?from=&to=       (drives the Registrations panel)
 */
export const dashboardService = {
  overview: () => unwrap<DashboardOverview>(api.get('/admin/dashboard/overview')),

  recentActivity: (limit = 20) =>
    unwrap<ActivityItem[]>(api.get('/admin/dashboard/activity', { params: { limit } })),

  recentUsers: async (limit = 10): Promise<AppUser[]> => {
    const res = await unwrap<Paginated<AppUser> | AppUser[]>(
      api.get('/admin/users', { params: { page: 1, pageSize: limit, sort: 'latest' } }),
    );
    if (Array.isArray(res)) return res;
    return res.data ?? [];
  },

  /**
   * Count + daily breakdown of new registrations between `from` and `to`
   * (both inclusive ISO datetimes). Used by the dashboard Registrations
   * panel for Today / Yesterday / This week / Last week / This month / etc.
   */
  registrationsRange: (params: RegistrationsRangeParams) =>
    unwrap<RegistrationsRangeResponse>(
      api.get('/admin/analytics/registrations', { params }),
    ),
};

export default dashboardService;
