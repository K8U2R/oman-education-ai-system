/**
 * Security Domain Barrel - بوابة تصدير الأمان
 *
 * @law Law-1 (Barrel Law) - Encapsulation gateway
 */

import { Router } from "express";
import passwordRoutes from "./password.routes.js";
import mfaRoutes from "./mfa.routes.js";

const router = Router();

router.use(passwordRoutes);
router.use(mfaRoutes);

export default router;
