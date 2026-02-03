/**
 * Admin Routes - مسارات الإدارة
 *
 * Aggregates admin-related routes
 */

import { Router } from "express";
import adminRoutes from "./admin.routes.js";
import securityRoutes from "./security.routes.js";
import securityAnalyticsRoutes from "./security-analytics.routes.js";
import whitelistRoutes from "./whitelist.routes.js";

const router = Router();

// Mount admin sub-routes
router.use("/", adminRoutes);
router.use("/security", securityRoutes);
router.use("/analytics", securityAnalyticsRoutes);
router.use("/whitelist", whitelistRoutes);

export default router;
