/**
 * Developer Controller - متحكم المطور
 */

import { Request, Response } from "express";
import { BaseHandler } from "@/presentation/api/handlers/base/BaseHandler.js";
import { DeveloperService } from "@/modules/user/services/DeveloperService.js";

export class DeveloperController extends BaseHandler {
  constructor(private readonly developerService: DeveloperService) {
    super();
  }

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

  getAPIEndpoints = async (_req: Request, res: Response): Promise<void> => {
    await this.execute(
      res,
      async () => {
        const endpoints = await this.developerService.getAPIEndpoints();
        this.ok(res, endpoints);
      },
      "فشل جلب نقاط النهاية",
    );
  };

  getServices = async (_req: Request, res: Response): Promise<void> => {
    await this.execute(
      res,
      async () => {
        const services = await this.developerService.getServices();
        this.ok(res, services);
      },
      "فشل جلب الخدمات",
    );
  };

  getPerformanceMetrics = async (
    _req: Request,
    res: Response,
  ): Promise<void> => {
    await this.execute(
      res,
      async () => {
        const metrics = await this.developerService.getAPIPerformanceMetrics();
        this.ok(res, metrics);
      },
      "فشل جلب مقاييس الأداء",
    );
  };
}
