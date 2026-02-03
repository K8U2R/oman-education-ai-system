/**
 * Base Repository - المستودع الأساسي
 *
 * Base class لجميع Repositories
 * يوفر وظائف مشتركة مثل error handling و logging
 */

import { DatabaseCoreAdapter } from "../adapters/db/DatabaseCoreAdapter";
import { logger } from "@/shared/utils/logger";

/**
 * Base Repository Class
 *
 * يوفر وظائف مشتركة لجميع Repositories
 */
export abstract class BaseRepository {
  protected readonly databaseAdapter: DatabaseCoreAdapter;

  constructor(databaseAdapter: DatabaseCoreAdapter) {
    this.databaseAdapter = databaseAdapter;
  }

  /**
   * Get repository name (must be implemented by child classes)
   */
  protected abstract getRepositoryName(): string;

  /**
   * Log repository operation
   */
  protected logOperation(
    operation: string,
    context?: Record<string, unknown>,
  ): void {
    logger.debug(`Repository operation: ${operation}`, {
      repository: this.getRepositoryName(),
      operation,
      ...context,
    });
  }

  /**
   * Log repository error
   */
  protected logError(
    operation: string,
    error: unknown,
    context?: Record<string, unknown>,
  ): void {
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";

    logger.error(`Repository operation failed: ${operation}`, {
      repository: this.getRepositoryName(),
      operation,
      error: errorMessage,
      ...context,
    });
  }

  /**
   * Handle repository errors
   */
  protected handleRepositoryError(
    error: unknown,
    operation: string,
    context?: Record<string, unknown>,
  ): never {
    this.logError(operation, error, context);
    throw error;
  }

  /**
   * Execute operation with error handling
   */
  protected async executeWithErrorHandling<T>(
    operation: () => Promise<T>,
    operationName: string,
    context?: Record<string, unknown>,
  ): Promise<T> {
    try {
      this.logOperation(operationName, context);
      const result = await operation();
      return result;
    } catch (error) {
      this.handleRepositoryError(error, operationName, context);
    }
  }

  /**
   * Find one record
   */
  protected async findOne<T>(
    entity: string,
    conditions: Record<string, unknown>,
  ): Promise<T | null> {
    return this.executeWithErrorHandling(
      async () => {
        return await this.databaseAdapter.findOne<T>(entity, conditions);
      },
      "findOne",
      { entity, conditions },
    );
  }

  /**
   * Find multiple records
   */
  protected async findMany<T>(
    entity: string,
    conditions?: Record<string, unknown>,
  ): Promise<T[]> {
    return this.executeWithErrorHandling(
      async () => {
        return await this.databaseAdapter.find<T>(entity, conditions || {});
      },
      "findMany",
      { entity, conditions },
    );
  }

  /**
   * Create a record
   */
  protected async insert<T>(
    entity: string,
    data: Record<string, unknown>,
  ): Promise<T> {
    return this.executeWithErrorHandling(
      async () => {
        return await this.databaseAdapter.insert<T>(entity, data);
      },
      "create",
      { entity, data },
    );
  }

  /**
   * Update a record
   */
  protected async modify<T>(
    entity: string,
    conditions: Record<string, unknown>,
    data: Record<string, unknown>,
  ): Promise<T> {
    return this.executeWithErrorHandling(
      async () => {
        const result = await this.databaseAdapter.update<T>(
          entity,
          conditions,
          data,
        );
        if (!result)
          throw new Error(`Record not found for update in ${entity}`);
        return result;
      },
      "update",
      { entity, conditions, data },
    );
  }

  /**
   * Delete a record
   */
  protected async remove(
    entity: string,
    conditions: Record<string, unknown>,
  ): Promise<void> {
    return this.executeWithErrorHandling(
      async () => {
        await this.databaseAdapter.delete(entity, conditions);
      },
      "delete",
      { entity, conditions },
    );
  }

  /**
   * Check if record exists
   */
  protected async exists(
    entity: string,
    conditions: Record<string, unknown>,
  ): Promise<boolean> {
    try {
      const result = await this.databaseAdapter.findOne(entity, conditions);
      return result !== null;
    } catch (error) {
      this.logError("exists", error, { entity, conditions });
      return false;
    }
  }
}
