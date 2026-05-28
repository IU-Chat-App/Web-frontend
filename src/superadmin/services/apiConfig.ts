/**
 * Shared API configuration for the Super Admin Portal.
 * Kept in its own module so api.ts and apiDebug.ts can import without cycles.
 */
export function resolveApiUrl(): string {
  const configured = (import.meta.env.VITE_API_URL as string | undefined)?.trim();
  if (configured) return configured.replace(/\/$/, '');
  // In dev, default to the Vite proxy path (see vite.config.ts).
  if (import.meta.env.DEV) return '/api';
  return 'https://api.iuindia.com';
}

export const API_URL = resolveApiUrl();

export const TOKEN_KEY = 'iu_admin_token';
export const ADMIN_KEY = 'iu_admin_user';
export const DEV_TOKEN_PREFIX = 'dev_mock_';

export function isDevMockToken(token: string | null | undefined): boolean {
  return !!token && token.startsWith(DEV_TOKEN_PREFIX);
}
