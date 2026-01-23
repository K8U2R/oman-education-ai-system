/**
 * Learning Features Routes - مسارات ميزات التعلم
 *
 * Aggregates learning-related routes
 */

import { Router } from "express";
import learningRoutes from "./learning.routes.js";
import assessmentRoutes from "./assessment.routes.js";

const router = Router();

// Mount learning sub-routes
router.use("/lessons", learningRoutes);
router.use("/assessments", assessmentRoutes);

export default router;
