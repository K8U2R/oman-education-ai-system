/**
 * AI Provider Factory - مصنع موفري AI
 *
 * Factory لإنشاء AI Provider حسب الإعدادات
 */

import type { IAIProvider } from "@/domain";
import { OpenAIAdapter } from "./OpenAIAdapter";
import { AnthropicAdapter } from "./AnthropicAdapter";
import { getSettings } from "@/shared/configuration";
import { logger } from "@/shared/utils/logger";

/**
 * إنشاء AI Provider حسب الإعدادات
 *
 * @returns IAIProvider instance
 */
export async function createAIProvider(): Promise<IAIProvider> {
  const settings = getSettings();
  const provider = settings.ai.defaultProvider;

  let aiProvider: IAIProvider;

  if (provider === "openai") {
    if (!settings.ai.openaiApiKey) {
      logger.warn("OpenAI API key not configured");
      throw new Error(
        "OpenAI API key is required. Set OPENAI_API_KEY environment variable.",
      );
    }

    const adapter = new OpenAIAdapter();
    await adapter.connect({
      apiKey: settings.ai.openaiApiKey,
      defaultModel: "gpt-4",
    });

    // aiProvider = { ... }
    aiProvider = adapter;
  } else if (provider === "anthropic") {
    if (!settings.ai.anthropicApiKey) {
      logger.warn("Anthropic API key not configured");
      throw new Error(
        "Anthropic API key is required. Set ANTHROPIC_API_KEY environment variable.",
      );
    }

    const adapter = new AnthropicAdapter();
    await adapter.connect({
      apiKey: settings.ai.anthropicApiKey,
      defaultModel: "claude-3-opus-20240229",
    });

    // Remove manual wrapper as Adapter now implements generic IAIProvider
    // aiProvider = { ... }

    // Check strict interface compliance
    aiProvider = adapter;
  } else {
    throw new Error(`Unsupported AI provider: ${provider}`);
  }

  logger.info(`AI Provider initialized: ${provider}`);
  return aiProvider;
}
