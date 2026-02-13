import { Router } from "express";
import codeGenerationRoutes from "./code-generation.routes.js";
import officeRoutes from "./office.routes.js";
import { chatRoutes } from "./chat/chat.routes.js";
import generalRoutes from "./general.routes.js";
import { aiRoutes as soulRoutes } from "./soul.routes.js";
import healthRoutes from "./health.routes.js"; // New import

const router = Router();

// Mount AI sub-routes
router.use("/", generalRoutes); // Mount at root of /ai prefix
router.use("/code-generation", codeGenerationRoutes);
router.use("/office", officeRoutes);
router.use("/chat", chatRoutes); // Unified Chat Route
router.use("/", soulRoutes);
router.use("/", healthRoutes); // Expose /health and /usage

export default router;
