import { container } from "@/infrastructure/di/Container.js";
import { OpenAIAdapter } from "@/infrastructure/adapters/ai/OpenAIAdapter.js";

export function registerAIModule(): void {
    // Register the Provider (Adapter)
    // We register it as a Singleton because OpenAI Client handles connection pooling internally
    container.registerSingleton("IAIProvider", OpenAIAdapter);

    console.log("🧠 Neural Core Activated: AI Module Registered");
}
