/**
 * Security API Swagger Documentation - توثيق API الأمان
 *
 * Swagger/OpenAPI documentation للـ Security APIs
 */

export const securitySwaggerPaths = {
  "/api/v1/security/stats": {
    get: {
      tags: ["Security"],
      summary: "الحصول على إحصائيات الأمان",
      description: "جلب إحصائيات شاملة للأمان (Admin only)",
      security: [{ bearerAuth: [] }],
      responses: {
        200: {
          description: "نجح جلب الإحصائيات",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  success: { type: "boolean" },
                  data: {
                    type: "object",
                    properties: {
                      totalSessions: { type: "number" },
                      activeSessions: { type: "number" },
                      totalEvents: { type: "number" },
                      criticalEvents: { type: "number" },
                      totalAlerts: { type: "number" },
                      unreadAlerts: { type: "number" },
                      failedLogins: { type: "number" },
                      successfulLogins: { type: "number" },
                      blockedIPs: { type: "number" },
                    },
                  },
                },
              },
            },
          },
        },
        401: { description: "غير مصرح" },
        403: { description: "غير مسموح" },
      },
    },
  },
  "/api/v1/security/logs": {
    get: {
      tags: ["Security"],
      summary: "الحصول على سجلات الأمان",
      description: "جلب سجلات الأحداث الأمنية مع إمكانية الفلترة (Admin only)",
      security: [{ bearerAuth: [] }],
      parameters: [
        {
          name: "userId",
          in: "query",
          schema: { type: "string", format: "uuid" },
          description: "معرف المستخدم",
        },
        {
          name: "eventType",
          in: "query",
          schema: { type: "string" },
          description: "نوع الحدث",
        },
        {
          name: "severity",
          in: "query",
          schema: {
            type: "string",
            enum: ["info", "warning", "error", "critical"],
          },
          description: "مستوى الخطورة",
        },
        {
          name: "page",
          in: "query",
          schema: { type: "integer", default: 1 },
          description: "رقم الصفحة",
        },
        {
          name: "limit",
          in: "query",
          schema: { type: "integer", default: 50, maximum: 100 },
          description: "عدد النتائج",
        },
      ],
      responses: {
        200: {
          description: "نجح جلب السجلات",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  success: { type: "boolean" },
                  data: {
                    type: "array",
                    items: { $ref: "#/components/schemas/SecurityEvent" },
                  },
                  pagination: {
                    type: "object",
                    properties: {
                      page: { type: "number" },
                      limit: { type: "number" },
                      total: { type: "number" },
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
  },
  "/api/v1/security/settings": {
    get: {
      tags: ["Security"],
      summary: "الحصول على إعدادات الأمان",
      description: "جلب جميع إعدادات الأمان (Admin only)",
      security: [{ bearerAuth: [] }],
      responses: {
        200: {
          description: "نجح جلب الإعدادات",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  success: { type: "boolean" },
                  data: { $ref: "#/components/schemas/SecuritySettings" },
                },
              },
            },
          },
        },
      },
    },
    put: {
      tags: ["Security"],
      summary: "تحديث إعدادات الأمان",
      description: "تحديث إعدادات الأمان (Admin only)",
      security: [{ bearerAuth: [] }],
      requestBody: {
        required: true,
        content: {
          "application/json": {
            schema: {
              $ref: "#/components/schemas/UpdateSecuritySettingsRequest",
            },
          },
        },
      },
      responses: {
        200: {
          description: "نجح تحديث الإعدادات",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  success: { type: "boolean" },
                  data: { $ref: "#/components/schemas/SecuritySettings" },
                },
              },
            },
          },
        },
      },
    },
  },
  "/api/v1/security/sessions": {
    get: {
      tags: ["Sessions"],
      summary: "الحصول على جلسات المستخدم",
      description: "جلب جميع جلسات المستخدم الحالي",
      security: [{ bearerAuth: [] }],
      responses: {
        200: {
          description: "نجح جلب الجلسات",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  success: { type: "boolean" },
                  data: {
                    type: "array",
                    items: { $ref: "#/components/schemas/SecuritySession" },
                  },
                },
              },
            },
          },
        },
      },
    },
  },
  "/api/v1/security/alerts": {
    get: {
      tags: ["Security"],
      summary: "الحصول على التنبيهات الأمنية",
      description: "جلب التنبيهات الأمنية للمستخدم",
      security: [{ bearerAuth: [] }],
      responses: {
        200: {
          description: "نجح جلب التنبيهات",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  success: { type: "boolean" },
                  data: {
                    type: "array",
                    items: { $ref: "#/components/schemas/SecurityAlert" },
                  },
                },
              },
            },
          },
        },
      },
    },
  },
  "/api/v1/security/analytics/report": {
    get: {
      tags: ["Security Analytics"],
      summary: "الحصول على تقرير التحليلات",
      description: "جلب تقرير تحليلات الأمان الشامل (Developer/Admin only)",
      security: [{ bearerAuth: [] }],
      parameters: [
        {
          name: "period",
          in: "query",
          schema: {
            type: "string",
            enum: ["1h", "24h", "7d", "30d", "90d", "custom"],
          },
          description: "فترة التحليل",
        },
        {
          name: "startDate",
          in: "query",
          schema: { type: "string", format: "date-time" },
          description: "تاريخ البداية",
        },
        {
          name: "endDate",
          in: "query",
          schema: { type: "string", format: "date-time" },
          description: "تاريخ النهاية",
        },
      ],
      responses: {
        200: {
          description: "نجح جلب التقرير",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  success: { type: "boolean" },
                  data: {
                    $ref: "#/components/schemas/SecurityAnalyticsReport",
                  },
                },
              },
            },
          },
        },
      },
    },
  },
  "/api/v1/security/monitoring/health": {
    get: {
      tags: ["Security Monitoring"],
      summary: "الحصول على حالة صحة النظام",
      description: "جلب حالة صحة جميع مكونات النظام (Developer only)",
      security: [{ bearerAuth: [] }],
      responses: {
        200: {
          description: "نجح جلب حالة الصحة",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  success: { type: "boolean" },
                  data: { $ref: "#/components/schemas/SystemHealthStatus" },
                },
              },
            },
          },
        },
      },
    },
  },
  "/api/v1/security/monitoring/realtime": {
    get: {
      tags: ["Security Monitoring"],
      summary: "الحصول على مقاييس الوقت الفعلي",
      description: "جلب مقاييس الأمان في الوقت الفعلي (Developer only)",
      security: [{ bearerAuth: [] }],
      responses: {
        200: {
          description: "نجح جلب المقاييس",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  success: { type: "boolean" },
                  data: {
                    $ref: "#/components/schemas/RealTimeSecurityMetrics",
                  },
                },
              },
            },
          },
        },
      },
    },
  },
};

