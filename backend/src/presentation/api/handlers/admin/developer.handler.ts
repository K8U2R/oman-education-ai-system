/**
 * Developer Handlers - معالجات المطور
 *
 * Request handlers لجميع endpoints المطور
 */

import { Request, Response } from "express";
import { DeveloperService } from "@/application/services/developer/DeveloperService";
import { BaseHandler } from "@/presentation/api/handlers/base/BaseHandler";

export class DeveloperHandler extends BaseHandler {
  /**
   * إنشاء Developer Handler
   *
   * @param developerService - خدمة المطور
   */
  constructor(private readonly developerService: DeveloperService) {
    super();
  }

  /**
   * معالج جلب إحصائيات المطور
   *
   * GET /api/v1/developer/stats
   */
  getDeveloperStats = async (_req: Request, res: Response): Promise<void> => {
    await this.execute(
      res,
      async () => {
        const stats = await this.developerService.getDeveloperStats();
        this.ok(res, stats);
      },
      "فشل جلب إحصائيات المطور",
    );
  };

  /**
   * معالج جلب API Endpoints
   *
   * GET /api/v1/developer/api-endpoints
   */
  getAPIEndpoints = async (_req: Request, res: Response): Promise<void> => {
    await this.execute(
      res,
      async () => {
        const endpoints = await this.developerService.getAPIEndpoints();
        this.ok(res, {
          endpoints,
          count: endpoints.length,
        });
      },
      "فشل جلب API Endpoints",
    );
  };

  /**
   * معالج جلب Services
   *
   * GET /api/v1/developer/services
   */
  getServices = async (_req: Request, res: Response): Promise<void> => {
    await this.execute(
      res,
      async () => {
        const services = await this.developerService.getServices();
        this.ok(res, {
          services,
          count: services.length,
        });
      },
      "فشل جلب Services",
    );
  };

  /**
   * معالج جلب Performance Metrics
   *
   * GET /api/v1/developer/performance
   */
  getPerformanceMetrics = async (
    _req: Request,
    res: Response,
  ): Promise<void> => {
    await this.execute(
      res,
      async () => {
        const metrics = await this.developerService.getAPIPerformanceMetrics();
        this.ok(res, {
          metrics,
          count: metrics.length,
        });
      },
      "فشل جلب Performance Metrics",
    );
  };
}
