/**
 * Error Tracking Service - خدمة تتبع الأخطاء
 *
 * خدمة شاملة لتتبع وتحليل الأخطاء في التطبيق
 * تدعم:
 * - Error aggregation
 * - Error categorization
 * - Error frequency tracking
 * - Error trends analysis
 * - Error alerts
 */

import { logger } from "@/shared/utils/logger.js";

export interface ErrorEntry {
  id: string;
  message: string;
  stack?: string;
  type: string;
  severity: "low" | "medium" | "high" | "critical";
  category:
    | "validation"
    | "database"
    | "network"
    | "authentication"
    | "authorization"
    | "business"
    | "system"
    | "unknown";
  context?: Record<string, unknown>;
  userId?: string;
  sessionId?: string;
  requestId?: string;
  userAgent?: string;
  ipAddress?: string;
  url?: string;
  method?: string;
  timestamp: number;
  resolved: boolean;
  resolvedAt?: number;
  resolvedBy?: string;
  occurrences: number;
  firstOccurrence: number;
  lastOccurrence: number;
}

export interface ErrorStats {
  total: number;
  byCategory: Record<string, number>;
  bySeverity: Record<string, number>;
  recent: ErrorEntry[];
  critical: ErrorEntry[];
  unresolved: number;
  trend: {
    last24h: number;
    last7d: number;
    last30d: number;
  };
}

export interface ErrorFilter {
  category?: string;
  severity?: string;
  resolved?: boolean;
  startDate?: number;
  endDate?: number;
  userId?: string;
  limit?: number;
  offset?: number;
}

export class ErrorTrackingService {
  private errors: Map<string, ErrorEntry> = new Map();
  private maxErrors = 10000;
  private alertThreshold = 10; // Alert if same error occurs 10+ times in 1 hour

  /**
   * Record an error
   */
  recordError(
    error: Error | unknown,
    context?: {
      severity?: ErrorEntry["severity"];
      category?: ErrorEntry["category"];
      userId?: string;
      sessionId?: string;
      requestId?: string;
      userAgent?: string;
      ipAddress?: string;
      url?: string;
      method?: string;
      metadata?: Record<string, unknown>;
    },
  ): string {
    const errorId = this.generateErrorId(error, context);
    const now = Date.now();

    // Get or create error entry
    let entry = this.errors.get(errorId);

    if (entry) {
      // Update existing entry
      entry.occurrences++;
      entry.lastOccurrence = now;
      entry.context = { ...entry.context, ...context?.metadata };
    } else {
      // Create new entry
      const errorMessage =
        error instanceof Error ? error.message : String(error);
      const errorStack = error instanceof Error ? error.stack : undefined;
      const errorType =
        error instanceof Error ? error.constructor.name : typeof error;

      entry = {
        id: errorId,
        message: errorMessage,
        stack: errorStack,
        type: errorType,
        severity: context?.severity || this.determineSeverity(error, context),
        category: context?.category || this.determineCategory(error, context),
        context: context?.metadata || {},
        userId: context?.userId,
        sessionId: context?.sessionId,
        requestId: context?.requestId,
        userAgent: context?.userAgent,
        ipAddress: context?.ipAddress,
        url: context?.url,
        method: context?.method,
        timestamp: now,
        resolved: false,
        occurrences: 1,
        firstOccurrence: now,
        lastOccurrence: now,
      };

      this.errors.set(errorId, entry);

      // Cleanup if too many errors
      if (this.errors.size > this.maxErrors) {
        this.cleanupOldErrors();
      }
    }

    // Log error
    logger.error("Error tracked", {
      errorId: entry.id,
      message: entry.message,
      severity: entry.severity,
      category: entry.category,
      occurrences: entry.occurrences,
    });

    // Check for alerts
    this.checkAlerts(entry);

    return errorId;
  }

  /**
   * Generate unique error ID based on error message and context
   */
  private generateErrorId(
    error: Error | unknown,
    context?: Record<string, unknown>,
  ): string {
    const message = error instanceof Error ? error.message : String(error);
    const type = error instanceof Error ? error.constructor.name : typeof error;
    const category = context?.category || "unknown";

    // Create a hash-like ID from error characteristics
    const key = `${type}:${category}:${message.substring(0, 100)}`;
    return Buffer.from(key).toString("base64").substring(0, 32);
  }

  /**
   * Determine error severity
   */
  private determineSeverity(
    error: Error | unknown,
    context?: Record<string, unknown>,
  ): ErrorEntry["severity"] {
    if (context?.severity) {
      return context.severity as ErrorEntry["severity"];
    }

    const message = error instanceof Error ? error.message : String(error);

    // Critical errors
    if (
      message.includes("database") ||
      message.includes("connection") ||
      message.includes("timeout") ||
      message.includes("memory")
    ) {
      return "critical";
    }

    // High severity
    if (
      message.includes("authentication") ||
      message.includes("authorization") ||
      message.includes("security")
    ) {
      return "high";
    }

    // Medium severity
    if (
      message.includes("validation") ||
      message.includes("invalid") ||
      message.includes("missing")
    ) {
      return "medium";
    }

    return "low";
  }

