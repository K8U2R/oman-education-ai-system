import { IAIProvider } from "@/domain";
import {
  UserContext,
  IntentAnalysisResult,
  ChatMessage,
} from "@/core/ai-kernel/types";
import { logger } from "@/shared/utils/logger";
import { SkillRegistry } from "@/core/ai-kernel/skills/SkillRegistry";
import { OfficeGenerationRequest } from "@/domain/types/features/productivity/office.types.js";
import { ISkill } from "@/core/ai-kernel/skills/ISkill";

export class OfficeAgent {
  constructor(_aiProvider: IAIProvider) {}

  public async process(
    context: UserContext,
    intent: IntentAnalysisResult,
    rawQuery: string,
    _history: ChatMessage[] = [],
    onToken?: (token: string) => void,
  ): Promise<import("@/core/ai-kernel/types").AgentResponse> {
    logger.info(
      `[OfficeAgent] Processing document request: ${intent.entities.fileType} via Sovereign Skill`,
    );

    if (onToken) {
      onToken(
        "جاري تحضير " + intent.entities.fileType + " عبر البروتوكول السيادي...",
      );
    }

    try {
      // 1. Resolve Skill via Registry
      const skillRegistry = SkillRegistry.getInstance();
      const officeSkill = skillRegistry.get("office.generate") as ISkill<
        OfficeGenerationRequest,
        unknown
      >;

      if (!officeSkill) {
        throw new Error(
          "Sovereign Skill 'office.generate' not initialized in Registry.",
        );
      }

      // 2. Prepare Payload
      const fileType = (intent.entities.fileType as string) || "word";
      const payload: OfficeGenerationRequest = {
        type: fileType as "word" | "excel" | "powerpoint",
        data: {
          topic: intent.entities.topic || "عام",
          query: rawQuery,
          requestedBy: context.userId,
          context: context, // Pass full context if needed by service
        },
        template_id: "default",
      };

      // 3. Execute Skill
      if (onToken) onToken("\nجاري الاتصال بمولد المستندات...");

      // Execute the skill
      const result = await officeSkill.execute(payload, context);

      if (onToken) onToken("\nتم الانتهاء بنجاح.");

      return {
        explanation: `تم إنشاء ملف ${fileType} بنجاح.`,
        status: "completed",
        data: result, // Result from service (e.g., file path, download URL)
        fileType: fileType,
        topic: intent.entities.topic || "General",
      };
    } catch (error) {
      logger.error("[OfficeAgent] Failed to execute skill", error);

      const errorMessage =
        error instanceof Error ? error.message : "Unknown error";
      if (onToken) onToken(`\nحدث خطأ: ${errorMessage}`);

      return {
        explanation: "حدث خطأ أثناء إنشاء المستند.",
        status: "error",
        error: errorMessage,
      };
    }
  }
}
