export interface TokenizerOptions {
    model?: string;
    normalize?: boolean;
}

export interface AnalysisResult {
    tokens: number;
    cost: number;
    valid: boolean;
}

export class AITokenizerService {
    analyze(_text: string, _options?: TokenizerOptions): AnalysisResult {
        return {
            tokens: 0,
            cost: 0,
            valid: true
        };
    }
    async countTokens(text: string): Promise<number> {
        return text.length / 4; // Approx
    }
}
