/**
 * Image Utilities - أدوات تحسين الصور
 *
 * Utilities لتحسين ومعالجة الصور
 */

/**
 * Generate blur placeholder data URL
 * Creates a tiny 1x1 pixel image as placeholder
 */
export function generateBlurPlaceholder(width = 1, height = 1): string {
  const canvas = document.createElement('canvas')
  canvas.width = width
  canvas.height = height
  const ctx = canvas.getContext('2d')
  if (ctx) {
    ctx.fillStyle = '#f0f0f0'
    ctx.fillRect(0, 0, width, height)
  }
  return canvas.toDataURL()
}

/**
 * Check if AVIF format is supported
 */
export function isAVIFSupported(): boolean {
  if (typeof window === 'undefined') return false

  const canvas = document.createElement('canvas')
  canvas.width = 1
  canvas.height = 1
  return canvas.toDataURL('image/avif').indexOf('data:image/avif') === 0
}

/**
 * Check if WebP format is supported
 */
export function isWebPSupported(): boolean {
  if (typeof window === 'undefined') return false

  const canvas = document.createElement('canvas')
  canvas.width = 1
  canvas.height = 1
  return canvas.toDataURL('image/webp').indexOf('data:image/webp') === 0
}

/**
 * Get the best image format based on browser support
 * Priority: AVIF > WebP > Original
 */
export function getBestImageFormat(): 'avif' | 'webp' | 'original' {
  if (isAVIFSupported()) return 'avif'
  if (isWebPSupported()) return 'webp'
  return 'original'
}

/**
 * Generate optimized image URL
 * In production, this would integrate with an image CDN
 */
export function getOptimizedImageUrl(
  src: string,
  options?: {
    width?: number
    height?: number
    format?: 'webp' | 'avif' | 'original'
    quality?: number
  }
): string {
  if (!options) return src

  try {
    const url = new URL(src, window.location.origin)

    if (options.width) {
      url.searchParams.set('w', options.width.toString())
    }
    if (options.height) {
      url.searchParams.set('h', options.height.toString())
    }
    if (options.format && options.format !== 'original') {
      url.searchParams.set('format', options.format)
    }
    if (options.quality) {
      url.searchParams.set('q', options.quality.toString())
    }

    return url.toString()
  } catch {
    // If URL parsing fails, return original src
    return src
  }
}

/**
 * Generate srcset for responsive images
 */
export function generateSrcSet(
  src: string,
  widths: number[] = [400, 800, 1200, 1600, 2000],
  format?: 'webp' | 'avif' | 'original'
): string {
  return widths
    .map(width => {
      const optimizedUrl = getOptimizedImageUrl(src, { width, format })
      return `${optimizedUrl} ${width}w`
    })
    .join(', ')
}

/**
 * Calculate aspect ratio
 */
export function calculateAspectRatio(width: number, height: number): number {
  return width / height
}

/**
 * Get image dimensions from URL or element
 */
export function getImageDimensions(src: string): Promise<{ width: number; height: number }> {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.onload = () => {
      resolve({ width: img.naturalWidth, height: img.naturalHeight })
    }
    img.onerror = reject
    img.src = src
  })
}

/**
 * Preload image
 */
export function preloadImage(src: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.onload = () => resolve()
    img.onerror = reject
    img.src = src
  })
}

/**
 * Image compression quality presets
 */
export const IMAGE_QUALITY_PRESETS = {
  low: 60,
  medium: 75,
  high: 90,
  max: 100,
} as const

/**
 * Responsive image breakpoints
 */
export const RESPONSIVE_BREAKPOINTS = {
  mobile: 400,
  tablet: 800,
  desktop: 1200,
  large: 1600,
  xlarge: 2000,
} as const
