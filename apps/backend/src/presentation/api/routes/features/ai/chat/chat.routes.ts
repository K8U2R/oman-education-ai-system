import { Router } from "express";
import { ChatController } from "./chat.controller";

const router = Router();
// Unified Interaction Point
// Mounted at /api/v1/interact in index.ts
router.post("/", (req, res) => {
  const controller = new ChatController();
  controller.interact(req, res);
});

export { router as chatRoutes };
