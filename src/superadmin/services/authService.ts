import api, { ADMIN_KEY, isDevMockToken, tokenStorage, unwrap } from './api';
import { DEV_TOKEN_PREFIX } from './apiConfig';
import type { AdminUser, LoginRequest, LoginResponse } from '../types';

/**
 * Authentication service. Wraps the backend auth endpoints.
 *
 * In development (`npm run dev`) we fall back to a local mock session when the
 * backend is unreachable. The fallback issues a `dev_mock_…` token; admin CRUD
 * can then use the DEV local store when the API is still offline.
 */

function makeMockLoginResponse(payload: LoginRequest): LoginResponse {
  const email = payload.email.trim() || 'admin@iuindia.com';
  const name =
    email
      .split('@')[0]
      .replace(/[._-]+/g, ' ')
      .replace(/\b\w/g, (c) => c.toUpperCase()) || 'Super Admin';
  return {
    token: `${DEV_TOKEN_PREFIX}${Date.now()}_${Math.random().toString(36).slice(2, 10)}`,
    admin: {
      id: 'admin_dev',
      name,
      email,
      role: 'super_admin',
      createdAt: new Date().toISOString(),
    },
  };
}

export const authService = {
  login: async (payload: LoginRequest): Promise<LoginResponse> => {
    try {
      return await unwrap<LoginResponse>(api.post('/admin/auth/login', payload));
    } catch (err) {
      if (import.meta.env.DEV) {
        // eslint-disable-next-line no-console
        console.warn(
          '[authService] Backend login unreachable — using a local DEV mock session. ' +
            'This only happens in `npm run dev`; production builds still surface the error.',
          err,
        );
        return makeMockLoginResponse(payload);
      }
      throw err;
    }
  },

  me: async (): Promise<AdminUser> => {
    // If the active token was issued by the dev fallback above, short-circuit
    // straight to the cached admin record so a page reload doesn't kick the
    // user out while the real backend is still offline.
    const token = tokenStorage.get();
    if (isDevMockToken(token)) {
      const cached = localStorage.getItem(ADMIN_KEY);
      if (cached) {
        try {
          return JSON.parse(cached) as AdminUser;
        } catch {
          // Fall through to the real API call below.
        }
      }
    }
    // Backend may return either { admin: AdminUser } or AdminUser directly.
    // Normalize so the AuthContext always sees a flat admin record.
    const payload = await unwrap<AdminUser | { admin: AdminUser }>(
      api.get('/admin/auth/me'),
    );
    if (payload && typeof payload === 'object' && 'admin' in payload) {
      return (payload as { admin: AdminUser }).admin;
    }
    return payload as AdminUser;
  },

  logout: () => api.post('/admin/auth/logout').catch(() => undefined),

  refresh: () => unwrap<{ token: string }>(api.post('/admin/auth/refresh')),
};

export default authService;
