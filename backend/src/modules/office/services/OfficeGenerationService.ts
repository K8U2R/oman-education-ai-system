import { IAIProvider } from "@/domain/interfaces/ai/IAIProvider.js";
import { container } from "@/infrastructure/di/Container.js";

export class OfficeGenerationService {
    private aiProvider: IAIProvider;

    constructor() {
        this.aiProvider = container.resolve<IAIProvider>("IAIProvider");
    }

    async generateOffice(input: any, _userId?: string): Promise<any> {
        // 1. Generate Content Structure via AI
        const prompt = `Generate structure for a ${input.type || 'document'} about: ${input.topic}. Return JSON with sections and content.`;
        const content = await this.aiProvider.generateJson(prompt, { type: "object" });

        // 2. (Future) Pass content to Docx/PPTX Generator Adapter
        // For strict implementation without external libs installed yet, we return the structured content 
        // which represents the "Office Document Model" ready for serialization.

        return {
            success: true,
            documentType: input.type,
            contentModel: content,
            url: "pending-file-generation-adapter"
        };
    }

    async getTemplates(_type: string): Promise<any[]> {
        return [];
    }
}
