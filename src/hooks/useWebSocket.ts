import { useEffect, useRef, useState } from 'react';
import {
  getWebSocketService,
  initializeWebSocket,
} from '../services/websocket/WebSocketService';

interface UseWebSocketOptions {
  autoConnect?: boolean;
  onConnect?: () => void;
  onDisconnect?: () => void;
}

export const useWebSocket = (options: UseWebSocketOptions = {}) => {
  const { autoConnect = true, onConnect, onDisconnect } = options;
  const [isConnected, setIsConnected] = useState(false);
  const wsRef = useRef<ReturnType<typeof getWebSocketService> | null>(null);

  useEffect(() => {
    if (!autoConnect) return;

    // Initialize WebSocket
    const token = localStorage.getItem('token');
    if (!token) return;

    try {
      const ws = initializeWebSocket(token);
      wsRef.current = ws;

      // Set up connection handlers
      const unsubscribeConnect = ws.onConnect(() => {
        setIsConnected(true);
        onConnect?.();
      });

      const unsubscribeDisconnect = ws.onDisconnect(() => {
        setIsConnected(false);
        onDisconnect?.();
      });

      // Cleanup
      return () => {
        unsubscribeConnect();
        unsubscribeDisconnect();
        ws.disconnect();
      };
    } catch (error) {
      console.error('Failed to initialize WebSocket:', error);
    }
  }, [autoConnect, onConnect, onDisconnect]);

  const subscribe = (type: string, handler: (data: any) => void) => {
    if (!wsRef.current) {
      console.warn('WebSocket not initialized');
      return () => {};
    }

    return wsRef.current.on(type, handler);
  };

  const send = (type: string, data: any) => {
    if (!wsRef.current) {
      console.warn('WebSocket not initialized');
      return;
    }

    wsRef.current.send(type, data);
  };

  return {
    isConnected,
    subscribe,
    send,
    ws: wsRef.current,
  };
};

// Hook for subscribing to booking updates
export const useBookingUpdates = (
  bookingId: string,
  onUpdate: (data: any) => void
) => {
  const { subscribe, isConnected } = useWebSocket();

  useEffect(() => {
    if (!isConnected || !bookingId) return;

    const unsubscribe = subscribe('booking-update', (data) => {
      if (data.bookingId === bookingId) {
        onUpdate(data);
      }
    });

    return unsubscribe;
  }, [isConnected, bookingId, onUpdate, subscribe]);
};

// Hook for real-time notifications
export const useRealtimeNotifications = (
  onNotification: (notification: any) => void
) => {
  const { subscribe, isConnected } = useWebSocket();

  useEffect(() => {
    if (!isConnected) return;

    const unsubscribe = subscribe('notification', onNotification);

    return unsubscribe;
  }, [isConnected, onNotification, subscribe]);
};
