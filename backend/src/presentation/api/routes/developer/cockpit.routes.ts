/**
 * Cockpit Routes - مسارات قمرة القيادة
 * 
 * الوصف: تعريف نقاط النهاية البثيةSSE والحالة لمنصة المطور.
 * السلطة الدستورية: القانون 01 والقانون 11.
 */

import { Router, Request, Response } from "express";
import { devWhitelistMiddleware } from "../../middleware/security/DevWhitelistMiddleware.js";
import { logStreamer } from "../../../../shared/utils/LogStreamer.js";
import { logger } from "../../../../shared/utils/logger.js";

const router = Router();

// تطبيق وسيط حماية IP على كافة المسارات هنا
router.use(devWhitelistMiddleware);

/**
 * GET /api/v1/developer/cockpit/logs (SSE)
 * بث السجلات في الوقت الفعلي
 */
router.get("/logs", (req: Request, res: Response) => {
    // إعداد رؤوس SSE
    res.setHeader("Content-Type", "text/event-stream");
    res.setHeader("Cache-Control", "no-cache");
    res.setHeader("Connection", "keep-alive");
    res.flushHeaders(); // إرسال الرؤوس فوراً

    logger.info(`🛰️ New Log Stream subscriber from IP: ${req.ip}`);

    // الاشتراك في البث
    const unsubscribe = logStreamer.subscribe((log) => {
        res.write(`data: ${JSON.stringify(log)}\n\n`);
    });

    // التعاطي مع إغلاق الاتصال
    req.on("close", () => {
        logger.info(`🔌 Log Stream subscriber disconnected: ${req.ip}`);
        unsubscribe();
        res.end();
    });
});

/**
 * GET /api/v1/developer/cockpit/health
 * جلب بيانات الحالة (Prometheus / JSON)
 */
router.get("/health", async (_req: Request, res: Response) => {
    // سيتم توسيع هذا لاحقاً لجلب بيانات Prometheus
    res.json({
        success: true,
        timestamp: new Date().toISOString(),
        metrics: {
            uptime: process.uptime(),
            memory: process.memoryUsage(),
            cpu: process.cpuUsage()
        }
    });
});

export default router;
