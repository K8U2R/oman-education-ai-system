import {
  IAIProvider,
  AICompletionOptions,
  AIChatRequest,
  AICompletionResponse,
  AICodeGenerationRequest,
  AICodeGenerationResponse,
} from "../../../domain/interfaces/ai/IAIProvider.js";
import { logger } from "../../../shared/utils/logger.js";
import { injectable } from "tsyringe";

@injectable()
export class MockAIProvider implements IAIProvider {
  getName(): string {
    return "mock";
  }

  async generateText(
    prompt: string,
    _options?: AICompletionOptions,
  ): Promise<string> {
    logger.info("MockAIProvider: generateText", {
      prompt: prompt.substring(0, 50),
    });
    return "Mock response text";
  }

  async generateJson<T>(
    prompt: string,
    _schema: any,
    _options?: AICompletionOptions,
  ): Promise<T> {
    logger.info("MockAIProvider: generateJson", {
      prompt: prompt.substring(0, 50),
    });

    if (prompt.includes("lesson") || prompt.includes("Lesson")) {
      return {
        topic: "Mock Lesson Topic",
        subject: "Mock Subject",
        gradeLevel: "Grade Mock",
        language: "ar",
        content: {
          objectives: ["Objective 1", "Objective 2"],
          introduction: "This is a mock introduction.",
          mainActivity: "This is the main activity.",
          assessment: "Assessment questions.",
          homework: "Homework assignment.",
        },
        metadata: {
          modelUsed: "mock-v1",
          generationTimeMs: 123,
          promptVersion: "1.0",
        },
      } as unknown as T;
    }

    throw new Error("MockAIProvider: No mock JSON defined for this prompt.");
  }

  async chatCompletion(_request: AIChatRequest): Promise<AICompletionResponse> {
    logger.info("MockAIProvider: chatCompletion");
    return {
      content: "Mock chat response",
      model: "mock-v1",
      usage: {
        promptTokens: 10,
        completionTokens: 10,
        totalTokens: 20,
      },
    };
  }

  async generateCode(
    request: AICodeGenerationRequest,
  ): Promise<AICodeGenerationResponse> {
    return {
      code: "console.log('Mock Code');",
      explanation: "This is mock code.",
      language: request.language || "typescript",
    };
  }

  async generateEmbedding(_text: string): Promise<number[]> {
    return [0.1, 0.2, 0.3];
  }

  async checkHealth(): Promise<boolean> {
    return true;
  }

  async healthCheck(): Promise<
    { status: "healthy" | "unhealthy"; message?: string } | string
  > {
    return { status: "healthy", message: "Mock Provider Online" };
  }
}
