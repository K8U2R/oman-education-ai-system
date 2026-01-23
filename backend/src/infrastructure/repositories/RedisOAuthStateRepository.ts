/**
 * Redis OAuth State Repository
 *
 * Production-ready management using central ENV_CONFIG engine.
 */

import { IGoogleOAuthRepository } from "../../domain/interfaces/repositories/IGoogleOAuthRepository.js";
import { OAuthState } from "../../domain/entities/OAuthState.js";
import { RedisCacheAdapter } from "../adapters/cache/RedisCacheAdapter.js";
import { v4 as uuidv4 } from "uuid";
import { logger } from "../../shared/utils/logger.js";
import { ENV_CONFIG } from "../config/env.config.js";

export class RedisOAuthStateRepository implements Pick<
  IGoogleOAuthRepository,
  "createState" | "findStateByToken" | "deleteState"
> {
  private readonly redis: RedisCacheAdapter;
  private readonly keyPrefix = "oauth:state:";

  constructor(redis?: RedisCacheAdapter) {
    if (redis) {
      this.redis = redis;
    } else {
      this.redis = new RedisCacheAdapter({
        host: ENV_CONFIG.REDIS_HOST,
        port: ENV_CONFIG.REDIS_PORT,
        password: ENV_CONFIG.REDIS_PASSWORD,
        db: 0,
      });
    }
  }

  async initialize(): Promise<void> {
    if (!this.redis.isConnected()) {
      await this.redis.connect({
        host: ENV_CONFIG.REDIS_HOST,
        port: ENV_CONFIG.REDIS_PORT,
        password: ENV_CONFIG.REDIS_PASSWORD,
        db: 0,
      });
    }
  }

  async createState(
    redirectTo: string,
    codeVerifier: string,
    expiresInSeconds: number,
  ): Promise<OAuthState> {
    try {
      await this.initialize();
    } catch (error) {
      logger.error("Failed to initialize Redis connection for OAuth state", {
        error: error instanceof Error ? error.message : String(error),
      });
      throw new Error("Redis is not available.");
    }

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

    const key = this.getKey(stateToken);
    const stateData = {
      id: state.id,
      stateToken: state.stateToken,
      redirectTo: state.redirectTo,
      codeVerifier: state.codeVerifier,
      createdAt: state.createdAt.toISOString(),
      expiresAt: state.expiresAt.toISOString(),
    };

    try {
      await this.redis.set(key, stateData, expiresInSeconds);
      logger.info("OAuth state created in Redis", { stateToken });
    } catch {
      logger.error("Failed to store OAuth state in Redis", { stateToken });
      throw new Error("Failed to store OAuth state in Redis.");
    }

    return state;
  }

  async findStateByToken(stateToken: string): Promise<OAuthState | null> {
    await this.initialize();
    const key = this.getKey(stateToken);
    const data = await this.redis.get<Record<string, unknown>>(key);
    if (!data) return null;

    return new OAuthState(
      data.id as string,
      data.stateToken as string,
      data.redirectTo as string,
      data.codeVerifier as string,
      new Date(data.createdAt as string),
      new Date(data.expiresAt as string),
      data.usedAt ? new Date(data.usedAt as string) : undefined,
    );
  }

  async deleteState(stateToken: string): Promise<void> {
    await this.initialize();
    const key = this.getKey(stateToken);
    await this.redis.delete(key);
  }

  private getKey(stateToken: string): string {
    return `${this.keyPrefix}${stateToken}`;
  }

  private generateStateToken(): string {
    return uuidv4() + "-" + Date.now().toString(36);
  }
}
