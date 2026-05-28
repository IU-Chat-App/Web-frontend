import { createContext, useCallback, useEffect, useMemo, useState, ReactNode } from 'react';
import { ADMIN_KEY, tokenStorage } from '../services/api';
import { authService } from '../services/authService';
import { disconnectSocket, reconnectWithFreshToken } from '../utils/socket';
import type { AdminUser, LoginRequest } from '../types';

interface AuthContextValue {
  admin: AdminUser | null;
  token: string | null;
  loading: boolean;
  initializing: boolean;
  login: (payload: LoginRequest) => Promise<void>;
  logout: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextValue | undefined>(undefined);

interface Props {
  children: ReactNode;
}

export function AuthProvider({ children }: Props) {
  const [admin, setAdmin] = useState<AdminUser | null>(() => {
    const cached = localStorage.getItem(ADMIN_KEY);
    return cached ? (JSON.parse(cached) as AdminUser) : null;
  });
  const [token, setToken] = useState<string | null>(() => tokenStorage.get());
  const [loading, setLoading] = useState(false);
  const [initializing, setInitializing] = useState<boolean>(!!tokenStorage.get());

  // Hydrate the cached admin profile against the server on boot.
  useEffect(() => {
    let cancelled = false;
    async function hydrate() {
      if (!tokenStorage.get()) {
        setInitializing(false);
        return;
      }
      try {
        const me = await authService.me();
        if (!cancelled && me) {
          setAdmin(me);
          localStorage.setItem(ADMIN_KEY, JSON.stringify(me));
        }
      } catch {
        if (!cancelled) {
          tokenStorage.clear();
          setAdmin(null);
          setToken(null);
        }
      } finally {
        if (!cancelled) setInitializing(false);
      }
    }
    hydrate();
    return () => {
      cancelled = true;
    };
  }, []);

  const login = useCallback(async (payload: LoginRequest) => {
    setLoading(true);
    try {
      const res = await authService.login(payload);
      tokenStorage.set(res.token);
      localStorage.setItem(ADMIN_KEY, JSON.stringify(res.admin));
      setToken(res.token);
      setAdmin(res.admin);
      reconnectWithFreshToken();
    } finally {
      setLoading(false);
    }
  }, []);

  const logout = useCallback(async () => {
    try {
      await authService.logout();
    } catch {
      // ignore — we still clear locally
    }
    tokenStorage.clear();
    setAdmin(null);
    setToken(null);
    disconnectSocket();
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({ admin, token, loading, initializing, login, logout }),
    [admin, token, loading, initializing, login, logout],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
