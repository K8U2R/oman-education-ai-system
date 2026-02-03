/**
 * Base Service - الخدمة الأساسية
 *
 * Base class لجميع Application Services
 * يوفر وظائف مشتركة مثل error handling و logging
 */

// Shared Layer - استخدام common.ts
import { logger } from "@/shared/common";

/**
 * Base Service Class
 *
 * يوفر وظائف مشتركة لجميع Services
 */
export abstract class BaseService {
  /**
   * Log service operation
   */
  protected logOperation(
    operation: string,
    context?: Record<string, unknown>,
  ): void {
    logger.debug(`Service operation: ${operation}`, {
      service: this.getServiceName(),
      operation,
      ...context,
    });
  }

  /**
   * Log service error
   */
  protected logError(
    operation: string,
    error: unknown,
    context?: Record<string, unknown>,
  ): void {
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";

    logger.error(`Service operation failed: ${operation}`, {
      service: this.getServiceName(),
      operation,
      error: errorMessage,
      ...context,
    });
  }

  /**
   * Get service name (must be implemented by child classes)
   */
  protected abstract getServiceName(): string;

  /**
   * Handle service errors
   */
  protected handleServiceError(error: unknown, operation: string): never {
    this.logError(operation, error);
    throw error;
  }
}
