import React from 'react';
import { useLazyImage } from '../../hooks/useIntersectionObserver';

interface LazyImageProps {
  src: string;
  alt: string;
  placeholder?: string;
  className?: string;
  width?: number | string;
  height?: number | string;
}

const LazyImage: React.FC<LazyImageProps> = ({
  src,
  alt,
  placeholder = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 300"%3E%3Crect fill="%23f3f4f6" width="400" height="300"/%3E%3C/svg%3E',
  className = '',
  width,
  height,
}) => {
  const { targetRef, imageSrc } = useLazyImage(src, placeholder);

  return (
    <div ref={targetRef} className={className}>
      <img
        src={imageSrc}
        alt={alt}
        width={width}
        height={height}
        className={`${className} ${imageSrc === placeholder ? 'blur-sm' : ''} transition-all duration-300`}
        loading="lazy"
      />
    </div>
  );
};

export default LazyImage;
