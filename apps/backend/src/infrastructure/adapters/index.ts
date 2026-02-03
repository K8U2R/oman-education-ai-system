/**
 * Infrastructure Adapters - محوّلات البنية التحتية
 *
 * Export جميع Adapters من المجلدات المنظمة
 */

// Database Adapters
export * from "./db";

// AI Adapters
export { OpenAIAdapter } from "./ai/OpenAIAdapter";
export { AnthropicAdapter } from "./ai/AnthropicAdapter";
export { createAIProvider } from "./ai/AIProviderFactory";

// Email Adapters
export * from "./email";

// Cache Adapters
export * from "./cache";

// Base Adapter
export {
  BaseAdapter,
  type IAdapter,
  type HealthStatus,
} from "./base/BaseAdapter";
