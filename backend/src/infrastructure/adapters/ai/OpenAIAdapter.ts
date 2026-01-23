/**
 * OpenAI Adapter - محول OpenAI
 *
 * Infrastructure Adapter للتكامل مع OpenAI API
 */

import { BaseAdapter, type HealthStatus } from "../base/BaseAdapter";
import type {
  AIMessage,
  AIChatRequest,
  AICodeGenerationRequest,
  AICompletionResponse,
  AICodeGenerationResponse,
} from "@/domain";
import { logger } from "@/shared/common";

interface OpenAIConfig {
  apiKey: string;
  baseURL?: string;
  defaultModel?: string;
}

interface OpenAIResponse {
  id: string;
  object: string;
  created: number;
  model: string;
  choices: Array<{
    index: number;
    message: {
      role: string;
      content: string;
    };
    finish_reason: string;
  }>;
  usage?: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
}

/**
 * OpenAI Adapter
 */
export class OpenAIAdapter extends BaseAdapter<OpenAIConfig, OpenAIResponse> {
  private apiKey: string = "";
  private baseURL: string = "https://api.openai.com/v1";
  private defaultModel: string = "gpt-4";

  async connect(config: OpenAIConfig): Promise<void> {
    try {
      if (!config.apiKey) {
        throw new Error("OpenAI API key is required");
      }

      this.apiKey = config.apiKey;
      this.baseURL = config.baseURL || this.baseURL;
      this.defaultModel = config.defaultModel || this.defaultModel;
      this.config = config;
      this.connected = true;

      this.logConnectionStatus("connected");
    } catch (error) {
      this.handleConnectionError(error, "connect");
      throw error;
    }
  }

  async disconnect(): Promise<void> {
    this.connected = false;
    this.apiKey = "";
    this.config = null;
    this.logConnectionStatus("disconnected");
  }

  async healthCheck(): Promise<HealthStatus> {
    try {
      if (!this.connected) {
        return "unhealthy";
      }

      // Simple health check - try to list models
      const response = await fetch(`${this.baseURL}/models`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${this.apiKey}`,
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        return "healthy";
      } else {
        return "unhealthy";
      }
    } catch {
      return "unhealthy";
    }
  }

  getName(): string {
    return "OpenAI";
  }

  async chatCompletion(request: AIChatRequest): Promise<AICompletionResponse> {
    if (!this.connected) {
      throw new Error("OpenAI adapter is not connected");
    }

    try {
      const model = request.model || this.defaultModel;
      const messages = request.messages.map((msg) => ({
        role: msg.role,
        content: msg.content,
      }));

      const response = await fetch(`${this.baseURL}/chat/completions`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${this.apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model,
          messages,
          temperature: request.temperature ?? 0.7,
          max_tokens: request.maxTokens,
        }),
      });

      if (!response.ok) {
        const errorData = (await response.json().catch(() => ({}))) as {
          error?: { message?: string };
        };
        throw new Error(
          `OpenAI API error: ${response.status} - ${errorData.error?.message || response.statusText}`,
        );
      }

      const data = (await response.json()) as OpenAIResponse;

      if (!data.choices || data.choices.length === 0) {
        throw new Error("No completion choices returned from OpenAI");
      }

      return {
        content: data.choices[0].message.content,
        model: data.model,
        usage: data.usage
          ? {
              promptTokens: data.usage.prompt_tokens,
              completionTokens: data.usage.completion_tokens,
              totalTokens: data.usage.total_tokens,
            }
          : undefined,
      };
    } catch (error) {
      logger.error("OpenAI chat completion error", {
        adapter: this.getName(),
        error: error instanceof Error ? error.message : "Unknown error",
      });
      throw error;
    }
  }

  async generateCode(
    request: AICodeGenerationRequest,
  ): Promise<AICodeGenerationResponse> {
    if (!this.connected) {
      throw new Error("OpenAI adapter is not connected");
    }

    try {
      const systemPrompt = `You are an expert code generator. Generate clean, well-documented code based on user requirements.
${request.language ? `Language: ${request.language}` : ""}
${request.framework ? `Framework: ${request.framework}` : ""}
${request.context ? `Context: ${request.context}` : ""}

Provide only the code without explanations unless specifically asked.`;

      const userPrompt = request.prompt;

      const messages: AIMessage[] = [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt },
      ];

      const completion = await this.chatCompletion({
        messages,
        model: this.defaultModel,
        temperature: 0.3, // Lower temperature for code generation
        maxTokens: 2000,
      });

      return {
        code: completion.content,
        language: request.language,
        framework: request.framework,
      };
    } catch (error) {
      logger.error("OpenAI code generation error", {
        adapter: this.getName(),
        error: error instanceof Error ? error.message : "Unknown error",
      });
      throw error;
    }
  }

  async generateEmbedding(text: string): Promise<number[]> {
    if (!this.connected) {
      throw new Error("OpenAI adapter is not connected");
    }

    try {
      const response = await fetch(`${this.baseURL}/embeddings`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${this.apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "text-embedding-3-small", // Explicitly use efficient model
          input: text,
        }),
      });

      if (!response.ok) {
        const errorData = (await response.json().catch(() => ({}))) as {
          error?: { message?: string };
        };
        throw new Error(
          `OpenAI Embedding error: ${response.status} - ${errorData.error?.message || response.statusText}`,
        );
      }

      const data = (await response.json()) as {
        data: Array<{ embedding: number[] }>;
        usage: { total_tokens: number };
      };

      if (!data.data || data.data.length === 0) {
        throw new Error("No embedding returned from OpenAI");
      }

      return data.data[0].embedding;
    } catch (error) {
      logger.error("OpenAI embedding generation error", {
        adapter: this.getName(),
        error: error instanceof Error ? error.message : "Unknown error",
      });
      throw error;
    }
  }
}
