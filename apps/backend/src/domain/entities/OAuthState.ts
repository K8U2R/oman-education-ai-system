/**
 * OAuth State Entity
 *
 * Entity لإدارة OAuth State tokens
 */

export class OAuthState {
  constructor(
    public readonly id: string,
    public readonly stateToken: string,
    public readonly redirectTo: string,
    public readonly codeVerifier: string,
    public readonly createdAt: Date,
    public readonly expiresAt: Date,
    public usedAt?: Date,
  ) {}

  /**
   * التحقق من انتهاء صلاحية State
   */
  isExpired(): boolean {
    return new Date() > this.expiresAt;
  }

  /**
   * التحقق من استخدام State
   */
  isUsed(): boolean {
    return this.usedAt !== undefined;
  }

  /**
   * التحقق من صحة State
   */
  isValid(): boolean {
    return !this.isExpired() && !this.isUsed();
  }

  /**
   * Mark state as used
   */
  markAsUsed(): void {
    // Note: This creates a new instance with usedAt set
    // In a real implementation, you'd update the entity in the repository
    Object.defineProperty(this, "usedAt", {
      value: new Date(),
      writable: true,
      configurable: true,
    });
  }

  /**
   * Convert to data object
   */
  toData(): {
    id: string;
    stateToken: string;
    redirectTo: string;
    codeVerifier: string;
    createdAt: Date;
    expiresAt: Date;
    usedAt?: Date;
  } {
    return {
      id: this.id,
      stateToken: this.stateToken,
      redirectTo: this.redirectTo,
      codeVerifier: this.codeVerifier,
      createdAt: this.createdAt,
      expiresAt: this.expiresAt,
      usedAt: this.usedAt,
    };
  }
}
