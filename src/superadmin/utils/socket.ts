import { io, Socket } from 'socket.io-client';
import { tokenStorage } from '../services/api';

export const SOCKET_URL =
  (import.meta.env.VITE_SOCKET_URL as string | undefined) ?? 'https://api.iuindia.com';

let socket: Socket | null = null;

export function getSocket(): Socket {
  if (socket) return socket;

  socket = io(SOCKET_URL, {
    transports: ['websocket', 'polling'],
    autoConnect: true,
    reconnection: true,
    reconnectionAttempts: 8,
    reconnectionDelay: 1500,
    auth: { token: tokenStorage.get() ?? undefined },
  });

  return socket;
}

export function disconnectSocket() {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
}

export function reconnectWithFreshToken() {
  disconnectSocket();
  return getSocket();
}

export const SOCKET_EVENTS = {
  STATS: 'admin:stats',
  PRESENCE: 'admin:presence',
  ACTIVITY: 'admin:activity',
  NOTIFICATION: 'admin:notification',
  REGISTRATION: 'admin:registration',
  CALL_STARTED: 'admin:call_started',
  CALL_ENDED: 'admin:call_ended',
} as const;

export type SocketEventName = (typeof SOCKET_EVENTS)[keyof typeof SOCKET_EVENTS];
