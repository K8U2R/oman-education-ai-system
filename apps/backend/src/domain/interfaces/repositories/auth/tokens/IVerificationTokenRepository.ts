import { VerificationTokenData } from "../../../../types/auth/index.js";

export interface IVerificationTokenRepository {
  /**
   * Save a verification token
   * @param tokenData Token data to save
   */
  save(tokenData: VerificationTokenData): Promise<void>;

  /**
   * Find a token by its value and type
   * @param token Token value
   * @param type Token type
   */
  findByTokenAndType(
    token: string,
    type: string,
  ): Promise<VerificationTokenData | null>;

  /**
   * Mark a token as used
   * @param id Token ID
   */
  markAsUsed(id: string): Promise<void>;

  /**
   * Delete expired tokens for a user
   * @param userId User ID
   */
  deleteExpiredForUser(userId: string): Promise<void>;
}
