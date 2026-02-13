import { BaseService } from "@/application/services/system/base/BaseService.js";
import {
  SecurityAnalyticsFilter,
  SecurityMetric,
} from "@/domain/types/security.types.js";

export class SecurityAnalyticsService extends BaseService {
  protected getServiceName(): string {
    return "SecurityAnalyticsService";
  }

  async getAnalyticsReport(
    _filter: SecurityAnalyticsFilter,
  ): Promise<{ summary: string; metrics: SecurityMetric[] }> {
    return { summary: "Stub Report", metrics: [] };
  }

  async getLoginAttemptsOverTime(
    _filter: SecurityAnalyticsFilter,
  ): Promise<{ date: string; count: number }[]> {
    return [];
  }

  async getUserActivityTrend(
    _filter: SecurityAnalyticsFilter,
  ): Promise<{ date: string; activeUsers: number }[]> {
    return [];
  }

  async getGeographicLoginDistribution(
    _filter: SecurityAnalyticsFilter,
  ): Promise<{ country: string; count: number }[]> {
    return [];
  }

  async getTopFailedLogins(
    _filter: SecurityAnalyticsFilter,
  ): Promise<{ userId: string; count: number }[]> {
    return [];
  }

  async getSecurityEventSummary(
    _filter: SecurityAnalyticsFilter,
  ): Promise<{ type: string; count: number }[]> {
    return [];
  }

  async getSessionDistribution(
    _filter: SecurityAnalyticsFilter,
  ): Promise<{ active: number; idle: number }> {
    return { active: 0, idle: 0 };
  }

  async getUserRiskScores(
    _filter: SecurityAnalyticsFilter,
  ): Promise<{ userId: string; score: number }[]> {
    return [];
  }

  async getSecurityMetrics(
    _filter: SecurityAnalyticsFilter,
  ): Promise<{ name: string; value: number }[]> {
    return [];
  }

  async getSecurityStats(): Promise<{ totalIncidents: number }> {
    return { totalIncidents: 0 };
  }
}
