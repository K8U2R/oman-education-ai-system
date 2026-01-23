/**
 * Base Repository - المستودع الأساسي
 *
 * Base class لجميع Repositories
 * يوفر وظائف مشتركة مثل error handling و logging
 */

import { DatabaseCoreAdapter } from "../../adapters/db/DatabaseCoreAdapter";
import { logger } from "@/shared/utils/logger";
import {
  DatabaseQueryError,
  DatabaseConnectionError,
} from "@/domain/exceptions";

export interface FilterOptions {
  [key: string]: unknown;
}

/**
 * Base Repository Class
 *
 * يوفر وظائف مشتركة لجميع Repositories
 */
export abstract class BaseRepository<TEntity, TId = string> {
  protected constructor(
    protected readonly databaseAdapter: DatabaseCoreAdapter,
  ) {}

  /**
   * Find entity by ID
   */
  async findById(id: TId): Promise<TEntity | null> {
    try {
      const entity = await this.databaseAdapter.findOne<TEntity>(
        this.getTableName(),
        { id } as FilterOptions,
      );
      return entity || null;
    } catch (error) {
      this.handleDatabaseError(error, "findById", { id });
      throw error;
    }
  }

  /**
   * Find all entities with optional filters
   */
  async findAll(filters?: FilterOptions): Promise<TEntity[]> {
    try {
      const entities = await this.databaseAdapter.find<TEntity>(
        this.getTableName(),
        filters || {},
      );
      return entities || [];
    } catch (error) {
      this.handleDatabaseError(error, "findAll", filters);
      throw error;
    }
  }

  /**
   * Find one entity with filters
   */
  async findOne(filters: FilterOptions): Promise<TEntity | null> {
    try {
      const entity = await this.databaseAdapter.findOne<TEntity>(
        this.getTableName(),
        filters,
      );
      return entity || null;
    } catch (error) {
      this.handleDatabaseError(error, "findOne", filters);
      throw error;
    }
  }

  /**
   * Create new entity
   */
  async create(entity: Partial<TEntity>): Promise<TEntity> {
    try {
      const created = await this.databaseAdapter.insert<TEntity>(
        this.getTableName(),
        entity as Record<string, unknown>,
      );
      return created as TEntity;
    } catch (error) {
      this.handleDatabaseError(error, "create", entity);
      throw error;
    }
  }

  /**
   * Update entity by ID
   */
  async update(id: TId, entity: Partial<TEntity>): Promise<TEntity> {
    try {
      const updated = await this.databaseAdapter.update<TEntity>(
        this.getTableName(),
        { id } as FilterOptions,
        entity as Record<string, unknown>,
      );
      return updated as TEntity;
    } catch (error) {
      this.handleDatabaseError(error, "update", { id, entity });
      throw error;
    }
  }

  /**
   * Delete entity by ID
   */
  async delete(id: TId): Promise<void> {
    try {
      await this.databaseAdapter.delete(this.getTableName(), {
        id,
      } as FilterOptions);
    } catch (error) {
      this.handleDatabaseError(error, "delete", { id });
      throw error;
    }
  }

  /**
   * Count entities with optional filters
   */
  async count(filters?: FilterOptions): Promise<number> {
    try {
      const entities = await this.findAll(filters);
      return entities.length;
    } catch (error) {
      this.handleDatabaseError(error, "count", filters);
      throw error;
    }
  }

  /**
   * Get table name (must be implemented by child classes)
   */
  protected abstract getTableName(): string;

  /**
   * Handle database errors
   */
  protected handleDatabaseError(
    error: unknown,
    operation: string,
    context?: Record<string, unknown>,
  ): void {
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";

    logger.error(`Database operation failed: ${operation}`, {
      operation,
      table: this.getTableName(),
      error: errorMessage,
      context,
    });

    // Convert to domain exceptions if needed
    if (
      errorMessage.includes("timeout") ||
      errorMessage.includes("ECONNREFUSED")
    ) {
      throw new DatabaseConnectionError("فشل الاتصال بقاعدة البيانات");
    }

    throw new DatabaseQueryError(`فشل تنفيذ العملية: ${operation}`);
  }
}
