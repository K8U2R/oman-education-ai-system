/**
 * Image Utilities Tests - اختبارات أدوات تحسين الصور
 */

import { describe, it, expect, vi, beforeEach } from 'vitest'
import * as imageUtil from './image.util'
import {
  generateBlurPlaceholder,
  isAVIFSupported,
  isWebPSupported,
  getBestImageFormat,
  getOptimizedImageUrl,
  generateSrcSet,
  calculateAspectRatio,
  getImageDimensions,
  preloadImage,
  IMAGE_QUALITY_PRESETS,
  RESPONSIVE_BREAKPOINTS,
} from './image.util'

describe('Image Utilities', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('generateBlurPlaceholder', () => {
    it('should generate blur placeholder data URL', () => {
      const placeholder = generateBlurPlaceholder()
      expect(placeholder).toMatch(/^data:image\/png;base64,/)
    })

    it('should generate placeholder with custom dimensions', () => {
      const placeholder = generateBlurPlaceholder(10, 10)
      expect(placeholder).toMatch(/^data:image\/png;base64,/)
    })
  })

  describe('isAVIFSupported', () => {
    it('should return false when window is undefined', () => {
      const originalWindow = global.window
      // @ts-expect-error - Testing undefined window
      global.window = undefined

      expect(isAVIFSupported()).toBe(false)

      global.window = originalWindow
    })

    it('should check AVIF support using canvas', () => {
      const result = isAVIFSupported()
      expect(typeof result).toBe('boolean')
    })
  })

  describe('isWebPSupported', () => {
    it('should return false when window is undefined', () => {
      const originalWindow = global.window
      // @ts-expect-error - Testing undefined window
      global.window = undefined

      expect(isWebPSupported()).toBe(false)

      global.window = originalWindow
    })

    it('should check WebP support using canvas', () => {
      const result = isWebPSupported()
      expect(typeof result).toBe('boolean')
    })
  })

  describe('getBestImageFormat', () => {
    it('should return avif when supported', () => {
      vi.spyOn(imageUtil, 'isAVIFSupported').mockReturnValueOnce(true)
      const format = getBestImageFormat()
      expect(['avif', 'webp', 'original']).toContain(format)
    })

    it('should return webp when AVIF not supported but WebP is', () => {
      vi.spyOn(imageUtil, 'isAVIFSupported').mockReturnValueOnce(false)
      vi.spyOn(imageUtil, 'isWebPSupported').mockReturnValueOnce(true)
      const format = getBestImageFormat()
      expect(['webp', 'original']).toContain(format)
    })

    it('should return original when neither AVIF nor WebP supported', () => {
      vi.spyOn(imageUtil, 'isAVIFSupported').mockReturnValueOnce(false)
      vi.spyOn(imageUtil, 'isWebPSupported').mockReturnValueOnce(false)
      const format = getBestImageFormat()
      expect(format).toBe('original')
    })
  })

  describe('getOptimizedImageUrl', () => {
    it('should return original src when no options provided', () => {
      const src = '/test.jpg'
      const result = getOptimizedImageUrl(src)
      expect(result).toBe(src)
    })

    it('should add width parameter', () => {
      const src = '/test.jpg'
      const result = getOptimizedImageUrl(src, { width: 800 })
      expect(result).toContain('w=800')
    })

    it('should add height parameter', () => {
      const src = '/test.jpg'
      const result = getOptimizedImageUrl(src, { height: 600 })
      expect(result).toContain('h=600')
    })

    it('should add format parameter', () => {
      const src = '/test.jpg'
      const result = getOptimizedImageUrl(src, { format: 'webp' })
      expect(result).toContain('format=webp')
    })

    it('should add quality parameter', () => {
      const src = '/test.jpg'
      const result = getOptimizedImageUrl(src, { quality: 80 })
      expect(result).toContain('q=80')
    })

    it('should combine multiple parameters', () => {
      const src = '/test.jpg'
      const result = getOptimizedImageUrl(src, {
        width: 800,
        height: 600,
        format: 'webp',
        quality: 80,
      })
      expect(result).toContain('w=800')
      expect(result).toContain('h=600')
      expect(result).toContain('format=webp')
      expect(result).toContain('q=80')
    })

    it('should handle invalid URL gracefully', () => {
      const src = 'invalid-url'
      const result = getOptimizedImageUrl(src, { width: 800 })
      expect(result).toBe(src)
    })

    it('should not add format parameter when original', () => {
      const src = '/test.jpg'
      const result = getOptimizedImageUrl(src, { format: 'original' })
      expect(result).not.toContain('format=original')
    })
  })

  describe('generateSrcSet', () => {
    it('should generate srcset with default widths', () => {
      const src = '/test.jpg'
      const srcset = generateSrcSet(src)
      expect(srcset).toContain('400w')
      expect(srcset).toContain('800w')
      expect(srcset).toContain('1200w')
      expect(srcset).toContain('1600w')
      expect(srcset).toContain('2000w')
    })

    it('should generate srcset with custom widths', () => {
      const src = '/test.jpg'
      const widths = [100, 200, 300]
      const srcset = generateSrcSet(src, widths)
      expect(srcset).toContain('100w')
      expect(srcset).toContain('200w')
      expect(srcset).toContain('300w')
    })

    it('should generate srcset with format', () => {
      const src = '/test.jpg'
      const srcset = generateSrcSet(src, [400, 800], 'webp')
      expect(srcset).toContain('format=webp')
    })

    it('should format srcset correctly', () => {
      const src = '/test.jpg'
      const srcset = generateSrcSet(src, [400, 800])
      const parts = srcset.split(', ')
      expect(parts.length).toBe(2)
      expect(parts[0]).toContain('400w')
      expect(parts[1]).toContain('800w')
    })
  })

  describe('calculateAspectRatio', () => {
    it('should calculate aspect ratio correctly', () => {
      expect(calculateAspectRatio(16, 9)).toBe(16 / 9)
      expect(calculateAspectRatio(4, 3)).toBe(4 / 3)
      expect(calculateAspectRatio(1, 1)).toBe(1)
    })

    it('should handle zero height', () => {
      expect(calculateAspectRatio(16, 0)).toBe(Infinity)
    })
  })

  describe('getImageDimensions', () => {
    it('should get image dimensions', async () => {
      // Mock Image constructor
      const ImageMock = vi.fn().mockImplementation(() => {
        const mockImg = {
          onload: null as (() => void) | null,
          onerror: null as ((error: Error) => void) | null,
          src: '',
          naturalWidth: 800,
          naturalHeight: 600,
        }
        setTimeout(() => {
          if (mockImg.onload) {
            mockImg.onload()
          }
        }, 0)
        return mockImg
      })

      global.Image = ImageMock as unknown as typeof Image

      const dimensions = await getImageDimensions('/test.jpg')
      expect(dimensions.width).toBe(800)
      expect(dimensions.height).toBe(600)
    })

    it('should reject on error', async () => {
      const ImageMock = vi.fn().mockImplementation(() => {
        const mockImg = {
          onload: null as (() => void) | null,
          onerror: null as ((error: Error) => void) | null,
          src: '',
        }
        setTimeout(() => {
          if (mockImg.onerror) {
            mockImg.onerror(new Error('Failed to load'))
          }
        }, 0)
        return mockImg
      })

      global.Image = ImageMock as unknown as typeof Image

      await expect(getImageDimensions('/test.jpg')).rejects.toThrow()
    })
  })

  describe('preloadImage', () => {
    it('should preload image successfully', async () => {
      const ImageMock = vi.fn().mockImplementation(() => {
        const mockImg = {
          onload: null as (() => void) | null,
          onerror: null as ((error: Error) => void) | null,
          src: '',
        }
        setTimeout(() => {
          if (mockImg.onload) {
            mockImg.onload()
          }
        }, 0)
        return mockImg
      })

      global.Image = ImageMock as unknown as typeof Image

      await expect(preloadImage('/test.jpg')).resolves.not.toThrow()
    })

    it('should reject on error', async () => {
      const ImageMock = vi.fn().mockImplementation(() => {
        const mockImg = {
          onload: null as (() => void) | null,
          onerror: null as ((error: Error) => void) | null,
          src: '',
        }
        setTimeout(() => {
          if (mockImg.onerror) {
            mockImg.onerror(new Error('Failed to load'))
          }
        }, 0)
        return mockImg
      })

      global.Image = ImageMock as unknown as typeof Image

      await expect(preloadImage('/test.jpg')).rejects.toThrow()
    })
  })

  describe('Constants', () => {
    it('should have IMAGE_QUALITY_PRESETS', () => {
      expect(IMAGE_QUALITY_PRESETS.low).toBe(60)
      expect(IMAGE_QUALITY_PRESETS.medium).toBe(75)
      expect(IMAGE_QUALITY_PRESETS.high).toBe(90)
      expect(IMAGE_QUALITY_PRESETS.max).toBe(100)
    })

    it('should have RESPONSIVE_BREAKPOINTS', () => {
      expect(RESPONSIVE_BREAKPOINTS.mobile).toBe(400)
      expect(RESPONSIVE_BREAKPOINTS.tablet).toBe(800)
      expect(RESPONSIVE_BREAKPOINTS.desktop).toBe(1200)
      expect(RESPONSIVE_BREAKPOINTS.large).toBe(1600)
      expect(RESPONSIVE_BREAKPOINTS.xlarge).toBe(2000)
    })
  })
})
