/**
 * Validation Tests
 * اختبارات التحقق من صحة البيانات
 */

import { describe, it, expect } from 'vitest';
import { validatePreferences, validateSettings, validateProfile } from '../validation';

describe('Validation Utils', () => {
  describe('validatePreferences', () => {
    it('should validate correct preferences', () => {
      const result = validatePreferences({
        theme: 'dark',
        layout: 'comfortable',
        language: 'ar',
      });
      expect(result.valid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('should reject invalid theme', () => {
      const result = validatePreferences({
        theme: 'invalid' as 'light' | 'dark' | 'auto',
      });
      expect(result.valid).toBe(false);
      expect(result.errors.length).toBeGreaterThan(0);
    });

    it('should reject invalid layout', () => {
      const result = validatePreferences({
        layout: 'invalid' as 'compact' | 'comfortable' | 'spacious',
      });
      expect(result.valid).toBe(false);
      expect(result.errors.length).toBeGreaterThan(0);
    });

    it('should reject invalid language', () => {
      const result = validatePreferences({
        language: 'invalid' as string,
      });
      expect(result.valid).toBe(false);
      expect(result.errors.length).toBeGreaterThan(0);
    });
  });

  describe('validateSettings', () => {
    it('should validate correct settings', () => {
      const result = validateSettings({
        ai_temperature: 0.7,
        ai_max_tokens: 2048,
        font_size: 14,
      });
      expect(result.valid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('should reject temperature out of range', () => {
      const result = validateSettings({
        ai_temperature: 1.5,
      });
      expect(result.valid).toBe(false);
      expect(result.errors.length).toBeGreaterThan(0);
    });

    it('should reject font size out of range', () => {
      const result = validateSettings({
        font_size: 30,
      });
      expect(result.valid).toBe(false);
      expect(result.errors.length).toBeGreaterThan(0);
    });
  });

  describe('validateProfile', () => {
    it('should validate correct profile', () => {
      const result = validateProfile({
        display_name: 'Test User',
        bio: 'Test bio',
      });
      expect(result.valid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('should reject display name too long', () => {
      const result = validateProfile({
        display_name: 'a'.repeat(300),
      });
      expect(result.valid).toBe(false);
      expect(result.errors.length).toBeGreaterThan(0);
    });

    it('should reject bio too long', () => {
      const result = validateProfile({
        bio: 'a'.repeat(2000),
      });
      expect(result.valid).toBe(false);
      expect(result.errors.length).toBeGreaterThan(0);
    });
  });
});

