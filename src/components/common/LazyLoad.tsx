import React, { ComponentType, Suspense } from 'react';
import { LoadingSpinner } from './LoadingSpinner';

interface LazyLoadProps {
  component: ComponentType<any>;
  fallback?: React.ReactNode;
  [key: string]: any;
}

const LazyLoad: React.FC<LazyLoadProps> = ({
  component: Component,
  fallback,
  ...props
}) => {
  return (
    <Suspense
      fallback={
        fallback || (
          <div className="flex h-64 items-center justify-center">
            <LoadingSpinner size="large" />
          </div>
        )
      }
    >
      <Component {...props} />
    </Suspense>
  );
};

export default LazyLoad;
