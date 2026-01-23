/**
 * Anthropic Adapter - محول Anthropic (Claude)
 *
 * Infrastructure Adapter للتكامل مع Anthropic API
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

interface AnthropicConfig {
  apiKey: string;
  baseURL?: string;
  defaultModel?: string;
}

interface AnthropicResponse {
  id: string;
  type: string;
  role: string;
  content: Array<{
    type: string;
    text: string;
  }>;
  model: string;
  stop_reason: string;
  stop_sequence?: string;
  usage: {
    input_tokens: number;
    output_tokens: number;
  };
}

/**
 * Anthropic Adapter
 */
export class AnthropicAdapter extends BaseAdapter<
  AnthropicConfig,
  AnthropicResponse
> {
  private apiKey: string = "";
  private baseURL: string = "https://api.anthropic.com/v1";
  private defaultModel: string = "claude-3-5-sonnet-20241022";

  async connect(config: AnthropicConfig): Promise<void> {
    try {
      if (!config.apiKey) {
        throw new Error("Anthropic API key is required");
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

      // Simple health check - try a minimal message
      const response = await fetch(`${this.baseURL}/messages`, {
        method: "POST",
        headers: {
          "x-api-key": this.apiKey,
          "anthropic-version": "2023-06-01",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: this.defaultModel,
          max_tokens: 10,
          messages: [{ role: "user", content: "Hi" }],
        }),
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
    return "Anthropic";
  }

  async chatCompletion(request: AIChatRequest): Promise<AICompletionResponse> {
    if (!this.connected) {
      throw new Error("Anthropic adapter is not connected");
    }

    try {
      const model = request.model || this.defaultModel;

      // Convert messages format for Anthropic API
      const messages = request.messages
        .filter((msg: AIMessage) => msg.role !== "system") // Anthropic handles system messages differently
        .map((msg: AIMessage) => ({
          role: msg.role === "assistant" ? "assistant" : "user",
          content: msg.content,
        }));

      // Extract system message if exists
      const systemMessage = request.messages.find(
        (msg) => msg.role === "system",
      );

      const response = await fetch(`${this.baseURL}/messages`, {
        method: "POST",
        headers: {
          "x-api-key": this.apiKey,
          "anthropic-version": "2023-06-01",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model,
          max_tokens: request.maxTokens || 1024,
          messages,
          ...(systemMessage && { system: systemMessage.content }),
          temperature: request.temperature ?? 0.7,
        }),
      });

      if (!response.ok) {
        const errorData = (await response.json().catch(() => ({}))) as {
          error?: { message?: string };
        };
        throw new Error(
          `Anthropic API error: ${response.status} - ${errorData.error?.message || response.statusText}`,
        );
      }

      const data = (await response.json()) as AnthropicResponse;

      if (!data.content || data.content.length === 0) {
        throw new Error("No completion content returned from Anthropic");
      }

      return {
        content: data.content[0].text,
        model: data.model,
        usage: {
          promptTokens: data.usage.input_tokens,
          completionTokens: data.usage.output_tokens,
          totalTokens: data.usage.input_tokens + data.usage.output_tokens,
        },
      };
    } catch (error) {
      logger.error("Anthropic chat completion error", {
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
      throw new Error("Anthropic adapter is not connected");
    }

    try {
      const systemPrompt = `You are an expert code generator. Generate clean, well-documented code based on user requirements.
${request.language ? `Language: ${request.language}` : ""}
${request.framework ? `Framework: ${request.framework}` : ""}
${request.context ? `Context: ${request.context}` : ""}

Provide only the code without explanations unless specifically asked.`;

      // Create messages array from prompt
      const messages = [
        {
          role: "user" as const,
          content: request.prompt,
        },
      ];

      // Add system message to the completion request
      const response = await fetch(`${this.baseURL}/messages`, {
        method: "POST",
        headers: {
          "x-api-key": this.apiKey,
          "anthropic-version": "2023-06-01",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: this.defaultModel,
          max_tokens: 2000,
          system: systemPrompt,
          messages: messages.map((msg) => ({
            role: "user" as const,
            content: msg.content,
          })),
          temperature: 0.3,
        }),
      });

      if (!response.ok) {
        throw new Error(`Anthropic API error: ${response.status}`);
      }

      const data = (await response.json()) as AnthropicResponse;

      return {
        code: data.content[0].text,
        language: request.language,
        framework: request.framework,
      };
    } catch (error) {
      logger.error("Anthropic code generation error", {
        adapter: this.getName(),
        error: error instanceof Error ? error.message : "Unknown error",
      });
      throw error;
    }
  }
}
