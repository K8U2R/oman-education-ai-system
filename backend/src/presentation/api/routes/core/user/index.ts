/**
 * User Domain Aggregator - المجمع الرئيسي لنطاق المستخدم
 * 
 * @law Law-1 (Barrel Law) - Main Aggregator
 * @law Law-10 (Scalability) - Encapsulated Sub-domains
 */

import { Router } from "express";
// الالتزام بقانون البرميل (Barrel Law): استيراد المجلدات فقط
import managementRoutes from "./management/index.js";
import profileRoutes from "./profile/index.js";
import discoveryRoutes from "./discovery/index.js";
// import preferencesRoutes from "./preferences/index.js";

const router = Router();

// تقسيم المسارات حسب النطاق (Prefixing)
router.use("/management", managementRoutes); // -> /api/v1/users/management
router.use("/profile", profileRoutes);       // -> /api/v1/users/profile
router.use("/discovery", discoveryRoutes);   // -> /api/v1/users/discovery

export default router;
