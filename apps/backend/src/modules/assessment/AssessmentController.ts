import { Request, Response } from "express";
import { AiGradingService } from "./AiGradingService";

const gradingService = new AiGradingService();

export const AssessmentController = {
  /**
   * Submit an assessment answer
   */
  async submitAnswer(req: Request, res: Response) {
    try {
      const { id } = req.params; // UserAssessment ID
      const { questionId, answer } = req.body;
      // In a real app, we'd fetch question text from DB.
      // For MVP/Demo, simple pass-through or mock text.
      const questionText = "Explain the concept of Neural Networks.";

      const result = await gradingService.gradeSubmission(
        id,
        questionId,
        questionText,
        answer,
      );

      res.json(result);
    } catch (error) {
      console.error("Grading Error:", error);
      res.status(500).json({ error: "Failed to grade assessment" });
    }
  },
};
