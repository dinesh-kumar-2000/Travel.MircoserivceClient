import React from 'react';

export interface SkeletonProps {
  variant?: 'text' | 'circular' | 'rectangular' | 'rounded';
  width?: string | number;
  height?: string | number;
  className?: string;
  animation?: 'pulse' | 'wave' | 'none';
  count?: number;
}

export const Skeleton: React.FC<SkeletonProps> = ({
  variant = 'text',
  width,
  height,
  className = '',
  animation = 'pulse',
  count = 1,
}) => {
  const getVariantStyles = () => {
    switch (variant) {
      case 'circular':
        return 'rounded-full';
      case 'rectangular':
        return 'rounded-none';
      case 'rounded':
        return 'rounded-lg';
      default: // text
        return 'rounded';
    }
  };

  const getAnimationStyles = () => {
    switch (animation) {
      case 'wave':
        return 'animate-shimmer bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 dark:from-gray-700 dark:via-gray-600 dark:to-gray-700 bg-[length:200%_100%]';
      case 'none':
        return 'bg-gray-200 dark:bg-gray-700';
      default: // pulse
        return 'animate-pulse bg-gray-200 dark:bg-gray-700';
    }
  };

  const getDefaultSize = () => {
    if (variant === 'circular') {
      return { width: width || '40px', height: height || '40px' };
    }
    if (variant === 'text') {
      return { width: width || '100%', height: height || '1em' };
    }
    return { width: width || '100%', height: height || '120px' };
  };

  const size = getDefaultSize();

  const skeletons = Array.from({ length: count }, (_, i) => (
    <div
      key={i}
      className={`
        ${getVariantStyles()}
        ${getAnimationStyles()}
        ${className}
      `}
      style={{
        width: typeof size.width === 'number' ? `${size.width}px` : size.width,
        height:
          typeof size.height === 'number' ? `${size.height}px` : size.height,
      }}
      aria-busy="true"
      aria-live="polite"
    />
  ));

  return count > 1 ? (
    <div className="space-y-2">{skeletons}</div>
  ) : (
    <>{skeletons}</>
  );
};

// Predefined skeleton layouts
export const SkeletonCard: React.FC<{ className?: string }> = ({
  className = '',
}) => {
  return (
    <div
      className={`rounded-lg border border-gray-200 p-4 dark:border-gray-700 ${className}`}
    >
      <Skeleton variant="rectangular" height="200px" className="mb-4" />
      <Skeleton variant="text" width="60%" className="mb-2" />
      <Skeleton variant="text" width="80%" className="mb-2" />
      <Skeleton variant="text" width="40%" />
    </div>
  );
};

export const SkeletonProfile: React.FC<{ className?: string }> = ({
  className = '',
}) => {
  return (
    <div className={`flex items-center space-x-4 ${className}`}>
      <Skeleton variant="circular" width="48px" height="48px" />
      <div className="flex-1 space-y-2">
        <Skeleton variant="text" width="40%" />
        <Skeleton variant="text" width="60%" />
      </div>
    </div>
  );
};

export const SkeletonTable: React.FC<{
  rows?: number;
  columns?: number;
  className?: string;
}> = ({ rows = 5, columns = 4, className = '' }) => {
  return (
    <div className={`space-y-3 ${className}`}>
      {/* Header */}
      <div className="flex space-x-4">
        {Array.from({ length: columns }, (_, i) => (
          <Skeleton
            key={`header-${i}`}
            variant="text"
            height="20px"
            className="flex-1"
          />
        ))}
      </div>

      {/* Rows */}
      {Array.from({ length: rows }, (_, rowIndex) => (
        <div key={`row-${rowIndex}`} className="flex space-x-4">
          {Array.from({ length: columns }, (_, colIndex) => (
            <Skeleton
              key={`cell-${rowIndex}-${colIndex}`}
              variant="text"
              height="16px"
              className="flex-1"
            />
          ))}
        </div>
      ))}
    </div>
  );
};

export const SkeletonList: React.FC<{ items?: number; className?: string }> = ({
  items = 3,
  className = '',
}) => {
  return (
    <div className={`space-y-4 ${className}`}>
      {Array.from({ length: items }, (_, i) => (
        <div key={i} className="flex items-start space-x-3">
          <Skeleton variant="circular" width="40px" height="40px" />
          <div className="flex-1 space-y-2">
            <Skeleton variant="text" width="70%" />
            <Skeleton variant="text" width="90%" />
          </div>
        </div>
      ))}
    </div>
  );
};

// Add shimmer animation to tailwind config if not present
// @keyframes shimmer {
//   0% { background-position: -200% 0; }
//   100% { background-position: 200% 0; }
// }
// animation: shimmer 2s infinite;
