/**
 * Collaboration Namespace - مساحة التعاون
 * 
 * Handles real-time collaboration features (document editing, presence, cursors)
 */

import type { Namespace, Socket } from 'socket.io';
import { logger } from '@/shared/utils/logger.js';

interface RoomPresence {
    [roomId: string]: Set<string>;
}

// Track user presence in collaboration rooms
const roomPresence: RoomPresence = {};

export function setupCollaborationNamespace(ns: Namespace): void {
    ns.on('connection', (socket: Socket) => {
        const userId = socket.data.user.id;
        const userEmail = socket.data.user.email;

        logger.info(`🤝 User ${userId} connected to collaboration namespace`);

        // Join room event
        socket.on('join-room', (roomId: string) => {
            socket.join(`room:${roomId}`);

            // Initialize presence tracking
            if (!roomPresence[roomId]) {
                roomPresence[roomId] = new Set();
            }
            roomPresence[roomId].add(userId);

            logger.info(`User ${userId} joined room ${roomId}`);

            // Notify others in the room
            socket.to(`room:${roomId}`).emit('user:join', {
                userId,
                email: userEmail,
                timestamp: new Date()
            });

            // Send current participants to joining user
            socket.emit('room:participants', {
                roomId,
                count: roomPresence[roomId].size,
                users: Array.from(roomPresence[roomId]),
                timestamp: new Date()
            });
        });

        // Leave room event
        socket.on('leave-room', (roomId: string) => {
            socket.leave(`room:${roomId}`);

            if (roomPresence[roomId]) {
                roomPresence[roomId].delete(userId);

                // Clean up empty rooms
                if (roomPresence[roomId].size === 0) {
                    delete roomPresence[roomId];
                }
            }

            logger.info(`User ${userId} left room ${roomId}`);

            // Notify others
            socket.to(`room:${roomId}`).emit('user:leave', {
                userId,
                timestamp: new Date()
            });
        });

        // Cursor movement
        socket.on('cursor:move', ({ roomId, position }) => {
            socket.to(`room:${roomId}`).emit('cursor:update', {
                userId,
                position,
                timestamp: new Date()
            });
        });

        // Text/content changes
        socket.on('content:change', ({ roomId, changes }) => {
            socket.to(`room:${roomId}`).emit('content:changed', {
                userId,
                changes,
                timestamp: new Date()
            });
        });

        // Selection changes
        socket.on('selection:change', ({ roomId, selection }) => {
            socket.to(`room:${roomId}`).emit('selection:changed', {
                userId,
                selection,
                timestamp: new Date()
            });
        });

        // Typing indicator
        socket.on('typing:start', ({ roomId }) => {
            socket.to(`room:${roomId}`).emit('user:typing', {
                userId,
                typing: true,
                timestamp: new Date()
            });
        });

        socket.on('typing:stop', ({ roomId }) => {
            socket.to(`room:${roomId}`).emit('user:typing', {
                userId,
                typing: false,
                timestamp: new Date()
            });
        });

        // Disconnect handler - clean up all rooms
        socket.on('disconnect', (reason) => {
            logger.info(`User ${userId} disconnected from collaboration: ${reason}`);

            // Remove from all rooms
            for (const roomId in roomPresence) {
                if (roomPresence[roomId].has(userId)) {
                    roomPresence[roomId].delete(userId);

                    // Notify room
                    socket.to(`room:${roomId}`).emit('user:leave', {
                        userId,
                        timestamp: new Date()
                    });

                    // Clean up empty rooms
                    if (roomPresence[roomId].size === 0) {
                        delete roomPresence[roomId];
                    }
                }
            }
        });

        // Error handler
        socket.on('error', (error) => {
            logger.error(`❌ Collaboration socket error for user ${userId}:`, error);
        });
    });
}