export const securitySwaggerSchemas = {
  SecurityEvent: {
    type: "object",
    properties: {
      id: { type: "string", format: "uuid" },
      userId: { type: "string", format: "uuid" },
      eventType: { type: "string" },
      severity: {
        type: "string",
        enum: ["info", "warning", "error", "critical"],
      },
      title: { type: "string" },
      description: { type: "string" },
      metadata: { type: "object" },
      ipAddress: { type: "string" },
      userAgent: { type: "string" },
      location: { type: "object" },
      source: { type: "string" },
      resolved: { type: "boolean" },
      resolvedAt: { type: "string", format: "date-time" },
      resolvedBy: { type: "string", format: "uuid" },
      createdAt: { type: "string", format: "date-time" },
    },
  },
  SecuritySettings: {
    type: "object",
    properties: {
      maxLoginAttempts: { type: "number" },
      lockoutDuration: { type: "number" },
      passwordMinLength: { type: "number" },
      passwordRequireUppercase: { type: "boolean" },
      passwordRequireLowercase: { type: "boolean" },
      passwordRequireNumbers: { type: "boolean" },
      passwordRequireSymbols: { type: "boolean" },
      twoFactorEnabled: { type: "boolean" },
      sessionTimeout: { type: "number" },
      maxConcurrentSessions: { type: "number" },
      rateLimitEnabled: { type: "boolean" },
      rateLimitRequests: { type: "number" },
      rateLimitWindow: { type: "number" },
      alertOnSuspiciousLogin: { type: "boolean" },
      alertOnPasswordChange: { type: "boolean" },
    },
  },
  UpdateSecuritySettingsRequest: {
    type: "object",
    properties: {
      maxLoginAttempts: { type: "number", minimum: 1, maximum: 20 },
      lockoutDuration: { type: "number", minimum: 1, maximum: 1440 },
      passwordMinLength: { type: "number", minimum: 1, maximum: 128 },
      passwordRequireUppercase: { type: "boolean" },
      passwordRequireLowercase: { type: "boolean" },
      passwordRequireNumbers: { type: "boolean" },
      passwordRequireSymbols: { type: "boolean" },
      twoFactorEnabled: { type: "boolean" },
      sessionTimeout: { type: "number", minimum: 1, maximum: 1440 },
      maxConcurrentSessions: { type: "number", minimum: 1, maximum: 50 },
      rateLimitEnabled: { type: "boolean" },
      rateLimitRequests: { type: "number", minimum: 1, maximum: 10000 },
      rateLimitWindow: { type: "number", minimum: 1, maximum: 3600 },
      alertOnSuspiciousLogin: { type: "boolean" },
      alertOnPasswordChange: { type: "boolean" },
    },
  },
  SecuritySession: {
    type: "object",
    properties: {
      id: { type: "string", format: "uuid" },
      userId: { type: "string", format: "uuid" },
      deviceInfo: { type: "object" },
      ipAddress: { type: "string" },
      userAgent: { type: "string" },
      location: { type: "object" },
      isActive: { type: "boolean" },
      lastActivityAt: { type: "string", format: "date-time" },
      expiresAt: { type: "string", format: "date-time" },
      createdAt: { type: "string", format: "date-time" },
    },
  },
  SecurityAlert: {
    type: "object",
    properties: {
      id: { type: "string", format: "uuid" },
      userId: { type: "string", format: "uuid" },
      alertType: { type: "string" },
      severity: {
        type: "string",
        enum: ["info", "warning", "error", "critical"],
      },
      title: { type: "string" },
      description: { type: "string" },
      metadata: { type: "object" },
      isRead: { type: "boolean" },
      readAt: { type: "string", format: "date-time" },
      actionRequired: { type: "boolean" },
      actionTaken: { type: "boolean" },
      actionTakenAt: { type: "string", format: "date-time" },
      createdAt: { type: "string", format: "date-time" },
    },
  },
  SecurityAnalyticsReport: {
    type: "object",
    properties: {
      period: {
        type: "string",
        enum: ["1h", "24h", "7d", "30d", "90d", "custom"],
      },
      startDate: { type: "string", format: "date-time" },
      endDate: { type: "string", format: "date-time" },
      loginAttempts: { type: "object" },
      userActivityTrend: { type: "object" },
      geographicDistribution: { type: "object" },
      topFailedLogins: { type: "object" },
      eventSummary: { type: "object" },
      sessionDistribution: { type: "object" },
      riskScores: { type: "array", items: { type: "object" } },
      generatedAt: { type: "string", format: "date-time" },
    },
  },
  SystemHealthStatus: {
    type: "object",
    properties: {
      overall: {
        type: "string",
        enum: ["healthy", "warning", "error", "critical"],
      },
      score: { type: "number", minimum: 0, maximum: 100 },
      components: {
        type: "object",
        properties: {
          authentication: { $ref: "#/components/schemas/ComponentHealth" },
          sessions: { $ref: "#/components/schemas/ComponentHealth" },
          database: { $ref: "#/components/schemas/ComponentHealth" },
          cache: { $ref: "#/components/schemas/ComponentHealth" },
          api: { $ref: "#/components/schemas/ComponentHealth" },
          websocket: { $ref: "#/components/schemas/ComponentHealth" },
        },
      },
      lastChecked: { type: "string", format: "date-time" },
    },
  },
  ComponentHealth: {
    type: "object",
    properties: {
      status: {
        type: "string",
        enum: ["healthy", "warning", "error", "critical"],
      },
      uptime: { type: "number" },
      responseTime: { type: "number" },
      errorRate: { type: "number" },
      lastError: { type: "string" },
      lastErrorAt: { type: "string", format: "date-time" },
    },
  },
  RealTimeSecurityMetrics: {
    type: "object",
    properties: {
      timestamp: { type: "string", format: "date-time" },
      activeSessions: { type: "number" },
      activeSessionsChange: { type: "number" },
      loginsLastMinute: { type: "number" },
      failedLoginsLastMinute: { type: "number" },
      loginSuccessRate: { type: "number" },
      eventsLastMinute: { type: "number" },
      criticalEventsLastMinute: { type: "number" },
      rateLimitHitsLastMinute: { type: "number" },
      rateLimitBlocksLastMinute: { type: "number" },
      requestsLastMinute: { type: "number" },
      averageResponseTime: { type: "number" },
      errorRate: { type: "number" },
    },
  },
};
