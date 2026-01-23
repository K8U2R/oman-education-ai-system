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

// === ADMIN ROUTES ===
import adminRoutes from "./admin/index.js";

// === DEVELOPER ROUTES ===
import developerRoutes from "./developer/index.js";

// === STANDALONE ROUTES ===
import healthRoutes from "./health.routes.js";
import contentManagementRoutes from "./content-management.routes.js";

// === AI INTERACTION ===
import { chatRoutes } from "./features/ai/chat/chat.routes.js";

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

// Admin & Developer
coreRouter.use("/admin", adminRoutes);
coreRouter.use("/developer", developerRoutes);

// Unified AI Interaction
coreRouter.use("/interact", chatRoutes);

export default coreRouter;
