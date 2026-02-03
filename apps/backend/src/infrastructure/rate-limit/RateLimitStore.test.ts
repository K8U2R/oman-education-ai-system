/**
 * RateLimitStore Tests - اختبارات مخزن Rate Limiting
 */

import { describe, it, expect, beforeEach, afterEach } from "vitest";
import { RateLimitStore } from "./RateLimitStore";

describe("RateLimitStore", () => {
  let store: RateLimitStore;

  beforeEach(() => {
    store = new RateLimitStore();
  });

  afterEach(() => {
    store.stopCleanup();
  });

  describe("increment", () => {
    it("should increment attempts for a key", () => {
      // Arrange
      const key = "test-key";

      // Act
      const count1 = store.increment(key, 15 * 60 * 1000);
      const count2 = store.increment(key, 15 * 60 * 1000);

      // Assert
      expect(count1).toBe(1);
      expect(count2).toBe(2);
    });

    it("should reset count when window expires", () => {
      // Arrange
      const key = "test-key";

      // Act - Increment and wait for window to expire
      store.increment(key, 100); // 100ms window
      // @ts-expect-error - Test variable, intentionally unused
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const count1 = store.getAttempts(key);

      // Wait for window to expire
      return new Promise<void>((resolve) => {
        setTimeout(() => {
          const count2 = store.getAttempts(key);
          expect(count2).toBe(0); // Should reset after expiration
          resolve();
        }, 150);
      });
    });
  });

  describe("getAttempts", () => {
    it("should return 0 for non-existent key", () => {
      // Act
      const attempts = store.getAttempts("non-existent-key");

      // Assert
      expect(attempts).toBe(0);
    });

    it("should return current attempts count", () => {
      // Arrange
      const key = "test-key";
      store.increment(key, 15 * 60 * 1000);
      store.increment(key, 15 * 60 * 1000);

      // Act
      const attempts = store.getAttempts(key);

      // Assert
      expect(attempts).toBe(2);
    });
  });

  describe("isLocked", () => {
    it("should return false for non-locked key", () => {
      // Act
      const isLocked = store.isLocked("test-key");

      // Assert
      expect(isLocked).toBe(false);
    });

    it("should return true for locked key", () => {
      // Arrange
      const key = "test-key";
      store.setLockout(key, 30 * 60 * 1000);

      // Act
      const isLocked = store.isLocked(key);

      // Assert
      expect(isLocked).toBe(true);
    });

    it("should return false when lockout expires", () => {
      // Arrange
      const key = "test-key";
      store.setLockout(key, 100); // 100ms lockout

      // Act & Assert
      expect(store.isLocked(key)).toBe(true);

      // Wait for lockout to expire
      return new Promise<void>((resolve) => {
        setTimeout(() => {
          expect(store.isLocked(key)).toBe(false);
          resolve();
        }, 150);
      });
    });
  });

  describe("setLockout", () => {
    it("should set lockout for a key", () => {
      // Arrange
      const key = "test-key";

      // Act
      store.setLockout(key, 30 * 60 * 1000);

      // Assert
      expect(store.isLocked(key)).toBe(true);
    });
  });

  describe("reset", () => {
    it("should reset attempts for a key", () => {
      // Arrange
      const key = "test-key";
      store.increment(key, 15 * 60 * 1000);
      store.increment(key, 15 * 60 * 1000);

      // Act
      store.reset(key);

      // Assert
      expect(store.getAttempts(key)).toBe(0);
      expect(store.isLocked(key)).toBe(false);
    });
  });

  describe("getLockoutUntil", () => {
    it("should return undefined for non-locked key", () => {
      // Act
      const lockoutUntil = store.getLockoutUntil("test-key");

      // Assert
      expect(lockoutUntil).toBeUndefined();
    });

    it("should return lockout expiration date", () => {
      // Arrange
      const key = "test-key";
      const duration = 30 * 60 * 1000;
      store.setLockout(key, duration);

      // Act
      const lockoutUntil = store.getLockoutUntil(key);

      // Assert
      expect(lockoutUntil).toBeDefined();
      expect(lockoutUntil).toBeInstanceOf(Date);
      if (lockoutUntil) {
        expect(lockoutUntil.getTime()).toBeGreaterThan(Date.now());
      }
    });
  });
});
