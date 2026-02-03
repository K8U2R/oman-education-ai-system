/**
 * OAuth Authorization Code Value Object
 *
 * Value Object لـ Authorization Code من OAuth provider
 */

export class OAuthCode {
  constructor(private readonly value: string) {
    if (!value || value.trim().length === 0) {
      throw new Error("Authorization code cannot be empty");
    }
  }

  toString(): string {
    return this.value;
  }

  equals(other: OAuthCode): boolean {
    return this.value === other.value;
  }
}
