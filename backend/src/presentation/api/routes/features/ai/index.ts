/**
 * AI Features Routes - مسارات ميزات الذكاء الاصطناعي
 *
 * Aggregates AI-related routes
 */

import { Router } from "express";
import codeGenerationRoutes from "./code-generation.routes.js";
import officeRoutes from "./office.routes.js";
import { chatRoutes } from "./chat/chat.routes.js";
import generalRoutes from "./general.routes.js";

const router = Router();

// Mount AI sub-routes
router.use("/", generalRoutes); // Mount at root of /ai prefix
router.use("/code-generation", codeGenerationRoutes);
router.use("/office", officeRoutes);
router.use("/chat", chatRoutes); // Unified Chat Route

export default router;
