/**
 * IAIProvider Interface
 * 
 * Contract for any AI Provider (OpenAI, DeepSeek, etc.)
 * Complies with Law 01 (Dependency Inversion).
 */

export interface AICompletionOptions {
    temperature?: number;
    maxTokens?: number;
    systemPrompt?: string;
}

export interface IAIProvider {
    /**
     * Generate simple text completion
     */
    generateText(
        prompt: string,
        options?: AICompletionOptions
    ): Promise<string>;

    /**
     * Generate structured JSON output (Strict Schema)
     */
    generateJson<T>(
        prompt: string,
        schema: object,
        options?: AICompletionOptions
    ): Promise<T>;

    /**
     * Check provider health
     */
    checkHealth(): Promise<boolean>;
}
