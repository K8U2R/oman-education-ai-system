/**
 * Routes Module - وحدة المسارات
 *
 * Professional modular routes structure with separation of concerns
 */

import { Router } from "express";

// === CORE ROUTES ===
import authRoutes from "./core/auth/index.js";
import sessionRoutes from "./core/session.routes.js";
import userRoutes from "./core/user/index.js";

// === FEATURE ROUTES ===
import learningRoutes from "./features/learning/index.js";
import aiRoutes from "./features/ai/index.js";
import storageRoutes from "./features/storage/storage.routes.js";
import projectRoutes from "./features/project.routes.js";
import notificationRoutes from "./features/notifications/notification.routes.js";
import educationRoutes from "@/modules/education/interfaces/http/routes/education.routes.js";
import subscriptionRoutes from "@/modules/subscription/subscription.routes.js";
import monitoringRoutes from "./features/security/monitoring.routes.js";
import assessmentRoutes from "../../../modules/assessment/assessment.routes.js";

// === ADMIN ROUTES ===
import adminRoutes from "./admin/index.js";

// === DEVELOPER ROUTES ===
import developerRoutes from "./developer/index.js";

// === STANDALONE ROUTES ===
import healthRoutes from "./health.routes.js";
import contentManagementRoutes from "./content-management.routes.js";
import docsRoutes from "./docs.routes.js";

// === MIDDLEWARE ===
import { requireVerification } from "../middleware/security/auth/require-verification.middleware.js";

// === SYSTEM ROUTES ===
import changelogRoutes from "./system/changelog.routes.js";

const coreRouter = Router();

// === MOUNTING ===

// Health
coreRouter.use("/", healthRoutes); // /api/v1/health mounted inside

// Core
coreRouter.use("/auth", authRoutes);
coreRouter.use("/users", userRoutes);
coreRouter.use("/security/sessions", sessionRoutes);

// Features
coreRouter.use("/learning", learningRoutes);
coreRouter.use("/ai", aiRoutes); // Re-enabled for T048
coreRouter.use("/subscription", subscriptionRoutes);
coreRouter.use("/content", contentManagementRoutes);
coreRouter.use("/projects", projectRoutes);
coreRouter.use("/storage", storageRoutes);
coreRouter.use("/notifications", notificationRoutes);
coreRouter.use("/security/monitoring", monitoringRoutes);
coreRouter.use("/assessments", assessmentRoutes);

// ════════════════════════════════════════════════════════════════════════
// Protected Feature Routes (Require Email Verification in Production)
// ════════════════════════════════════════════════════════════════════════
coreRouter.use("/education", requireVerification, educationRoutes);

// Admin & Developer
coreRouter.use("/admin", adminRoutes);
coreRouter.use("/developer", developerRoutes);

// System
coreRouter.use("/system/changelog", changelogRoutes);

// API Documentation
coreRouter.use("/docs", docsRoutes);

// Unified AI Interaction
// coreRouter.use("/interact", chatRoutes); // TODO: Re-enable when chatRoutes is verified

export default coreRouter;
