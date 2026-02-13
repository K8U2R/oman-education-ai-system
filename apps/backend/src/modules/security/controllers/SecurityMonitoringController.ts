import { Request, Response } from "express";
import { BaseController } from "@/shared/core/BaseController.js";
import { SecurityMonitoringService } from "../services/SecurityMonitoringService.js";

export class SecurityMonitoringController extends BaseController {
  private service: SecurityMonitoringService;

  constructor() {
    super();
    this.service = new SecurityMonitoringService();
  }

  protected getControllerName(): string {
    return "SecurityMonitoringController";
  }

  public getSystemHealth = async (
    _req: Request,
    res: Response,
  ): Promise<void> => {
    try {
      const result = await this.service.getSystemHealthStatus();
      this.ok(res, result);
    } catch (err) {
      this.fail(res, (err as Error).message);
    }
  };

  public getRealtimeMetrics = async (
    _req: Request,
    res: Response,
  ): Promise<void> => {
    try {
      const result = await this.service.getRealtimeMetrics();
      this.ok(res, result);
    } catch (err) {
      this.fail(res, (err as Error).message);
    }
  };

  public getAlertThresholds = async (
    _req: Request,
    res: Response,
  ): Promise<void> => {
    try {
      const result = await this.service.getAlertThresholds();
      this.ok(res, result);
    } catch (err) {
      this.fail(res, (err as Error).message);
    }
  };

  public getMonitoringConfig = async (
    _req: Request,
    res: Response,
  ): Promise<void> => {
    try {
      // Basic config return since update logic exists in service
      const result = await this.service.updateMonitoringConfig({});
      this.ok(res, result);
    } catch (err) {
      this.fail(res, (err as Error).message);
    }
  };

  public updateMonitoringConfig = async (
    req: Request,
    res: Response,
  ): Promise<void> => {
    try {
      const result = await this.service.updateMonitoringConfig(req.body);
      this.ok(res, result);
    } catch (err) {
      this.fail(res, (err as Error).message);
    }
  };
}
