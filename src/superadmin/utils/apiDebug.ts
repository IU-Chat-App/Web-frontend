import type { AxiosError, AxiosResponse, InternalAxiosRequestConfig } from 'axios';
import { API_URL, TOKEN_KEY } from '../services/apiConfig';

export interface ApiClientError {
  status?: number;
  message: string;
  code?: string;
  url?: string;
  method?: string;
  payload?: unknown;
  responseData?: unknown;
  responseHeaders?: Record<string, string>;
  isNetworkError: boolean;
  raw?: AxiosError;
}

function maskToken(token: string | null): string {
  if (!token) return '(none)';
  if (token.length <= 12) return `${token.slice(0, 4)}…`;
  return `${token.slice(0, 8)}…${token.slice(-4)}`;
}

export function buildApiUrl(path: string): string {
  const base = API_URL.replace(/\/$/, '');
  const suffix = path.startsWith('/') ? path : `/${path}`;
  return `${base}${suffix}`;
}

export function isNetworkFailure(error: unknown): boolean {
  if (!error || typeof error !== 'object') return false;
  const err = error as ApiClientError & { raw?: AxiosError };
  if (err.isNetworkError) return true;

  // Backend reachable but its CORS middleware rejected the request. From the
  // frontend's point of view this is just as broken as the API being offline,
  // so let the dev fallback (DEV mock token + local store) kick in.
  const responseData = err.responseData as
    | { message?: string; error?: string }
    | undefined;
  const messages = [
    err.message,
    responseData?.message,
    responseData?.error,
  ].filter(Boolean) as string[];
  if (messages.some((msg) => /not allowed by cors|cors/i.test(msg))) {
    return true;
  }

  const axiosErr = err.raw;
  if (!axiosErr) return false;
  return !axiosErr.response && axiosErr.code === 'ERR_NETWORK';
}

export function normalizeApiError(error: unknown): ApiClientError {
  if (error && typeof error === 'object' && 'isNetworkError' in error) {
    return error as ApiClientError;
  }

  const axiosErr = error as AxiosError<{ message?: string; error?: string }>;
  if (axiosErr?.isAxiosError) {
    const status = axiosErr.response?.status;
    const responseData = axiosErr.response?.data;
    const url = axiosErr.config?.url ? buildApiUrl(axiosErr.config.url) : undefined;
    const isNetworkError = !axiosErr.response && axiosErr.code === 'ERR_NETWORK';

    let message =
      (responseData &&
        typeof responseData === 'object' &&
        ('message' in responseData
          ? (responseData as { message?: string }).message
          : 'error' in responseData
            ? (responseData as { error?: string }).error
            : undefined)) ||
      axiosErr.message ||
      'Something went wrong';

    if (isNetworkError) {
      message =
        `Cannot reach backend at ${url ?? API_URL}. ` +
        'Check that the API server is running, VITE_API_URL is correct, and CORS allows this origin. ' +
        'Open the browser console for the full request/error dump.';
    } else if (status === 404) {
      message = `Endpoint not found (404): ${url ?? 'unknown URL'}`;
    } else if (status === 403) {
      message = responseData?.message || 'Forbidden — your account may not have permission.';
    }

    return {
      status,
      message,
      code: axiosErr.code,
      url,
      method: axiosErr.config?.method?.toUpperCase(),
      payload: axiosErr.config?.data,
      responseData,
      responseHeaders: axiosErr.response?.headers as Record<string, string> | undefined,
      isNetworkError,
      raw: axiosErr,
    };
  }

  const fallback = error as { status?: number; message?: string; raw?: AxiosError };
  return {
    status: fallback.status,
    message: fallback.message ?? 'Something went wrong',
    isNetworkError: false,
    raw: fallback.raw,
  };
}

export function getApiErrorMessage(error: unknown): string {
  return normalizeApiError(error).message;
}

export function logApiRequest(
  label: string,
  config: {
    method?: string;
    url: string;
    payload?: unknown;
    params?: unknown;
  },
): void {
  if (!import.meta.env.DEV) return;
  const token = localStorage.getItem(TOKEN_KEY);
  // eslint-disable-next-line no-console
  console.groupCollapsed(`[API] ${label}`);
  // eslint-disable-next-line no-console
  console.log('API URL:', buildApiUrl(config.url));
  // eslint-disable-next-line no-console
  console.log('Method:', (config.method ?? 'GET').toUpperCase());
  // eslint-disable-next-line no-console
  console.log('Request payload:', config.payload ?? null);
  // eslint-disable-next-line no-console
  console.log('Query params:', config.params ?? null);
  // eslint-disable-next-line no-console
  console.log('Authorization:', token ? `Bearer ${maskToken(token)}` : '(missing — request is unauthenticated)');
  // eslint-disable-next-line no-console
  console.groupEnd();
}

export function logApiSuccess(label: string, response: AxiosResponse): void {
  if (!import.meta.env.DEV) return;
  // eslint-disable-next-line no-console
  console.groupCollapsed(`[API] ${label} ✓ ${response.status}`);
  // eslint-disable-next-line no-console
  console.log('Response status:', response.status, response.statusText);
  // eslint-disable-next-line no-console
  console.log('Response data:', response.data);
  // eslint-disable-next-line no-console
  console.groupEnd();
}

export function logApiFailure(label: string, error: unknown): void {
  if (!import.meta.env.DEV) return;
  const normalized = normalizeApiError(error);
  // eslint-disable-next-line no-console
  console.groupCollapsed(`[API] ${label} ✗`);
  // eslint-disable-next-line no-console
  console.error('Normalized error:', normalized);
  if (normalized.raw) {
    // eslint-disable-next-line no-console
    console.error('Axios error:', normalized.raw);
    // eslint-disable-next-line no-console
    console.error('Backend response body:', normalized.raw.response?.data ?? '(no response body — network/CORS/SSL failure)');
    // eslint-disable-next-line no-console
    console.error('Backend response status:', normalized.raw.response?.status ?? '(no HTTP status)');
  }
  // eslint-disable-next-line no-console
  console.groupEnd();
}

export function attachAxiosDebugLogging(
  config: InternalAxiosRequestConfig,
): InternalAxiosRequestConfig {
  if (!import.meta.env.DEV) return config;
  const url = config.url ?? '';
  const shouldLog =
    url.includes('/admin/admins') ||
    url.includes('/admin/auth/') ||
    import.meta.env.VITE_API_DEBUG === 'true';

  if (shouldLog) {
    let payload: unknown = config.data;
    if (typeof payload === 'string') {
      try {
        payload = JSON.parse(payload);
      } catch {
        // keep raw string
      }
    }
    logApiRequest(`${(config.method ?? 'get').toUpperCase()} ${url}`, {
      method: config.method,
      url,
      payload,
      params: config.params,
    });
  }
  return config;
}
