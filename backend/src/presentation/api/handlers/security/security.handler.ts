/**
 * Security Handler - معالج الأمان
 *
 * Request handlers لعمليات الأمان والغربلة والتحذيرات
 */

import { Request, Response } from "express";
import { SecurityService } from "@/modules/security/index.js";
import { BaseHandler } from "@/presentation/api/handlers/base/BaseHandler.js";
import {
  CreateRouteProtectionRuleRequest as CreateRouteProtectionRuleDTO,
  UpdateRouteProtectionRuleRequest as UpdateRouteProtectionRuleDTO,
  UpdateSecuritySettingsRequest as SecuritySettingsDTO,
} from "@/presentation/api/dto/security/security.dto.js";
import {
  SecurityEventFilter,
  SecurityEventType,
  SecurityEventSeverity,
} from "@/domain/types/security.types.js";

export class SecurityHandler extends BaseHandler {
  /**
   * إنشاء Security Handler
   *
   * @param securityService - خدمة الأمان
   */
  constructor(private readonly securityService: SecurityService) {
    super();
  }

  /**
   * معالج جلب سجلات الأمان
   *
   * GET /api/v1/security/logs
   */
  getSecurityLogs = async (req: Request, res: Response): Promise<void> => {
    await this.execute(
      res,
      async () => {
        const filters: SecurityEventFilter = {
          userId: req.query.userId as string,
          eventType: req.query.type as unknown as SecurityEventType,
          severity: req.query.severity as unknown as SecurityEventSeverity,
          startDate: undefined,
          endDate: undefined,
        };
        const logs = await this.securityService.getSecurityLogs(filters);
        this.ok(res, logs);
      },
      "فشل جلب سجلات الأمان",
    );
  };

  /**
   * معالج تصدير سجلات الأمان
   *
   * GET /api/v1/security/logs/export
   */
  exportSecurityLogs = async (req: Request, res: Response): Promise<void> => {
    await this.execute(
      res,
      async () => {
        const format = (req.query.format as string) || "json";
        const filters = {
          userId: req.query.userId as string,
          eventType: req.query.type as unknown as SecurityEventType,
          severity: req.query.severity as unknown as SecurityEventSeverity,
          startDate: req.query.startDate
            ? new Date(req.query.startDate as string)
            : undefined,
          endDate: req.query.endDate
            ? new Date(req.query.endDate as string)
            : undefined,
        };

        const logs = await this.securityService.getSecurityLogs(filters);

        if (format === "csv") {
          res.setHeader("Content-Type", "text/csv");
          res.setHeader(
            "Content-Disposition",
            "attachment; filename=security-logs.csv",
          );
          // Simplified CSV conversion
          const csv = logs
            .map(
              (l: any) =>
                `${l.id},${l.eventType},${l.severity},${l.userId},${l.createdAt}`,
            )
            .join("\n");
          res.send(csv);
          return;
        }

        this.ok(res, logs);
      },
      "فشل تصدير سجلات الأمان",
    );
  };

  /**
   * معالج جلب إعدادات الأمان
   *
   * GET /api/v1/security/settings
   */
  getSecuritySettings = async (_req: Request, res: Response): Promise<void> => {
    await this.execute(
      res,
      async () => {
        const settings = await this.securityService.getSecuritySettings();
        this.ok(res, settings);
      },
      "فشل جلب إعدادات الأمان",
    );
  };

  /**
   * معالج تحديث إعدادات الأمان
   *
   * PUT /api/v1/security/settings
   */
  updateSecuritySettings = async (
    req: Request,
    res: Response,
  ): Promise<void> => {
    await this.execute(
      res,
      async () => {
        const settings = req.body as SecuritySettingsDTO;
        const updaterId = req.user?.id;
        const updatedSettings =
          await this.securityService.updateSecuritySettings(
            settings,
            updaterId,
          );
        this.ok(res, updatedSettings);
      },
      "فشل تحديث إعدادات الأمان",
    );
  };

