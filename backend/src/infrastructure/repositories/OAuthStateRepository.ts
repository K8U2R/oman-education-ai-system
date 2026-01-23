/**
 * OAuth State Repository
 *
 * Manages OAuth state tokens (in-memory for now, can be extended to Redis/DB)
 */

import { IGoogleOAuthRepository } from "@/domain/interfaces/repositories";
import { OAuthState } from "@/domain/entities/OAuthState";
import { v4 as uuidv4 } from "uuid";
import { logger } from "@/shared/utils/logger";

// In-memory storage (for development)
// TODO: Replace with Redis or Database for production
// Using global to prevent module reload issues with tsx watch

// Initialize global storage if it doesn't exist
if (!global.__oman_education_oauth_state_storage__) {
  const newStorage = new Map<string, OAuthState>();
  global.__oman_education_oauth_state_storage__ = newStorage;
  // Also set the old key for backward compatibility
  global.__oauthStateStorage = newStorage;
  logger.info("Initialized global OAuth state storage", {
    existingSize: 0,
    module: "OAuthStateRepository",
  });
} else {
  // Restore the old key reference if it exists
  const existingStorage = global.__oman_education_oauth_state_storage__;
  global.__oauthStateStorage = existingStorage;
  logger.info("Global OAuth state storage already exists", {
    existingSize: existingStorage.size,
    keys: Array.from(existingStorage.keys()).slice(0, 5),
    module: "OAuthStateRepository",
  });
}

// Always use the global storage directly to ensure consistency
function getStateStorage(): Map<string, OAuthState> {
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
    "Re-initialized global OAuth state storage (this should not happen in normal operation)",
    {
      stack: new Error().stack,
    },
  );
  return newStorage;
}

// Cleanup interval (every 5 minutes)
const CLEANUP_INTERVAL = 5 * 60 * 1000;

// Start cleanup interval only once
let cleanupIntervalStarted = false;
if (!cleanupIntervalStarted) {
  setInterval(() => {
    cleanupExpiredStates();
  }, CLEANUP_INTERVAL);
  cleanupIntervalStarted = true;
  logger.debug("OAuth state cleanup interval started", {
    interval: CLEANUP_INTERVAL,
  });
}

/**
 * Cleanup expired states
 */
function cleanupExpiredStates(): void {
  const stateStorage = getStateStorage();
  const now = new Date();
  let cleaned = 0;

  for (const [token, state] of stateStorage.entries()) {
    if (state.expiresAt < now) {
      stateStorage.delete(token);
      cleaned++;
    }
  }

  if (cleaned > 0) {
    logger.debug(`Cleaned up ${cleaned} expired OAuth states`);
  }
}

export class OAuthStateRepository implements Pick<
  IGoogleOAuthRepository,
  "createState" | "findStateByToken" | "deleteState"
