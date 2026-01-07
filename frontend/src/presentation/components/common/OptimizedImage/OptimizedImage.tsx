/**
 * Optimized Image Component - مكون صورة محسّن
 *
 * مكون محسّن للصور مع:
 * - Lazy loading
 * - Responsive images (srcset)
 * - WebP format support
 * - Placeholder support
 * - Error handling
 */

import React, { useState, useRef, useEffect, useMemo } from 'react'
import styles from './OptimizedImage.module.scss'
import {
  isWebPSupported,
  isAVIFSupported,
  getBestImageFormat,
  generateSrcSet as generateSrcSetUtil,
  getOptimizedImageUrl,
} from '@/infrastructure/utils/image.util'

interface OptimizedImageProps {
  /**
   * Source URL للصورة
   */
  src: string

  /**
   * Alt text
   */
  alt: string

  /**
   * Width (للـ srcset)
   */
  width?: number

  /**
   * Height (للـ srcset)
   */
  height?: number

  /**
   * Responsive sizes
   */
  sizes?: string

  /**
   * Placeholder image
   */
  placeholder?: string

  /**
   * Loading strategy (lazy, eager)
   */
  loading?: 'lazy' | 'eager'

  /**
   * Fallback image on error
   */
  fallback?: string

  /**
   * className إضافي
   */
  className?: string

  /**
   * Object fit
   */
  objectFit?: 'cover' | 'contain' | 'fill' | 'none' | 'scale-down'

  /**
   * On load callback
   */
  onLoad?: () => void

  /**
   * On error callback
   */
  onError?: () => void
}

// Functions moved to infrastructure/utils/image.util.ts

/**
 * Optimized Image Component
 */
export const OptimizedImage: React.FC<OptimizedImageProps> = ({
  src,
  alt,
  width,
  height,
  sizes = '100vw',
  placeholder,
  loading = 'lazy',
  fallback,
  className = '',
  objectFit = 'cover',
  onLoad,
  onError,
}) => {
  const [imageSrc, setImageSrc] = useState<string>(src)
  const [isLoaded, setIsLoaded] = useState(false)
  const [hasError, setHasError] = useState(false)
  const [isInView, setIsInView] = useState(loading === 'eager')
  const imgRef = useRef<HTMLImageElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  // Intersection Observer for lazy loading
  useEffect(() => {
    if (loading !== 'lazy' || isInView) return

    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            setIsInView(true)
            observer.disconnect()
          }
        })
      },
      {
        rootMargin: '50px', // Start loading 50px before image enters viewport
      }
    )

    if (containerRef.current) {
      observer.observe(containerRef.current)
    }

    return () => {
      observer.disconnect()
    }
  }, [loading, isInView])

  // Generate optimized URLs
  const bestFormat = useMemo(() => getBestImageFormat(), [])
  const webpSupported = useMemo(() => isWebPSupported(), [])
  const avifSupported = useMemo(() => isAVIFSupported(), [])

  const optimizedSrc = useMemo(() => {
    if (bestFormat === 'original') return imageSrc
    return getOptimizedImageUrl(imageSrc, { format: bestFormat })
  }, [imageSrc, bestFormat])

  const srcSet = useMemo(() => {
    if (!width) return undefined
    const format = bestFormat !== 'original' ? bestFormat : undefined
    return generateSrcSetUtil(imageSrc, [400, 800, 1200, 1600, 2000], format)
  }, [imageSrc, width, bestFormat])

  const handleLoad = (): void => {
    setIsLoaded(true)
    onLoad?.()
  }

  const handleError = (): void => {
    setHasError(true)
    if (fallback && imageSrc !== fallback) {
      setImageSrc(fallback)
      setHasError(false)
    } else {
      onError?.()
    }
  }

  return (
    <div
      ref={containerRef}
      className={`${styles.optimizedImage} ${className} ${isLoaded ? styles.loaded : ''}`}
      style={{ width, height }}
    >
      {/* Placeholder */}
      {placeholder && !isLoaded && (
        <img src={placeholder} alt="" className={styles.placeholder} aria-hidden="true" />
      )}

      {/* Main Image */}
      {isInView && (
        <picture>
          {/* AVIF source (best quality) */}
          {avifSupported && bestFormat === 'avif' && (
            <source
              srcSet={srcSet || getOptimizedImageUrl(imageSrc, { format: 'avif' })}
              type="image/avif"
            />
          )}
          {/* WebP source */}
          {webpSupported && bestFormat === 'webp' && (
            <source
              srcSet={srcSet || getOptimizedImageUrl(imageSrc, { format: 'webp' })}
              type="image/webp"
            />
          )}
          {/* Fallback */}
          <img
            ref={imgRef}
            src={optimizedSrc}
            srcSet={srcSet}
            sizes={sizes}
            alt={alt}
            width={width}
            height={height}
            loading={loading}
            className={`${styles.image} ${isLoaded ? styles.loaded : ''}`}
            style={{ objectFit }}
            onLoad={handleLoad}
            onError={handleError}
            decoding="async"
          />
        </picture>
      )}

      {/* Error State */}
      {hasError && !fallback && (
        <div className={styles.error} role="img" aria-label={alt}>
          <span className={styles.errorIcon}>📷</span>
          <span className={styles.errorText}>فشل تحميل الصورة</span>
        </div>
      )}
    </div>
  )
}
