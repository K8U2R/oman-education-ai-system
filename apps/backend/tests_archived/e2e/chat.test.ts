import { describe, it, expect, beforeAll } from 'vitest';
import request from 'supertest';
import express from 'express';
// Removed static import to prevent premature initialization
// import { chatRoutes } from '@/interfaces/chat/chat.routes';

// Mock AI Provider
class MockAIProvider {
    async chatCompletion(_options: any): Promise<any> {
        return {
            content: JSON.stringify({
                explanation: "This is a mock explanation from the AI Kernel testing harness.",
                examples: ["Mock Example 1", "Mock Example 2"],
                interactiveQuestion: {
                    question: "Did this test pass?",
                    options: ["Yes", "No"],
                    answerHint: "Yes"
                },
                mediaRecommendation: "none",
                relatedConcepts: ["Testing", "Automation"]
            })
        };
    }

    // Stub other methods if interface requires them
    async generateEmbedding(_text: string): Promise<number[]> { return []; }
}

let app: express.Application;

beforeAll(async () => {
    // 1. Inject Mock Provider into Global Scope (Dependency Injection)
    (globalThis as any).aiProvider = new MockAIProvider();

    // 1b. Mock Container Dependencies required by ChatController/Routes
    const { container } = await import('@/infrastructure/di/Container');

    // Register Mock AgentDispatcher if not present
    // Register Mock AgentDispatcher (force overwrite if possible, or just register)
    try {
        // Attempt to unregister if exists (pseudo-code, depends on implementation)
        // container.remove("AgentDispatcher"); 
    } catch (e) { }

    // Force register/overwrite
    if (container.isRegistered("AgentDispatcher")) {
        // If we can't unregister, we might have to rely on the fact it's already registered.
        // But if it IS registered and it's the REAL one, we are in trouble.
        // We really want to replace it.
        // Let's assume register overwrites or we can access the internal map.
        // Safe bet: The previous check was preventing us from overwriting the REAL one if it was loaded.
        // But we WANT to overwrite.
        // So we should try to register regardless, or handle the error.

        // Actually, let's see why it would be registered. `chat.routes` imports it?
        // Detailed plan: Remove the `if` and let it register.
    }

    // Better approach: mock the dependency before importing routes?
    // We are already doing that.

    container.register("AgentDispatcher", () => ({
        dispatch: async (_msg: any, context: any) => ({
            response: {
                explanation: "Mock Dispatcher Response",
                examples: ["Mock Example 1"],
                interactiveQuestion: { question: "Q?", options: ["A"] },
                relatedConcepts: ["C1"]
            },
            updatedContext: context
        })
    }) as any, "singleton");

    // 2. Dynamic Import of Routes (Crucial! This runs AFTER the mock is set)
    // Corrected path from @/interfaces/chat/chat.routes to @/presentation/api/routes...
    const { chatRoutes } = await import('@/presentation/api/routes/features/ai/chat/chat.routes');

    // 3. Setup App
    app = express();
    app.use(express.json());
    app.use('/api/v1/interact', chatRoutes);
});

describe('Chat API E2E Flow', () => {
    it('should process an educational request and return an explanation', async () => {
        const payload = {
            message: 'اشرح لي مفهوم المتغيرات في بايثون',
            userId: '123e4567-e89b-12d3-a456-426614174000',
            sessionId: '987fcdeb-51a2-43d7-9012-345678901234',
            context: {
                proficiencyLevel: 3,
                currentSubject: 'python'
            }
        };

        const response = await request(app)
            .post('/api/v1/interact')
            .send(payload);

        // Debug output if failed
        if (response.status !== 200) {
            console.error('Test Failed Response:', response.body);
        }

        expect(response.status).toBe(200);
        expect(response.body.success).toBe(true);
        expect(response.body.data).toBeDefined();

        // specific checks for Educator structure
        const educatorResponse = response.body.data;
        expect(educatorResponse).toHaveProperty('explanation');
        expect(educatorResponse).toHaveProperty('examples');

        // ensure AI generated some text (or fallback text)
        expect(typeof educatorResponse.explanation).toBe('string');
        expect(educatorResponse.explanation.length).toBeGreaterThan(10);
    });

    it('should handle invalid input gracefully', async () => {
        const response = await request(app)
            .post('/api/v1/interact')
            .send({ message: '' }); // Invalid: empty message

        expect(response.status).toBe(400);
        expect(response.body.success).toBe(false);
    });
});
