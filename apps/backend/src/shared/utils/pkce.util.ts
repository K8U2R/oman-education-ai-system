/**
 * PKCE (Proof Key for Code Exchange) Utilities
 *
 * RFC 7636 implementation for OAuth 2.0 PKCE
 *
 * @see https://tools.ietf.org/html/rfc7636
 */

import crypto from "crypto";

/**
 * Generate code verifier (43-128 characters)
 *
 * @returns Base64URL-encoded random string
 */
export function generateCodeVerifier(): string {
  // Generate 32 random bytes (256 bits) and base64url encode
  const randomBytes = crypto.randomBytes(32);
  return base64UrlEncode(randomBytes);
}

/**
 * Generate code challenge from verifier
 *
 * @param verifier - Code verifier
 * @returns Base64URL-encoded SHA256 hash
 */
export function generateCodeChallenge(verifier: string): string {
  // SHA256 hash and base64url encode
  const hash = crypto.createHash("sha256").update(verifier).digest();
  return base64UrlEncode(hash);
}

/**
 * Verify code challenge matches verifier
 *
 * @param verifier - Code verifier
 * @param challenge - Code challenge
 * @returns true if challenge matches verifier
 */
export function verifyCodeChallenge(
  verifier: string,
  challenge: string,
): boolean {
  const computedChallenge = generateCodeChallenge(verifier);
  return computedChallenge === challenge;
}

/**
 * Base64URL encode (RFC 4648)
 *
 * @param buffer - Buffer to encode
 * @returns Base64URL-encoded string
 */
function base64UrlEncode(buffer: Buffer): string {
  return buffer
    .toString("base64")
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=/g, "");
}
