import { IVerificationTokenRepository } from "@/domain/interfaces/repositories";
import { DatabaseCoreAdapter } from "@/infrastructure/adapters/db/DatabaseCoreAdapter";
import { VerificationTokenData } from "@/domain/types/auth";
import { logger } from "@/shared/utils/logger";

export class VerificationTokenRepository implements IVerificationTokenRepository {
  constructor(private readonly db: DatabaseCoreAdapter) {}

  async save(tokenData: VerificationTokenData): Promise<void> {
    try {
      await this.db.insert(
        "verification_tokens",
        tokenData as unknown as Record<string, unknown>,
      );
    } catch (error) {
      logger.error("Failed to save verification token", { error });
      throw error;
    }
  }

  async findByTokenAndType(
    token: string,
    type: string,
  ): Promise<VerificationTokenData | null> {
    try {
      return await this.db.findOne<VerificationTokenData>(
        "verification_tokens",
        { token, type },
      );
    } catch (error) {
      logger.error("Failed to find verification token", { token, type, error });
      throw error;
    }
  }

  async markAsUsed(id: string): Promise<void> {
    try {
      await this.db.update<VerificationTokenData>(
        "verification_tokens",
        { id },
        { used: true },
      );
    } catch (error) {
      logger.error("Failed to mark verification token as used", { id, error });
      throw error;
    }
  }

  async deleteExpiredForUser(userId: string): Promise<void> {
    // Optional cleanup method
    // const query = `DELETE FROM verification_tokens WHERE user_id = $1 AND expires_at < NOW()`
    // Note: DatabaseCoreAdapter might need a raw query method or we can implement specific logic if needed.
    // For now, this is a placeholder or we can extend the adapter.
    // given current adapter interface, we might skip implementation or use a custom query if supported.
    // The current DatabaseCoreAdapter seems to support basic CRUD.
    // We will skip actual implementation of this specific method for now unless we add raw query support to adapter.
    logger.info("deleteExpiredForUser called (not implemented yet)", {
      userId,
    });
  }
}
