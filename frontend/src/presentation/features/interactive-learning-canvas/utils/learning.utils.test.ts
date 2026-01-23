/**
 * Learning Utils Tests - اختبارات دوال مساعدة التعلم
 */

import { describe, it, expect } from 'vitest'
import {
  validateLessonTitle,
  validateAssessmentTitle,
  calculateScorePercentage,
  formatTimeSpent,
  formatProgress,
} from './learning.utils'

describe('learning.utils', () => {
  describe('validateLessonTitle', () => {
    it('should validate correct lesson title', () => {
      const title = 'درس جديد'
      const result = validateLessonTitle(title)
      expect(result.valid).toBe(true)
    })

    it('should reject lesson without title', () => {
      const title = '' // Empty title
      const result = validateLessonTitle(title)
      expect(result.valid).toBe(false)
    })
  })

  describe('validateAssessmentTitle', () => {
    it('should validate correct assessment title', () => {
      const title = 'تقييم جديد'
      const result = validateAssessmentTitle(title)
      expect(result.valid).toBe(true)
    })

    it('should reject assessment without title', () => {
      const title = '' // Empty title
      const result = validateAssessmentTitle(title)
      expect(result.valid).toBe(false)
    })
  })

  describe('calculateScorePercentage', () => {
    it('should calculate score correctly', () => {
      const correct = 8
      const total = 10
      const score = calculateScorePercentage(correct, total)
      expect(score).toBe(80)
    })

    it('should handle zero total', () => {
      const score = calculateScorePercentage(5, 0)
      expect(score).toBe(0)
    })
  })

  describe('formatTimeSpent', () => {
    it('should format duration correctly', () => {
      expect(formatTimeSpent(60)).toBe('1 دقيقة')
      expect(formatTimeSpent(3600)).toBe('1 ساعة')
      expect(formatTimeSpent(3660)).toContain('ساعة')
    })
  })

  describe('formatProgress', () => {
    it('should format progress correctly', () => {
      expect(formatProgress(50)).toBe('50%')
      expect(formatProgress(100)).toBe('100%')
      expect(formatProgress(0)).toBe('0%')
    })
  })
})
