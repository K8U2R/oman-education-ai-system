/**
 * IAIProvider - واجهة مزود الذكاء الاصطناعي
 *
 * Domain Interface لمزودي AI (OpenAI, Anthropic, etc.)
 */

export interface AIMessage {
  role: "system" | "user" | "assistant";
  content: string;
}

export interface AICompletionRequest {
  messages: AIMessage[];
  model?: string;
  temperature?: number;
  maxTokens?: number;
  stream?: boolean;
}

export interface AICompletionResponse {
  content: string;
  model: string;
  usage?: {
    promptTokens: number;
    completionTokens: number;
    totalTokens: number;
  };
}

export interface AIChatRequest {
  messages: AIMessage[];
  model?: string;
  temperature?: number;
  maxTokens?: number;
  onToken?: (token: string) => void;
}

export interface AICodeGenerationRequest {
  prompt: string;
  language?: string;
  framework?: string;
  context?: string;
}

export interface AICodeGenerationResponse {
  code: string;
  explanation?: string;
  language?: string;
  framework?: string;
}

/**
 * واجهة مزود AI
 */
export interface IAIProvider {
  /**
   * إكمال محادثة (Chat Completion)
   */
  chatCompletion(request: AIChatRequest): Promise<AICompletionResponse>;

  /**
   * توليد كود
   */
  generateCode(
    request: AICodeGenerationRequest,
  ): Promise<AICodeGenerationResponse>;

  /**
   * توليد Embedding
   */
  generateEmbedding(text: string): Promise<number[]>;

  /**
   * Health Check (Simple)
   */
  checkHealth(): Promise<boolean>;

  /**
   * Check Health (Rich)
   */
  healthCheck(): Promise<{ status: "healthy" | "unhealthy"; message?: string } | string>;

  /**
   * Generate Text (Legacy/Simple)
   */
  generateText(prompt: string, options?: any): Promise<string>;

  /**
   * Generate JSON
   */
  generateJson<T>(prompt: string, schema: object, options?: any): Promise<T>;

  /**
   * اسم المزود
   */
  getName(): string;
}
