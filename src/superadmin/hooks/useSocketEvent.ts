import { useEffect } from 'react';
import { getSocket } from '../utils/socket';

/**
 * Subscribe to a socket.io event for the component's lifetime.
 *   useSocketEvent('admin:stats', (payload) => setStats(payload));
 */
export function useSocketEvent<T = unknown>(
  event: string,
  handler: (payload: T) => void,
) {
  useEffect(() => {
    const socket = getSocket();
    socket.on(event, handler as (...args: unknown[]) => void);
    return () => {
      socket.off(event, handler as (...args: unknown[]) => void);
    };
  }, [event, handler]);
}
