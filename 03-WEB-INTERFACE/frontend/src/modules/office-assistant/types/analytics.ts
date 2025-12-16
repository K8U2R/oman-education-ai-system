/**
 * Analytics Types
 * أنواع التحليلات
 */

export interface OfficeAnalytics {
  usage: {
    totalFiles: number;
    totalEdits: number;
  };
  performance: {
    averageProcessingTime: number;
    successRate: number;
  };
  insights?: string[];
}

