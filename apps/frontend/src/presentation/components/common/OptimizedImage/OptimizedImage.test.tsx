/**
 * OptimizedImage Component Tests - اختبارات مكون الصورة المحسّن
 */

import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor } from '@/test/utils'
import { OptimizedImage } from './OptimizedImage'
import * as imageUtil from '@/infrastructure/utils/image.util'

vi.mock('@/infrastructure/utils/image.util', () => ({
  isWebPSupported: vi.fn(() => true),
  isAVIFSupported: vi.fn(() => false),
  getBestImageFormat: vi.fn(() => 'webp'),
  generateSrcSet: vi.fn((src: string) => `${src}?w=400 400w, ${src}?w=800 800w`),
  getOptimizedImageUrl: vi.fn((src: string) => `${src}?format=webp`),
}))

describe('OptimizedImage', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should render image with src and alt', () => {
    render(<OptimizedImage src="/test.jpg" alt="Test image" />)

    const img = screen.getByAltText('Test image')
    expect(img).toBeInTheDocument()
    expect(img).toHaveAttribute('src')
  })

  it('should render placeholder when provided and not loaded', () => {
    render(<OptimizedImage src="/test.jpg" alt="Test image" placeholder="/placeholder.jpg" />)

    const placeholder = document.querySelector('.blurPlaceholder')
    expect(placeholder).toBeInTheDocument()
  })

  it('should use optimized URL', () => {
    render(<OptimizedImage src="/test.jpg" alt="Test image" />)

    expect(imageUtil.getOptimizedImageUrl).toHaveBeenCalledWith('/test.jpg', { format: 'webp' })
  })

  it('should generate srcset when width is provided', () => {
    render(<OptimizedImage src="/test.jpg" alt="Test image" width={800} />)

    expect(imageUtil.generateSrcSet).toHaveBeenCalledWith('/test.jpg')
  })

  it('should handle lazy loading', () => {
    render(<OptimizedImage src="/test.jpg" alt="Test image" loading="lazy" />)

    const img = screen.getByAltText('Test image')
    expect(img).toHaveAttribute('loading', 'lazy')
  })

  it('should handle eager loading', () => {
    render(<OptimizedImage src="/test.jpg" alt="Test image" loading="eager" />)

    const img = screen.getByAltText('Test image')
    expect(img).toHaveAttribute('loading', 'eager')
  })

  it('should call onLoad when image loads', async () => {
    const onLoad = vi.fn()
    render(<OptimizedImage src="/test.jpg" alt="Test image" onLoad={onLoad} />)

    const img = screen.getByAltText('Test image') as HTMLImageElement
    img.dispatchEvent(new Event('load'))

    await waitFor(() => {
      expect(onLoad).toHaveBeenCalled()
    })
  })

  it('should handle error and use fallback', async () => {
    const onError = vi.fn()
    render(
      <OptimizedImage src="/test.jpg" alt="Test image" fallback="/fallback.jpg" onError={onError} />
    )

    const img = screen.getByAltText('Test image') as HTMLImageElement
    img.dispatchEvent(new Event('error'))

    await waitFor(() => {
      expect(onError).toHaveBeenCalled()
    })
  })

  it('should show error state when no fallback', async () => {
    render(<OptimizedImage src="/test.jpg" alt="Test image" />)

    const img = screen.getByAltText('Test image') as HTMLImageElement
    img.dispatchEvent(new Event('error'))

    await waitFor(() => {
      const errorState = screen.queryByText('فشل تحميل الصورة')
      expect(errorState).toBeInTheDocument()
    })
  })

  it('should apply custom className', () => {
    render(<OptimizedImage src="/test.jpg" alt="Test image" className="custom-class" />)

    const container = document.querySelector('.optimizedImage')
    expect(container).toHaveClass('custom-class')
  })

  it('should apply objectFit style', () => {
    render(<OptimizedImage src="/test.jpg" alt="Test image" objectFit="cover" />)

    const img = screen.getByAltText('Test image')
    expect(img).toHaveStyle({ objectFit: 'cover' })
  })

  it('should use AVIF when supported', () => {
    vi.mocked(imageUtil.isAVIFSupported).mockReturnValueOnce(true)
    vi.mocked(imageUtil.getBestImageFormat).mockReturnValueOnce('avif')

    render(<OptimizedImage src="/test.jpg" alt="Test image" />)

    expect(imageUtil.getBestImageFormat).toHaveBeenCalled()
  })
})
