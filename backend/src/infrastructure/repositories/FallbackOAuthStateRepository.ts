/**
 * Fallback OAuth State Repository
 *
 * Wrapper that falls back to memory storage if Redis fails
 */

import { IGoogleOAuthRepository } from "@/domain/interfaces/repositories";
import { OAuthState } from "@/domain/entities/OAuthState";
import { RedisOAuthStateRepository } from "./RedisOAuthStateRepository";
import { logger } from "@/shared/utils/logger";

// Get the shared global storage
function getSharedStateStorage(): Map<string, OAuthState> {
  // First check the persistent key
  const persistentStorage = global.__oman_education_oauth_state_storage__;
  if (persistentStorage) {
    global.__oauthStateStorage = persistentStorage;
    return persistentStorage;
  }

  // If persistent key doesn't exist, check the old key
  if (global.__oauthStateStorage) {
    // Migrate to persistent key
    global.__oman_education_oauth_state_storage__ = global.__oauthStateStorage;
    return global.__oauthStateStorage;
  }

  // Last resort: create new storage (should not happen)
  const newStorage = new Map<string, OAuthState>();
  global.__oman_education_oauth_state_storage__ = newStorage;
  global.__oauthStateStorage = newStorage;
  logger.warn(
    "Re-initialized global OAuth state storage in FallbackOAuthStateRepository",
    {
      stack: new Error().stack,
    },
  );
  return newStorage;
}

export class FallbackOAuthStateRepository implements Pick<
  IGoogleOAuthRepository,
  "createState" | "findStateByToken" | "deleteState"
