/**
 * Configuration Manager - مدير الإعدادات الموحد
 *
 * نظام إدارة إعدادات احترافي يوحد جميع الإعدادات في مكان واحد
 */

import { getSettings, type Settings } from "@/shared/configuration";
import { ConfigurationError } from "@/domain/exceptions";
import { logger } from "@/shared/utils/logger";
import {
  loadGoogleOAuthConfig,
  type GoogleOAuthConfig,
} from "../oauth/google/google-oauth.config.js";

/**
 * Application Configuration
 *
 * يوحد جميع الإعدادات من مصادر مختلفة
 */
export class ConfigManager {
  private settings: Settings;
  private googleOAuthConfig: GoogleOAuthConfig | null = null;
  private configs = new Map<string, unknown>();

  constructor() {
    this.settings = getSettings();
    this.loadConfigurations();
  }

  /**
   * Load all configurations
   */
  private loadConfigurations(): void {
    try {
      // Load Google OAuth config if available
      try {
        this.googleOAuthConfig = loadGoogleOAuthConfig();
        this.configs.set("googleOAuth", this.googleOAuthConfig);
      } catch (error) {
        // Google OAuth config is optional
        logger.debug("Google OAuth config not available", { error });
      }

      logger.info("Configuration Manager initialized", {
        environment: this.settings.app.env,
        configsLoaded: Array.from(this.configs.keys()),
      });
    } catch (error) {
      logger.error("Failed to load configurations", { error });
      throw new ConfigurationError("فشل تحميل الإعدادات");
    }
  }

  /**
   * Get application settings
   */
  getSettings(): Settings {
    return this.settings;
  }

  /**
   * Get Google OAuth configuration
   */
  getGoogleOAuthConfig(): GoogleOAuthConfig | null {
    return this.googleOAuthConfig;
  }

  /**
   * Get configuration by key
   */
  get<T>(key: string, defaultValue?: T): T {
    if (this.configs.has(key)) {
      return this.configs.get(key) as T;
    }

    if (defaultValue !== undefined) {
      return defaultValue;
    }

    throw new ConfigurationError(`Configuration key '${key}' not found`);
  }

  /**
   * Set configuration (useful for testing)
   */
  set(key: string, value: unknown): void {
    this.configs.set(key, value);
  }

  /**
   * Check if configuration exists
   */
  has(key: string): boolean {
    return this.configs.has(key);
  }

  /**
   * Get all configurations
   */
  getAll(): Record<string, unknown> {
    return {
      settings: this.settings,
      googleOAuth: this.googleOAuthConfig,
      ...Object.fromEntries(this.configs),
    };
  }

  /**
   * Reload configurations (useful for hot reload)
   */
  reload(): void {
    logger.info("Reloading configurations");
    this.settings = getSettings();
    this.configs.clear();
    this.loadConfigurations();
  }

  /**
   * Validate configuration
   */
  validate(): void {
    // Validate settings
    if (!this.settings) {
      throw new ConfigurationError("Settings not loaded");
    }

    // Validate required configurations based on environment
    if (this.settings.app.env === "production") {
      if (this.settings.jwt.secret === "dev-jwt-secret-change-in-production") {
        throw new ConfigurationError(
          "JWT_SECRET must be changed in production",
        );
      }

      if (
        this.settings.app.secretKey === "dev-secret-key-change-in-production"
      ) {
        throw new ConfigurationError(
          "SECRET_KEY must be changed in production",
        );
      }
    }

    logger.debug("Configuration validation passed");
  }
}

// Global instance
let configManagerInstance: ConfigManager | null = null;

/**
 * Get Config Manager instance (Singleton)
 */
export function getConfigManager(): ConfigManager {
  if (!configManagerInstance) {
    configManagerInstance = new ConfigManager();
  }
  return configManagerInstance;
}

/**
 * Reset Config Manager (useful for testing)
 */
export function resetConfigManager(): void {
  configManagerInstance = null;
}
