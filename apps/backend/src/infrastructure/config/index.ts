/**
 * Configuration - Main Barrel Export
 *
 * Organized by function:
 * - core: ConfigManager
 * - environment: env config, validator, schema
 * - oauth: Google OAuth and future providers
 * - system: endpoints, services metadata
 *
 * @compliance LAW_05 - Functional organization
 * @note Explicit re-exports for backward compatibility
 */

// Core
export {
  ConfigManager,
  getConfigManager,
  resetConfigManager,
} from "./core/ConfigManager.js";

// Environment
export { ENV_CONFIG } from "./environment/env.config.js";
export { validateEnvironment } from "./environment/env.validator.js";
export * from "./environment/index.js";

// OAuth
export {
  loadGoogleOAuthConfig,
  type GoogleOAuthConfig,
} from "./oauth/google/google-oauth.config.js";

// System
export { SYSTEM_ENDPOINTS, SYSTEM_SERVICES } from "./system/structure/index.js";
