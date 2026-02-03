/**
 * Job Types - أنواع المهام
 *
 * أنواع موحدة للـ Background Jobs و Scheduled Tasks
 */

import type { BaseEntity, Metadata } from "./common.types";

/**
 * Job Type - نوع المهمة
 */
export type JobType =
  | "email"
  | "notification"
  | "report"
  | "backup"
  | "cleanup"
  | "sync"
  | "export"
  | "import"
  | "processing"
  | "webhook"
  | string; // للسماح بمهام مخصصة

/**
 * Job Status - حالة المهمة
 */
export type JobStatus =
  | "pending"
  | "queued"
  | "running"
  | "completed"
  | "failed"
  | "cancelled"
  | "retrying";

/**
 * Job Priority - أولوية المهمة
 */
export type JobPriority = "low" | "normal" | "high" | "critical";

/**
 * Job - مهمة
 *
 * بنية موحدة للمهام
 */
export interface Job<T = unknown> extends BaseEntity {
  type: JobType;
  name: string;
  payload: T;
  status: JobStatus;
  priority: JobPriority;
  attempts: number;
  maxAttempts: number;
  runAt?: string; // للـ scheduled jobs
  startedAt?: string;
  completedAt?: string;
  failedAt?: string;
  error?: string;
  result?: unknown;
  progress?: number; // 0-100
  metadata?: Metadata;
  userId?: string;
  parentJobId?: string;
  retryDelay?: number; // milliseconds
}

/**
 * Job Queue - قائمة انتظار المهام
 */
export interface JobQueue {
  id: string;
  name: string;
  jobs: Job[];
  maxConcurrency: number;
  processing: boolean;
  createdAt: string;
}

/**
 * Scheduled Task - مهمة مجدولة
 *
 * مهمة يتم تشغيلها في أوقات محددة
 */
export interface ScheduledTask extends BaseEntity {
  name: string;
  description?: string;
  jobType: JobType;
  schedule: SchedulePattern;
  enabled: boolean;
  lastRunAt?: string;
  nextRunAt: string;
  runCount: number;
  successCount: number;
  failureCount: number;
  metadata?: Metadata;
}

/**
 * Schedule Pattern - نمط الجدولة
 *
 * أنماط مختلفة للجدولة
 */
export type SchedulePattern =
  | {
      type: "cron";
      expression: string; // Cron expression
    }
  | {
      type: "interval";
      value: number;
      unit: "seconds" | "minutes" | "hours" | "days" | "weeks" | "months";
    }
  | {
      type: "once";
      date: string; // ISO date string
    }
  | {
      type: "daily";
      time: string; // HH:mm format
      timezone?: string;
    }
  | {
      type: "weekly";
      dayOfWeek: number; // 0-6 (Sunday-Saturday)
      time: string;
      timezone?: string;
    }
  | {
      type: "monthly";
      day: number; // 1-31
      time: string;
      timezone?: string;
    };

/**
 * Job Handler - معالج المهمة
 *
 * دالة لمعالجة مهمة
 */
export type JobHandler<T = unknown> = (job: Job<T>) => Promise<unknown>;

/**
 * Job Options - خيارات المهمة
 */
export interface JobOptions {
  priority?: JobPriority;
  delay?: number; // milliseconds
  attempts?: number;
  backoff?: {
    type: "fixed" | "exponential";
    delay: number;
  };
  timeout?: number; // milliseconds
  removeOnComplete?: boolean;
  removeOnFail?: boolean;
  metadata?: Metadata;
}

/**
 * Job Statistics - إحصائيات المهام
 */
export interface JobStatistics {
  total: number;
  byStatus: Record<JobStatus, number>;
  byType: Record<JobType, number>;
  byPriority: Record<JobPriority, number>;
  averageProcessingTime: number;
  successRate: number;
  failureRate: number;
  queueSize: number;
}

/**
 * Job Queue Interface - واجهة قائمة انتظار المهام
 */
export interface IJobQueue {
  add<T = unknown>(
    type: JobType,
    payload: T,
    options?: JobOptions,
  ): Promise<Job<T>>;
  process<T = unknown>(type: JobType, handler: JobHandler<T>): void;
  getJob<T = unknown>(jobId: string): Promise<Job<T> | null>;
  getJobs(status?: JobStatus, limit?: number): Promise<Job[]>;
  remove(jobId: string): Promise<boolean>;
  retry(jobId: string): Promise<boolean>;
  cancel(jobId: string): Promise<boolean>;
  getStatistics(): Promise<JobStatistics>;
  pause(): Promise<void>;
  resume(): Promise<void>;
  clean(grace: number, limit: number, status?: JobStatus): Promise<number>;
}

/**
 * Scheduler Interface - واجهة المجدول
 */
export interface IScheduler {
  schedule(task: ScheduledTask): Promise<string>;
  unschedule(taskId: string): Promise<boolean>;
  getTask(taskId: string): Promise<ScheduledTask | null>;
  getTasks(enabled?: boolean): Promise<ScheduledTask[]>;
  enable(taskId: string): Promise<boolean>;
  disable(taskId: string): Promise<boolean>;
  runNow(taskId: string): Promise<boolean>;
  getNextRunTime(pattern: SchedulePattern, fromDate?: Date): Date;
}

/**
 * Job Progress - تقدم المهمة
 */
export interface JobProgress {
  jobId: string;
  progress: number; // 0-100
  message?: string;
  data?: unknown;
  timestamp: string;
}

/**
 * Job Result - نتيجة المهمة
 */
export interface JobResult<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  executionTime: number; // milliseconds
  metadata?: Metadata;
}
