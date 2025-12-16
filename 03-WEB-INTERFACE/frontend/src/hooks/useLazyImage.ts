/**
 * useLazyImage Hook - Hook لتحميل الصور بشكل كسول
 */

import { useState, useEffect, useRef } from 'react';

export interface UseLazyImageOptions {
  rootMargin?: string;
  threshold?: number;
  placeholder?: string;
}

export interface UseLazyImageReturn {
  src: string | undefined;
  isLoaded: boolean;
  hasError: boolean;
  ref: React.RefObject<HTMLImageElement>;
}

/**
 * Hook لتحميل الصور بشكل كسول
 */
export function useLazyImage(
  imageSrc: string,
  options: UseLazyImageOptions = {}
): UseLazyImageReturn {
  const { rootMargin = '50px', threshold = 0.1, placeholder } = options;
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [shouldLoad, setShouldLoad] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    if (!imgRef.current || shouldLoad) return;

    // فحص دعم IntersectionObserver
    if (!('IntersectionObserver' in window)) {
      // Fallback: تحميل مباشر
      setShouldLoad(true);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setShouldLoad(true);
            observer.unobserve(entry.target);
          }
        });
      },
      { rootMargin, threshold }
    );

    observer.observe(imgRef.current);

    return () => {
      if (imgRef.current) {
        observer.unobserve(imgRef.current);
      }
    };
  }, [rootMargin, threshold, shouldLoad]);

  useEffect(() => {
    if (!shouldLoad) return;

    const img = new Image();
    
    img.onload = () => {
      setIsLoaded(true);
      setHasError(false);
    };
    
    img.onerror = () => {
      setHasError(true);
      setIsLoaded(false);
    };
    
    img.src = imageSrc;
  }, [shouldLoad, imageSrc]);

  return {
    src: isLoaded ? imageSrc : placeholder,
    isLoaded,
    hasError,
    ref: imgRef,
  };
}

