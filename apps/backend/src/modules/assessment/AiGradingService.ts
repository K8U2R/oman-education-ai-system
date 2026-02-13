import { prisma } from "../../infrastructure/database/client";
import { OpenAIService } from "../learning/openai.service";

export class AiGradingService {
  private openAIService: OpenAIService;

  constructor() {
    this.openAIService = new OpenAIService();
  }

  /**
   * Auto-grade a user's answer and log the result
   */
  async gradeSubmission(
    userAssessmentId: string,
    questionId: string,
    questionText: string,
    userAnswer: string,
  ) {
    const gradingResult = await this.openAIService.gradeAnswer(
      questionText,
      userAnswer,
    );

    await prisma.ai_grading_logs.create({
      data: {
        user_assessment_id: userAssessmentId,
        question_id: questionId,
        prompt: questionText,
        ai_response: JSON.stringify(gradingResult),
        confidence: gradingResult.confidence,
      },
    });

    // Update user assessment score and status
    await prisma.user_assessments.update({
      where: { id: userAssessmentId },
      data: {
        score: gradingResult.score,
        status: "COMPLETED",
        completed_at: new Date(),
      },
    });

    return gradingResult;
  }
}
