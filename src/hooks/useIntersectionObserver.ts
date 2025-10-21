import { useEffect, useRef, useState } from 'react';

interface UseIntersectionObserverOptions {
  threshold?: number | number[];
  root?: Element | null;
  rootMargin?: string;
  freezeOnceVisible?: boolean;
}

export const useIntersectionObserver = (
  options: UseIntersectionObserverOptions = {}
) => {
  const {
    threshold = 0.1,
    root = null,
    rootMargin = '0px',
    freezeOnceVisible = false,
  } = options;

  const [isIntersecting, setIsIntersecting] = useState(false);
  const [hasIntersected, setHasIntersected] = useState(false);
  const targetRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const node = targetRef.current;
    if (!node) return;

    // If frozen and already intersected, don't observe
    if (freezeOnceVisible && hasIntersected) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        const isElementIntersecting = entry.isIntersecting;
        setIsIntersecting(isElementIntersecting);

        if (isElementIntersecting) {
          setHasIntersected(true);
        }

        if (freezeOnceVisible && isElementIntersecting) {
          observer.disconnect();
        }
      },
      {
        threshold,
        root,
        rootMargin,
      }
    );

    observer.observe(node);

    return () => {
      observer.disconnect();
    };
  }, [threshold, root, rootMargin, freezeOnceVisible, hasIntersected]);

  return {
    targetRef,
    isIntersecting,
    hasIntersected,
  };
};

// Hook for lazy loading images
export const useLazyImage = (src: string, placeholder?: string) => {
  const [imageSrc, setImageSrc] = useState(placeholder || '');
  const { targetRef, isIntersecting } = useIntersectionObserver({
    freezeOnceVisible: true,
  });

  useEffect(() => {
    if (isIntersecting && src) {
      setImageSrc(src);
    }
  }, [isIntersecting, src]);

  return {
    targetRef,
    imageSrc,
  };
};

// Hook for infinite scroll
export const useInfiniteScroll = (callback: () => void) => {
  const { targetRef, isIntersecting } = useIntersectionObserver({
    threshold: 1.0,
  });

  useEffect(() => {
    if (isIntersecting) {
      callback();
    }
  }, [isIntersecting, callback]);

  return targetRef;
};
