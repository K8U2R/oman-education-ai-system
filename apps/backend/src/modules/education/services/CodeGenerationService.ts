import { IAIProvider } from "@/domain/interfaces/ai/IAIProvider.js";
import { container } from "@/infrastructure/di/Container.js";

export class CodeGenerationService {
    private aiProvider: IAIProvider;

    constructor() {
        this.aiProvider = container.resolve<IAIProvider>("IAIProvider");
    }

    async generateCode(data: any): Promise<any> {
        const prompt = `Generate code for: ${JSON.stringify(data)}`;
        const result = await this.aiProvider.generateCode({
            prompt: prompt,
            language: data.language || 'typescript',
            framework: data.framework,
            context: data.context
        });
        return result;
    }

    async improveCode(data: any): Promise<any> {
        const prompt = `Improve this code: ${data.code}. 
        Focus on: ${data.improvement_type || 'general quality'}. 
        Specific issues: ${data.specific_issues?.join(', ') || 'none'}.`;

        const result = await this.aiProvider.generateCode({
            prompt: prompt,
            language: data.language,
        });

        return {
            code: result.code,
            improvementExplanation: result.explanation
        };
    }

    async explainCode(data: any): Promise<any> {
        const prompt = `Explain this code: ${data.code}. Detail level: ${data.detail_level || 'simple'}.`;
        const result = await this.aiProvider.generateText(prompt);
        return { explanation: result };
    }
}
