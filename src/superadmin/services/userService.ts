import api, { unwrap } from './api';
import type { AppUser, Paginated, UserSort, UserStatus } from '../types';

export interface ListUsersParams {
  page?: number;
  pageSize?: number;
  search?: string;
  status?: '' | UserStatus;
  sort?: UserSort;
  online?: boolean;
  /** Filter: only users whose `createdAt >= registeredFrom` (`YYYY-MM-DD`). */
  registeredFrom?: string;
  /** Filter: only users whose `createdAt <= registeredTo` (`YYYY-MM-DD`, inclusive). */
  registeredTo?: string;
}

/**
 * User management service. All data comes from the backend.
 *
 * Backend endpoints:
 *   GET    /admin/users?page=&pageSize=&search=&status=&sort=&online=
 *   GET    /admin/users/:id
 *   POST   /admin/users/:id/block
 *   POST   /admin/users/:id/unblock
 *   DELETE /admin/users/:id
 */
export const userService = {
  list: (params: ListUsersParams = {}) =>
    unwrap<Paginated<AppUser>>(api.get('/admin/users', { params })),

  get: (id: string) => unwrap<AppUser>(api.get(`/admin/users/${id}`)),

  block: (id: string) => unwrap<AppUser>(api.post(`/admin/users/${id}/block`)),
  unblock: (id: string) => unwrap<AppUser>(api.post(`/admin/users/${id}/unblock`)),
  remove: (id: string) => api.delete(`/admin/users/${id}`),

  /** Export all users by paginating through the API server-side (max 50 pages). */
  exportAll: async (params: ListUsersParams = {}): Promise<AppUser[]> => {
    const pageSize = 200;
    const collected: AppUser[] = [];
    let page = 1;
    while (page <= 50) {
      const res = await userService.list({ ...params, page, pageSize });
      collected.push(...res.data);
      if (collected.length >= res.total || res.data.length < pageSize) break;
      page += 1;
    }
    return collected;
  },
};

export default userService;
