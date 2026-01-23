/**
 * Whitelist Routes - مسارات القائمة البيضاء
 *
 * Express routes لجميع endpoints القائمة البيضاء
 */

import { RouteFactory } from "../shared/route-factory.js";
import { WhitelistHandler } from "../../handlers/auth/whitelist.handler.js";
import {
  authMiddleware,
  requireAnyRole,
  requirePermission
} from "../../middleware/security/index.js";

const router = RouteFactory.createFeatureRouter();

/**
 * جميع Routes تتطلب:
 * - المصادقة (authMiddleware)
 * - دور Admin أو Developer (requireAnyRole)
 * - صلاحية whitelist.manage (requirePermission)
 */
const standardMiddleware = [
  authMiddleware.authenticate,
  requireAnyRole(["admin", "developer"]),
  requirePermission("whitelist.manage"),
];

/**
 * GET /api/v1/admin/whitelist
 * الحصول على جميع الإدخالات
 */
router.get(
  "/",
  ...RouteFactory.createRoute<WhitelistHandler>(
    "WhitelistHandler",
    "getAllEntries",
    ...standardMiddleware,
  ),
);

/**
 * GET /api/v1/admin/whitelist/expired
 * الحصول على الإدخالات المنتهية
 */
router.get(
  "/expired",
  ...RouteFactory.createRoute<WhitelistHandler>(
    "WhitelistHandler",
    "getExpiredEntries",
    ...standardMiddleware,
  ),
);

/**
 * GET /api/v1/admin/whitelist/:id
 * الحصول على إدخال بالمعرف
 */
router.get(
  "/:id",
  ...RouteFactory.createRoute<WhitelistHandler>(
    "WhitelistHandler",
    "getEntryById",
    ...standardMiddleware,
  ),
);

/**
 * POST /api/v1/admin/whitelist
 * إنشاء إدخال جديد
 */
router.post(
  "/",
  ...RouteFactory.createRoute<WhitelistHandler>(
    "WhitelistHandler",
    "createEntry",
    ...standardMiddleware,
  ),
);

/**
 * PUT /api/v1/admin/whitelist/:id
 * تحديث إدخال موجود
 */
router.put(
  "/:id",
  ...RouteFactory.createRoute<WhitelistHandler>(
    "WhitelistHandler",
    "updateEntry",
    ...standardMiddleware,
  ),
);

/**
 * DELETE /api/v1/admin/whitelist/:id
 * حذف إدخال
 */
router.delete(
  "/:id",
  ...RouteFactory.createRoute<WhitelistHandler>(
    "WhitelistHandler",
    "deleteEntry",
    ...standardMiddleware,
  ),
);

/**
 * POST /api/v1/admin/whitelist/:id/activate
 * تفعيل إدخال
 */
router.post(
  "/:id/activate",
  ...RouteFactory.createRoute<WhitelistHandler>(
    "WhitelistHandler",
    "activateEntry",
    ...standardMiddleware,
  ),
);

/**
 * POST /api/v1/admin/whitelist/:id/deactivate
 * تعطيل إدخال
 */
router.post(
  "/:id/deactivate",
  ...RouteFactory.createRoute<WhitelistHandler>(
    "WhitelistHandler",
    "deactivateEntry",
    ...standardMiddleware,
  ),
);

export default router;
