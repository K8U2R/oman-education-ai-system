import { Request, Response } from "express";
import { container } from "../../../../../../infrastructure/di/index.js";
import { AgentDispatcher } from "../../../../../../core/ai-kernel/dispatcher/AgentDispatcher.js";
import { SSEService } from "../../../../../../infrastructure/services/communication/SSEService.js";
import { InteractRequestSchema } from "./chat.validation.js";
import { logger } from "../../../../../../shared/utils/logger.js";
import { UserContext } from "../../../../../../core/ai-kernel/types/index.js";

export class ChatController {
  private dispatcher: AgentDispatcher;

  constructor() {
    // TODO: proper DI injection. For now obtaining from container or creating fresh (temporary fix)
    // Ideally this controller should have these injected.
    // Assuming we can get them from a registry or they are passed in constructor.
    // For now, let's assume we need to resolving them.
    // BUT `AgentDispatcher` expects dependencies.
    // Let's rely on container in next steps or mock.
    // Actually, `start.ts` or `bootstrap.ts` should register them.
    // Here we will use the container to resolve AgentDispatcher directly if registered, or resolve dependencies.
    // Proper DI injection using Container
    this.dispatcher = container.resolve("AgentDispatcher");
  }

  /**
   * Handle Interaction Request
   * POST /api/v1/interact
   */
  public interact = async (req: Request, res: Response): Promise<void> => {
    try {
      // 1. Validate Input
      const validationResult = InteractRequestSchema.safeParse(req.body);

      if (!validationResult.success) {
        res.status(400).json({
          success: false,
          error: "بيانات غير صالحة",
          details: validationResult.error.format(),
        });
        return;
      }

      const { message, userId, sessionId, context } = validationResult.data;

      // 2. Build User Context
      const userContext: UserContext = {
        userId,
        sessionId,
        currentSubject: context?.currentSubject,
        proficiencyLevel: context?.proficiencyLevel || 3,
      };

      // 3. Dispatch to AI Kernel
      logger.info(`[ChatController] Dispatching message from User:${userId}`);

      // NEW: Streaming Callback
      // const { SSEService } = await import("@/infrastructure/services/communication/SSEService");
      const sse = SSEService.getInstance();

      const result = await this.dispatcher.dispatch({
        text: message,
        context: userContext,
        history: [], // TODO: Load history from DB based on sessionId
        onToken: (token) => {
          sse.streamToken(userId, token);
        },
      });

      // 4. Send Response
      res.status(200).json({
        success: true,
        data: result.response,
        meta: {
          updatedContext: result.updatedContext,
        },
      });
    } catch (error) {
      logger.error("[ChatController] Error processing interaction", error);

      // Friendly Error Handling (AI Persona)
      res.status(503).json({
        success: false,
        error: "FriendlyError",
        data: {
          explanation:
            "أعتذر منك، يبدو أن 'المعلم الرقمي' يأخذ استراحة قصيرة لتحديث معلوماته. ☕",
          examples: [],
          interactiveQuestion: {
            question: "هل يمكنك محاولة إعادة صياغة سؤالك بعد قليل؟",
            options: ["حسناً", "سأنتظر"],
          },
          mediaRecommendation: "none",
          relatedConcepts: ["الصبر", "المحاولة مرة أخرى"],
        },
      });
    }
  };
}
