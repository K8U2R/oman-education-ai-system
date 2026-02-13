import { Router } from "express";
import { SecurityMonitoringController } from "@/modules/security/controllers/SecurityMonitoringController.js";

const monitoringRoutes = Router();
const controller = new SecurityMonitoringController();

monitoringRoutes.get("/health", controller.getSystemHealth);
monitoringRoutes.get("/realtime", controller.getRealtimeMetrics);
monitoringRoutes.get("/alert-thresholds", controller.getAlertThresholds);
monitoringRoutes.get("/config", controller.getMonitoringConfig);
monitoringRoutes.post("/config", controller.updateMonitoringConfig);

export default monitoringRoutes;
