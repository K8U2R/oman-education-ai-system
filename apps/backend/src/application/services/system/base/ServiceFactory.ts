/**
 * Service Factory - مصنع الخدمات
 *
 * Factory لإنشاء Services بشكل موحد
 * يطبق DRY Principle لتجنب تكرار كود إنشاء Services
 */

import { DatabaseCoreAdapter } from "@/infrastructure/adapters/db/DatabaseCoreAdapter";
import { EnhancedBaseService } from "./EnhancedBaseService";
import { container } from "@/infrastructure/di/Container";
import { logger } from "@/shared/utils/logger";

/**
 * Service Factory
 *
 * Factory لإنشاء Services مع Dependency Injection
 */
export class ServiceFactory {
  /**
   * Get DatabaseCoreAdapter from ServiceRegistry
   */
  private static getDatabaseAdapter(): DatabaseCoreAdapter {
    try {
      const adapter = container.resolve<DatabaseCoreAdapter>(
        "DatabaseCoreAdapter",
      );
      if (!adapter) {
        throw new Error("DatabaseCoreAdapter not found in ServiceRegistry");
      }
      return adapter;
    } catch (error) {
      logger.error("Failed to get DatabaseCoreAdapter from ServiceRegistry", {
        error,
      });
      throw new Error("DatabaseCoreAdapter is required but not available");
    }
  }

  /**
   * Create a service instance
   *
   * @param ServiceClass - Service class constructor
   * @param dependencies - Additional dependencies (besides DatabaseCoreAdapter)
   * @returns Service instance
   *
   * @example
   * ```typescript
   * const whitelistService = ServiceFactory.create(
   *   WhitelistService,
   *   [whitelistRepository]
   * )
   * ```
   */
  static create<T extends EnhancedBaseService>(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ServiceClass: new (
      databaseAdapter: DatabaseCoreAdapter,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      ...dependencies: any[]
    ) => T,
    ...dependencies: unknown[]
  ): T {
    try {
      const databaseAdapter = this.getDatabaseAdapter();
      return new ServiceClass(databaseAdapter, ...dependencies);
    } catch (error) {
      logger.error(`Failed to create service: ${ServiceClass.name}`, { error });
      throw error;
    }
  }

  /**
   * Create a service instance with custom DatabaseCoreAdapter
   *
   * @param ServiceClass - Service class constructor
   * @param databaseAdapter - Custom DatabaseCoreAdapter
   * @param dependencies - Additional dependencies
   * @returns Service instance
   */
  static createWithAdapter<T extends EnhancedBaseService>(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ServiceClass: new (
      databaseAdapter: DatabaseCoreAdapter,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      ...dependencies: any[]
    ) => T,
    databaseAdapter: DatabaseCoreAdapter,
    ...dependencies: unknown[]
  ): T {
    try {
      return new ServiceClass(databaseAdapter, ...dependencies);
    } catch (error) {
      logger.error(
        `Failed to create service with custom adapter: ${ServiceClass.name}`,
        { error },
      );
      throw error;
    }
  }

  /**
   * Register and create a service in ServiceRegistry
   *
   * @param name - Service name in registry
   * @param ServiceClass - Service class constructor
   * @param dependencies - Additional dependencies
   * @returns Service instance
   */
  static createAndRegister<T extends EnhancedBaseService>(
    name: string,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ServiceClass: new (
      databaseAdapter: DatabaseCoreAdapter,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      ...dependencies: any[]
    ) => T,
    ...dependencies: unknown[]
  ): T {
    try {
      const service = ServiceFactory.create(ServiceClass, ...dependencies);
      container.register(name, () => service, "singleton");
      logger.info(`Service registered: ${name}`, {
        serviceName: ServiceClass.name,
      });
      return service;
    } catch (error) {
      logger.error(`Failed to create and register service: ${name}`, { error });
      throw error;
    }
  }
}