  /**
   * Determine error category
   */
  private determineCategory(
    error: Error | unknown,
    context?: Record<string, unknown>,
  ): ErrorEntry["category"] {
    if (context?.category) {
      return context.category as ErrorEntry["category"];
    }

    const message = error instanceof Error ? error.message : String(error);
    const type = error instanceof Error ? error.constructor.name : typeof error;

    if (
      message.includes("database") ||
      message.includes("query") ||
      message.includes("SQL")
    ) {
      return "database";
    }

    if (
      message.includes("network") ||
      message.includes("fetch") ||
      message.includes("request")
    ) {
      return "network";
    }

    if (
      message.includes("auth") ||
      message.includes("login") ||
      message.includes("token")
    ) {
      return "authentication";
    }

    if (
      message.includes("permission") ||
      message.includes("access") ||
      message.includes("forbidden")
    ) {
      return "authorization";
    }

    if (
      message.includes("validation") ||
      message.includes("invalid") ||
      message.includes("required")
    ) {
      return "validation";
    }

    if (type.includes("Business") || type.includes("Domain")) {
      return "business";
    }

    if (type.includes("System") || message.includes("system")) {
      return "system";
    }

    return "unknown";
  }

  /**
   * Get error by ID
   */
  getError(errorId: string): ErrorEntry | null {
    return this.errors.get(errorId) || null;
  }

  /**
   * Get errors with filters
   */
  getErrors(filter?: ErrorFilter): ErrorEntry[] {
    let results = Array.from(this.errors.values());

    // Apply filters
    if (filter?.category) {
      results = results.filter((e) => e.category === filter.category);
    }

    if (filter?.severity) {
      results = results.filter((e) => e.severity === filter.severity);
    }

    if (filter?.resolved !== undefined) {
      results = results.filter((e) => e.resolved === filter.resolved);
    }

    if (filter?.startDate) {
      results = results.filter((e) => e.timestamp >= filter.startDate!);
    }

    if (filter?.endDate) {
      results = results.filter((e) => e.timestamp <= filter.endDate!);
    }

    if (filter?.userId) {
      results = results.filter((e) => e.userId === filter.userId);
    }

    // Sort by last occurrence (most recent first)
    results.sort((a, b) => b.lastOccurrence - a.lastOccurrence);

    // Apply pagination
    const offset = filter?.offset || 0;
    const limit = filter?.limit || 100;

    return results.slice(offset, offset + limit);
  }

  /**
   * Get error statistics
   */
  getErrorStats(): ErrorStats {
    const errors = Array.from(this.errors.values());
    const now = Date.now();
    const last24h = now - 24 * 60 * 60 * 1000;
    const last7d = now - 7 * 24 * 60 * 60 * 1000;
    const last30d = now - 30 * 24 * 60 * 60 * 1000;

    const byCategory: Record<string, number> = {};
    const bySeverity: Record<string, number> = {};

    errors.forEach((error) => {
      byCategory[error.category] =
        (byCategory[error.category] || 0) + error.occurrences;
      bySeverity[error.severity] =
        (bySeverity[error.severity] || 0) + error.occurrences;
    });

    const recent = errors
      .filter((e) => e.lastOccurrence >= last24h)
      .sort((a, b) => b.lastOccurrence - a.lastOccurrence)
      .slice(0, 10);

    const critical = errors
      .filter((e) => e.severity === "critical" && !e.resolved)
      .sort((a, b) => b.lastOccurrence - a.lastOccurrence)
      .slice(0, 10);

    const unresolved = errors.filter((e) => !e.resolved).length;

    return {
      total: errors.reduce((sum, e) => sum + e.occurrences, 0),
      byCategory,
      bySeverity,
      recent,
      critical,
      unresolved,
      trend: {
        last24h: errors.filter((e) => e.lastOccurrence >= last24h).length,
        last7d: errors.filter((e) => e.lastOccurrence >= last7d).length,
        last30d: errors.filter((e) => e.lastOccurrence >= last30d).length,
      },
    };
  }

  /**
   * Mark error as resolved
   */
  resolveError(errorId: string, resolvedBy?: string): boolean {
    const entry = this.errors.get(errorId);
    if (!entry) {
      return false;
    }

    entry.resolved = true;
    entry.resolvedAt = Date.now();
    entry.resolvedBy = resolvedBy;

    logger.info("Error resolved", { errorId, resolvedBy });

    return true;
  }

  /**
   * Check for alerts
   */
  private checkAlerts(entry: ErrorEntry): void {
    const oneHourAgo = Date.now() - 60 * 60 * 1000;

    // Check if error occurred frequently in last hour
    if (
      entry.occurrences >= this.alertThreshold &&
      entry.lastOccurrence >= oneHourAgo
    ) {
      logger.warn("Error alert triggered", {
        errorId: entry.id,
        message: entry.message,
        occurrences: entry.occurrences,
        severity: entry.severity,
      });

      // TODO: Send alert notification (email, Slack, etc.)
    }
  }

  /**
   * Cleanup old errors
   */
  private cleanupOldErrors(): void {
    const thirtyDaysAgo = Date.now() - 30 * 24 * 60 * 60 * 1000;
    let cleaned = 0;

    for (const [id, entry] of this.errors) {
      if (entry.lastOccurrence < thirtyDaysAgo && entry.resolved) {
        this.errors.delete(id);
        cleaned++;
      }
    }

    // If still too many, remove oldest resolved errors
    if (this.errors.size > this.maxErrors) {
      const sorted = Array.from(this.errors.entries()).sort(
        (a, b) => a[1].lastOccurrence - b[1].lastOccurrence,
      );

      for (
        let i = 0;
        i < sorted.length && this.errors.size > this.maxErrors;
        i++
      ) {
        if (sorted[i][1].resolved) {
          this.errors.delete(sorted[i][0]);
          cleaned++;
        }
      }
    }

    if (cleaned > 0) {
      logger.info("Cleaned up old errors", { count: cleaned });
    }
  }

  /**
   * Clear all errors (for testing)
   */
  clearAll(): void {
    this.errors.clear();
    logger.info("All errors cleared");
  }
}

export const errorTrackingService = new ErrorTrackingService();
