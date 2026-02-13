/**
 * Social Domain Barrel - بوابة تصدير الـ OAuth
 *
 * @law Law-1 (Barrel Law) - Encapsulation gateway
 */

import { Router } from "express";
import oauthRoutes from "./oauth.routes.js";

const router = Router();

router.use(oauthRoutes);

export default router;
