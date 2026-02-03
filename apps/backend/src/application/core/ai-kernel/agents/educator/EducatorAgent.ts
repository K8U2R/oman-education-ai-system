import { IAIProvider } from "@/domain";
import {
  UserContext,
  IntentAnalysisResult,
  EducatorResponse,
  ChatMessage,
} from "@/core/ai-kernel/types";
import { logger } from "@/shared/utils/logger";
import { getSettings } from "@/shared/configuration";
// import { KnowledgeBaseService } from "@/application/services/knowledge/KnowledgeBaseService"; // Import kept for type if needed, but dependency injection usage removed
import { SkillRegistry } from "@/core/ai-kernel/skills/SkillRegistry";
import { ISkill } from "@/core/ai-kernel/skills/ISkill";

/**
 * Educator Agent
 * وكيل التعليم المسؤول عن شرح المفاهيم وتبسيطها.
 */
export class EducatorAgent {
  private aiProvider: IAIProvider;

  // We keep the property but won't strictly depend on it for logic anymore
  // if we can use the skill, but constructor signature might be fixed in DI container.
  // For now, we keep the constructor compatible but ignore the usage.
  constructor(aiProvider: IAIProvider) {
    this.aiProvider = aiProvider;
  }

  /**
   * Process the educational request
   */
  public async process(
    context: UserContext,
    intent: IntentAnalysisResult,
    rawQuery: string,
    history: ChatMessage[] = [],
    onToken?: (token: string) => void,
  ): Promise<EducatorResponse> {
    logger.info(
      `[EducatorAgent] Processing query: "${rawQuery}" for level: ${context.proficiencyLevel}`,
    );

    // 1. Retrieve Knowledge (RAG Integration via Skill)
    const rawKnowledge = await this.retrieveKnowledgeViaSkill(rawQuery);

    // 2. Construct Prompt
    const systemPrompt = this.constructSystemPrompt(context);
    const userPrompt = this.constructUserPrompt(rawQuery, rawKnowledge, intent);

    // 3. Call AI Model (Nemotron/GPT)
    const responseText = await this.callAI(
      systemPrompt,
      userPrompt,
      history,
      onToken,
    );

    // 4. Parse Response
    return this.parseResponse(responseText);
  }

  /**
   * RAG Retrieval via Sovereign Skill
   */
  private async retrieveKnowledgeViaSkill(query: string): Promise<string> {
    try {
      const skillRegistry = SkillRegistry.getInstance();
      const searchSkill = skillRegistry.get("search.rag") as ISkill<
        { query: string; limit?: number },
        string[]
      >;

      if (!searchSkill) {
        logger.warn(
          "[EducatorAgent] RAG Skill not found, skipping knowledge retrieval.",
        );
        return "";
      }

      // Execute Skill
      const chunks = await searchSkill.execute({ query: query, limit: 3 }, {});

      if (!chunks || chunks.length === 0)
        return "لا توجد معلومات محددة في المنهج حول هذا الموضوع.";

      return chunks
        .map((chunk, i) => `[Source ${i + 1}]: ${chunk}`)
        .join("\n\n");
    } catch (error) {
      logger.warn(
        "[EducatorAgent] RAG Retrieval failed via Skill, falling back to general knowledge",
        error,
      );
      return "";
    }
  }

  /**
   * Builds the persona of the AI Teacher
   */
  private constructSystemPrompt(context: UserContext): string {
    const levelDescription = this.getLevelDescription(context.proficiencyLevel);

    return `
    نت مدرس ذكي (Educator Agent) في نظام التعليم العماني.
    مهمتك: شرح المفاهيم البرمجية والعلمية بأسلوب تربوي ممتع.
    
    مستوى الطالب: ${context.proficiencyLevel}/5 (${levelDescription}).
    
    تعليمات الأسلوب:
    1. تكييف اللغة: استخدم مصطلحات تناسب مستوى الطالب. للمبتدئين بسط جداً، للمتقدمين تعمق.
    2. التوطين: استخدم أمثلة من البيئة العمانية والعربية عند الإمكان.
    3. التفاعل: لا تلقي محاضرة، بل حاور الطالب.
    
    Format Output:
    You are communicating directly with the student via a streaming interface.
    
    1. **Start directly with the explanation** in Markdown format. Use headers, bullet points, and **bold** text.
    2. If you provide code, use standard markdown code blocks like:
       \`\`\`python
    print("Code here")
       \`\`\`
    3. At the very end of your response, strictly AFTER the explanation, provide a hidden metadata block wrapped in a specific tag for the system to read:
    
    <metadata>
    {
      "interactiveQuestion": {
        "question": "...",
        "options": ["..."],
        "answerHint": "..."
      },
      "relatedConcepts": ["..."]
    }
    </metadata>
    
    Do NOT output the JSON at the beginning. Output the natural text explanation first so the user sees it immediately.
    `;
  }

