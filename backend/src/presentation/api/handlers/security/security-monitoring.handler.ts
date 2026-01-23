/**
 * Security Monitoring Handler - معالج مراقبة الأمان
 */

import { Request, Response } from "express";
import { z } from "zod";
import { SecurityMonitoringService } from "@/application/services/security/SecurityMonitoringService.js";
import { BaseHandler } from "@/presentation/api/handlers/base/BaseHandler.js";

// Validation Schemas
const UpdateMonitoringConfigRequestSchema = z.object({
  refreshInterval: z.number().optional(),
  autoRefresh: z.boolean().optional(),
  darkMode: z.boolean().optional(),
  metricsToShow: z.array(z.string()).optional(),
  chartsToShow: z.array(z.string()).optional(),
  alertsToShow: z.array(z.string()).optional(),
});

export class SecurityMonitoringHandler extends BaseHandler {
  constructor(
    private readonly securityMonitoringService: SecurityMonitoringService,
  ) {
    super();
  }

  /**
   * جلب معلومات صحة النظام
   */
  getSystemHealthStatus = async (
    _req: Request,
    res: Response,
  ): Promise<void> => {
    await this.execute(
      res,
      async () => {
        const health =
          await this.securityMonitoringService.getSystemHealthStatus();
        this.ok(res, health);
      },
      "فشل جلب معلومات صحة النظام",
    );
  };

  /**
   * جلب مقاييس الأمان في الوقت الفعلي
   */
  getRealtimeMetrics = async (_req: Request, res: Response): Promise<void> => {
    await this.execute(
      res,
      async () => {
        const metrics =
          await this.securityMonitoringService.getRealtimeMetrics();
        this.ok(res, metrics);
      },
      "فشل جلب مقاييس الأمان",
    );
  };

  /**
   * جلب إعدادات لوحة المراقبة
   */
  getAlertThresholds = async (_req: Request, res: Response): Promise<void> => {
    await this.execute(
      res,
      async () => {
        const thresholds =
          await this.securityMonitoringService.getAlertThresholds();
        this.ok(res, thresholds);
      },
      "فشل جلب إعدادات التنبيهات",
    );
  };

  /**
   * تحديث إعدادات لوحة المراقبة
   */
  updateMonitoringConfig = async (
    req: Request,
    res: Response,
  ): Promise<void> => {
    await this.execute(
      res,
      async () => {
        const validatedData = UpdateMonitoringConfigRequestSchema.parse(
          req.body,
        );
        const config =
          await this.securityMonitoringService.updateMonitoringConfig(
            validatedData,
          );
        this.ok(res, config);
      },
      "فشل تحديث إعدادات لوحة المراقبة",
    );
  };
}
