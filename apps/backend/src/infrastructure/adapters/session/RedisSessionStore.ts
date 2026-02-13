import { createClient, RedisClientType } from "redis";
import RedisStore from "connect-redis";
import { ISessionStore } from "./ISessionStore";
import { logger } from "../../../shared/utils/logger";

interface RedisSessionConfig {
  host: string;
  port: number;
  password?: string;
  prefix?: string;
  ttl?: number;
}

/**
 * Redis Session Store Adapter
 * Implements session storage using Redis as backend
 *
 * @compliance LAW_01 - Iron Firewall (Constructor Injection)
 * @compliance LAW_02 - Strict Typing (No 'any')
 * @compliance LAW_05 - Single Responsibility
 * @compliance LAW_11 - Root Sovereignty (Stateless sessions)
 */
export class RedisSessionStore implements ISessionStore {
  private client: RedisClientType;
  private store: RedisStore | null = null;
  private config: RedisSessionConfig;

  constructor(config: RedisSessionConfig) {
    this.config = {
      prefix: "session:",
      ttl: 86400, // 24 hours
      ...config,
    };

    this.client = createClient({
      socket: {
        host: this.config.host,
        port: this.config.port,
      },
      password: this.config.password,
    });

    // Error handling
    this.client.on("error", (err: Error) => {
      logger.error("Redis Session Store Error", { error: err.message });
    });

    this.client.on("connect", () => {
      logger.info("Redis Session Store connected successfully");
    });

    this.client.on("ready", () => {
      logger.info("Redis Session Store ready to accept commands");
    });
  }

  /**
   * Connect to Redis and initialize the session store
   */
  async connect(): Promise<void> {
    try {
      if (!this.client.isOpen) {
        await this.client.connect();
      }

      this.store = new RedisStore({
        client: this.client,
        prefix: this.config.prefix,
        ttl: this.config.ttl,
      });

      logger.info("Redis Session Store initialized", {
        prefix: this.config.prefix,
        ttl: this.config.ttl,
      });
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error";
      logger.error("Failed to connect Redis Session Store", {
        error: errorMessage,
      });
      throw new Error(`Redis Session Store connection failed: ${errorMessage}`);
    }
  }

  /**
   * Disconnect from Redis
   */
  async disconnect(): Promise<void> {
    try {
      if (this.client.isOpen) {
        await this.client.disconnect();
        this.store = null;
        logger.info("Redis Session Store disconnected gracefully");
      }
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error";
      logger.error("Failed to disconnect Redis Session Store", {
        error: errorMessage,
      });
    }
  }

  /**
   * Get the express-session compatible store
   */
  getStore(): RedisStore {
    if (!this.store) {
      throw new Error(
        "Redis Session Store not initialized. Call connect() first.",
      );
    }
    return this.store;
  }

  /**
   * Health check - verify Redis connection
   */
  async isHealthy(): Promise<boolean> {
    try {
      if (!this.client.isOpen) {
        return false;
      }
      await this.client.ping();
      return true;
    } catch {
      return false;
    }
  }
}
