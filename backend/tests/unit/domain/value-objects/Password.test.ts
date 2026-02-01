/**
 * Password Value Object Tests - اختبارات كائن قيمة كلمة المرور
 */

import { describe, it, expect } from "vitest";
import { Password } from "../../../../src/domain/value-objects/Password.js";
import { InvalidPasswordError } from "../../../../src/domain/value-objects/Password.js";

describe("Password", () => {
  describe("constructor", () => {
    it("should create Password with valid password", () => {
      const password = new Password("SecurePass123");
      expect(password.toString()).toBe("SecurePass123");
    });

    it("should throw InvalidPasswordError for password shorter than minimum length", () => {
      expect(() => new Password("Short1")).toThrow(InvalidPasswordError);
    });

    it("should throw InvalidPasswordError for password without uppercase", () => {
      expect(() => new Password("securepass123")).toThrow(InvalidPasswordError);
    });

    it("should throw InvalidPasswordError for password without number", () => {
      expect(() => new Password("SecurePass")).toThrow(InvalidPasswordError);
    });

    it("should accept password with custom minimum length", () => {
      const password = new Password("Short1", { minLength: 6 });
      expect(password.toString()).toBe("Short1");
    });

    it("should accept password without uppercase if not required", () => {
      const password = new Password("securepass123", {
        requireUppercase: false,
      });
      expect(password.toString()).toBe("securepass123");
    });

    it("should accept password without number if not required", () => {
      const password = new Password("SecurePass", { requireNumber: false });
      expect(password.toString()).toBe("SecurePass");
    });

    it("should throw InvalidPasswordError for password without special char when required", () => {
      expect(
        () => new Password("SecurePass123", { requireSpecialChar: true }),
      ).toThrow(InvalidPasswordError);
    });

    it("should accept password with special char when required", () => {
      const password = new Password("SecurePass123!", {
        requireSpecialChar: true,
      });
      expect(password.toString()).toBe("SecurePass123!");
    });

    it("should throw InvalidPasswordError for empty string", () => {
      expect(() => new Password("")).toThrow(InvalidPasswordError);
    });

    it("should throw InvalidPasswordError for null", () => {
      expect(() => new Password(null as unknown as string)).toThrow(
        InvalidPasswordError,
      );
    });
  });

  describe("hash", () => {
    it("should hash password", async () => {
      const password = new Password("SecurePass123");
      const hashed = await password.hash();
      expect(hashed).toBeDefined();
      expect(hashed).not.toBe("SecurePass123");
      expect(hashed.length).toBeGreaterThan(0);
    });

    it("should generate different hashes for same password", async () => {
      const password1 = new Password("SecurePass123");
      const password2 = new Password("SecurePass123");
      const hashed1 = await password1.hash();
      const hashed2 = await password2.hash();
      // Hashes should be different due to salt
      expect(hashed1).not.toBe(hashed2);
    });
  });

  describe("verify", () => {
    it("should verify correct password", async () => {
      const password = new Password("SecurePass123");
      const hashed = await password.hash();
      const isValid = await password.verify(hashed);
      expect(isValid).toBe(true);
    });

    it("should reject incorrect password", async () => {
      const password1 = new Password("SecurePass123");
      const password2 = new Password("WrongPassword123");
      const hashed1 = await password1.hash();
      const isValid = await password2.verify(hashed1);
      expect(isValid).toBe(false);
    });
  });

  describe("toString", () => {
    it("should return password as string", () => {
      const password = new Password("SecurePass123");
      expect(password.toString()).toBe("SecurePass123");
    });
  });
});
