/**
 * Security Analytics Handler - معالج تحليلات الأمان
 */

import { Request, Response } from "express";
import { z } from "zod";
import { SecurityAnalyticsService } from "@/application/services/security/SecurityAnalyticsService.js";
import { BaseHandler } from "@/presentation/api/handlers/base/BaseHandler.js";
import { SecurityAnalyticsFilter } from "@/domain/types/security.types.js";

// Validation Schemas
const GetAnalyticsReportRequestSchema = z.object({
  period: z.enum(["1h", "24h", "7d", "30d", "90d", "custom"]).optional(),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  userId: z.string().optional(),
});

export class SecurityAnalyticsHandler extends BaseHandler {
  constructor(
    private readonly securityAnalyticsService: SecurityAnalyticsService,
  ) {
    super();
  }

  private parseFilter(query: unknown): SecurityAnalyticsFilter {
    const validatedData = GetAnalyticsReportRequestSchema.parse(query);
    return {
      period: validatedData.period,
      startDate: validatedData.startDate
        ? new Date(validatedData.startDate)
        : undefined,
      endDate: validatedData.endDate
        ? new Date(validatedData.endDate)
        : undefined,
      userId: validatedData.userId,
    };
  }

  /**
   * جلب تقرير تحليلات الأمان
   */
  getAnalyticsReport = async (req: Request, res: Response): Promise<void> => {
    await this.execute(
      res,
      async () => {
        const filter = this.parseFilter(req.query);
        const report =
          await this.securityAnalyticsService.getAnalyticsReport(filter);
        this.ok(res, report);
      },
      "فشل جلب تقرير تحليلات الأمان",
    );
  };

  /**
   * جلب محاولات تسجيل الدخول عبر الوقت
   */
  getLoginAttemptsOverTime = async (
    req: Request,
    res: Response,
  ): Promise<void> => {
    await this.execute(
      res,
      async () => {
        const filter = this.parseFilter(req.query);
        const data =
          await this.securityAnalyticsService.getLoginAttemptsOverTime(filter);
        this.ok(res, data);
      },
      "فشل جلب محاولات تسجيل الدخول",
    );
  };

  /**
   * جلب اتجاه نشاط المستخدم
   */
  getUserActivityTrend = async (req: Request, res: Response): Promise<void> => {
    await this.execute(
      res,
      async () => {
        const filter = this.parseFilter(req.query);
        const data =
          await this.securityAnalyticsService.getUserActivityTrend(filter);
        this.ok(res, data);
      },
      "فشل جلب اتجاه نشاط المستخدم",
    );
  };

  /**
   * جلب التوزيع الجغرافي لتسجيلات الدخول
   */
  getGeographicDistribution = async (
    req: Request,
    res: Response,
  ): Promise<void> => {
    await this.execute(
      res,
      async () => {
        const filter = this.parseFilter(req.query);
        const data =
          await this.securityAnalyticsService.getGeographicLoginDistribution(
            filter,
          );
        this.ok(res, data);
      },
      "فشل جلب التوزيع الجغرافي",
    );
  };

  /**
   * جلب أعلى محاولات تسجيل دخول فاشلة
   */
  getTopFailedLogins = async (req: Request, res: Response): Promise<void> => {
    await this.execute(
      res,
      async () => {
        const filter = this.parseFilter(req.query);
        const data =
          await this.securityAnalyticsService.getTopFailedLogins(filter);
        this.ok(res, data);
      },
      "فشل جلب محاولات تسجيل الدخول الفاشلة",
    );
  };

  /**
   * جلب ملخص الأحداث الأمنية
   */
  getSecurityEventSummary = async (
    req: Request,
    res: Response,
  ): Promise<void> => {
    await this.execute(
      res,
      async () => {
        const filter = this.parseFilter(req.query);
        const data =
          await this.securityAnalyticsService.getSecurityEventSummary(filter);
        this.ok(res, data);
      },
      "فشل جلب ملخص الأحداث",
    );
  };

  /**
   * جلب توزيع الجلسات
   */
  getSessionDistribution = async (
    req: Request,
    res: Response,
  ): Promise<void> => {
    await this.execute(
      res,
      async () => {
        const filter = this.parseFilter(req.query);
        const data =
          await this.securityAnalyticsService.getSessionDistribution(filter);
        this.ok(res, data);
      },
      "فشل جلب توزيع الجلسات",
    );
  };

  /**
   * جلب درجات مخاطر المستخدمين
   */
  getUserRiskScores = async (req: Request, res: Response): Promise<void> => {
    await this.execute(
      res,
      async () => {
        const filter = this.parseFilter(req.query);
        const scores =
          await this.securityAnalyticsService.getUserRiskScores(filter);
        this.ok(res, scores);
      },
      "فشل جلب درجات مخاطر المستخدمين",
    );
  };

  /**
   * جلب مقاييس الأمان
   */
  getSecurityMetrics = async (req: Request, res: Response): Promise<void> => {
    await this.execute(
      res,
      async () => {
        const filter = this.parseFilter(req.query);
        const metrics =
          await this.securityAnalyticsService.getSecurityMetrics(filter);
        this.ok(res, metrics);
      },
      "فشل جلب مقاييس الأمان",
    );
  };
}
