import api, { isDevMockToken, tokenStorage, unwrap } from './api';
import { buildApiUrl, isNetworkFailure, logApiFailure, logApiRequest } from '../utils/apiDebug';
import {
  createDevAdmin,
  listDevAdmins,
  removeDevAdmin,
  setDevAdminStatus,
  updateDevAdmin,
} from './devAdminStore';
import type {
  AdminAccount,
  AdminRole,
  CreateAdminPayload,
  Paginated,
  UpdateAdminPayload,
} from '../types';

export interface ListAdminsParams {
  page?: number;
  pageSize?: number;
  search?: string;
  role?: '' | AdminRole;
}

const CREATE_PATH = '/admin/admins';

function shouldUseDevAdminFallback(): boolean {
  return import.meta.env.DEV && isDevMockToken(tokenStorage.get());
}

/**
 * When the active session is a DEV mock (issued because the backend was
 * unreachable at login time), the backend will reject every request with
 * "invalid token". Skip the network entirely and use the local dev store so
 * the UI keeps working until the user logs out + back in with real creds.
 */
function isUsingDevMockSession(): boolean {
  return shouldUseDevAdminFallback();
}

function warnDevMockShortcircuit(label: string): void {
  if (!import.meta.env.DEV) return;
  // eslint-disable-next-line no-console
  console.warn(
    `[adminService.${label}] Using DEV local store — current session is a dev_mock_… token. ` +
      'Log out and log in again to get a real backend session.',
  );
}

/**
 * Admin-account management service.
 *
 * Backend endpoints (base = VITE_API_URL):
 *   GET    /admin/admins?page=&pageSize=&search=&role=
 *   GET    /admin/admins/:id
 *   POST   /admin/admins                  body: CreateAdminPayload
 *   PUT    /admin/admins/:id              body: UpdateAdminPayload
 *   POST   /admin/admins/:id/suspend
 *   POST   /admin/admins/:id/activate
 *   DELETE /admin/admins/:id
 */
export const adminService = {
  list: async (params: ListAdminsParams = {}) => {
    if (isUsingDevMockSession()) {
      warnDevMockShortcircuit('list');
      return listDevAdmins(params);
    }

    logApiRequest('adminService.list', {
      method: 'GET',
      url: CREATE_PATH,
      params,
    });
    try {
      return await unwrap<Paginated<AdminAccount>>(api.get(CREATE_PATH, { params }));
    } catch (err) {
      if (shouldUseDevAdminFallback() && isNetworkFailure(err)) {
        // eslint-disable-next-line no-console
        console.warn(
          '[adminService.list] Backend unreachable — returning admins from DEV local store.',
          err,
        );
        return listDevAdmins(params);
      }
      logApiFailure('adminService.list', err);
      throw err;
    }
  },

  get: (id: string) => unwrap<AdminAccount>(api.get(`${CREATE_PATH}/${id}`)),

  create: async (payload: CreateAdminPayload) => {
    if (isUsingDevMockSession()) {
      warnDevMockShortcircuit('create');
      const created = createDevAdmin(payload);
      // eslint-disable-next-line no-console
      console.log('[adminService.create] DEV mock session — created admin in local store:', created);
      return created;
    }

    logApiRequest('adminService.create (Add admin)', {
      method: 'POST',
      url: CREATE_PATH,
      payload,
    });

    try {
      const created = await unwrap<AdminAccount>(api.post(CREATE_PATH, payload));
      if (import.meta.env.DEV) {
        // eslint-disable-next-line no-console
        console.log('[adminService.create] Success — created admin:', created);
      }
      return created;
    } catch (err) {
      logApiFailure('adminService.create (Add admin)', err);

      if (shouldUseDevAdminFallback() && isNetworkFailure(err)) {
        // eslint-disable-next-line no-console
        console.warn(
          `[adminService.create] Backend unreachable at ${buildApiUrl(CREATE_PATH)} — ` +
            'saving admin to DEV local store. Implement POST /admin/admins on your API for production.',
        );
        const created = createDevAdmin(payload);
        // eslint-disable-next-line no-console
        console.log('[adminService.create] DEV fallback created admin:', created);
        return created;
      }

      throw err;
    }
  },

  update: async (id: string, payload: UpdateAdminPayload) => {
    if (isUsingDevMockSession()) {
      warnDevMockShortcircuit('update');
      return updateDevAdmin(id, payload);
    }

    try {
      return await unwrap<AdminAccount>(api.put(`${CREATE_PATH}/${id}`, payload));
    } catch (err) {
      if (shouldUseDevAdminFallback() && isNetworkFailure(err)) {
        return updateDevAdmin(id, payload);
      }
      throw err;
    }
  },

  suspend: async (id: string) => {
    if (isUsingDevMockSession()) {
      warnDevMockShortcircuit('suspend');
      return setDevAdminStatus(id, 'suspended');
    }

    try {
      return await unwrap<AdminAccount>(api.post(`${CREATE_PATH}/${id}/suspend`));
    } catch (err) {
      if (shouldUseDevAdminFallback() && isNetworkFailure(err)) {
        return setDevAdminStatus(id, 'suspended');
      }
      throw err;
    }
  },

  activate: async (id: string) => {
    if (isUsingDevMockSession()) {
      warnDevMockShortcircuit('activate');
      return setDevAdminStatus(id, 'active');
    }

    try {
      return await unwrap<AdminAccount>(api.post(`${CREATE_PATH}/${id}/activate`));
    } catch (err) {
      if (shouldUseDevAdminFallback() && isNetworkFailure(err)) {
        return setDevAdminStatus(id, 'active');
      }
      throw err;
    }
  },

  remove: async (id: string) => {
    if (isUsingDevMockSession()) {
      warnDevMockShortcircuit('remove');
      removeDevAdmin(id);
      return;
    }

    try {
      await api.delete(`${CREATE_PATH}/${id}`);
    } catch (err) {
      if (shouldUseDevAdminFallback() && isNetworkFailure(err)) {
        removeDevAdmin(id);
        return;
      }
      throw err;
    }
  },
};

export default adminService;
