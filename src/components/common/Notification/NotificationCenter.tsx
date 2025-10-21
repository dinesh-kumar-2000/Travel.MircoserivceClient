import React, { useState } from 'react';
import { Button } from '../Button';
import { Card } from '../Card';

interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  isRead: boolean;
  createdAt: string;
  actionUrl?: string;
}

const NotificationCenter: React.FC = () => {
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: '1',
      title: 'Booking Confirmed',
      message: 'Your booking #BK001 has been confirmed',
      type: 'success',
      isRead: false,
      createdAt: new Date().toISOString(),
    },
    {
      id: '2',
      title: 'Special Offer',
      message: '20% off on all beach resorts this weekend!',
      type: 'info',
      isRead: false,
      createdAt: new Date(Date.now() - 3600000).toISOString(),
    },
  ]);
  const [showAll, setShowAll] = useState(false);

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  const markAsRead = (id: string) => {
    setNotifications(
      notifications.map((n) => (n.id === id ? { ...n, isRead: true } : n))
    );
  };

  const markAllAsRead = () => {
    setNotifications(notifications.map((n) => ({ ...n, isRead: true })));
  };

  const deleteNotification = (id: string) => {
    setNotifications(notifications.filter((n) => n.id !== id));
  };

  const getIcon = (type: string) => {
    switch (type) {
      case 'success':
        return '✓';
      case 'warning':
        return '⚠';
      case 'error':
        return '✕';
      default:
        return 'ℹ';
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'success':
        return 'bg-green-100 text-green-800';
      case 'warning':
        return 'bg-yellow-100 text-yellow-800';
      case 'error':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-blue-100 text-blue-800';
    }
  };

  const displayedNotifications = showAll
    ? notifications
    : notifications.slice(0, 5);

  return (
    <div className="relative">
      <Card>
        <div className="p-4">
          {/* Header */}
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-lg font-semibold">
              Notifications
              {unreadCount > 0 && (
                <span className="ml-2 rounded-full bg-red-500 px-2 py-1 text-xs text-white">
                  {unreadCount}
                </span>
              )}
            </h3>
            {unreadCount > 0 && (
              <Button size="sm" variant="secondary" onClick={markAllAsRead}>
                Mark all as read
              </Button>
            )}
          </div>

          {/* Notifications List */}
          {notifications.length > 0 ? (
            <div className="space-y-3">
              {displayedNotifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`rounded-lg border p-3 ${
                    notification.isRead
                      ? 'border-gray-200 bg-white'
                      : 'border-blue-200 bg-blue-50'
                  }`}
                  onClick={() =>
                    !notification.isRead && markAsRead(notification.id)
                  }
                >
                  <div className="flex items-start gap-3">
                    <div
                      className={`flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full ${getTypeColor(
                        notification.type
                      )}`}
                    >
                      {getIcon(notification.type)}
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900">
                        {notification.title}
                      </h4>
                      <p className="text-sm text-gray-600">
                        {notification.message}
                      </p>
                      <p className="mt-1 text-xs text-gray-500">
                        {new Date(notification.createdAt).toLocaleString()}
                      </p>
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteNotification(notification.id);
                      }}
                      className="text-gray-400 hover:text-gray-600"
                    >
                      ✕
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="py-8 text-center text-gray-500">No notifications</p>
          )}

          {/* Show More */}
          {notifications.length > 5 && (
            <button
              onClick={() => setShowAll(!showAll)}
              className="mt-4 w-full text-center text-sm text-blue-600 hover:text-blue-800"
            >
              {showAll ? 'Show less' : `Show all (${notifications.length})`}
            </button>
          )}
        </div>
      </Card>
    </div>
  );
};

export default NotificationCenter;
