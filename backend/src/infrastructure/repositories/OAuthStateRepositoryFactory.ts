/**
 * OAuth State Repository Factory
 *
 * Centralized Repository creation using ENV_CONFIG.
 */

import { OAuthStateRepository } from "./OAuthStateRepository.js";
import { FallbackOAuthStateRepository } from "./FallbackOAuthStateRepository.js";
import { IGoogleOAuthRepository } from "@/domain/interfaces/repositories/auth/social/IGoogleOAuthRepository.js";
import { logger } from "../../shared/utils/logger.js";
import { ENV_CONFIG } from "../config/env.config.js";

export type OAuthStateRepositoryType = Pick<
  IGoogleOAuthRepository,
  "createState" | "findStateByToken" | "deleteState"
>;

export function createOAuthStateRepository(): OAuthStateRepositoryType {
  const storageType = ENV_CONFIG.OAUTH_STATE_STORAGE;

  if (storageType === "redis") {
    logger.info(
      "Using Redis for OAuth state storage (Sovereign Cluster Enabled)",
      {
        host: ENV_CONFIG.REDIS_HOST,
        port: ENV_CONFIG.REDIS_PORT,
      },
    );
    return new FallbackOAuthStateRepository();
  }

  logger.info(
    "Using in-memory OAuth state storage (Ephemeral Development Mode)",
  );
  return new OAuthStateRepository();
}
