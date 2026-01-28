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
import educationRoutes from "@/modules/education/interfaces/http/routes/education.routes.js"; // Modularized

// === ADMIN ROUTES ===
import adminRoutes from "./admin/index.js";

// === DEVELOPER ROUTES ===
import developerRoutes from "./developer/index.js";

// === STANDALONE ROUTES ===
import healthRoutes from "./health.routes.js";
import contentManagementRoutes from "./content-management.routes.js";

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
coreRouter.use("/ai", aiRoutes);
coreRouter.use("/content", contentManagementRoutes);
coreRouter.use("/projects", projectRoutes);
coreRouter.use("/storage", storageRoutes);
coreRouter.use("/notifications", notificationRoutes);
coreRouter.use("/education", educationRoutes);

// Admin & Developer
coreRouter.use("/admin", adminRoutes);
coreRouter.use("/developer", developerRoutes);

// System
coreRouter.use("/system/changelog", changelogRoutes);

// Unified AI Interaction
// coreRouter.use("/interact", chatRoutes); // TODO: Re-enable when chatRoutes is verified

export default coreRouter;
