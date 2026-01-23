/**
 * Simulation Script for AI Kernel
 * This script bypasses the HTTP layer to test the core logic directly.
 */
import { AgentDispatcher } from './backend/src/core/ai-kernel/dispatcher/AgentDispatcher';
import { UserContext } from './backend/src/core/ai-kernel/types';

async function runSimulation() {
    console.log("🚀 Starting AI Kernel Simulation...\n");

    const dispatcher = new AgentDispatcher();

    // Mock User Context
    const context: UserContext = {
        userId: "user-123",
        sessionId: "sess-999",
        proficiencyLevel: 2, // Beginner/Intermediate
        currentSubject: "Computer Science"
    };

    // Test Case: Educational Request
    const userMessage = "اشرح لي مفهوم التكرار (Loops) في البرمجة مع مثال بسيط";

    console.log(`👤 User: ${userMessage}`);
    console.log(`📊 Context Level: ${context.proficiencyLevel}/5`);
    console.log("--------------------------------------------------");

    try {
        const result = await dispatcher.dispatch({
            text: userMessage,
            context: context,
            history: []
        });

        console.log("\n🤖 System Response (Educator Agent):");
        console.log(JSON.stringify(result.response, null, 2));

        console.log("\n--------------------------------------------------");
        console.log("🧠 Updated Context:");
        console.log(`Last Intent: ${result.updatedContext.lastIntent}`);
        console.log(`Last Topic: ${result.updatedContext.lastTopic}`);

    } catch (error) {
        console.error("❌ Simulation Failed:", error);
    }
}

// Run (needs ts-node or similar, but for now we write it to verify logic structure)
// In a real environment we would execute this via: tsx scripts/simulate_ai.ts
console.log("Simulation script prepared.");
