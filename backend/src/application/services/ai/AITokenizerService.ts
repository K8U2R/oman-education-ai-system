export class AITokenizerService {
    analyze(_text: string, _options?: any): any {
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
