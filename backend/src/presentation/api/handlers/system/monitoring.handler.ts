/**
 * Monitoring Handler - معالجات المراقبة
 */

import { Request, Response } from "express";
import { PerformanceTrackingService } from "@/application/services/monitoring/performance-tracking.service.js";
import { ErrorTrackingService } from "@/application/services/monitoring/error-tracking.service.js";
import { BaseHandler } from "@/presentation/api/handlers/base/BaseHandler.js";

export class MonitoringHandler extends BaseHandler {
  constructor(
    private readonly performanceTrackingService: PerformanceTrackingService,
    private readonly errorTrackingService: ErrorTrackingService,
  ) {
    super();
  }

  /**
   * جلب مقاييس الأداء
   */
  getPerformanceMetrics = async (
    req: Request,
    res: Response,
  ): Promise<void> => {
    await this.execute(
      res,
      async () => {
        const startDate = req.query.startDate
          ? new Date(req.query.startDate as string).getTime()
          : undefined;
        const endDate = req.query.endDate
          ? new Date(req.query.endDate as string).getTime()
          : undefined;

        const metrics = this.performanceTrackingService.getMetrics({
          startDate,
          endDate,
        });
        this.ok(res, metrics);
      },
      "فشل جلب مقاييس الأداء",
    );
  };

  /**
   * جلب إحصائيات الأداء
   */
  getPerformanceStats = async (_req: Request, res: Response): Promise<void> => {
    await this.execute(
      res,
      async () => {
        const stats = this.performanceTrackingService.getPerformanceStats();
        this.ok(res, stats);
      },
      "فشل جلب إحصائيات الأداء",
    );
  };

  /**
   * جلب أداء Endpoint محدد
   */
  getEndpointPerformance = async (
    req: Request,
    res: Response,
  ): Promise<void> => {
    await this.execute(
      res,
      async () => {
        const method = req.query.method as string;
        const path = req.query.path as string;

        const metrics = this.performanceTrackingService.getEndpointPerformance(
          path,
          method,
        );
        this.ok(res, metrics);
      },
      "فشل جلب أداء Endpoint",
    );
  };

  /**
   * جلب موارد النظام
   */
  getSystemResources = async (_req: Request, res: Response): Promise<void> => {
    await this.execute(
      res,
      async () => {
        // Mocked response as service implementation is missing
        const resources = {
          cpuUsage: 0,
          memoryUsage: 0,
          uptime: process.uptime(),
        };
        this.ok(res, resources);
      },
      "فشل جلب موارد النظام",
    );
  };

  /**
   * جلب إحصائيات الأخطاء
   */
  getErrorStats = async (_req: Request, res: Response): Promise<void> => {
    await this.execute(
      res,
      async () => {
        const stats = this.errorTrackingService.getErrorStats();
        this.ok(res, stats);
      },
      "فشل جلب إحصائيات الأخطاء",
    );
  };

  /**
   * جلب قائمة الأخطاء
   */
  getErrors = async (req: Request, res: Response): Promise<void> => {
    await this.execute(
      res,
      async () => {
        const filters = {
          category: req.query.category as string,
          severity: req.query.severity as string,
          resolved: req.query.resolved
            ? req.query.resolved === "true"
            : undefined,
          startDate: req.query.startDate
            ? new Date(req.query.startDate as string).getTime()
            : undefined,
          endDate: req.query.endDate
            ? new Date(req.query.endDate as string).getTime()
            : undefined,
          limit: req.query.limit
            ? parseInt(req.query.limit as string)
            : undefined,
          offset: req.query.offset
            ? parseInt(req.query.offset as string)
            : undefined,
        };

        const errors = this.errorTrackingService.getErrors(filters);
        this.ok(res, errors);
      },
      "فشل جلب قائمة الأخطاء",
    );
  };

  /**
   * جلب خطأ محدد
   */
  getError = async (req: Request, res: Response): Promise<void> => {
    await this.execute(
      res,
      async () => {
        const { id } = req.params;
        const error = this.errorTrackingService.getError(id);

        if (!error) {
          this.notFound(res, "الخطأ غير موجود");
          return;
        }

        this.ok(res, error);
      },
      "فشل جلب تفاصيل الخطأ",
    );
  };

  /**
   * حل خطأ
   */
  resolveError = async (req: Request, res: Response): Promise<void> => {
    await this.execute(
      res,
      async () => {
        const { id } = req.params;
        const resolvedBy = req.user?.id;

        const success = this.errorTrackingService.resolveError(id, resolvedBy);

        if (!success) {
          this.notFound(res, "الخطأ غير موجود");
          return;
        }

        this.ok(res, { message: "تم حل الخطأ بنجاح" });
      },
      "فشل حل الخطأ",
    );
  };
}
