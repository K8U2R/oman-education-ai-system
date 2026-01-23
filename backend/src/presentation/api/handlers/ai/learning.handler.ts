/**
 * Learning Handlers - معالجات التعلم
 *
 * Request handlers لجميع endpoints التعلم
 */

import { Request, Response } from "express";
import { LearningService } from "@/application/services/index.js";
import { BaseHandler } from "@/presentation/api/handlers/base/BaseHandler.js";
import { AgentDispatcher } from "@/core/ai-kernel/dispatcher/AgentDispatcher";
// import { AuthService } from "@/application/services/auth/AuthService";
import { logger } from "@/shared/utils/logger";

export class LearningHandler extends BaseHandler {
  /**
   * إنشاء Learning Handler
   *
   * @param learningService - خدمة التعلم
   */
  constructor(
    private readonly learningService: LearningService,
    private readonly agentDispatcher: AgentDispatcher,
    // private readonly authService: AuthService
  ) {
    super();
  }

  /**
   * معالج جلب جميع الدروس
   *
   * GET /api/v1/learning/lessons
   */
  getLessons = async (req: Request, res: Response): Promise<void> => {
    await this.execute(
      res,
      async () => {
        const subjectId = req.query.subject_id as string | undefined;
        const gradeLevelId = req.query.grade_level_id as string | undefined;
        const page = parseInt(req.query.page as string) || 1;
        const perPage = parseInt(req.query.per_page as string) || 20;

        const result = await this.learningService.getLessons(
          subjectId,
          gradeLevelId,
          page,
          perPage,
        );
        this.ok(res, result);
      },
      "فشل جلب الدروس",
    );
  };

  /**
   * معالج جلب درس محدد
   *
   * GET /api/v1/learning/lessons/:id
   */
  getLesson = async (req: Request, res: Response): Promise<void> => {
    await this.execute(
      res,
      async () => {
        const { id } = req.params;
        const lesson = await this.learningService.getLesson(id);
        this.ok(res, lesson);
      },
      "فشل جلب الدرس",
    );
  };

  /**
   * معالج جلب شرح الدرس
   *
   * GET /api/v1/learning/lessons/:id/explanation
   */
  getLessonExplanation = async (req: Request, res: Response): Promise<void> => {
    await this.execute(
      res,
      async () => {
        const { id } = req.params;
        const language = (req.query.language as string) || "ar";
        const style = (req.query.style as string) || "simple";

        const explanation = await this.learningService.getLessonExplanation(
          id,
          language,
          style,
        );
        this.ok(res, explanation);
      },
      "فشل جلب شرح الدرس",
    );
  };

  /**
   * معالج جلب أمثلة الدرس
   *
   * GET /api/v1/learning/lessons/:id/examples
   */
  getLessonExamples = async (req: Request, res: Response): Promise<void> => {
    await this.execute(
      res,
      async () => {
        const { id } = req.params;
        const count = parseInt(req.query.count as string) || 5;
        const difficulty = req.query.difficulty as string | undefined;
        const language = (req.query.language as string) || "ar";

        const examples = await this.learningService.getLessonExamples(
          id,
          count,
          difficulty,
          language,
        );
        this.ok(res, examples);
      },
      "فشل جلب أمثلة الدرس",
    );
  };

  /**
   * معالج جلب فيديوهات الدرس
   *
   * GET /api/v1/learning/lessons/:id/videos
   */
  getLessonVideos = async (req: Request, res: Response): Promise<void> => {
    await this.execute(
      res,
      async () => {
        const { id } = req.params;
        const platform = req.query.platform as string | undefined;
        const maxResults = parseInt(req.query.max_results as string) || 10;

        const videos = await this.learningService.getLessonVideos(
          id,
          platform,
          maxResults,
        );
        this.ok(res, videos);
      },
      "فشل جلب فيديوهات الدرس",
    );
  };

  /**
   * معالج جلب Mind Map للدرس
   *
   * GET /api/v1/learning/lessons/:id/mind-map
   */
  getLessonMindMap = async (req: Request, res: Response): Promise<void> => {
    await this.execute(
      res,
      async () => {
        const { id } = req.params;
        const format = (req.query.format as string) || "json";
        const language = (req.query.language as string) || "ar";

        const mindMap = await this.learningService.getLessonMindMap(
          id,
          format,
          language,
        );
        this.ok(res, mindMap);
      },
      "فشل جلب Mind Map للدرس",
    );
  };

  /**
   * معالج المحادثة مع الدرس (streaming)
   *
   * POST /api/v1/learning/lessons/:id/chat
   */
  chatWithLesson = async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;
    const { message, context } = req.body;
    const user = req.user; // From auth middleware

    if (!message) {
      res.status(400).json({ error: "Message is required" });
      return;
    }

    // Set headers for SSE
    res.setHeader("Content-Type", "text/event-stream");
    res.setHeader("Cache-Control", "no-cache");
    res.setHeader("Connection", "keep-alive");

    const onToken = (token: string) => {
      res.write(`data: ${JSON.stringify({ token })}\n\n`);
    };

    try {
      // Create comprehensive context for the agent
      const messageInput = {
        text: message,
        context: {
          userId: user?.id || "anonymous",
          role: user?.role || "student",
          sessionId: req.headers["x-session-id"] as string,
          metadata: {
            ...context,
            lessonId: id,
            userProfile: user,
          },
          proficiencyLevel: 1, // Default to beginner, or fetch from user profile
        },
        onToken,
      };

      // Dispatch to agent
      await this.agentDispatcher.dispatch(messageInput);

      // End stream
      res.write(`data: ${JSON.stringify({ done: true })}\n\n`);
      res.end();
    } catch (error) {
      logger.error("Error in chatWithLesson", error);
      res.write(
        `data: ${JSON.stringify({ error: "An error occurred processing your request" })}\n\n`,
      );
      res.end();
    }
  };
}
