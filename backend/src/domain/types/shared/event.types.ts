/**
 * Event Types - أنواع الأحداث
 *
 * أنواع موحدة لنظام الأحداث (Event System)
 */

import type { Metadata, BaseEntity } from "./common.types";

/**
 * Event Type - نوع الحدث
 *
 * أنواع الأحداث المختلفة في النظام
 */
export type EventType =
  | "user.created"
  | "user.updated"
  | "user.deleted"
  | "user.login"
  | "user.logout"
  | "lesson.created"
  | "lesson.updated"
  | "lesson.deleted"
  | "project.created"
  | "project.updated"
  | "project.completed"
  | "assessment.submitted"
  | "assessment.graded"
  | "notification.sent"
  | "notification.read"
  | "file.uploaded"
  | "file.deleted"
  | "system.error"
  | "system.warning"
  | string; // للسماح بأحداث مخصصة

/**
 * Event Priority - أولوية الحدث
 */
export type EventPriority = "low" | "normal" | "high" | "critical";

/**
 * Event Status - حالة الحدث
 */
export type EventStatus =
  | "pending"
  | "processing"
  | "completed"
  | "failed"
  | "cancelled";

/**
 * Event - حدث
 *
 * بنية موحدة للأحداث
 */
export interface Event<T = unknown> extends BaseEntity {
  type: EventType;
  payload: T;
  priority: EventPriority;
  status: EventStatus;
  source: string;
  userId?: string;
  correlationId?: string;
  parentEventId?: string;
  metadata?: Metadata;
  retryCount?: number;
  maxRetries?: number;
  scheduledAt?: string;
  processedAt?: string;
  error?: string;
}

/**
 * Event Handler - معالج الحدث
 *
 * دالة لمعالجة حدث
 */
export type EventHandler<T = unknown> = (
  event: Event<T>,
) => Promise<void> | void;

/**
 * Event Listener - مستمع الحدث
 *
 * مستمع للأحداث
 */
export interface EventListener<T = unknown> {
  eventType: EventType | EventType[];
  handler: EventHandler<T>;
  priority?: number;
  once?: boolean;
  filter?: (event: Event<T>) => boolean;
}

/**
 * Event Emitter - باعث الحدث
 *
 * واجهة لإرسال الأحداث
 */
export interface IEventEmitter {
  emit<T = unknown>(
    type: EventType,
    payload: T,
    options?: EventEmitOptions,
  ): Promise<void>;
  on<T = unknown>(listener: EventListener<T>): void;
  off<T = unknown>(listener: EventListener<T>): void;
  once<T = unknown>(type: EventType, handler: EventHandler<T>): void;
  removeAllListeners(type?: EventType): void;
}

/**
 * Event Emit Options - خيارات إرسال الحدث
 */
export interface EventEmitOptions {
  priority?: EventPriority;
  delay?: number; // milliseconds
  scheduledAt?: string;
  correlationId?: string;
  parentEventId?: string;
  metadata?: Metadata;
  retryable?: boolean;
  maxRetries?: number;
}

/**
 * Event Subscription - اشتراك في الأحداث
 */
export interface EventSubscription {
  id: string;
  eventType: EventType | EventType[];
  handler: EventHandler;
  createdAt: string;
  active: boolean;
  filter?: (event: Event) => boolean;
}

/**
 * Event Queue - قائمة انتظار الأحداث
 */
export interface EventQueue {
  id: string;
  name: string;
  events: Event[];
  maxSize?: number;
  processing: boolean;
  createdAt: string;
}

/**
 * Event Statistics - إحصائيات الأحداث
 */
export interface EventStatistics {
  totalEvents: number;
  byType: Record<EventType, number>;
  byStatus: Record<EventStatus, number>;
  byPriority: Record<EventPriority, number>;
  averageProcessingTime: number;
  failedEvents: number;
  retriedEvents: number;
}

/**
 * Event Middleware - وسيط الأحداث
 *
 * دالة للتحكم في تدفق الأحداث
 */
export type EventMiddleware<T = unknown> = (
  event: Event<T>,
  next: () => Promise<void>,
) => Promise<void>;

/**
 * Event Store - مخزن الأحداث
 *
 * واجهة لتخزين الأحداث
 */
export interface IEventStore {
  save(event: Event): Promise<void>;
  findById(id: string): Promise<Event | null>;
  findByType(type: EventType, limit?: number): Promise<Event[]>;
  findByStatus(status: EventStatus, limit?: number): Promise<Event[]>;
  delete(id: string): Promise<boolean>;
  count(conditions?: EventQueryConditions): Promise<number>;
}

/**
 * Event Query Conditions - شروط استعلام الأحداث
 */
export interface EventQueryConditions {
  type?: EventType | EventType[];
  status?: EventStatus | EventStatus[];
  priority?: EventPriority | EventPriority[];
  userId?: string;
  source?: string;
  startDate?: string;
  endDate?: string;
  correlationId?: string;
}

/**
 * Event Replay Options - خيارات إعادة تشغيل الأحداث
 */
export interface EventReplayOptions {
  fromDate?: string;
  toDate?: string;
  eventTypes?: EventType[];
  filter?: (event: Event) => boolean;
  limit?: number;
}

/**
 * Event Bus - حافلة الأحداث
 *
 * واجهة لإدارة الأحداث
 */
export interface IEventBus extends IEventEmitter {
  subscribe(listener: EventListener): string;
  unsubscribe(subscriptionId: string): boolean;
  publish<T = unknown>(event: Event<T>): Promise<void>;
  replay(options?: EventReplayOptions): Promise<void>;
  getStatistics(): Promise<EventStatistics>;
}
