/**
 * Learning Features Routes - مسارات ميزات التعلم
 *
 * Aggregates learning-related routes
 */

import { Router } from "express";
import learningRoutes from "@/modules/learning/learning.routes.js";
// import assessmentRoutes from "./assessment.routes.js"; // Temporarily disabled

const router = Router();

// Mount learning sub-routes directly
router.use("/", learningRoutes);

export default router;
