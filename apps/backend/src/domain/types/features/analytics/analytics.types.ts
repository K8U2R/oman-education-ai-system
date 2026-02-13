/**
 * Analytics Types - أنواع التحليلات
 *
 * أنواع موحدة للتحليلات والإحصائيات
 */

import type { BaseEntity, Metadata } from "../../shared/common.types.js";

/**
 * Analytics Metric Type - نوع مقياس التحليلات
 */
export type AnalyticsMetricType =
  | "count"
  | "sum"
  | "average"
  | "min"
  | "max"
  | "percentage"
  | "rate"
  | "trend";

/**
 * Analytics Dimension - بُعد التحليلات
 *
 * بُعد للتحليل (مثل: date, user, category)
 */
export type AnalyticsDimension =
  | "date"
  | "user"
  | "category"
  | "type"
  | "status"
  | string;

/**
 * Analytics Time Range - نطاق زمني للتحليلات
 */
export type AnalyticsTimeRange =
  | "today"
  | "yesterday"
  | "last_7_days"
  | "last_30_days"
  | "last_90_days"
  | "this_month"
  | "last_month"
  | "this_year"
  | "last_year"
  | "custom";

/**
 * Analytics Query - استعلام تحليلات
 */
export interface AnalyticsQuery {
  metrics: string[]; // أسماء المقاييس
  dimensions?: AnalyticsDimension[];
  filters?: Record<string, unknown>;
  timeRange?:
    | AnalyticsTimeRange
    | {
        start: string;
        end: string;
      };
  groupBy?: AnalyticsDimension[];
  orderBy?: {
    metric: string;
    direction: "asc" | "desc";
  };
  limit?: number;
}

/**
 * Analytics Metric - مقياس تحليلات
 */
export interface AnalyticsMetric {
  name: string;
  type: AnalyticsMetricType;
  value: number;
  unit?: string;
  label?: string;
  description?: string;
  trend?: {
    direction: "up" | "down" | "stable";
    percentage: number;
    value: number;
  };
}

/**
 * Analytics Dimension Value - قيمة بُعد
 */
export interface AnalyticsDimensionValue {
  dimension: AnalyticsDimension;
  value: string | number;
  label?: string;
  metrics: Record<string, number>;
}

/**
 * Analytics Result - نتيجة التحليلات
 */
export interface AnalyticsResult {
  metrics: AnalyticsMetric[];
  dimensions?: AnalyticsDimensionValue[];
  data: Array<Record<string, unknown>>;
  summary: Record<string, number>;
  timeRange: {
    start: string;
    end: string;
  };
  generatedAt: string;
  metadata?: Metadata;
}

/**
 * Analytics Dashboard - لوحة تحليلات
 */
export interface AnalyticsDashboard extends BaseEntity {
  name: string;
  description?: string;
  widgets: AnalyticsWidget[];
  layout: {
    columns: number;
    rows: number;
    widgetPositions: Array<{
      widgetId: string;
      x: number;
      y: number;
      width: number;
      height: number;
    }>;
  };
  isPublic: boolean;
  createdBy: string;
  metadata?: Metadata;
}

/**
 * Analytics Widget - عنصر تحليلات
 */
export interface AnalyticsWidget {
  id: string;
  type: "chart" | "metric" | "table" | "list" | "map";
  title: string;
  query: AnalyticsQuery;
  config?: {
    chartType?: "line" | "bar" | "pie" | "area" | "scatter";
    colors?: string[];
    showLegend?: boolean;
    showGrid?: boolean;
    xAxisLabel?: string;
    yAxisLabel?: string;
  };
  position: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
}

/**
 * Analytics Event - حدث تحليلات
 *
 * حدث يتم تتبعه للتحليلات
 */
export interface AnalyticsEvent extends BaseEntity {
  name: string;
  category?: string;
  action: string;
  label?: string;
  value?: number;
  userId?: string;
  sessionId?: string;
  properties?: Record<string, unknown>;
  timestamp: string;
  metadata?: Metadata;
}

/**
 * Analytics Funnel - قمع تحليلات
 *
 * لتحليل مسار المستخدم
 */
export interface AnalyticsFunnel {
  id: string;
  name: string;
  steps: Array<{
    name: string;
    event: string;
    filters?: Record<string, unknown>;
  }>;
  timeRange?: AnalyticsTimeRange;
  results?: {
    steps: Array<{
      name: string;
      count: number;
      percentage: number;
      dropOff: number;
    }>;
    totalConversions: number;
    conversionRate: number;
  };
}

/**
 * Analytics Cohort - مجموعة تحليلات
 *
 * لتحليل سلوك المجموعات
 */
export interface AnalyticsCohort {
  id: string;
  name: string;
  definition: {
    firstEvent: string;
    returnEvent: string;
    timeRange: AnalyticsTimeRange;
  };
  results?: {
    cohorts: Array<{
      period: string;
      size: number;
      retention: number[];
    }>;
  };
}

/**
 * Analytics Segmentation - تجزئة تحليلات
 */
export interface AnalyticsSegmentation {
  id: string;
  name: string;
  criteria: Record<string, unknown>;
  users: string[];
  size: number;
  createdAt: string;
  metadata?: Metadata;
}

/**
 * Analytics Service Interface - واجهة خدمة التحليلات
 */
export interface IAnalyticsService {
  query(query: AnalyticsQuery): Promise<AnalyticsResult>;
  trackEvent(
    event: Omit<AnalyticsEvent, "id" | "created_at" | "updated_at">,
  ): Promise<AnalyticsEvent>;
  getDashboard(dashboardId: string): Promise<AnalyticsDashboard | null>;
  createDashboard(
    dashboard: Omit<AnalyticsDashboard, "id" | "created_at" | "updated_at">,
  ): Promise<AnalyticsDashboard>;
  analyzeFunnel(funnel: AnalyticsFunnel): Promise<AnalyticsFunnel>;
  analyzeCohort(cohort: AnalyticsCohort): Promise<AnalyticsCohort>;
  createSegmentation(
    segmentation: Omit<AnalyticsSegmentation, "id" | "created_at">,
  ): Promise<AnalyticsSegmentation>;
  getStatistics(): Promise<Record<string, number>>;
}
