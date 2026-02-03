/**
 * Database Core Adapter - محوّل Database Core
 *
 * Adapter للاتصال بـ Database Core Service
 * يستخدم HTTP للاتصال بـ TypeScript Database Core Service
 *
 * @example
 * ```typescript
 * const adapter = new DatabaseCoreAdapter(settings)
 * const users = await adapter.find('users', { role: 'student' })
 * ```
 */

import axios, { AxiosInstance } from "axios";

import http from "http";

import https from "https";
import { getSettings } from "@/shared/configuration";
import { logger } from "@/shared/utils/logger";
import {
  DatabaseConnectionError,
  DatabaseQueryError,
  DatabaseTimeoutError,
} from "@/domain/exceptions";
import { queryOptimizerService } from "../../database/query-optimizer.service.js";

export interface DatabaseOperation {
  operation: "FIND" | "INSERT" | "UPDATE" | "DELETE";
  entity: string;
  conditions?: Record<string, unknown>;
  payload?: Record<string, unknown>;
  actor?: string;
}

export interface DatabaseResponse<T = unknown> {
  success: boolean;
  data?: T | T[];
  error?: string;
}

export class DatabaseCoreAdapter {
  private readonly client: AxiosInstance;
  private readonly baseUrl: string;
  private readonly timeout: number;
  private readonly httpAgent: http.Agent;
  private readonly httpsAgent: https.Agent;
  private connectionHealth: {
    isHealthy: boolean;
    lastCheck: number;
    consecutiveFailures: number;
  } = {
    isHealthy: true,
    lastCheck: 0,
    consecutiveFailures: 0,
  };

