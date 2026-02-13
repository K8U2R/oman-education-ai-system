/**
 * Socket.IO Authentication Middleware - وسيط مصادقة Socket.IO
 * 
 * JWT-based authentication for WebSocket connections
 */

import type { Socket } from 'socket.io';
import { verifyToken } from '../../security/jwt/jwt.service.js';
import { logger } from '../../../shared/utils/logger.js';

interface SocketData {
    user: {
        id: string;
        email: string;
        role: string;
        tier: string;
    };
}

/**
 * Authenticate WebSocket connection using JWT
 */
export const socketAuthMiddleware = async (
    socket: Socket<any, any, any, SocketData>,
    next: (err?: Error) => void
): Promise<void> => {
    try {
        // Extract token from handshake
        const token = socket.handshake.auth.token ||
            socket.handshake.headers.authorization?.replace('Bearer ', '');

        if (!token) {
            logger.warn('WebSocket connection attempt without token');
            return next(new Error('Authentication token required'));
        }

        // Verify JWT token
        const decoded = await verifyToken(token);

        // Ensure it's an access token
        if (decoded.type !== 'access') {
            logger.warn(`Invalid token type for WebSocket: ${decoded.type}`);
            return next(new Error('Invalid token type - access token required'));
        }

        // Attach user data to socket
        socket.data.user = {
            id: decoded.userId,
            email: decoded.email,
            role: decoded.role || 'user',
            tier: decoded.tier || 'FREE'
        };

        logger.info(`✅ WebSocket authenticated: User ${decoded.userId}`);
        next();
    } catch (error) {
        logger.error('WebSocket authentication failed:', error);
        next(new Error('Authentication failed'));
    }
};