  private constructUserPrompt(
    query: string,
    knowledge: string,
    intent: IntentAnalysisResult,
  ): string {
    return `
    سؤال الطالب: "${query}"
    
    المعرفة المتوفرة من المنهج (استخدمها كمصدر للحقيقة):
    ${knowledge}
    
    Entities detected: ${JSON.stringify(intent.entities)}
    
    قم بتوليد الرد التعليمي JSON الآن.
    `;
  }

  private getLevelDescription(level: number): string {
    const levels = [
      "مبتدئ جداً (يحتاج تشبيهات واقعية)",
      "مبتدئ (يفهم الأساسيات البسيطة)",
      "متوسط (يفهم المنطق البرمجي)",
      "متقدم (يريد تفاصيل تقنية)",
      "خبير (يريد نقاشاً معمارياً)",
    ];
    return levels[level - 1] || levels[2];
  }

  /**
   * Abstraction to call the AI Provider
   */
  private async callAI(
    sys: string,
    user: string,
    history: ChatMessage[] = [],
    onToken?: (token: string) => void,
  ): Promise<string> {
    if (!this.aiProvider) {
      throw new Error("AI Provider not initialized");
    }

    try {
      const settings = getSettings();
      const model = settings.ai?.defaultModel || "gpt-4-turbo-preview";

      // Map history to provider messages
      const previousMessages = history.map((msg) => ({
        role: msg.role === "assistant" ? "assistant" : "user", // Map system/user/assistant
        content: msg.content,
      }));

      const result = await this.aiProvider.chatCompletion({
        model: model,
        messages: [
          { role: "system", content: sys },
          ...previousMessages.map((msg) => ({
            ...msg,
            role: msg.role as "system" | "user" | "assistant",
          })),
          { role: "user" as const, content: user },
        ],
        temperature: 0.7,
        onToken: onToken, // Streaming support
      });

      return result.content;
    } catch (error) {
      logger.error("Error processing request:", error);
      throw error;
    }
  }

  private parseResponse(responseText: string): EducatorResponse {
    try {
      // Split content into Explanation (Markdown) and Metadata (JSON)
      const metadataStart = responseText.indexOf("<metadata>");

      let explanation = responseText;
      let metadata: Record<string, unknown> = {};

      if (metadataStart !== -1) {
        explanation = responseText.substring(0, metadataStart).trim();
        const metadataStr = responseText.substring(
          metadataStart + "<metadata>".length,
          responseText.indexOf("</metadata>"),
        );
        try {
          metadata = JSON.parse(metadataStr);
        } catch (e) {
          logger.warn("Failed to parse metadata block", e);
        }
      }

      // Construct EducatorResponse
      return {
        explanation: explanation,
        examples: [], // Extracted from markdown if needed, or metadata
        interactiveQuestion:
          (metadata.interactiveQuestion as EducatorResponse["interactiveQuestion"]) || {
            question: "",
            options: [],
          },
        mediaRecommendation:
          (metadata.mediaRecommendation as EducatorResponse["mediaRecommendation"]) ||
          "none",
        relatedConcepts: (metadata.relatedConcepts as string[]) || [],
      };
    } catch (e) {
      logger.error("Failed to parse AI response", e);
      return {
        explanation: responseText, // Fallback: return full text as explanation
        examples: [],
        interactiveQuestion: { question: "", options: [] },
        mediaRecommendation: "none",
        relatedConcepts: [],
      };
    }
  }
}
