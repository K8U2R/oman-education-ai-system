/**
 * Real-time Notification Service - خدمة الإشعارات الفورية
 * 
 * Sends real-time notifications via Socket.IO
 */

import { injectable } from 'tsyringe';
import { SocketIOServer } from '@/infrastructure/websocket/socket.server.js';
import { logger } from '@/shared/utils/logger.js';
import crypto from 'crypto';

export interface Notification {
    id: string;
    userId: string;
    type: 'success' | 'info' | 'warning' | 'error';
    title: string;
    message: string;
    data?: any;
    timestamp: Date;
    read?: boolean;
}

@injectable()
export class RealtimeNotificationService {
    /**
     * Send notification to specific user
     */
    async sendToUser(userId: string, notification: Omit<Notification, 'id' | 'timestamp'>): Promise<void> {
        try {
            const io = SocketIOServer.getInstance().getIO();
            const ns = io.of('/notifications');

            const fullNotification: Notification = {
                ...notification,
                id: crypto.randomUUID(),
                timestamp: new Date(),
                read: false
            };

            // Emit to user's private room
            ns.to(`user:${userId}`).emit('notification', fullNotification);

            logger.info(`📬 Notification sent to user ${userId}: ${notification.title}`);
        } catch (error) {
            logger.error('Failed to send notification:', error);
        }
    }

    /**
     * Broadcast to all users with specific role
     */
    async broadcastToRole(role: string, notification: Omit<Notification, 'id' | 'userId' | 'timestamp'>): Promise<void> {
        try {
            const io = SocketIOServer.getInstance().getIO();
            const ns = io.of('/notifications');

            const fullNotification: Omit<Notification, 'userId'> = {
                ...notification,
                id: crypto.randomUUID(),
                timestamp: new Date(),
                read: false
            };

            // Get all connected sockets
            const sockets = await ns.fetchSockets();

            // Filter by role and emit
            let sentCount = 0;
            for (const socket of sockets) {
                if (socket.data.user.role === role) {
                    socket.emit('notification', {
                        ...fullNotification,
                        userId: socket.data.user.id
                    });
                    sentCount++;
                }
            }

            logger.info(`📢 Broadcast to role '${role}': ${sentCount} users`);
        } catch (error) {
            logger.error('Failed to broadcast to role:', error);
        }
    }

    /**
     * Broadcast to all connected users
     */
    async broadcastToAll(notification: Omit<Notification, 'id' | 'userId' | 'timestamp'>): Promise<void> {
        try {
            const io = SocketIOServer.getInstance().getIO();
            const ns = io.of('/notifications');

            const sockets = await ns.fetchSockets();

            const sentCount = sockets.length;

            // Send to each user individually with their userId
            for (const socket of sockets) {
                socket.emit('notification', {
                    ...notification,
                    id: crypto.randomUUID(),
                    userId: socket.data.user.id,
                    timestamp: new Date(),
                    read: false
                });
            }

            logger.info(`📢 Broadcast to all: ${sentCount} users`);
        } catch (error) {
            logger.error('Failed to broadcast to all:', error);
        }
    }

    /**
     * Send notification to multiple users
     */
    async sendToUsers(userIds: string[], notification: Omit<Notification, 'id' | 'userId' | 'timestamp'>): Promise<void> {
        try {
            const promises = userIds.map(userId =>
                this.sendToUser(userId, { ...notification, userId })
            );

            await Promise.all(promises);
            logger.info(`📬 Notification sent to ${userIds.length} users`);
        } catch (error) {
            logger.error('Failed to send to multiple users:', error);
        }
    }
}
