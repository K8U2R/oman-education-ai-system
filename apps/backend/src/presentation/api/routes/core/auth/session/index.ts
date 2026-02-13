/**
 * Session Domain Barrel - بوابة تصدير الجلسات
 *
 * @law Law-1 (Barrel Law) - Encapsulation gateway
 */

import { Router } from "express";
import loginRoutes from "./login.routes.js";
import logoutRoutes from "./logout.routes.js";
import deviceRoutes from "./device.routes.js";

const router = Router();

router.use(loginRoutes);
router.use(logoutRoutes);
router.use(deviceRoutes);

export default router;
