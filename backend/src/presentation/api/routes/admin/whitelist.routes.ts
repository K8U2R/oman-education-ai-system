/**
 * Whitelist Routes - مسارات القائمة البيضاء
 *
 * Express routes لجميع endpoints القائمة البيضاء
 */

import { RouteFactory } from "../shared/route-factory.js";
import { WhitelistController } from "@/modules/auth/controllers/whitelist.controller.js";
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
  ...RouteFactory.createRoute<WhitelistController>(
    "WhitelistController",
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
  ...RouteFactory.createRoute<WhitelistController>(
    "WhitelistController",
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
  ...RouteFactory.createRoute<WhitelistController>(
    "WhitelistController",
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
  ...RouteFactory.createRoute<WhitelistController>(
    "WhitelistController",
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
  ...RouteFactory.createRoute<WhitelistController>(
    "WhitelistController",
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
  ...RouteFactory.createRoute<WhitelistController>(
    "WhitelistController",
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
  ...RouteFactory.createRoute<WhitelistController>(
    "WhitelistController",
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
  ...RouteFactory.createRoute<WhitelistController>(
    "WhitelistController",
    "deactivateEntry",
    ...standardMiddleware,
  ),
);

export default router;
