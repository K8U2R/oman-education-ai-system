
import OpenAI from 'openai';
// import { PrismaClient } from '@prisma/client';

export class OpenAIService {
    private openai: OpenAI;

    constructor() {
        this.openai = new OpenAI({
            apiKey: process.env.OPENAI_API_KEY,
        });
    }

    async generateResponse(_userId: string, context: string, userMessage: string): Promise<string> {
        // 1. Retrieve or create conversation thread logic could go here
        // For now, simpler stateless verification

        try {
            const completion = await this.openai.chat.completions.create({
                messages: [
                    { role: 'system', content: `You are an AI Tutor for the Oman Education AI System. Context: ${context}` },
                    { role: 'user', content: userMessage }
                ],
                model: 'gpt-4-turbo-preview', // High intelligence model for education
            });

            return completion.choices[0].message.content || "I'm not sure how to answer that.";
        } catch (error) {
            console.error('OpenAI Error:', error);
            return "I'm having trouble connecting to my brain right now. Please try again later.";
        }
    }
}
