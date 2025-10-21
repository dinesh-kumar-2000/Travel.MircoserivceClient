import { addNotification } from '../store/slices/notificationSlice';
import { useAppDispatch } from './useAppDispatch';
import { useAppSelector } from './useAppSelector';

interface NotificationOptions {
  title: string;
  message: string;
  type?: 'info' | 'success' | 'warning' | 'error';
  duration?: number;
  actionUrl?: string;
}

export const useNotifications = () => {
  const dispatch = useAppDispatch();
  const notifications = useAppSelector(
    (state) => state.notification.notifications
  );

  const showNotification = (options: NotificationOptions) => {
    const notification = {
      id: Date.now().toString(),
      userId: 'current-user', // This should come from auth state
      ...options,
      type: options.type || 'info',
      isRead: false,
      createdAt: new Date().toISOString(),
    };

    dispatch(addNotification(notification as any));

    // Auto-dismiss after duration
    if (options.duration) {
      setTimeout(() => {
        removeNotification(notification.id);
      }, options.duration);
    }
  };

  const showSuccess = (message: string, title: string = 'Success') => {
    showNotification({ title, message, type: 'success', duration: 5000 });
  };

  const showError = (message: string, title: string = 'Error') => {
    showNotification({ title, message, type: 'error', duration: 7000 });
  };

  const showWarning = (message: string, title: string = 'Warning') => {
    showNotification({ title, message, type: 'warning', duration: 6000 });
  };

  const showInfo = (message: string, title: string = 'Info') => {
    showNotification({ title, message, type: 'info', duration: 5000 });
  };

  const removeNotification = (_id: string) => {
    // Dispatch remove notification action
    // This would be implemented in the notification slice
  };

  const requestPermission = async () => {
    if ('Notification' in window) {
      const permission = await Notification.requestPermission();
      return permission === 'granted';
    }
    return false;
  };

  const sendBrowserNotification = (
    title: string,
    options?: NotificationOptions
  ) => {
    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification(title, {
        body: options?.message,
        icon: '/vite.svg',
        badge: '/vite.svg',
      });
    }
  };

  return {
    notifications,
    showNotification,
    showSuccess,
    showError,
    showWarning,
    showInfo,
    removeNotification,
    requestPermission,
    sendBrowserNotification,
  };
};
