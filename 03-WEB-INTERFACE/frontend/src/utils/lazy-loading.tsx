/**
 * Lazy Loading Utilities - أدوات التحميل الكسول
 * لتحسين الأداء عبر تحميل المكونات عند الحاجة فقط
 */

import React, { lazy, ComponentType } from 'react';

/**
 * Fallback component افتراضي
 */
const DefaultFallback: React.FC = () => (
  <div className="flex items-center justify-center p-8">
    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
    <span className="ml-3 text-gray-600">جاري التحميل...</span>
  </div>
);

/**
 * إنشاء مكون كسول مع Suspense fallback
 */
export function createLazyComponent<T extends ComponentType<any>>(
  importFn: () => Promise<{ default: T }>,
  fallback?: React.ReactNode
) {
  const LazyComponent = lazy(importFn);
  
  return {
    Component: LazyComponent,
    fallback: fallback || React.createElement(DefaultFallback),
  };
}

/**
 * Lazy load للصور
 */
export function lazyLoadImages(): void {
  if (typeof window === 'undefined' || !('IntersectionObserver' in window)) {
    // Fallback: تحميل جميع الصور مباشرة
    document.querySelectorAll('img[data-src]').forEach((img) => {
      const image = img as HTMLImageElement;
      image.src = image.dataset.src || '';
      image.removeAttribute('data-src');
    });
    return;
  }

  const imageObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const image = entry.target as HTMLImageElement;
          const src = image.dataset.src;
          
          if (src) {
            // تحميل الصورة
            const img = new window.Image();
            img.onload = () => {
              image.src = src;
              image.classList.add('loaded');
              image.removeAttribute('data-src');
            };
            img.onerror = () => {
              image.classList.add('error');
              console.error('فشل تحميل الصورة:', src);
            };
            img.src = src;
          }
          
          imageObserver.unobserve(image);
        }
      });
    },
    {
      rootMargin: '50px', // بدء التحميل قبل 50px من الظهور
    }
  );

  // مراقبة جميع الصور مع data-src
  document.querySelectorAll('img[data-src]').forEach((img) => {
    imageObserver.observe(img);
  });
}

/**
 * Lazy load للفيديو
 */
export function lazyLoadVideos(): void {
  if (typeof window === 'undefined' || !('IntersectionObserver' in window)) {
    return;
  }

  const videoObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const video = entry.target as HTMLVideoElement;
          const src = video.dataset.src;
          
          if (src && video.paused) {
            video.src = src;
            video.load();
            videoObserver.unobserve(video);
          }
        }
      });
    },
    {
      rootMargin: '100px',
    }
  );

  document.querySelectorAll('video[data-src]').forEach((video) => {
    videoObserver.observe(video);
  });
}

/**
 * Lazy load للـ iframes
 */
export function lazyLoadIframes(): void {
  if (typeof window === 'undefined' || !('IntersectionObserver' in window)) {
    return;
  }

  const iframeObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const iframe = entry.target as HTMLIFrameElement;
          const src = iframe.dataset.src;
          
          if (src) {
            iframe.src = src;
            iframe.removeAttribute('data-src');
            iframeObserver.unobserve(iframe);
          }
        }
      });
    },
    {
      rootMargin: '50px',
    }
  );

  document.querySelectorAll('iframe[data-src]').forEach((iframe) => {
    iframeObserver.observe(iframe);
  });
}

/**
 * تهيئة جميع Lazy Loading
 */
export function initializeLazyLoading(): void {
  // تحميل الصور
  lazyLoadImages();
  
  // تحميل الفيديو
  lazyLoadVideos();
  
  // تحميل iframes
  lazyLoadIframes();
  
  // إعادة التهيئة عند تغيير الصفحة (لـ SPA)
  if (typeof window !== 'undefined') {
    // استخدام MutationObserver لمراقبة الصور الجديدة
    const observer = new MutationObserver(() => {
      lazyLoadImages();
      lazyLoadVideos();
      lazyLoadIframes();
    });
    
    observer.observe(document.body, {
      childList: true,
      subtree: true,
    });
  }
}

/**
 * مكون React للصورة الكسولة
 */
export interface LazyImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src: string;
  alt: string;
  placeholder?: string;
  className?: string;
}

export function LazyImage({ src, alt, placeholder, className, ...props }: LazyImageProps) {
  const [isLoaded, setIsLoaded] = React.useState(false);
  const [hasError, setHasError] = React.useState(false);
  const imgRef = React.useRef<HTMLImageElement>(null);

  React.useEffect(() => {
    if (!imgRef.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const img = new window.Image();
            img.onload = () => setIsLoaded(true);
            img.onerror = () => setHasError(true);
            img.src = src;
            observer.unobserve(entry.target);
          }
        });
      },
      { rootMargin: '50px' }
    );

    observer.observe(imgRef.current);

    return () => {
      if (imgRef.current) {
        observer.unobserve(imgRef.current);
      }
    };
  }, [src]);

  return (
    <div className={`relative overflow-hidden ${className || ''}`}>
      {!isLoaded && !hasError && placeholder && (
        <img
          src={placeholder}
          alt=""
          className="absolute inset-0 w-full h-full object-cover blur-sm"
          aria-hidden="true"
        />
      )}
      <img
        ref={imgRef}
        src={isLoaded ? src : placeholder || ''}
        alt={alt}
        className={`transition-opacity duration-300 ${
          isLoaded ? 'opacity-100' : 'opacity-0'
        } ${hasError ? 'hidden' : ''}`}
        {...props}
      />
      {hasError && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
          <span className="text-gray-400 text-sm">فشل تحميل الصورة</span>
        </div>
      )}
    </div>
  );
}

