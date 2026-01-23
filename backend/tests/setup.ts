
import { vi, beforeAll } from 'vitest';
import 'reflect-metadata';
import { container } from 'tsyringe';

// Mock AgentDispatcher
const mockAgentDispatcher = {
    dispatch: vi.fn(),
    registerAgent: vi.fn(),
    getAgent: vi.fn(),
};

beforeAll(() => {
    // Register mock AgentDispatcher in the container
    if (!container.isRegistered('AgentDispatcher')) {
        container.registerInstance('AgentDispatcher', mockAgentDispatcher);
    }
});
