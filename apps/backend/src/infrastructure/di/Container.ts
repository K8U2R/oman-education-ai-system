/**
 * Service Container - Dependency Injection Container
 *
 * Enterprise-level DI container with support for:
 * - Singleton & Transient scopes
 * - Factory pattern
 * - Lazy loading
 * - Circular dependency detection
 */

export type ServiceFactory<T> = (container: Container) => T;
export type ServiceScope = "singleton" | "transient";

interface ServiceDefinition<T = unknown> {
  factory: ServiceFactory<T>;
  scope: ServiceScope;
  instance?: T;
}

export class Container {
  private services = new Map<string, ServiceDefinition>();
  private singletons = new Map<string, unknown>();
  private resolving = new Set<string>(); // For circular dependency detection

  /**
   * Register a service
   */
  register<T>(
    key: string,
    factory: ServiceFactory<T>,
    scope: ServiceScope = "transient",
  ): void {
    this.services.set(key, { factory, scope });
  }

  /**
   * Register a singleton service
   */
  registerSingleton<T>(
    key: string,
    constructorOrFactory: { new (...args: unknown[]): T } | ServiceFactory<T>,
  ): void {
    let factory: ServiceFactory<T>;

    if (this.isConstructor(constructorOrFactory)) {
      const Constructor = constructorOrFactory as {
        new (...args: unknown[]): T;
      };
      factory = () => new Constructor();
    } else {
      factory = constructorOrFactory as ServiceFactory<T>;
    }

    this.register(key, factory, "singleton");
  }

  /**
   * Register a factory (transient) service
   */
  registerFactory<T>(key: string, factory: ServiceFactory<T>): void {
    this.register(key, factory, "transient");
  }

  private isConstructor(obj: unknown): boolean {
    return !!(obj as { prototype?: { constructor?: { name?: string } } })
      ?.prototype?.constructor?.name;
  }

  /**
   * Resolve a service
   */
  resolve<T>(key: string): T {
    // Check for circular dependencies
    if (this.resolving.has(key)) {
      throw new Error(`Circular dependency detected: ${key}`);
    }

    const definition = this.services.get(key);
    if (!definition) {
      throw new Error(`Service '${key}' not found`);
    }

    // Singleton: return cached instance
    if (definition.scope === "singleton") {
      if (!this.singletons.has(key)) {
        this.resolving.add(key);
        try {
          this.singletons.set(key, definition.factory(this));
        } finally {
          this.resolving.delete(key);
        }
      }
      return this.singletons.get(key) as T;
    }

    // Transient: create new instance
    this.resolving.add(key);
    try {
      return definition.factory(this) as T;
    } finally {
      this.resolving.delete(key);
    }
  }

  /**
   * Check if service is registered
   */
  isRegistered(key: string): boolean {
    return this.services.has(key);
  }

  /**
   * Clear all services (useful for testing)
   */
  clear(): void {
    this.services.clear();
    this.singletons.clear();
  }
}

// Global container instance
export const container = new Container();
