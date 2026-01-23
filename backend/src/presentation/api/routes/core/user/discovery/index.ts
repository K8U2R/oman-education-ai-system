/**
 * Discovery Sub-domain Barrel - بوابة تصدير الاكتشاف
 * 
 * @law Law-1 (Barrel Law)
 */

import { Router } from "express";
import discoveryRoutes from "./routes.js";

const router = Router();

router.use(discoveryRoutes);

export default router;
