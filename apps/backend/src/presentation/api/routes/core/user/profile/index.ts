/**
 * Profile Sub-domain Barrel - بوابة تصدير الملف الشخصي
 *
 * @law Law-1 (Barrel Law)
 */

import { Router } from "express";
import profileRoutes from "./routes.js";

const router = Router();

router.use(profileRoutes);

export default router;