> {
  /**
   * Create OAuth state
   *
   * @param redirectTo - Redirect URL after OAuth
   * @param codeVerifier - PKCE code verifier
   * @param expiresInSeconds - State expiration in seconds
   * @returns OAuthState
   */
  async createState(
    redirectTo: string,
    codeVerifier: string,
    expiresInSeconds: number,
  ): Promise<OAuthState> {
    const stateStorage = getStateStorage();
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

    // Store in both to ensure consistency
    stateStorage.set(stateToken, state);
    if (
      global.__oauthStateStorage &&
      global.__oauthStateStorage !== stateStorage
    ) {
      global.__oauthStateStorage.set(stateToken, state);
    }

    // Verify it was actually stored
    const verifyState = stateStorage.get(stateToken);
    const globalVerify = global.__oauthStateStorage?.get(stateToken);

    if (!verifyState) {
      logger.error("Failed to store OAuth state!", {
        stateToken,
        stateStorageSize: stateStorage.size,
        globalStorageSize: global.__oauthStateStorage?.size || 0,
        sameReference: stateStorage === global.__oauthStateStorage,
      });
      throw new Error("Failed to store OAuth state");
    }

    logger.info("OAuth state created and verified", {
      stateToken,
      expiresAt: expiresAt.toISOString(),
      expiresInSeconds,
      totalStates: stateStorage.size,
      globalStorageSize: global.__oauthStateStorage?.size || 0,
      storedCorrectly: verifyState.stateToken === stateToken,
      globalStoredCorrectly: globalVerify?.stateToken === stateToken,
      sameReference: stateStorage === global.__oauthStateStorage,
    });

    return state;
  }

  /**
   * Find state by token
   *
   * @param stateToken - State token
   * @returns OAuthState or null if not found
   */
  async findStateByToken(stateToken: string): Promise<OAuthState | null> {
    const stateStorage = getStateStorage();
    const allKeys = Array.from(stateStorage.keys());

    // Also check global directly
    const globalKeys = global.__oauthStateStorage
      ? Array.from(global.__oauthStateStorage.keys())
      : [];

    const storage = global.__oman_education_oauth_state_storage__;
    const persistentKeys = storage ? Array.from(storage.keys()) : [];

    logger.info("Looking for OAuth state", {
      stateToken,
      totalStates: stateStorage.size,
      globalStorageSize: global.__oauthStateStorage?.size || 0,
      persistentStorageSize: storage?.size || 0,
      stateKeys: allKeys.slice(0, 10), // First 10 for debugging
      globalKeys: globalKeys.slice(0, 10),
      persistentKeys: persistentKeys.slice(0, 10),
      lookingFor: stateToken,
      foundInKeys: allKeys.includes(stateToken),
      foundInGlobalKeys: globalKeys.includes(stateToken),
      foundInPersistentKeys: persistentKeys.includes(stateToken),
      globalStorageExists: !!global.__oauthStateStorage,
      persistentStorageExists: !!storage,
      persistentSameReference: stateStorage === storage,
    });

    // Try to get from both to see if there's a mismatch
    let state = stateStorage.get(stateToken);
    const globalState = global.__oauthStateStorage?.get(stateToken);

    if (!state && !globalState) {
      logger.warn("OAuth state not found in either storage", {
        stateToken,
        totalStates: stateStorage.size,
        globalStorageSize: global.__oauthStateStorage?.size || 0,
        persistentStorageSize: storage?.size || 0,
        allStateKeys: allKeys,
        globalKeys: globalKeys,
        persistentKeys: persistentKeys,
        globalStorageExists: !!global.__oauthStateStorage,
        persistentStorageExists: !!storage,
        persistentSameReference: stateStorage === storage,
      });
      return null;
    }

    // If found in global but not in local, use global
    if (!state && globalState) {
      logger.warn("OAuth state found in global but not in local storage!", {
        stateToken,
        sameReference: stateStorage === global.__oauthStateStorage,
      });
      // Update local to match global
      stateStorage.set(stateToken, globalState);
      state = globalState;
    }

    // At this point, state should be defined
    if (!state) {
      logger.error("Unexpected: state is still undefined after checks", {
        stateToken,
      });
      return null;
    }

    if (state.isExpired()) {
      stateStorage.delete(stateToken);
      logger.debug("OAuth state expired", { stateToken });
      return null;
    }

    logger.debug("OAuth state found", {
      stateToken,
      redirectTo: state.redirectTo,
      expiresAt: state.expiresAt.toISOString(),
    });

    return state;
  }

  /**
   * Delete state
   *
   * @param stateToken - State token
   */
  async deleteState(stateToken: string): Promise<void> {
    const stateStorage = getStateStorage();
    const deleted = stateStorage.delete(stateToken);
    if (deleted) {
      logger.debug("OAuth state deleted", { stateToken });
    }
  }

  /**
   * Generate secure state token
   *
   * @returns State token
   */
  private generateStateToken(): string {
    return uuidv4() + "-" + Date.now().toString(36);
  }
}
