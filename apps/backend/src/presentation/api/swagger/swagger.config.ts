/**
 * Swagger Configuration - إعدادات Swagger
 *
 * إعدادات Swagger/OpenAPI للتوثيق
 */

import swaggerJsdoc from "swagger-jsdoc";
import { getSettings } from "@/shared/configuration/index.js";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";
import { securitySwaggerSchemas } from "./security.swagger.js";
import { projectSwaggerSchemas } from "./project.swagger.js";

const settings = getSettings();

// Get current directory for resolving file paths
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const projectRoot = resolve(__dirname, "../../..");

const options: swaggerJsdoc.Options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "نظام التعليم الذكي العماني - API",
      version: settings.app.version,
      description: `
        API Documentation لنظام التعليم الذكي العماني
        
        ## نظرة عامة
        هذا API يوفر جميع العمليات المتعلقة بالمصادقة وإدارة المستخدمين.
        
        ## المصادقة
        معظم الـ Endpoints تتطلب مصادقة باستخدام JWT Token.
        أرسل Token في Header: \`Authorization: Bearer <token>\`
        
        ## الأخطاء
        جميع الأخطاء تُرجع في الصيغة التالية:
        \`\`\`json
        {
          "success": false,
          "error": {
            "message": "رسالة الخطأ",
            "code": "ERROR_CODE"
          }
        }
        \`\`\`
      `,
      contact: {
        name: "Oman Education AI System",
        email: "support@oman-education.ai",
      },
      license: {
        name: "MIT",
        url: "https://opensource.org/licenses/MIT",
      },
    },
    servers: [
      {
        url: `http://localhost:${settings.app.port}`,
        description: "Development Server",
      },
      {
        url: "https://api.oman-education.ai",
        description: "Production Server",
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
          description: "JWT Token للمصادقة",
        },
      },
      schemas: {
        ...securitySwaggerSchemas,
        ...projectSwaggerSchemas,
        Error: {
          type: "object",
          properties: {
            success: {
              type: "boolean",
              example: false,
            },
            error: {
              type: "object",
              properties: {
                message: {
                  type: "string",
                  example: "رسالة الخطأ",
                },
                code: {
                  type: "string",
                  example: "ERROR_CODE",
                },
                details: {
                  type: "array",
                  items: {
                    type: "object",
                  },
                  description: "تفاصيل إضافية (في حالة Validation Errors)",
                },
              },
              required: ["message", "code"],
            },
          },
          required: ["success", "error"],
        },
        Success: {
          type: "object",
          properties: {
            success: {
              type: "boolean",
              example: true,
            },
            message: {
              type: "string",
              example: "تمت العملية بنجاح",
            },
            data: {
              type: "object",
              description: "البيانات المرجعة (اختياري)",
            },
          },
          required: ["success"],
        },
        User: {
          type: "object",
          properties: {
            id: {
              type: "string",
              format: "uuid",
              example: "123e4567-e89b-12d3-a456-426614174000",
            },
            email: {
              type: "string",
              format: "email",
              example: "user@example.com",
            },
            first_name: {
              type: "string",
              nullable: true,
              example: "أحمد",
            },
            last_name: {
              type: "string",
              nullable: true,
              example: "محمد",
            },
            username: {
              type: "string",
              nullable: true,
              example: "ahmed_mohammed",
            },
            avatar_url: {
              type: "string",
              nullable: true,
              format: "uri",
            },
            is_verified: {
              type: "boolean",
              example: false,
            },
            is_active: {
              type: "boolean",
              example: true,
            },
            role: {
              type: "string",
              enum: ["student", "admin", "parent", "developer"],
              example: "student",
            },
            permissions: {
              type: "array",
              items: {
                type: "string",
              },
              example: [],
            },
            created_at: {
              type: "string",
              format: "date-time",
            },
            updated_at: {
              type: "string",
              format: "date-time",
            },
          },
          required: ["id", "email", "is_verified", "is_active", "role"],
        },
        AuthTokens: {
          type: "object",
          properties: {
            access_token: {
              type: "string",
              example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
            },
            refresh_token: {
              type: "string",
              example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
            },
            token_type: {
              type: "string",
              example: "Bearer",
            },
            expires_in: {
              type: "number",
              example: 3600,
              description: "مدة صلاحية Access Token بالثواني",
            },
          },
          required: [
            "access_token",
            "refresh_token",
            "token_type",
            "expires_in",
          ],
        },
      },
    },
    tags: [
      {
        name: "Authentication",
        description: "عمليات المصادقة والتسجيل",
      },
      {
        name: "User",
        description: "إدارة المستخدمين",
      },
      {
        name: "Email Verification",
        description: "التحقق من البريد الإلكتروني",
      },
      {
        name: "Password Reset",
        description: "إعادة تعيين كلمة المرور",
      },
      {
        name: "Health",
        description: "Health Check Endpoints",
      },
      {
        name: "Security",
        description: "إدارة الأمان والمراقبة",
      },
      {
        name: "Sessions",
        description: "إدارة الجلسات",
      },
      {
        name: "Security Analytics",
        description: "تحليلات الأمان (Developer/Admin only)",
      },
      {
        name: "Security Monitoring",
        description: "مراقبة الأمان في الوقت الفعلي (Developer only)",
      },
    ],
  },
  apis: [
    resolve(projectRoot, "src/presentation/api/routes/*.ts"),
    resolve(projectRoot, "src/presentation/api/handlers/*.ts"),
    resolve(projectRoot, "src/index.ts"),
  ],
};

export const swaggerSpec = swaggerJsdoc(options);
