/**
 * Management Sub-domain Barrel - بوابة تصدير الإدارة
 * 
 * @law Law-1 (Barrel Law)
 */

import { Router } from "express";
import managementRoutes from "./routes.js";

const router = Router();

router.use(managementRoutes);

export default router;
