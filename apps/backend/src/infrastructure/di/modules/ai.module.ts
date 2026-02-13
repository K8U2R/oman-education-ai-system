import { container } from "@/infrastructure/di/Container.js";
import { OpenAIAdapter } from "@/infrastructure/adapters/ai/OpenAIAdapter.js";
import { MockAIProvider } from "@/modules/ai/services/MockAIProvider.js";
import { LessonGeneratorService } from "@/modules/education/services/ai/LessonGeneratorService.js";
import { AIController } from "@/modules/ai/controllers/ai.controller.js";
import { getSettings } from "@/shared/configuration/index.js";

export function registerAIModule(): void {
  const settings = getSettings();
  const useOpenAI =
    settings.ai.defaultProvider === "openai" && settings.ai.openaiApiKey;

  // 1. Register AI Provider (Neural Core)
  if (useOpenAI) {
    container.registerSingleton("IAIProvider", OpenAIAdapter);
    console.log("🧠 Neural Core: Using OpenAI Adapter");
  } else {
    container.registerSingleton("IAIProvider", MockAIProvider);
    console.log("🧠 Neural Core: Using Mock Adapter (Development Mode)");
  }

  // 2. Register Education AI Services
  container.registerSingleton("LessonGeneratorService", (c) => {
    return new LessonGeneratorService(c.resolve("IAIProvider"));
  });

  // 3. Register Controllers
  container.registerSingleton("AIController", (c) => {
    return new AIController(c.resolve("LessonGeneratorService"));
  });

  console.log("🧠 Neural Core Activated: AI Module Registered");
}
