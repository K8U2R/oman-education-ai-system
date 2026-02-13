/**
 * Notifications Namespace - مساحة الإشعارات
 * 
 * Handles real-time user notifications
 */

import type { Namespace, Socket } from 'socket.io';
import { logger } from '@/shared/utils/logger.js';

interface NotificationEvent {
    id: string;
    type: 'success' | 'info' | 'warning' | 'error';
    title: string;
    message: string;
    data?: any;
}

export function setupNotificationsNamespace(ns: Namespace): void {
    ns.on('connection', (socket: Socket) => {
        const userId = socket.data.user.id;
        const userRoom = `user:${userId}`;

        // Join user's private notification room
        socket.join(userRoom);
        logger.info(`📬 User ${userId} joined notifications namespace`);

        // Send connection confirmation
        socket.emit('connected', {
            message: 'Connected to notifications',
            userId,
            timestamp: new Date()
        });

        // Handle notification read event
        socket.on('notification:read', (notificationId: string) => {
            logger.info(`User ${userId} read notification: ${notificationId}`);

            // Acknowledge
            socket.emit('notification:read:ack', {
                notificationId,
                timestamp: new Date()
            });
        });

        // Handle mark all as read
        socket.on('notifications:read:all', () => {
            logger.info(`User ${userId} marked all notifications as read`);

            socket.emit('notifications:read:all:ack', {
                timestamp: new Date()
            });
        });

        // Handle clear notification
        socket.on('notification:clear', (notificationId: string) => {
            logger.info(`User ${userId} cleared notification: ${notificationId}`);

            socket.emit('notification:clear:ack', {
                notificationId,
                timestamp: new Date()
            });
        });

        // Disconnect handler
        socket.on('disconnect', (reason) => {
            logger.info(`📭 User ${userId} disconnected from notifications: ${reason}`);
        });

        // Error handler
        socket.on('error', (error) => {
            logger.error(`❌ Notification socket error for user ${userId}:`, error);
        });
    });
}
