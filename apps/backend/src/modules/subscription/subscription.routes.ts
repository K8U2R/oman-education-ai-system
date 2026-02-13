import { Router } from "express";
import { SubscriptionController } from "./subscription.controller.js";

const router = Router();
const controller = new SubscriptionController();

// Todo: Add auth middleware
router.get("/my-plan", (req, res) => controller.getMyPlan(req, res));
router.post("/upgrade", (req, res) => controller.upgrade(req, res));

export default router;
