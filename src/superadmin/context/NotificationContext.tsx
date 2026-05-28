import {
  createContext,
  ReactNode,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';
import toast from 'react-hot-toast';
import { getSocket, SOCKET_EVENTS } from '../utils/socket';
import type { AdminNotification, NotificationSeverity } from '../types';

interface NotificationContextValue {
  notifications: AdminNotification[];
  unreadCount: number;
  markAllRead: () => void;
  markRead: (id: string) => void;
  clear: () => void;
  push: (n: Omit<AdminNotification, 'id' | 'createdAt'> & { id?: string; createdAt?: string }) => void;
}

export const NotificationContext = createContext<NotificationContextValue | undefined>(undefined);

const MAX_NOTIFICATIONS = 50;

function makeId(): string {
  return `n_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
}

function toastFor(severity: NotificationSeverity, title: string) {
  switch (severity) {
    case 'success':
      return toast.success(title);
    case 'warning':
    case 'error':
      return toast.error(title);
    default:
      return toast(title);
  }
}

interface Props {
  children: ReactNode;
  enabled?: boolean;
}

export function NotificationProvider({ children, enabled = true }: Props) {
  const [notifications, setNotifications] = useState<AdminNotification[]>([]);

  const push = useCallback<NotificationContextValue['push']>((n) => {
    const item: AdminNotification = {
      id: n.id ?? makeId(),
      createdAt: n.createdAt ?? new Date().toISOString(),
      read: false,
      title: n.title,
      message: n.message,
      severity: n.severity,
      link: n.link,
    };
    setNotifications((prev) => [item, ...prev].slice(0, MAX_NOTIFICATIONS));
    toastFor(item.severity, item.title);
  }, []);

  useEffect(() => {
    if (!enabled) return;
    const socket = getSocket();

    function onNotification(payload: Partial<AdminNotification> & { title: string; message: string }) {
      const item: AdminNotification = {
        id: payload.id ?? makeId(),
        createdAt: payload.createdAt ?? new Date().toISOString(),
        title: payload.title,
        message: payload.message,
        severity: (payload.severity as NotificationSeverity | undefined) ?? 'info',
        link: payload.link,
        read: false,
      };
      setNotifications((prev) => [item, ...prev].slice(0, MAX_NOTIFICATIONS));
      toastFor(item.severity, item.title);
    }

    function onRegistration(payload: { name?: string }) {
      const item: AdminNotification = {
        id: makeId(),
        createdAt: new Date().toISOString(),
        title: 'New user registered',
        message: payload.name
          ? `${payload.name} just joined IU Chat.`
          : 'A new user has joined IU Chat.',
        severity: 'success',
        read: false,
      };
      setNotifications((prev) => [item, ...prev].slice(0, MAX_NOTIFICATIONS));
    }

    socket.on(SOCKET_EVENTS.NOTIFICATION, onNotification);
    socket.on(SOCKET_EVENTS.REGISTRATION, onRegistration);

    return () => {
      socket.off(SOCKET_EVENTS.NOTIFICATION, onNotification);
      socket.off(SOCKET_EVENTS.REGISTRATION, onRegistration);
    };
  }, [enabled]);

  const unreadCount = useMemo(
    () => notifications.filter((n) => !n.read).length,
    [notifications],
  );

  const markAllRead = useCallback(() => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  }, []);

  const markRead = useCallback((id: string) => {
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)));
  }, []);

  const clear = useCallback(() => setNotifications([]), []);

  const value = useMemo<NotificationContextValue>(
    () => ({ notifications, unreadCount, markAllRead, markRead, clear, push }),
    [notifications, unreadCount, markAllRead, markRead, clear, push],
  );

  return <NotificationContext.Provider value={value}>{children}</NotificationContext.Provider>;
}
