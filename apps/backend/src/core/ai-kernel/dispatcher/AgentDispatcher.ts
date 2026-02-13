import { IntentAnalyzer } from "../intents/IntentAnalyzer";
import { MessageInput, IntentAnalysisResult, UserContext } from "../types";
import { logger } from "@/shared/utils/logger";
import { KnowledgeBaseService } from "@/application/services/index.js";

import { EducatorAgent } from "@/application/core/ai-kernel/agents/educator/EducatorAgent";
import { DeveloperAgent } from "@/application/core/ai-kernel/agents/developer/DeveloperAgent";
import { OfficeAgent } from "@/application/core/ai-kernel/agents/office/OfficeAgent";
import { MemoryManager } from "../memory/MemoryManager";

/**
 * Agent Dispatcher
 * الموزع المركزي: يستلم الطلب -> يحلله -> يوجهه للوكيل المناسب.
 */
import { SkillRegistry } from "../skills/SkillRegistry";
import { OfficeGenerationSkill } from "../skills/implementations/OfficeGenerationSkill";
import { RAGSearchSkill } from "../skills/implementations/RAGSearchSkill";

// ... existing imports

export class AgentDispatcher {
  private analyzer: IntentAnalyzer;
  private memoryManager: MemoryManager;
  private skillRegistry: SkillRegistry;

  // Agents
  private educatorAgent: EducatorAgent;
  private developerAgent: DeveloperAgent;
  private officeAgent: OfficeAgent;

  constructor(
    aiProvider: import("@/domain").IAIProvider,
    knowledgeBase: KnowledgeBaseService,
  ) {
    this.analyzer = new IntentAnalyzer();
    this.memoryManager = new MemoryManager();
    this.skillRegistry = SkillRegistry.getInstance();

    // Register Sovereign Skills
    this.skillRegistry.register(new OfficeGenerationSkill()); // Will autofill service via container if not provided
    this.skillRegistry.register(new RAGSearchSkill(knowledgeBase)); // Pass KB service explicitly

    // Initialize Agents
    this.educatorAgent = new EducatorAgent(aiProvider);
    this.developerAgent = new DeveloperAgent(aiProvider);
    this.officeAgent = new OfficeAgent(aiProvider);
  }

  /**
   * Dispatch the user request to the appropriate agent
   */
  public async dispatch(
    input: MessageInput,
  ): Promise<{ response: unknown; updatedContext: UserContext }> {
    logger.info(
      `[Dispatcher] Received request: "${input.text.substring(0, 50)}..."`,
    );

    // 1. Analyze Intent
    const analysis: IntentAnalysisResult = await this.analyzer.analyze(input);

    logger.info(
      `[Dispatcher] Analysis Result: Intent=${analysis.primaryIntent}, Agent=${analysis.targetAgent}`,
    );

    // 2. Select Agent & Execute
    const agentResponse = await this.routeToAgent(analysis, input);

    // 3. Update Context + History via Memory Manager
    await this.memoryManager.addInteraction(
      input.context.userId,
      input.text,
      typeof agentResponse === "string"
        ? agentResponse
        : (agentResponse as { explanation?: string }).explanation ||
            JSON.stringify(agentResponse),
    );

    const updatedContext = await this.memoryManager.updateContext(
      input.context,
      analysis.primaryIntent,
      analysis.entities.topic,
    );

    return {
      response: agentResponse,
      updatedContext,
    };
  }

  /**
   * Routing Logic
   */
  private async routeToAgent(
    analysis: IntentAnalysisResult,
    input: MessageInput,
  ): Promise<unknown> {
    // Inject onToken into the process if the agent supports it
    const onToken = input.onToken;

    switch (analysis.targetAgent) {
      case "EDUCATOR": {
        return await this.educatorAgent.process(
          input.context,
          analysis,
          input.text,
          (await this.memoryManager.getHistory(
            input.context.userId,
          )) as import("@/core/ai-kernel/types").ChatMessage[],
          onToken,
        );
      }

      case "DEVELOPER": {
        return await this.developerAgent.process(
          input.context,
          analysis,
          input.text,
          (await this.memoryManager.getHistory(
            input.context.userId,
          )) as import("@/core/ai-kernel/types").ChatMessage[],
          onToken,
        );
      }

      case "OFFICE": {
        return await this.officeAgent.process(
          input.context,
          analysis,
          input.text,
          (await this.memoryManager.getHistory(
            input.context.userId,
          )) as import("@/core/ai-kernel/types").ChatMessage[],
          onToken, // Pass streaming callback if agent supports it
        );
      }

      case "EVALUATOR": {
        if (onToken) onToken("جاري تحليل مستواك التعليمي...");
        return { explanation: "جاري تحليل مستواك التعليمي..." };
      }

      default: {
        const msg = "أنا هنا للمساعدة. كيف يمكنني خدمتك في رحلتك التعليمية؟";
        if (onToken) {
          // Simulate streaming
          for (const char of msg) {
            onToken(char);
            await new Promise((r) => setTimeout(r, 10));
          }
        }
        return {
          explanation: msg,
        };
      }
    }
  }
}
