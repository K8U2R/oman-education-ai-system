/**
 * Helpers Tests
 * اختبارات الدوال المساعدة
 */

import { describe, it, expect } from 'vitest';
import { mergePreferences, mergeSettings, mergeProfile, hasChanges, formatDate, formatTime, sanitizeData } from '../helpers';
import { DEFAULT_PREFERENCES, DEFAULT_SETTINGS } from '../constants';

describe('Helper Functions', () => {
  describe('mergePreferences', () => {
    it('should merge with defaults', () => {
      const result = mergePreferences({ theme: 'dark' });
      expect(result.theme).toBe('dark');
      expect(result.layout).toBe(DEFAULT_PREFERENCES.layout);
    });

    it('should merge custom colors', () => {
      const result = mergePreferences({
        custom_colors: { primary: '#000000' },
      });
      expect(result.custom_colors.primary).toBe('#000000');
    });
  });

  describe('mergeSettings', () => {
    it('should merge with defaults', () => {
      const result = mergeSettings({ ai_temperature: 0.8 });
      expect(result.ai_temperature).toBe(0.8);
      expect(result.ai_model_preference).toBe(DEFAULT_SETTINGS.ai_model_preference);
    });
  });

  describe('mergeProfile', () => {
    it('should merge with defaults', () => {
      const result = mergeProfile({ display_name: 'Test' });
      expect(result.display_name).toBe('Test');
      expect(result.skills).toEqual([]);
    });
  });

  describe('hasChanges', () => {
    it('should detect changes', () => {
      const original = { a: 1, b: 2 };
      const modified = { a: 1, b: 3 };
      expect(hasChanges(original, modified)).toBe(true);
    });

    it('should detect no changes', () => {
      const original = { a: 1, b: 2 };
      const modified = { a: 1, b: 2 };
      expect(hasChanges(original, modified)).toBe(false);
    });
  });

  describe('formatDate', () => {
    it('should format date correctly', () => {
      const date = new Date('2024-01-15');
      const result = formatDate(date, 'DD/MM/YYYY');
      expect(result).toBe('15/01/2024');
    });
  });

  describe('formatTime', () => {
    it('should format time in 24h format', () => {
      const date = new Date('2024-01-15T14:30:00');
      const result = formatTime(date, '24h');
      expect(result).toBe('14:30');
    });

    it('should format time in 12h format', () => {
      const date = new Date('2024-01-15T14:30:00');
      const result = formatTime(date, '12h');
      expect(result).toContain('PM');
    });
  });

  describe('sanitizeData', () => {
    it('should remove empty values', () => {
      const data = { a: 1, b: '', c: null, d: undefined };
      const result = sanitizeData(data);
      expect(result).toEqual({ a: 1 });
    });
  });
});

