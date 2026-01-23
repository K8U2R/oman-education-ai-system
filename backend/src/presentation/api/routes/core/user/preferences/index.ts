/**
 * Preferences Sub-domain Barrel - بوابة تصدير التفضيلات
 * 
 * @law Law-1 (Barrel Law)
 */

import { Router } from "express";
import preferencesRoutes from "./routes.js";

const router = Router();

router.use(preferencesRoutes);

export default router;
