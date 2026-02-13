/**
 * Redis OAuth State Repository
 * 
 * Production-ready OAuth state storage using Redis with automatic TTL expiration
 * Replaces in-memory Map for distributed deployments
 */

import { IGoogleOAuthRepository } from "../../domain/interfaces/repositories.js";
import { OAuthState } from "../../domain/entities/OAuthState.js";
import { v4 as uuidv4 } from "uuid";
import { logger } from "../../shared/utils/logger.js";
import { redisClient } from "../cache/RedisClient.js";

const REDIS_PREFIX = "oauth:state:";

export class RedisOAuthStateRepository implements Pick<
  IGoogleOAuthRepository,
  "createState" | "findStateByToken" | "deleteState"
> {
  /**
   * Create OAuth state and store in Redis with TTL
   */
  async createState(
    redirectTo: string,
    codeVerifier: string,
    expiresInSeconds: number,
  ): Promise<OAuthState> {
    const id = uuidv4();
    const stateToken = this.generateStateToken();
    const createdAt = new Date();
    const expiresAt = new Date(createdAt.getTime() + expiresInSeconds * 1000);

    const state = new OAuthState(
      id,
      stateToken,
      redirectTo,
      codeVerifier,
      createdAt,
      expiresAt,
    );

    // Store in Redis with automatic expiration
    const key = `${REDIS_PREFIX}${stateToken}`;
    const value = JSON.stringify({
      id: state.id,
      stateToken: state.stateToken,
      redirectTo: state.redirectTo,
      codeVerifier: state.codeVerifier,
      createdAt: state.createdAt.toISOString(),
      expiresAt: state.expiresAt.toISOString(),
    });

    await redisClient.setex(key, expiresInSeconds, value);

    logger.info("OAuth state created in Redis", {
      stateToken,
      expiresAt: expiresAt.toISOString(),
      expiresInSeconds,
    });

    return state;
  }

  /**
   * Find state by token from Redis
   */
  async findStateByToken(stateToken: string): Promise<OAuthState | null> {
    const key = `${REDIS_PREFIX}${stateToken}`;
    const value = await redisClient.get(key);

    if (!value) {
      logger.debug("OAuth state not found in Redis", { stateToken });
      return null;
    }

    try {
      const data = JSON.parse(value);
      const state = new OAuthState(
        data.id,
        data.stateToken,
        data.redirectTo,
        data.codeVerifier,
        new Date(data.createdAt),
        new Date(data.expiresAt),
      );

      // Double-check expiration (Redis TTL should handle this, but be defensive)
      if (state.isExpired()) {
        await this.deleteState(stateToken);
        logger.debug("OAuth state expired (manual check)", { stateToken });
        return null;
      }

      logger.debug("OAuth state found in Redis", {
        stateToken,
        redirectTo: state.redirectTo,
        expiresAt: state.expiresAt.toISOString(),
      });

      return state;
    } catch (error) {
      logger.error("Failed to parse OAuth state from Redis", {
        stateToken,
        error: error instanceof Error ? error.message : "Unknown error",
      });
      await this.deleteState(stateToken);
      return null;
    }
  }

  /**
   * Delete state from Redis
   */
  async deleteState(stateToken: string): Promise<void> {
    const key = `${REDIS_PREFIX}${stateToken}`;
    await redisClient.del(key);
    logger.debug("OAuth state deleted from Redis", { stateToken });
  }

  /**
   * Generate secure state token
   */
  private generateStateToken(): string {
    return uuidv4() + "-" + Date.now().toString(36);
  }
}
