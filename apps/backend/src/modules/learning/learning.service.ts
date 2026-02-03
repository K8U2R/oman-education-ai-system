
import { PrismaClient } from '@prisma/client';
import { OpenAIService } from './openai.service.js';

export class LearningService {
    private prisma: PrismaClient;
    private ai: OpenAIService;

    constructor() {
        this.prisma = new PrismaClient();
        this.ai = new OpenAIService();
    }

    async getCourses(_userTier: string) {
        // Law 14: Filter courses based on Tier logic if needed, 
        // but for now listing all public courses
        return this.prisma.courses.findMany({
            where: { is_published: true },
            include: { modules: { include: { lessons: true } } }
        });
    }

    async getLesson(lessonId: string) {
        return this.prisma.lessons.findUnique({
            where: { id: lessonId }
        });
    }

    async askTutor(userId: string, threadId: string | null, message: string, context: string = '') {
        // 1. Manage Thread
        let currentThreadId = threadId;
        if (!currentThreadId) {
            const thread = await this.prisma.conversation_threads.create({
                data: {
                    user_id: userId,
                    title: message.substring(0, 50) + '...',
                    context: { topic: context }
                }
            });
            currentThreadId = thread.id;
        }

        // 2. Save User Message
        await this.prisma.chat_messages.create({
            data: {
                thread_id: currentThreadId,
                role: 'user',
                content: message
            }
        });

        // 3. Generate AI Response
        // Load history? For MVP, just Context + Message
        const aiResponse = await this.ai.generateResponse(userId, context, message);

        // 4. Save AI Response
        await this.prisma.chat_messages.create({
            data: {
                thread_id: currentThreadId,
                role: 'assistant',
                content: aiResponse
            }
        });

        return {
            threadId: currentThreadId,
            response: aiResponse
        };
    }
}
