import { IAIProvider } from "@/domain";
import {
  UserContext,
  IntentAnalysisResult,
  ChatMessage,
} from "@/core/ai-kernel/types";
import { logger } from "@/shared/utils/logger";
import { getSettings } from "@/shared/configuration";

export class DeveloperAgent {
  private aiProvider: IAIProvider;

  constructor(aiProvider: IAIProvider) {
    this.aiProvider = aiProvider;
  }

  public async process(
    _context: UserContext,
    intent: IntentAnalysisResult,
    rawQuery: string,
    history: ChatMessage[] = [],
    onToken?: (token: string) => void,
  ): Promise<import("@/core/ai-kernel/types").AgentResponse> {
    logger.info(
      `[DeveloperAgent] Processing code request: ${intent.entities.language || "Auto-detect"}`,
    );

    try {
      const settings = getSettings();
      const model = settings.ai?.defaultModel || "gpt-4-turbo-preview";

      // Construct system prompt for code
      const systemPrompt = `You are an expert software developer.
      User Language: ${intent.entities.language || "typescript"}.
      Task: Generate high-quality, documented code.
      Output: Return only the code explanation and then the code block.`;

      // Map history
      const previousMessages = history.map((msg) => ({
        role: msg.role === "assistant" ? "assistant" : "user",
        content: msg.content,
      }));

      const result = await this.aiProvider.chatCompletion({
        model: model,
        messages: [
          { role: "system", content: systemPrompt },
          ...previousMessages.map((msg) => ({
            ...msg,
            role: msg.role as "system" | "user" | "assistant",
          })),
          { role: "user" as const, content: rawQuery },
        ],
        temperature: 0.2, // Lower temp for code
        onToken: onToken,
      });

      return {
        explanation: result.content, // Return full AI response so it's saved to memory
        code: result.content, // Legacy field, might be parsed later
        language: intent.entities.language || "typescript",
      };
    } catch (error) {
      logger.error("[DeveloperAgent] Error:", error);
      return {
        explanation: "حدث خطأ أثناء توليد الكود.",
        code: "// Error generating code",
        language: "text",
      };
    }
  }
}
