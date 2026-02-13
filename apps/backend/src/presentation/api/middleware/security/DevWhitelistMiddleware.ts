/**
 * Dev Whitelist Middleware - وسيط حماية المطورين
 *
 * الوصف: يقوم بالتحقق من عنوان الـ IP للطلب ومقارنته بالقائمة البيضاء للمطورين.
 * يتم استخدام هذا الوسيط كبديل لتسجيل الدخول لمنصة Cockpit.
 *
 * السلطة الدستورية: القانون 01 (الجدار الناري الحديدي).
 */

import { Request, Response, NextFunction } from "express";
import { logger } from "../../../../shared/utils/logger.js";
import { ENV_CONFIG } from "../../../../infrastructure/config/env.config.js";

/**
 * وسيط التحقق من القائمة البيضاء
 */
export const devWhitelistMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction,
): void => {
  // جلب الآي بي الفعلي (مع مراعاة البروكسي)
  const clientIp =
    (req.headers["x-forwarded-for"] as string) ||
    req.socket.remoteAddress ||
    "";

  // تنظيف الآي بي (إزالة IPv6 prefix إذا وجد)
  const cleanIp = clientIp.replace(/^::ffff:/, "");

  // جلب القائمة البيضاء من الإعدادات
  const whitelist = ENV_CONFIG.DEV_WHITELIST || ["127.0.0.1", "::1"];

  logger.debug(`🛡️ Dev Whitelist Check: ${cleanIp}`, {
    ip: cleanIp,
    isWhitelisted: whitelist.includes(cleanIp),
  });

  if (whitelist.includes(cleanIp)) {
    return next();
  }

  logger.warn(`🚫 Forbidden access to Dev Cockpit from IP: ${cleanIp}`);

  res.status(403).json({
    success: false,
    error: "Forbidden: Your IP is not in the development whitelist.",
    timestamp: new Date().toISOString(),
  });
};
