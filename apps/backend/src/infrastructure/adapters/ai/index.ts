/**
 * AI Adapters - محولات الذكاء الاصطناعي
 *
 * Export جميع AI Adapters و Factory
 * هذا الملف يعمل كـ Barrel Export مركزي لجميع AI Adapters
 *
 * @example
 * ```typescript
 * // استيراد AI adapters:
 * import { OpenAIAdapter, AnthropicAdapter, createAIProvider } from '@/infrastructure/adapters/ai'
 * ```
 */

export { OpenAIAdapter } from "./OpenAIAdapter";
export { AnthropicAdapter } from "./AnthropicAdapter";
export { createAIProvider } from "./AIProviderFactory";
