/**
 * Account Domain Barrel - بوابة تصدير الحساب
 * 
 * @law Law-1 (Barrel Law) - Encapsulation gateway
 */

import { Router } from "express";
import registerRoutes from "./register.routes.js";
import profileRoutes from "./profile.routes.js";
import verificationRoutes from "./verification.routes.js";

const router = Router();

router.use(registerRoutes);
router.use(profileRoutes);
router.use(verificationRoutes);

export default router;
