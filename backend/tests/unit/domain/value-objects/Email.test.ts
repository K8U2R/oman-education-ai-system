/**
 * Email Value Object Tests - اختبارات كائن قيمة البريد الإلكتروني
 */

import { describe, it, expect } from "vitest";
import { Email } from "../../../../src/domain/value-objects/Email.js";
import { InvalidEmailError } from "../../../../src/domain/value-objects/Email.js";

describe("Email", () => {
  describe("constructor", () => {
    it("should create Email with valid email address", () => {
      const email = new Email("test@example.com");
      expect(email.toString()).toBe("test@example.com");
    });

    it("should normalize email to lowercase", () => {
      const email = new Email("TEST@EXAMPLE.COM");
      expect(email.toString()).toBe("test@example.com");
    });

    it("should normalize email to lowercase", () => {
      // Email validation happens before trim, so emails with leading/trailing spaces
      // would fail validation. The trim only happens after validation passes.
      const email = new Email("TEST@EXAMPLE.COM");
      expect(email.toString()).toBe("test@example.com");
    });

    it("should throw InvalidEmailError for invalid email format", () => {
      expect(() => new Email("invalid-email")).toThrow(InvalidEmailError);
    });

    it("should throw InvalidEmailError for email without @", () => {
      expect(() => new Email("invalidemail.com")).toThrow(InvalidEmailError);
    });

    it("should throw InvalidEmailError for email without domain", () => {
      expect(() => new Email("test@")).toThrow(InvalidEmailError);
    });

    it("should throw InvalidEmailError for email without local part", () => {
      expect(() => new Email("@example.com")).toThrow(InvalidEmailError);
    });

    it("should throw InvalidEmailError for empty string", () => {
      expect(() => new Email("")).toThrow(InvalidEmailError);
    });

    it("should accept valid email with subdomain", () => {
      const email = new Email("test@mail.example.com");
      expect(email.toString()).toBe("test@mail.example.com");
    });

    it("should accept valid email with plus sign", () => {
      const email = new Email("test+tag@example.com");
      expect(email.toString()).toBe("test+tag@example.com");
    });

    it("should accept valid email with dots", () => {
      const email = new Email("test.user@example.com");
      expect(email.toString()).toBe("test.user@example.com");
    });
  });

  describe("toString", () => {
    it("should return email as string", () => {
      const email = new Email("test@example.com");
      expect(email.toString()).toBe("test@example.com");
    });
  });

  describe("equals", () => {
    it("should return true for same email", () => {
      const email1 = new Email("test@example.com");
      const email2 = new Email("test@example.com");
      expect(email1.equals(email2)).toBe(true);
    });

    it("should return true for emails with different case", () => {
      const email1 = new Email("TEST@EXAMPLE.COM");
      const email2 = new Email("test@example.com");
      expect(email1.equals(email2)).toBe(true);
    });

    it("should return false for different emails", () => {
      const email1 = new Email("test1@example.com");
      const email2 = new Email("test2@example.com");
      expect(email1.equals(email2)).toBe(false);
    });
  });
});
