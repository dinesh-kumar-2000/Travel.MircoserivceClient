import React, { useState } from 'react';
import { StatusBadge } from './Badge';

export interface AvatarProps {
  src?: string;
  alt?: string;
  name?: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';
  shape?: 'circle' | 'square' | 'rounded';
  status?: 'online' | 'offline' | 'busy' | 'away';
  showStatusBadge?: boolean;
  className?: string;
  onClick?: () => void;
}

export const Avatar: React.FC<AvatarProps> = ({
  src,
  alt,
  name,
  size = 'md',
  shape = 'circle',
  status,
  showStatusBadge = false,
  className = '',
  onClick,
}) => {
  const [imageError, setImageError] = useState(false);

  const getSizeStyles = () => {
    switch (size) {
      case 'xs':
        return 'w-6 h-6 text-xs';
      case 'sm':
        return 'w-8 h-8 text-sm';
      case 'lg':
        return 'w-12 h-12 text-lg';
      case 'xl':
        return 'w-16 h-16 text-xl';
      case '2xl':
        return 'w-24 h-24 text-2xl';
      default:
        return 'w-10 h-10 text-base';
    }
  };

  const getShapeStyles = () => {
    switch (shape) {
      case 'square':
        return 'rounded-none';
      case 'rounded':
        return 'rounded-lg';
      default:
        return 'rounded-full';
    }
  };

  const getInitials = (name: string) => {
    const names = name.trim().split(' ');
    if (names.length >= 2) {
      return `${names[0][0]}${names[names.length - 1][0]}`.toUpperCase();
    }
    return name.slice(0, 2).toUpperCase();
  };

  const getColorFromName = (name: string) => {
    const colors = [
      'bg-red-500',
      'bg-yellow-500',
      'bg-green-500',
      'bg-blue-500',
      'bg-indigo-500',
      'bg-purple-500',
      'bg-pink-500',
      'bg-orange-500',
    ];
    const index =
      name.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0) %
      colors.length;
    return colors[index];
  };

  const showImage = src && !imageError;
  const displayName = alt || name || 'User';
  const initials = name
    ? getInitials(name)
    : displayName.slice(0, 2).toUpperCase();

  return (
    <div
      className={`relative inline-flex flex-shrink-0 ${
        onClick ? 'cursor-pointer' : ''
      } ${className}`}
      onClick={onClick}
    >
      <div
        className={`
          inline-flex items-center justify-center overflow-hidden
          ${getSizeStyles()}
          ${getShapeStyles()}
          ${
            showImage
              ? 'bg-gray-200 dark:bg-gray-700'
              : `${name ? getColorFromName(name) : 'bg-gray-400'} text-white`
          }
          font-medium
        `}
      >
        {showImage ? (
          <img
            src={src}
            alt={displayName}
            className="h-full w-full object-cover"
            onError={() => setImageError(true)}
          />
        ) : (
          <span>{initials}</span>
        )}
      </div>

      {/* Status Badge */}
      {showStatusBadge && status && (
        <span
          className={`
            absolute bottom-0 right-0 block rounded-full ring-2 ring-white dark:ring-gray-800
            ${size === 'xs' || size === 'sm' ? 'h-2 w-2' : 'h-3 w-3'}
          `}
        >
          <StatusBadge status={status} />
        </span>
      )}
    </div>
  );
};

// Avatar Group Component
export interface AvatarGroupProps {
  avatars: Array<{
    src?: string;
    alt?: string;
    name?: string;
  }>;
  max?: number;
  size?: AvatarProps['size'];
  shape?: AvatarProps['shape'];
  className?: string;
}

export const AvatarGroup: React.FC<AvatarGroupProps> = ({
  avatars,
  max = 5,
  size = 'md',
  shape = 'circle',
  className = '',
}) => {
  const displayAvatars = avatars.slice(0, max);
  const remainingCount = Math.max(0, avatars.length - max);

  const getOffsetClass = () => {
    switch (size) {
      case 'xs':
        return '-space-x-1';
      case 'sm':
        return '-space-x-1.5';
      case 'lg':
        return '-space-x-3';
      case 'xl':
        return '-space-x-4';
      case '2xl':
        return '-space-x-6';
      default:
        return '-space-x-2';
    }
  };

  return (
    <div className={`flex items-center ${getOffsetClass()} ${className}`}>
      {displayAvatars.map((avatar, index) => (
        <div
          key={index}
          className="relative ring-2 ring-white dark:ring-gray-800"
          style={{ zIndex: displayAvatars.length - index }}
        >
          <Avatar
            src={avatar.src}
            alt={avatar.alt}
            name={avatar.name}
            size={size}
            shape={shape}
          />
        </div>
      ))}

      {remainingCount > 0 && (
        <div
          className="relative ring-2 ring-white dark:ring-gray-800"
          style={{ zIndex: 0 }}
        >
          <Avatar
            name={`+${remainingCount}`}
            size={size}
            shape={shape}
            className="bg-gray-200 text-gray-600 dark:bg-gray-700 dark:text-gray-300"
          />
        </div>
      )}
    </div>
  );
};
