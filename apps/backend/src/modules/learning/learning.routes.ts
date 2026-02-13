import { Router } from "express";
import { LearningController } from "./learning.controller.js";

const router = Router();
const controller = new LearningController();

router.get("/courses", (req, res) => controller.getCourses(req, res));
router.get("/lessons/:id", (req, res) => controller.getLesson(req, res));
router.post("/chat", (req, res) => controller.chat(req, res));

export default router;