> {
  private redisRepo: RedisOAuthStateRepository | null = null;
  private useRedis: boolean = true;
  private redisCheckAttempted: boolean = false;
  private lastRedisCheck: number = 0;
  private readonly REDIS_CHECK_INTERVAL = 30000; // Check Redis again after 30 seconds

  constructor() {
    // Don't create Redis repo immediately - only create it if we need it
    // Use shared global storage directly instead of creating new OAuthStateRepository
  }

  /**
   * Check if Redis is available
   */
  private async checkRedis(): Promise<boolean> {
    // If we've already determined Redis is not available, skip check for a while
    if (!this.useRedis) {
      const now = Date.now();
      // Only retry after interval
      if (now - this.lastRedisCheck < this.REDIS_CHECK_INTERVAL) {
        return false;
      }
      // Reset flag to retry
      this.useRedis = true;
      this.redisCheckAttempted = false; // Reset to allow retry logging
    }

    // Lazy initialization of Redis repo
    if (!this.redisRepo) {
      this.redisRepo = new RedisOAuthStateRepository();
    }

    try {
      // Use a timeout to avoid hanging
      const initPromise = this.redisRepo.initialize();
      const timeoutPromise = new Promise<never>((_, reject) => {
        setTimeout(() => reject(new Error("Redis connection timeout")), 2000);
      });

      await Promise.race([initPromise, timeoutPromise]);

      // If we successfully connect, reset the flag
      if (!this.useRedis) {
        logger.info(
          "Redis connection restored, switching back to Redis for OAuth state storage",
        );
        this.useRedis = true;
      }
      return true;
    } catch (error) {
      if (this.useRedis) {
        // Only log warning once
        if (!this.redisCheckAttempted) {
          logger.warn(
            "Redis not available, falling back to memory storage for OAuth state",
            {
              error: error instanceof Error ? error.message : String(error),
              note: "Will retry Redis connection after 30 seconds",
            },
          );
          this.redisCheckAttempted = true;
        }
        this.useRedis = false;
        this.lastRedisCheck = Date.now();
      }
      return false;
    }
  }

  /**
   * Create OAuth state
   */
  async createState(
    redirectTo: string,
    codeVerifier: string,
    expiresInSeconds: number,
  ): Promise<OAuthState> {
    const redisAvailable = await this.checkRedis();

    if (redisAvailable && this.redisRepo) {
      try {
        return await this.redisRepo.createState(
          redirectTo,
          codeVerifier,
          expiresInSeconds,
        );
      } catch (error) {
        logger.warn(
          "Failed to create OAuth state in Redis, falling back to memory",
          {
            error: error instanceof Error ? error.message : String(error),
          },
        );
        this.useRedis = false;
        this.lastRedisCheck = Date.now();
        // Fall through to memory
      }
    }

    // Use shared global storage directly
    const { v4: uuidv4 } = await import("uuid");
    const stateStorage = getSharedStateStorage();
    const id = uuidv4();
    const stateToken = uuidv4() + "-" + Date.now().toString(36);
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

    stateStorage.set(stateToken, state);

    // Verify storage after setting
    const verifyStorage = getSharedStateStorage();
    const verifyState = verifyStorage.get(stateToken);

    logger.info("OAuth state created in shared memory storage", {
      stateToken,
      expiresAt: expiresAt.toISOString(),
      expiresInSeconds,
      totalStates: stateStorage.size,
      verifyStorageSize: verifyStorage.size,
      verifyStateExists: !!verifyState,
      storageReferenceMatch: stateStorage === verifyStorage,
      allKeys: Array.from(stateStorage.keys()).slice(0, 5),
    });

    if (!verifyState) {
      logger.error(
        "CRITICAL: OAuth state was set but not found in verification check",
        {
          stateToken,
          storageSize: stateStorage.size,
          verifyStorageSize: verifyStorage.size,
        },
      );
    }

    return state;
  }

  /**
   * Find state by token
   */
  async findStateByToken(stateToken: string): Promise<OAuthState | null> {
    // Skip Redis check if we know it's not available
    if (this.useRedis) {
      const redisAvailable = await this.checkRedis();

      if (redisAvailable && this.redisRepo) {
        try {
          const state = await this.redisRepo.findStateByToken(stateToken);
          if (state) {
            return state;
          }
          // If not found in Redis, try memory (might have been created there)
        } catch (error) {
          logger.warn("Failed to find OAuth state in Redis, trying memory", {
            error: error instanceof Error ? error.message : String(error),
          });
          this.useRedis = false;
          this.lastRedisCheck = Date.now();
          // Fall through to memory
        }
      }
    }

    // Use shared global storage directly
    const stateStorage = getSharedStateStorage();
    const allKeys = Array.from(stateStorage.keys());
    const persistentStorage = global.__oman_education_oauth_state_storage__;
    const oldKeyStorage = global.__oauthStateStorage;

    // Check all possible storage locations
    const checkPersistentStorage = persistentStorage?.get(stateToken);
    const checkOldKeyStorage = oldKeyStorage?.get(stateToken);
    const checkCurrentStorage = stateStorage.get(stateToken);

    logger.info("FallbackOAuthStateRepository: Looking for OAuth state", {
      stateToken,
      totalStates: stateStorage.size,
      persistentStorageSize: persistentStorage?.size || 0,
      oldKeyStorageSize: oldKeyStorage?.size || 0,
      stateKeys: allKeys.slice(0, 10),
      lookingFor: stateToken,
      foundInKeys: allKeys.includes(stateToken),
      sameReference: stateStorage === persistentStorage,
      foundInPersistent: !!checkPersistentStorage,
      foundInOldKey: !!checkOldKeyStorage,
      foundInCurrent: !!checkCurrentStorage,
      storageReferences: {
        persistent: !!persistentStorage,
        oldKey: !!oldKeyStorage,
        current: !!stateStorage,
        persistentEqualsCurrent: stateStorage === persistentStorage,
        oldKeyEqualsCurrent: stateStorage === oldKeyStorage,
      },
    });

    const state = stateStorage.get(stateToken);

    if (!state) {
      logger.warn("FallbackOAuthStateRepository: OAuth state not found", {
        stateToken,
        totalStates: stateStorage.size,
        allStateKeys: allKeys,
      });
      return null;
    }

    if (state.isExpired()) {
      stateStorage.delete(stateToken);
      logger.debug("OAuth state expired", { stateToken });
      return null;
    }

    logger.info("FallbackOAuthStateRepository: OAuth state found", {
      stateToken,
      redirectTo: state.redirectTo,
      expiresAt: state.expiresAt.toISOString(),
    });

    return state;
  }

  /**
   * Delete state
   */
  async deleteState(stateToken: string): Promise<void> {
    const redisAvailable = await this.checkRedis();

    if (redisAvailable && this.redisRepo) {
      try {
        await this.redisRepo.deleteState(stateToken);
        // Also try to delete from shared memory (in case it was stored there)
        const stateStorage = getSharedStateStorage();
        stateStorage.delete(stateToken);
        return;
      } catch (error) {
        logger.warn("Failed to delete OAuth state from Redis, trying memory", {
          error: error instanceof Error ? error.message : String(error),
        });
        this.useRedis = false;
        this.lastRedisCheck = Date.now();
        // Fall through to memory
      }
    }

    // Use shared global storage directly
    const stateStorage = getSharedStateStorage();
    stateStorage.delete(stateToken);
  }
}
