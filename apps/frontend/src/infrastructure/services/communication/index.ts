/**
 * Communication Services - خدمات الاتصال
 *
 * تصدير جميع خدمات الاتصال في الوقت الفعلي
 */

export { WebSocketService } from './websocket.service'
export { SSEService } from './sse.service'
export type { WebSocketEvent, WebSocketEventType, WebSocketEventHandler } from './websocket.service'
export type { SSEEvent, SSEEventType, SSEEventHandler } from './sse.service'