  /**
   * معالج جلب قواعد حماية الروابط
   *
   * GET /api/v1/security/protection/rules
   */
  getRouteProtectionRules = async (
    _req: Request,
    res: Response,
  ): Promise<void> => {
    await this.execute(
      res,
      async () => {
        const rules = await this.securityService.getRouteProtectionRules();
        this.ok(res, rules);
      },
      "فشل جلب قواعد حماية الروابط",
    );
  };

  /**
   * معالج إنشاء قاعدة حماية رابط
   *
   * POST /api/v1/security/protection/rules
   */
  createRouteProtectionRule = async (
    req: Request,
    res: Response,
  ): Promise<void> => {
    await this.execute(
      res,
      async () => {
        const ruleData = req.body as CreateRouteProtectionRuleDTO;
        const rule =
          await this.securityService.createRouteProtectionRule(ruleData);
        this.created(res, rule);
      },
      "فشل إنشاء قاعدة حماية الرابط",
    );
  };

  /**
   * معالج تحديث قاعدة حماية رابط
   *
   * PUT /api/v1/security/protection/rules/:id
   */
  updateRouteProtectionRule = async (
    req: Request,
    res: Response,
  ): Promise<void> => {
    await this.execute(
      res,
      async () => {
        const { id } = req.params;
        const ruleData = req.body as UpdateRouteProtectionRuleDTO;
        const updaterId = req.user?.id;

        const rule = await this.securityService.updateRouteProtectionRule(
          id,
          ruleData,
          updaterId,
        );
        this.ok(res, rule);
      },
      "فشل تحديث قاعدة حماية الرابط",
    );
  };

  /**
   * معالج حذف قاعدة حماية رابط
   *
   * DELETE /api/v1/security/protection/rules/:id
   */
  deleteRouteProtectionRule = async (
    req: Request,
    res: Response,
  ): Promise<void> => {
    await this.execute(
      res,
      async () => {
        const { id } = req.params;
        await this.securityService.deleteRouteProtectionRule(id);
        this.ok(res, { message: "تم حذف قاعدة الحماية بنجاح" });
      },
      "فشل حذف قاعدة حماية الرابط",
    );
  };

  /**
   * معالج جلب تحذيرات الأمان
   *
   * GET /api/v1/security/alerts
   */
  getSecurityAlerts = async (req: Request, res: Response): Promise<void> => {
    await this.execute(
      res,
      async () => {
        const activeOnly = req.query.activeOnly === "true";
        const alerts = await this.securityService.getSecurityAlerts({
          isRead: !activeOnly,
        });
        this.ok(res, alerts);
      },
      "فشل جلب تحذيرات الأمان",
    );
  };

  /**
   * معالج تحديد التحذير كمقروء
   *
   * POST /api/v1/security/alerts/:id/read
   */
  markAlertAsRead = async (req: Request, res: Response): Promise<void> => {
    await this.execute(
      res,
      async () => {
        const { id } = req.params;
        await this.securityService.markAlertAsRead(id);
        this.ok(res, { message: "تم تحديد التحذير كمقروء" });
      },
      "فشل تحديث حالة التحذير",
    );
  };

  /**
   * معالج تحديد جميع التحذيرات كمقروءة
   *
   * POST /api/v1/security/alerts/read-all
   */
  markAllAlertsAsRead = async (req: Request, res: Response): Promise<void> => {
    await this.execute(
      res,
      async () => {
        const userId = req.user?.id;
        await this.securityService.markAllAlertsAsRead(userId);
        this.ok(res, { message: "تم تحديد جميع التحذيرات كمقروءة" });
      },
      "فشل تحديث حالة التحذيرات",
    );
  };

  /**
   * معالج جلب إحصائيات الأمان
   * GET /api/v1/security/stats
   */
  getSecurityStats = async (_req: Request, res: Response): Promise<void> => {
    await this.execute(
      res,
      async () => {
        const stats = {
          totalEvents: 0,
          threatsBlocked: 0,
          activeAlerts: 0,
        };
        this.ok(res, stats);
      },
      "فشل جلب إحصائيات الأمان",
    );
  };
}
