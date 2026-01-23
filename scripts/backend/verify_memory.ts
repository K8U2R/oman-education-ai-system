
import { container } from '../../backend/src/infrastructure/di/Container';
import { AgentDispatcher } from '../../backend/src/core/ai-kernel/dispatcher/AgentDispatcher';
import { bootstrap } from '../../backend/src/bootstrap';
import { logger } from '../../backend/src/shared/utils/logger';

async function runSimulation() {
    console.log("🚀 Starting Sovereign Memory Simulation...");

    // 1. Bootstrap System (DI, Config)
    await bootstrap();

    // 2. Resolve Dispatcher
    const dispatcher = container.resolve<AgentDispatcher>("AgentDispatcher");

    // 3. User Context
    const userId = "test-simulation-user";
    const context = {
        userId: userId,
        sessionId: "sim-session-01",
        proficiencyLevel: 3,
        currentSubject: "Programming"
    };

    // 4. Interaction 1: Teach me Python
    // Expectation: Agent explains Python
    console.log("\n\n🗣️  User Turn 1: 'Teach me Python variables'");
    const response1 = await dispatcher.dispatch({
        text: "Teach me about Python variables",
        context: context,
        onToken: (t) => process.stdout.write(t) // Simulate stream
    });

    // 5. Interaction 2: Give me an example
    // Expectation: Agent gives a PYTHON variable example (using context from Turn 1)
    console.log("\n\n🗣️  User Turn 2: 'Give me a code example'");
    const response2 = await dispatcher.dispatch({
        text: "Give me a code example",
        context: context,
        onToken: (t) => process.stdout.write(t)
    });

    console.log("\n\n✅ Simulation Complete.");
}

runSimulation().catch(err => console.error(err));
