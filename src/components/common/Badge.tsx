import React, { ReactNode } from 'react';

export interface BadgeProps {
  children: ReactNode;
  variant?:
    | 'default'
    | 'primary'
    | 'success'
    | 'warning'
    | 'danger'
    | 'info'
    | 'secondary';
  size?: 'sm' | 'md' | 'lg';
  rounded?: 'normal' | 'full' | 'none';
  className?: string;
  icon?: ReactNode;
  onRemove?: () => void;
  dot?: boolean;
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'default',
  size = 'md',
  rounded = 'normal',
  className = '',
  icon,
  onRemove,
  dot = false,
}) => {
  const getVariantStyles = () => {
    switch (variant) {
      case 'primary':
        return 'bg-primary-100 text-primary-800 dark:bg-primary-900 dark:text-primary-200';
      case 'success':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'warning':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case 'danger':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      case 'info':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      case 'secondary':
        return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200';
      default:
        return 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300';
    }
  };

  const getSizeStyles = () => {
    switch (size) {
      case 'sm':
        return 'text-xs px-2 py-0.5';
      case 'lg':
        return 'text-base px-3 py-1';
      default:
        return 'text-sm px-2.5 py-0.5';
    }
  };

  const getRoundedStyles = () => {
    switch (rounded) {
      case 'full':
        return 'rounded-full';
      case 'none':
        return 'rounded-none';
      default:
        return 'rounded';
    }
  };

  const getDotColor = () => {
    switch (variant) {
      case 'primary':
        return 'bg-primary-500';
      case 'success':
        return 'bg-green-500';
      case 'warning':
        return 'bg-yellow-500';
      case 'danger':
        return 'bg-red-500';
      case 'info':
        return 'bg-blue-500';
      case 'secondary':
        return 'bg-gray-500';
      default:
        return 'bg-gray-400';
    }
  };

  return (
    <span
      className={`
        inline-flex items-center font-medium
        ${getVariantStyles()}
        ${getSizeStyles()}
        ${getRoundedStyles()}
        ${className}
      `}
    >
      {dot && (
        <span
          className={`mr-1.5 h-2 w-2 rounded-full ${getDotColor()}`}
          aria-hidden="true"
        />
      )}
      {icon && <span className="mr-1">{icon}</span>}
      {children}
      {onRemove && (
        <button
          type="button"
          onClick={onRemove}
          className="ml-1.5 inline-flex items-center justify-center rounded-full p-0.5 hover:bg-black/10 focus:outline-none focus:ring-2 focus:ring-offset-2 dark:hover:bg-white/10"
          aria-label="Remove badge"
        >
          <svg
            className="h-3 w-3"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      )}
    </span>
  );
};

// Notification Badge (for counts)
export interface NotificationBadgeProps {
  count: number;
  max?: number;
  showZero?: boolean;
  className?: string;
  position?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left';
  children?: ReactNode;
}

export const NotificationBadge: React.FC<NotificationBadgeProps> = ({
  count,
  max = 99,
  showZero = false,
  className = '',
  position = 'top-right',
  children,
}) => {
  const displayCount = count > max ? `${max}+` : count;
  const shouldShow = count > 0 || showZero;

  const getPositionStyles = () => {
    switch (position) {
      case 'top-left':
        return '-top-1 -left-1';
      case 'bottom-right':
        return '-bottom-1 -right-1';
      case 'bottom-left':
        return '-bottom-1 -left-1';
      default:
        return '-top-1 -right-1';
    }
  };

  return (
    <div className={`relative inline-flex ${className}`}>
      {children}
      {shouldShow && (
        <span
          className={`
            absolute ${getPositionStyles()}
            animate-in zoom-in inline-flex
            h-5 min-w-[20px] items-center justify-center
            rounded-full border-2 border-white bg-red-600
            px-1.5 py-0.5 text-xs font-bold
            text-white duration-200 dark:border-gray-800
          `}
        >
          {displayCount}
        </span>
      )}
    </div>
  );
};

// Status Badge
export interface StatusBadgeProps {
  status: 'online' | 'offline' | 'busy' | 'away';
  showText?: boolean;
  className?: string;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({
  status,
  showText = false,
  className = '',
}) => {
  const getStatusConfig = () => {
    switch (status) {
      case 'online':
        return { color: 'bg-green-500', text: 'Online' };
      case 'offline':
        return { color: 'bg-gray-500', text: 'Offline' };
      case 'busy':
        return { color: 'bg-red-500', text: 'Busy' };
      case 'away':
        return { color: 'bg-yellow-500', text: 'Away' };
    }
  };

  const config = getStatusConfig();

  return (
    <span className={`inline-flex items-center ${className}`}>
      <span
        className={`h-2 w-2 rounded-full ${config.color}`}
        aria-label={config.text}
      />
      {showText && (
        <span className="ml-1.5 text-sm text-gray-600 dark:text-gray-400">
          {config.text}
        </span>
      )}
    </span>
  );
};
