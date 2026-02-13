/**
 * Socket.IO Server - خادم Socket.IO
 * 
 * Main WebSocket server with Redis adapter for horizontal scaling
 */

import { Server } from 'socket.io';
import type { Server as HttpServer } from 'http';
import { createAdapter } from '@socket.io/redis-adapter';
import { RedisClient } from '@/infrastructure/cache/redis.client.js';
import { socketConfig } from './socket.config.js';
import { socketAuthMiddleware } from './middleware/auth.middleware.js';
import { setupNotificationsNamespace } from './namespaces/notifications.namespace.js';
import { setupCollaborationNamespace } from './namespaces/collaboration.namespace.js';
import { logger } from '@/shared/utils/logger.js';

export class SocketIOServer {
    private static instance: SocketIOServer;
    private io: Server;

    private constructor(httpServer: HttpServer) {
        logger.info('🚀 Initializing Socket.IO server...');

        this.io = new Server(httpServer, socketConfig);

        this.setupRedisAdapter();
        this.setupMiddleware();
        this.setupNamespaces();

        logger.info('✅ Socket.IO server initialized');
    }

    public static getInstance(httpServer?: HttpServer): SocketIOServer {
        if (!SocketIOServer.instance && httpServer) {
            SocketIOServer.instance = new SocketIOServer(httpServer);
        }
        return SocketIOServer.instance;
    }

    /**
     * Configure Redis adapter for multi-instance scaling
     */
    private async setupRedisAdapter(): Promise<void> {
        try {
            const redisClient = RedisClient.getInstance();
            const pubClient = redisClient.getClient();

            // Create duplicate client for subscribing
            const subClient = pubClient.duplicate();
            await subClient.connect();

            // Set Redis adapter
            this.io.adapter(createAdapter(pubClient, subClient));

            logger.info('✅ Socket.IO Redis Adapter configured');
        } catch (error) {
            logger.error('❌ Failed to setup Redis adapter:', error);
            logger.warn('⚠️ Socket.IO running without Redis adapter (single instance only)');
        }
    }

    /**
     * Setup global middleware
     */
    private setupMiddleware(): void {
        // JWT Authentication
        this.io.use(socketAuthMiddleware);

        // Connection logging
        this.io.use((socket, next) => {
            logger.info(`New connection attempt: ${socket.id}`);
            next();
        });
    }

    /**
     * Setup namespaces
     */
    private setupNamespaces(): void {
        // Notifications namespace
        const notificationsNs = this.io.of('/notifications');
        setupNotificationsNamespace(notificationsNs);
        logger.info('📬 Notifications namespace configured');

        // Collaboration namespace
        const collaborationNs = this.io.of('/collaboration');
        setupCollaborationNamespace(collaborationNs);
        logger.info('🤝 Collaboration namespace configured');

        // Default namespace (root)
        this.io.on('connection', (socket) => {
            logger.info(`✅ Client connected to root namespace: ${socket.id}`);

            socket.on('disconnect', (reason) => {
                logger.info(`❌ Client disconnected from root: ${socket.id}, reason: ${reason}`);
            });
        });
    }

    /**
     * Get Socket.IO server instance
     */
    public getIO(): Server {
        return this.io;
    }

    /**
     * Get specific namespace
     */
    public getNamespace(name: string) {
        return this.io.of(name);
    }
}
