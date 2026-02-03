/**
 * Office Utils Tests - اختبارات دوال مساعدة Office
 */

import { describe, it, expect, vi } from 'vitest'
import {
  formatOfficeFileType,
  formatOfficeStyle,
  formatOfficeLanguage,
  getOfficeFileTypeIcon,
  getOfficeFileTypeColor,
  formatOfficeFileSize,
  isValidOfficeFileType,
  isValidOfficeStyle,
  isValidOfficeLanguage,
  validateSlidesCount,
  validateOfficeTitle,
  validateOfficeDescription,
  formatOfficeError,
  getOfficeFileExtension,
  getOfficeFileMimeType,
  downloadOfficeFile,
  openOfficeFilePreview,
} from './office.utils'
import type { OfficeGenerationResponse } from '../types'

describe('office.utils', () => {
  describe('formatOfficeFileType', () => {
    it('should format file type correctly', () => {
      expect(formatOfficeFileType('excel')).toBe('Excel')
      expect(formatOfficeFileType('word')).toBe('Word')
      expect(formatOfficeFileType('powerpoint')).toBe('PowerPoint')
      expect(formatOfficeFileType('pdf')).toBe('PDF')
    })
  })

  describe('formatOfficeStyle', () => {
    it('should format style correctly', () => {
      expect(formatOfficeStyle('simple')).toBe('بسيط')
      expect(formatOfficeStyle('professional')).toBe('احترافي')
      expect(formatOfficeStyle('academic')).toBe('أكاديمي')
      expect(formatOfficeStyle('business')).toBe('تجاري')
    })
  })

  describe('formatOfficeLanguage', () => {
    it('should format language correctly', () => {
      expect(formatOfficeLanguage('ar')).toBe('العربية')
      expect(formatOfficeLanguage('en')).toBe('English')
    })
  })

  describe('getOfficeFileTypeIcon', () => {
    it('should return icon for file type', () => {
      expect(getOfficeFileTypeIcon('excel')).toBe('table')
      expect(getOfficeFileTypeIcon('word')).toBe('file-text')
      expect(getOfficeFileTypeIcon('powerpoint')).toBe('presentation')
      expect(getOfficeFileTypeIcon('pdf')).toBe('file-pdf')
    })
  })

  describe('getOfficeFileTypeColor', () => {
    it('should return color for file type', () => {
      expect(getOfficeFileTypeColor('excel')).toBe('#22c55e')
      expect(getOfficeFileTypeColor('word')).toBe('#3b82f6')
      expect(getOfficeFileTypeColor('powerpoint')).toBe('#f59e0b')
      expect(getOfficeFileTypeColor('pdf')).toBe('#ef4444')
    })
  })

  describe('formatOfficeFileSize', () => {
    it('should format file size correctly', () => {
      expect(formatOfficeFileSize(0)).toBe('0 Bytes')
      expect(formatOfficeFileSize(1024)).toBe('1 KB')
      expect(formatOfficeFileSize(1024 * 1024)).toBe('1 MB')
    })
  })

  describe('isValidOfficeFileType', () => {
    it('should validate correct file type', () => {
      expect(isValidOfficeFileType('excel')).toBe(true)
      expect(isValidOfficeFileType('word')).toBe(true)
      expect(isValidOfficeFileType('powerpoint')).toBe(true)
      expect(isValidOfficeFileType('pdf')).toBe(true)
    })

    it('should reject invalid file type', () => {
      expect(isValidOfficeFileType('invalid')).toBe(false)
    })
  })

  describe('isValidOfficeStyle', () => {
    it('should validate correct style', () => {
      expect(isValidOfficeStyle('simple')).toBe(true)
      expect(isValidOfficeStyle('professional')).toBe(true)
    })

    it('should reject invalid style', () => {
      expect(isValidOfficeStyle('invalid')).toBe(false)
    })
  })

  describe('isValidOfficeLanguage', () => {
    it('should validate correct language', () => {
      expect(isValidOfficeLanguage('ar')).toBe(true)
      expect(isValidOfficeLanguage('en')).toBe(true)
    })

    it('should reject invalid language', () => {
      expect(isValidOfficeLanguage('fr')).toBe(false)
    })
  })

  describe('validateSlidesCount', () => {
    it('should validate correct slides count', () => {
      const result = validateSlidesCount(10)
      expect(result.valid).toBe(true)
    })

    it('should reject slides count below minimum', () => {
      const result = validateSlidesCount(0)
      expect(result.valid).toBe(false)
    })

    it('should reject slides count above maximum', () => {
      const result = validateSlidesCount(101)
      expect(result.valid).toBe(false)
    })
  })

  describe('validateOfficeTitle', () => {
    it('should validate correct title', () => {
      const result = validateOfficeTitle('عنوان صحيح')
      expect(result.valid).toBe(true)
    })

    it('should reject empty title', () => {
      const result = validateOfficeTitle('')
      expect(result.valid).toBe(false)
    })

    it('should reject long title', () => {
      const longTitle = 'أ'.repeat(201)
      const result = validateOfficeTitle(longTitle)
      expect(result.valid).toBe(false)
    })
  })

  describe('validateOfficeDescription', () => {
    it('should validate correct description', () => {
      const result = validateOfficeDescription('وصف صحيح')
      expect(result.valid).toBe(true)
    })

    it('should reject long description', () => {
      const longDescription = 'أ'.repeat(1001)
      const result = validateOfficeDescription(longDescription)
      expect(result.valid).toBe(false)
    })
  })

  describe('formatOfficeError', () => {
    it('should format Error object', () => {
      const error = new Error('Test error')
      expect(formatOfficeError(error)).toBe('Test error')
    })

    it('should format string error', () => {
      expect(formatOfficeError('String error')).toBe('String error')
    })
  })

  describe('getOfficeFileExtension', () => {
    it('should return extension for file type', () => {
      expect(getOfficeFileExtension('excel')).toBe('xlsx')
      expect(getOfficeFileExtension('word')).toBe('docx')
      expect(getOfficeFileExtension('powerpoint')).toBe('pptx')
      expect(getOfficeFileExtension('pdf')).toBe('pdf')
    })
  })

  describe('getOfficeFileMimeType', () => {
    it('should return MIME type for file type', () => {
      expect(getOfficeFileMimeType('excel')).toContain('spreadsheet')
      expect(getOfficeFileMimeType('word')).toContain('wordprocessing')
      expect(getOfficeFileMimeType('powerpoint')).toContain('presentation')
      expect(getOfficeFileMimeType('pdf')).toBe('application/pdf')
    })
  })

  describe('downloadOfficeFile', () => {
    it('should create download link', () => {
      const response: OfficeGenerationResponse = {
        file_id: 'file-1',
        file_name: 'test.xlsx',
        file_type: 'excel',
        file_size: 1024,
        download_url: 'https://download.url',
      }

      // Mock DOM methods
      const createElementSpy = vi.spyOn(document, 'createElement')
      vi.spyOn(document.body, 'appendChild')
      vi.spyOn(document.body, 'removeChild')
      const clickSpy = vi.fn()

      createElementSpy.mockReturnValue({
        href: '',
        download: '',
        click: clickSpy,
      } as unknown as HTMLAnchorElement)

      downloadOfficeFile(response)

      expect(createElementSpy).toHaveBeenCalledWith('a')
      expect(clickSpy).toHaveBeenCalled()
    })
  })

  describe('openOfficeFilePreview', () => {
    it('should open preview URL', () => {
      const response: OfficeGenerationResponse = {
        file_id: 'file-1',
        file_name: 'test.xlsx',
        file_type: 'excel',
        file_size: 1024,
        download_url: 'https://download.url',
        preview_url: 'https://preview.url',
      }

      const openSpy = vi.spyOn(window, 'open').mockImplementation(() => null)

      openOfficeFilePreview(response)

      expect(openSpy).toHaveBeenCalledWith('https://preview.url', '_blank')

      openSpy.mockRestore()
    })

    it('should not open if preview URL is not available', () => {
      const response: OfficeGenerationResponse = {
        file_id: 'file-1',
        file_name: 'test.xlsx',
        file_type: 'excel',
        file_size: 1024,
        download_url: 'https://download.url',
      }

      const openSpy = vi.spyOn(window, 'open')

      openOfficeFilePreview(response)

      expect(openSpy).not.toHaveBeenCalled()

      openSpy.mockRestore()
    })
  })
})
