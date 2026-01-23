/**
 * WebSocket Types - أنواع WebSocket
 *
 * أنواع موحدة لـ WebSocket Messages و Events
 */

import type { Metadata } from "./common.types";

/**
 * WebSocket Message Type - نوع رسالة WebSocket
 */
export type WebSocketMessageType =
  | "ping"
  | "pong"
  | "subscribe"
  | "unsubscribe"
  | "notification"
  | "update"
  | "error"
  | "auth"
  | "heartbeat"
  | string; // للسماح برسائل مخصصة

/**
 * WebSocket Message - رسالة WebSocket
 *
 * بنية موحدة لرسائل WebSocket
 */
export interface WebSocketMessage<T = unknown> {
  type: WebSocketMessageType;
  payload?: T;
  timestamp: string;
  messageId?: string;
  correlationId?: string;
  userId?: string;
  metadata?: Metadata;
}

/**
 * WebSocket Connection Status - حالة اتصال WebSocket
 */
export type WebSocketConnectionStatus =
  | "connecting"
  | "connected"
  | "disconnected"
  | "error";

/**
 * WebSocket Connection - اتصال WebSocket
 */
export interface WebSocketConnection {
  id: string;
  userId?: string;
  status: WebSocketConnectionStatus;
  connectedAt: string;
  lastActivityAt: string;
  ipAddress?: string;
  userAgent?: string;
  subscriptions: string[];
  metadata?: Metadata;
}

/**
 * WebSocket Subscription - اشتراك WebSocket
 */
export interface WebSocketSubscription {
  id: string;
  connectionId: string;
  channel: string;
  filters?: Record<string, unknown>;
  createdAt: string;
  active: boolean;
}

/**
 * WebSocket Channel - قناة WebSocket
 */
export interface WebSocketChannel {
  name: string;
  description?: string;
  subscribers: string[]; // connection IDs
  messageHistory?: WebSocketMessage[];
  maxHistorySize?: number;
  requiresAuth?: boolean;
  requiredRoles?: string[];
}

/**
 * WebSocket Broadcast Options - خيارات البث WebSocket
 */
export interface WebSocketBroadcastOptions {
  channel?: string;
  excludeConnectionIds?: string[];
  includeConnectionIds?: string[];
  filters?: (connection: WebSocketConnection) => boolean;
  metadata?: Metadata;
}

/**
 * WebSocket Error - خطأ WebSocket
 */
export interface WebSocketError {
  code: string;
  message: string;
  details?: unknown;
  timestamp: string;
}

/**
 * WebSocket Heartbeat - نبضة WebSocket
 */
export interface WebSocketHeartbeat {
  timestamp: string;
  connectionId: string;
  latency?: number;
}

/**
 * WebSocket Statistics - إحصائيات WebSocket
 */
export interface WebSocketStatistics {
  totalConnections: number;
  activeConnections: number;
  totalMessages: number;
  messagesPerSecond: number;
  averageLatency: number;
  channels: number;
  subscriptions: number;
  errors: number;
}

/**
 * WebSocket Handler - معالج WebSocket
 *
 * دالة لمعالجة رسائل WebSocket
 */
export type WebSocketHandler<T = unknown> = (
  message: WebSocketMessage<T>,
  connection: WebSocketConnection,
) => Promise<void> | void;

/**
 * WebSocket Middleware - وسيط WebSocket
 *
 * دالة للتحكم في تدفق رسائل WebSocket
 */
export type WebSocketMiddleware = (
  message: WebSocketMessage,
  connection: WebSocketConnection,
  next: () => Promise<void>,
) => Promise<void>;

/**
 * WebSocket Server Interface - واجهة خادم WebSocket
 */
export interface IWebSocketServer {
  onConnection(handler: (connection: WebSocketConnection) => void): void;
  onDisconnection(handler: (connection: WebSocketConnection) => void): void;
  onMessage<T = unknown>(
    type: WebSocketMessageType,
    handler: WebSocketHandler<T>,
  ): void;
  send(connectionId: string, message: WebSocketMessage): Promise<boolean>;
  broadcast(
    message: WebSocketMessage,
    options?: WebSocketBroadcastOptions,
  ): Promise<number>;
  subscribe(
    connectionId: string,
    channel: string,
    filters?: Record<string, unknown>,
  ): Promise<boolean>;
  unsubscribe(connectionId: string, channel: string): Promise<boolean>;
  getConnection(connectionId: string): WebSocketConnection | null;
  getConnections(
    filters?: (connection: WebSocketConnection) => boolean,
  ): WebSocketConnection[];
  getStatistics(): WebSocketStatistics;
}
