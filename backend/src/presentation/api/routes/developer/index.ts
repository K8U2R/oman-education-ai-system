/**
 * Developer Routes - مسارات المطورين
 *
 * Aggregates developer tools routes
 */

import { Router } from "express";
import developerRoutes from "./developer.routes.js";
import monitoringRoutes from "./monitoring.routes.js";
import securityMonitoringRoutes from "./security-monitoring.routes.js";
import performanceMonitoringRoutes from "./performance-monitoring.routes.js";

const router = Router();

// Mount developer sub-routes
router.use("/", developerRoutes);
router.use("/monitoring", monitoringRoutes);
router.use("/security-monitoring", securityMonitoringRoutes);
router.use("/performance", performanceMonitoringRoutes);

export default router;
