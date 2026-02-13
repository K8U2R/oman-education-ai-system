/**
 * Socket.IO Configuration - إعدادات Socket.IO
 * 
 * CORS, transport, and connection settings
 */

export const socketConfig = {
    cors: {
        origin: process.env.VITE_APP_URL || 'http://localhost:5173',
        credentials: true,
        methods: ['GET', 'POST']
    },
    // WebSocket first, then fallback to polling
    transports: ['websocket', 'polling'] as const,

    // Connection timeouts
    pingTimeout: 60000,      // 60 seconds
    pingInterval: 25000,     // 25 seconds (heartbeat)
    upgradeTimeout: 30000,   // 30 seconds

    // Buffer limits
    maxHttpBufferSize: 1e6,  // 1MB max message size

    // Disable Engine.IO v3 (use v4 only)
    allowEIO3: false,

    // Connection state recovery
    connectionStateRecovery: {
        maxDisconnectionDuration: 2 * 60 * 1000, // 2 minutes
        skipMiddlewares: false
    }
};
