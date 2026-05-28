/**
 * Central axios setup for the Super Admin Portal.
 *  - JWT request interceptor.
 *  - 401 redirect + 5xx toast in the response interceptor.
 *  - `unwrap` tolerates `{ data: ... }` or raw payloads.
 *  - DEV request/response logging for admin routes (see apiDebug.ts).
 */
import axios, { AxiosError, AxiosInstance, AxiosRequestConfig } from 'axios';
import toast from 'react-hot-toast';
import {
  API_URL,
  ADMIN_KEY,
  TOKEN_KEY,
  isDevMockToken,
  resolveApiUrl,
} from './apiConfig';
import {
  attachAxiosDebugLogging,
  logApiFailure,
  logApiSuccess,
  normalizeApiError,
} from '../utils/apiDebug';

export { API_URL, ADMIN_KEY, TOKEN_KEY, isDevMockToken, resolveApiUrl };

export const tokenStorage = {
  get: () => localStorage.getItem(TOKEN_KEY),
  set: (token: string) => localStorage.setItem(TOKEN_KEY, token),
  clear: () => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(ADMIN_KEY);
  },
};

if (import.meta.env.DEV) {
  // eslint-disable-next-line no-console
  console.info('[api] Super Admin base URL:', API_URL);
}

const api: AxiosInstance = axios.create({
  baseURL: API_URL,
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
});

api.interceptors.request.use((config) => {
  const token = tokenStorage.get();
  if (token) {
    config.headers = config.headers ?? {};
    (config.headers as Record<string, string>).Authorization = `Bearer ${token}`;
  }
  return attachAxiosDebugLogging(config);
});

api.interceptors.response.use(
  (res) => {
    const url = res.config.url ?? '';
    if (
      import.meta.env.DEV &&
      (url.includes('/admin/admins') ||
        url.includes('/admin/auth/') ||
        import.meta.env.VITE_API_DEBUG === 'true')
    ) {
      logApiSuccess(`${(res.config.method ?? 'get').toUpperCase()} ${url}`, res);
    }
    return res;
  },
  (error: AxiosError<{ message?: string; error?: string }>) => {
    const normalized = normalizeApiError(error);
    const url = error.config?.url ?? '';

    if (
      import.meta.env.DEV &&
      (url.includes('/admin/admins') ||
        url.includes('/admin/auth/') ||
        import.meta.env.VITE_API_DEBUG === 'true')
    ) {
      logApiFailure(`${(error.config?.method ?? 'get').toUpperCase()} ${url}`, normalized);
    }

    const status = normalized.status;

    const activeToken = tokenStorage.get();
    const isDevSession = import.meta.env.DEV && isDevMockToken(activeToken);

    if (status === 401 && isDevSession) {
      // A dev mock login lets the UI be browsed while the backend is offline or
      // incomplete. Do not let follow-up API calls with the mock token kick the
      // user back to /admin/login; surface the page-level error instead.
      if (import.meta.env.DEV) {
        // eslint-disable-next-line no-console
        console.warn(
          '[api] Backend returned 401 during DEV mock session; keeping local session active.',
          normalized,
        );
      }
    } else if (status === 401) {
      tokenStorage.clear();
      if (!window.location.pathname.startsWith('/admin/login')) {
        toast.error('Session expired. Please sign in again.');
        window.location.href = '/admin/login';
      }
    } else if (status && status >= 500) {
      toast.error(normalized.message || 'Server error. Please try again shortly.');
    }

    return Promise.reject(normalized);
  },
);

export async function unwrap<T>(req: Promise<{ data: unknown }>, fallback?: T): Promise<T> {
  try {
    const res = await req;
    const body = res.data as { data?: T } | T;
    if (body && typeof body === 'object' && 'data' in (body as object)) {
      return (body as { data: T }).data;
    }
    return body as T;
  } catch (err) {
    if (fallback !== undefined) return fallback;
    throw err;
  }
}

/**
 * Resolves to live data when the request succeeds, or to mock data when the
 * endpoint is unreachable / returns 4xx/5xx.
 */
export async function withMock<T>(
  req: Promise<{ data: unknown }>,
  mock: T | (() => T),
): Promise<T> {
  try {
    const res = await req;
    const body = res.data as { data?: T } | T;
    if (body && typeof body === 'object' && 'data' in (body as object)) {
      return (body as { data: T }).data;
    }
    return body as T;
  } catch {
    return typeof mock === 'function' ? (mock as () => T)() : mock;
  }
}

export type ApiRequestConfig = AxiosRequestConfig;
export default api;
