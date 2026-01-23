/**
 * Base Adapter - المحوّل الأساسي
 *
 * Base class لجميع Adapters
 * يوفر وظائف مشتركة مثل connection management و error handling
 */

import { logger } from "@/shared/utils/logger";

export type HealthStatus = "healthy" | "unhealthy" | "degraded";

// TResponse is kept for future extensibility
// @ts-expect-error - Kept for future extensibility
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export interface IAdapter<TConfig = unknown, TResponse = unknown> {
  connect(config: TConfig): Promise<void>;
  disconnect(): Promise<void>;
  isConnected(): boolean;
  healthCheck(): Promise<HealthStatus>;
  getName(): string;
}

/**
 * Base Adapter Class
 *
 * يوفر وظائف مشتركة لجميع Adapters
 */
export abstract class BaseAdapter<TConfig, TResponse> implements IAdapter<
  TConfig,
  TResponse
> {
  protected config: TConfig | null = null;
  protected connected: boolean = false;

  /**
   * Connect to external service
   */
  abstract connect(config: TConfig): Promise<void>;

  /**
   * Disconnect from external service
   */
  abstract disconnect(): Promise<void>;

  /**
   * Check if connected
   */
  isConnected(): boolean {
    return this.connected;
  }

  /**
   * Health check (must be implemented by child classes)
   */
  abstract healthCheck(): Promise<HealthStatus>;

  /**
   * Get adapter name (must be implemented by child classes)
   */
  abstract getName(): string;

  /**
   * Handle connection errors
   */
  protected handleConnectionError(error: unknown, operation: string): void {
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";

    logger.error(`Adapter connection error: ${operation}`, {
      adapter: this.getName(),
      operation,
      error: errorMessage,
    });

    this.connected = false;
  }

  /**
   * Log connection status
   */
  protected logConnectionStatus(status: "connected" | "disconnected"): void {
    logger.info(`Adapter ${status}`, {
      adapter: this.getName(),
      status,
    });
  }
}