  /**
   * إنشاء Database Core Adapter
   *
   * @param settings - إعدادات التطبيق (اختياري، سيتم تحميلها تلقائياً)
   */
  constructor(settings?: ReturnType<typeof getSettings>) {
    const appSettings = settings || getSettings();
    this.baseUrl = appSettings.databaseCore.url;
    this.timeout = appSettings.databaseCore.timeout;

    // HTTP Connection Pooling Configuration (Optimized)
    // Keep connections alive for reuse, reducing connection overhead
    const poolOptions = {
      keepAlive: true,
      keepAliveMsecs: 1000, // Send keep-alive packet every 1 second
      maxSockets: 100, // Increased: Maximum number of sockets per host (was 50)
      maxFreeSockets: 20, // Increased: Maximum number of free sockets to keep open (was 10)
      timeout: this.timeout,
      scheduling: "fifo" as const, // FIFO scheduling for better connection reuse
    };

    this.httpAgent = new http.Agent(poolOptions);
    this.httpsAgent = new https.Agent(poolOptions);

    this.client = axios.create({
      baseURL: this.baseUrl,
      timeout: this.timeout,
      httpAgent: this.httpAgent,
      httpsAgent: this.httpsAgent,
      headers: {
        "Content-Type": "application/json; charset=utf-8",
        Accept: "application/json; charset=utf-8",
        Connection: "keep-alive", // Enable HTTP keep-alive
      },
      responseType: "json",
      responseEncoding: "utf8",
    });

    // Request interceptor
    this.client.interceptors.request.use(
      (config) => {
        logger.debug("Database Core request", {
          method: config.method,
          url: config.url,
          data: config.data,
        });
        return config;
      },
      (error) => {
        logger.error("Database Core request error", { error });
        return Promise.reject(error);
      },
    );

    // Response interceptor
    this.client.interceptors.response.use(
      (response) => {
        logger.debug("Database Core response", {
          status: response.status,
          data: response.data,
        });
        return response;
      },
      (error: unknown) => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const err = error as any;
        logger.error("Database Core response error", {
          status: err.response?.status,
          message: err.message,
          data: err.response?.data,
        });
        return Promise.reject(error);
      },
    );
  }

  /**
   * تنفيذ عملية على قاعدة البيانات
   *
   * @param operation - العملية المراد تنفيذها
   * @returns DatabaseResponse
   * @throws {Error} إذا فشلت العملية
   *
   * @private
   */
  private async execute<T = unknown>(
    operation: DatabaseOperation,
  ): Promise<DatabaseResponse<T>> {
    const startTime = Date.now();
    const queryString = JSON.stringify({
      operation: operation.operation,
      entity: operation.entity,
      conditions: operation.conditions,
    });

    try {
      // Check cache for FIND operations
      if (operation.operation === "FIND") {
        const cacheKey = queryOptimizerService.generateCacheKey(
          operation.entity,
          operation.conditions || {},
          operation.payload as
            | { limit?: number; offset?: number; orderBy?: unknown }
            | undefined,
        );
        const cached = queryOptimizerService.getCachedQuery<T[]>(cacheKey);
        if (cached !== null) {
          logger.debug("Query cache hit", {
            entity: operation.entity,
            cacheKey,
          });
          return {
            success: true,
            data: cached as T,
          };
        }
      }

      // Extract options from payload if it's a FIND operation
      const payload: Record<string, unknown> = operation.payload || {};
      const options =
        operation.operation === "FIND" && payload.limit !== undefined
          ? {
              limit: payload.limit,
              offset: payload.offset,
              orderBy: payload.orderBy,
            }
          : undefined;

      const requestPayload =
        operation.operation === "FIND"
          ? payload.data || {} // For FIND, payload might contain data
          : payload; // For INSERT/UPDATE, payload is the data

      const response = await this.client.post<DatabaseResponse<T>>(
        "/api/database/execute",
        {
          operation: operation.operation,
          entity: operation.entity,
          conditions: operation.conditions || {},
          payload: requestPayload,
          actor: operation.actor || "system",
          ...(options && { options }),
        },
      );

      const duration = Date.now() - startTime;

      // Record query metrics
      queryOptimizerService.recordQuery({
        query: queryString,
        duration,
        timestamp: Date.now(),
        table: operation.entity,
        operation: operation.operation as
          | "SELECT"
          | "INSERT"
          | "UPDATE"
          | "DELETE",
        rowsAffected: Array.isArray(response.data.data)
          ? response.data.data.length
          : 1,
      });

      if (!response.data.success) {
        const errorMessage = response.data.error || "Database operation failed";
        logger.error("Database Core operation failed", { error: errorMessage });
        throw new DatabaseQueryError(errorMessage);
      }

      // Cache FIND operations (only if not already cached)
      if (operation.operation === "FIND" && response.data.success) {
        const cacheKey = queryOptimizerService.generateCacheKey(
          operation.entity,
          operation.conditions || {},
          options as Record<string, unknown>,
        );
        // Only cache if not already in cache (to avoid overwriting)
        if (!queryOptimizerService.getCachedQuery(cacheKey)) {
          queryOptimizerService.cacheQuery(cacheKey, response.data.data);
        }
      }

      // Invalidate cache for write operations
      if (
        operation.operation === "INSERT" ||
        operation.operation === "UPDATE" ||
        operation.operation === "DELETE"
      ) {
        queryOptimizerService.clearCache(`query:${operation.entity}:`);
      }

      return response.data;
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        const axiosError = error;
        if (
          axiosError.code === "ECONNREFUSED" ||
          axiosError.code === "ETIMEDOUT"
        ) {
          logger.error("Database Core Service connection failed", {
            url: this.baseUrl,
            error: axiosError.message,
          });
          throw new DatabaseConnectionError(
            `Database Core Service is not available at ${this.baseUrl}. ` +
              "Please make sure the service is running on port 3001.",
          );
        }
        if (axiosError.code === "ETIMEDOUT") {
          logger.error("Database Core Service timeout", {
            url: this.baseUrl,
            timeout: this.timeout,
          });
          throw new DatabaseTimeoutError(
            `انتهت مهلة الاتصال بـ Database Core Service (${this.timeout}ms)`,
          );
        }
        if (axiosError.response) {
          const errorData = axiosError.response.data as Record<string, unknown>;
          const errorMessage =
            (errorData?.error as string) ||
            `Database Core error: ${axiosError.response.status} ${axiosError.response.statusText}`;
          logger.error("Database Core Service error", {
            status: axiosError.response.status,
            error: errorMessage,
          });
          throw new DatabaseQueryError(errorMessage);
        }
        if (axiosError.request) {
          logger.error("Database Core Service request failed", {
            url: this.baseUrl,
            error: "No response received",
          });
          throw new DatabaseConnectionError(
            `Database Core Service is not available at ${this.baseUrl}. ` +
              "Please make sure the service is running on port 3001.",
          );
        }
      }

      // Re-throw if already a DatabaseError
      if (
        error instanceof DatabaseConnectionError ||
        error instanceof DatabaseQueryError ||
        error instanceof DatabaseTimeoutError
      ) {
        throw error;
      }

      const errorMessage =
        error instanceof Error ? error.message : "Unknown error";
      logger.error("Database operation failed", { error: errorMessage });
      throw new DatabaseQueryError(
        `Database operation failed: ${errorMessage}`,
      );
    }
  }

  /**
   * البحث عن سجلات متعددة
   *
   * @param entity - اسم الجدول
   * @param conditions - شروط البحث
   * @param options - خيارات إضافية (limit, offset, orderBy)
   * @returns Array of records
   *
   * @example
   * ```typescript
   * const users = await adapter.find('users', { role: 'student' })
   * ```
   */
  async find<T = unknown>(
    entity: string,
    conditions: Record<string, unknown> = {},
    options?: {
      limit?: number;
      offset?: number;
      orderBy?: { column: string; direction: "asc" | "desc" };
    },
  ): Promise<T[]> {
    // Check cache first
    const cacheKey = queryOptimizerService.generateCacheKey(
      entity,
      conditions,
      options,
    );
    const cachedResult = queryOptimizerService.getCachedQuery<T[]>(cacheKey);

    if (cachedResult !== null) {
      logger.debug("Cache hit", { entity, cacheKey });
      return cachedResult;
    }

    logger.debug("Cache miss", { entity, cacheKey });

    const operation: DatabaseOperation = {
      operation: "FIND",
      entity,
      conditions,
      payload: options as Record<string, unknown>, // Will be extracted as options in execute
    };

    const response = await this.execute<T>(operation);
    const result = Array.isArray(response.data) ? response.data : [];

    // Cache the result (already done in execute, but ensure it's cached)
    if (result.length > 0 || Object.keys(conditions).length === 0) {
      queryOptimizerService.cacheQuery(cacheKey, result);
    }

    return result;
  }

  /**
   * Count records matching conditions
   *
   * @param entity - اسم الجدول
   * @param conditions - شروط البحث
   * @returns عدد السجلات
   *
   * @example
   * ```typescript
   * const count = await adapter.count('users', { role: 'student' })
   * ```
   */
  async count(
    entity: string,
    conditions: Record<string, unknown> = {},
  ): Promise<number> {
    // Use a lightweight query to count
    // This is more efficient than fetching all records and counting in memory
    try {
      const response = await this.client.post<
        DatabaseResponse<{ count: number }>
      >("/api/database/count", {
        entity,
        conditions,
      });

      if (!response.data.success) {
        // Fallback: fetch all and count (not ideal, but works)
        const allRecords = await this.find(entity, conditions);
        return allRecords.length;
      }

      const data = response.data.data;
      if (
        data &&
        typeof data === "object" &&
        "count" in data &&
        typeof data.count === "number"
      ) {
        return data.count;
      }

      // Fallback: fetch all and count
      const allRecords = await this.find(entity, conditions);
      return allRecords.length;
    } catch {
      // Fallback: fetch all and count
      const allRecords = await this.find(entity, conditions);
      return allRecords.length;
    }
  }

  /**
   * البحث عن سجل واحد
   *
   * @param entity - اسم الجدول
   * @param conditions - شروط البحث
   * @returns Record أو null
   *
   * @example
   * ```typescript
   * const user = await adapter.findOne('users', { email: 'user@example.com' })
   * ```
   */
  async findOne<T = unknown>(
    entity: string,
    conditions: Record<string, unknown>,
  ): Promise<T | null> {
    // Check cache first
    const cacheKey = queryOptimizerService.generateCacheKey(
      entity,
      conditions,
      { limit: 1 },
    );
    const cachedResult = queryOptimizerService.getCachedQuery<T[]>(cacheKey);

    if (cachedResult !== null && cachedResult.length > 0) {
      logger.debug("Cache hit (findOne)", { entity, cacheKey });
      return cachedResult[0] as T;
    }

    logger.debug("Cache miss (findOne)", { entity, cacheKey });

    // Use FIND with limit 1 instead of FIND_ONE
    const operation: DatabaseOperation = {
      operation: "FIND",
      entity,
      conditions,
      payload: { limit: 1 },
    };

    const response = await this.execute<T>(operation);
    const data = response.data;

    let result: T | null = null;
    if (Array.isArray(data)) {
      result = data.length > 0 ? (data[0] as T) : null;
    } else {
      result = (data as T) || null;
    }

    // Cache the result
    if (result !== null) {
      queryOptimizerService.cacheQuery(cacheKey, [result]);
    }

    return result;
  }

  /**
   * إدراج سجل جديد
   *
   * @param entity - اسم الجدول
   * @param data - البيانات المراد إدراجها
   * @returns Record المُدرج
   *
   * @example
   * ```typescript
   * const user = await adapter.insert('users', { email: 'user@example.com', name: 'Ahmed' })
   * ```
   */
  async insert<T = unknown>(
    entity: string,
    data: Record<string, unknown>,
  ): Promise<T> {
    const operation: DatabaseOperation = {
      operation: "INSERT",
      entity,
      payload: data,
    };

    const response = await this.execute<T>(operation);
    const result = response.data as T;

    // Invalidate cache for this entity
    queryOptimizerService.clearCache(`query:${entity}:`);

    return result;
  }

  /**
   * تحديث سجل
   *
   * @param entity - اسم الجدول
   * @param conditions - شروط البحث
   * @param data - البيانات المراد تحديثها
   * @returns Record المحدّث أو null
   *
   * @example
   * ```typescript
   * const user = await adapter.update('users', { id: 'user-id' }, { name: 'Ahmed' })
   * ```
   */
  async update<T = unknown>(
    entity: string,
    conditions: Record<string, unknown>,
    data: Record<string, unknown>,
  ): Promise<T | null> {
    const operation: DatabaseOperation = {
      operation: "UPDATE",
      entity,
      conditions,
      payload: data,
    };

    const response = await this.execute<T>(operation);
    const result = (response.data as T) || null;

    // Invalidate cache for this entity
    queryOptimizerService.clearCache(`query:${entity}:`);

    return result;
  }

  /**
   * حذف سجل
   *
   * @param entity - اسم الجدول
   * @param conditions - شروط البحث
   * @param soft - حذف ناعم (soft delete) أم حذف نهائي
   * @returns true إذا تم الحذف بنجاح
   *
   * @example
   * ```typescript
   * await adapter.delete('users', { id: 'user-id' })
   * ```
   */
  async delete(
    entity: string,
    conditions: Record<string, unknown>,
    soft: boolean = false,
  ): Promise<boolean> {
    const operation: DatabaseOperation = {
      operation: "DELETE",
      entity,
      conditions,
      payload: { soft },
    };

    const response = await this.execute(operation);
    const success = response.success;

    // Invalidate cache for this entity
    if (success) {
      queryOptimizerService.clearCache(`query:${entity}:`);
    }

    return success;
  }

  /**
   * Health check للتحقق من توفر Database Core Service
   *
   * @returns true إذا كان Service متاحاً
   */
  async healthCheck(): Promise<boolean> {
    try {
      const startTime = Date.now();
      const response = await this.client.get("/health", {
        timeout: 5000, // 5 seconds for health check
      });
      const duration = Date.now() - startTime;

      const isHealthy = response.status === 200;

      // Update connection health
      this.connectionHealth = {
        isHealthy,
        lastCheck: Date.now(),
        consecutiveFailures: isHealthy
          ? 0
          : this.connectionHealth.consecutiveFailures + 1,
      };

      if (isHealthy) {
        logger.debug("Database Core Service health check passed", {
          duration,
          status: response.status,
        });
      } else {
        logger.warn("Database Core Service health check failed", {
          status: response.status,
          consecutiveFailures: this.connectionHealth.consecutiveFailures,
        });
      }

      return isHealthy;
    } catch (error: unknown) {
      const consecutiveFailures = this.connectionHealth.consecutiveFailures + 1;

      this.connectionHealth = {
        isHealthy: false,
        lastCheck: Date.now(),
        consecutiveFailures,
      };

      logger.warn("Database Core Service health check error", {
        error: error instanceof Error ? error.message : "Unknown error",
        consecutiveFailures,
      });

      return false;
    }
  }

  /**
   * Get connection health status
   *
   * @returns Connection health information
   */
  getConnectionHealth(): {
    isHealthy: boolean;
    lastCheck: number;
    consecutiveFailures: number;
    poolStats: {
      http: {
        sockets: number;
        freeSockets: number;
        requests: number;
      };
      https: {
        sockets: number;
        freeSockets: number;
        requests: number;
      };
    };
  } {
    const httpStats = {
      sockets: Object.keys(this.httpAgent.sockets).length,
      freeSockets: Object.keys(this.httpAgent.freeSockets).length,
      requests: Object.keys(this.httpAgent.requests).length,
    };

    const httpsStats = {
      sockets: Object.keys(this.httpsAgent.sockets).length,
      freeSockets: Object.keys(this.httpsAgent.freeSockets).length,
      requests: Object.keys(this.httpsAgent.requests).length,
    };

    return {
      ...this.connectionHealth,
      poolStats: {
        http: httpStats,
        https: httpsStats,
      },
    };
  }

  /**
   * Destroy connection pool (cleanup)
   */
  destroy(): void {
    this.httpAgent.destroy();
    this.httpsAgent.destroy();
    logger.info("Database Core Adapter connection pool destroyed");
  }
}
