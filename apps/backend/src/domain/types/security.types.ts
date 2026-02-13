export interface SecurityAnalyticsFilter {
  period:
    | "day"
    | "week"
    | "month"
    | "1h"
    | "24h"
    | "7d"
    | "30d"
    | "90d"
    | "custom";
  startDate?: Date;
  endDate?: Date;
  userId?: string;
}

export type SecurityEventType =
  | "login"
  | "failed_login"
  | "blocked_ip"
  | "token_refresh"
  | "password_change"
  | "logout";

export type SecurityEventSeverity = "low" | "medium" | "high" | "critical";

export interface SecurityEventFilter {
  userId?: string;
  eventType?: SecurityEventType;
  severity?: SecurityEventSeverity;
  startDate?: Date;
  endDate?: Date;
}

export interface SecurityMetric {
  name: string;
  value: number;
  unit?: string;
  timestamp: Date;
  tags?: Record<string, string>;
}

export interface SecurityAlertThreshold {
  metric: string;
  threshold: number;
  condition: "gt" | "lt" | "eq";
  severity: SecurityEventSeverity;
}

export interface MonitoringConfig {
  refreshInterval: number;
  autoRefresh: boolean;
  darkMode: boolean;
  metricsToShow: string[];
  chartsToShow: string[];
  alertsToShow: string[];
}

export interface Session {
  id: string;
  userId: string;
  tokenHash: string;
  expiresAt: Date;
  createdAt: Date;
  isValid: boolean;
  device?: string;
  ip?: string;
}

export interface SessionDetails extends Session {
  user?: {
    name: string;
    email: string;
    role: string;
  };
}
