/**
 * Service Registry - Register all services
 *
 * Central registry for all application services
 */

import { container } from "./Container";
import { NodemailerAdapter } from "../adapters/email/NodemailerAdapter";
import { DatabaseCoreAdapter } from "../adapters/db/DatabaseCoreAdapter";
import { GoogleOAuthAdapter } from "../adapters/db/GoogleOAuthAdapter";
// Auth Cluster - Implemented Services
import {
  TokenService,
  AuthService,
} from "../../application/services/auth/index.js";

// Auth Cluster - Services referenced but NOT yet implemented  
import type {
  GoogleOAuthService,
  OAuthStateService,
  LoginRateLimiter,
} from "../../application/services/auth/index.js";

// Communication Cluster - Implemented Services
import { EmailService } from "../../application/services/communication/index.js";

// Auth Cluster - Services referenced but NOT yet implemented
import type { WhitelistService } from "../../application/services/whitelist/WhitelistService.js";
import { AuthRepository } from "../repositories/AuthRepository";
import { RefreshTokenRepository } from "../repositories/RefreshTokenRepository";
import { VerificationTokenRepository } from "../repositories/VerificationTokenRepository";
import type { AITokenizerService } from "../../application/services/ai/AITokenizerService.js";
import { GoogleOAuthRepository } from "../repositories/GoogleOAuthRepository";
import { WhitelistRepository } from "../repositories/WhitelistRepository";
import { UserRepository } from "../repositories/UserRepository";
import { createOAuthStateRepository } from "../repositories/OAuthStateRepositoryFactory";
import { createRateLimitStore } from "../rate-limit/RateLimitStoreFactory";
import { getCacheManager } from "../cache/CacheManager";
// Cluster-based imports (Post Services Clustering Migration)
import type { AdminService } from "../../application/services/user/admin/index.js";
import type { DeveloperService } from "../../application/services/user/developer/index.js";
import type { LearningService } from "../../application/services/education/learning/index.js";
import type { AssessmentService } from "../../application/services/education/learning/index.js";
import type { StorageService } from "../../application/services/system/storage/index.js";

// Services below are referenced but DO NOT EXIST in codebase (pre-existing issue)
// TODO: Implement or remove these service references
import type {
  NotificationService,
  CodeGenerationService,
  OfficeGenerationService,
  ContentManagementService,
  SecurityService,
  SessionService,
  SecurityAnalyticsService,
  SecurityMonitoringService,
  ProjectService,
} from "../../application/services/index.js";
import type { AgentDispatcher } from "../../core/ai-kernel/dispatcher/AgentDispatcher.js";
import type { AIHandler } from "../../presentation/api/handlers/ai/ai.handler.js";
import type { ProjectHandler } from "../../presentation/api/handlers/content/project.handler.js";
import type { AssessmentHandler } from "../../presentation/api/handlers/content/assessment.handler.js";
import type { AuthHandler } from "../../presentation/api/handlers/auth/index.js";
import type { AdminHandler } from "../../presentation/api/handlers/admin/admin.handler.js";
import type { DeveloperHandler } from "../../presentation/api/handlers/admin/developer.handler.js";
import type { ContentManagementHandler } from "../../presentation/api/handlers/content/content-management.handler.js";
import type { LearningHandler } from "../../presentation/api/handlers/ai/learning.handler.js";
import type { CodeGenerationHandler } from "../../presentation/api/handlers/ai/code-generation.handler.js";
import type { SecurityHandler } from "../../presentation/api/handlers/security/security.handler.js";
import type { SecurityAnalyticsHandler } from "../../presentation/api/handlers/security/security-analytics.handler.js";
import type { SecurityMonitoringHandler } from "../../presentation/api/handlers/security/security-monitoring.handler.js";
import type { NotificationHandler } from "../../presentation/api/handlers/communication/index.js";
import type { StorageHandler } from "../../presentation/api/handlers/system/storage.handler.js";
import type { SessionHandler } from "../../presentation/api/handlers/system/session.handler.js";
import type { MonitoringHandler } from "../../presentation/api/handlers/system/monitoring.handler.js";
import type { OfficeHandler } from "../../presentation/api/handlers/office/office.handler.js";
import type { UserHandler } from "../../presentation/api/handlers/user/index.js";
import type { PerformanceTrackingService } from "../../application/services/system/monitoring/performance-tracking.service.js";
import type { ErrorTrackingService } from "../../application/services/system/monitoring/error-tracking.service.js";
import type { VectorStoreService } from "../services/vector/VectorStoreService.js";
import type { KnowledgeBaseService } from "../../application/services/knowledge/KnowledgeBaseService.js";

import { NotificationRepository } from "../repositories/NotificationRepository";
import { ExcelAdapter } from "../adapters/office/ExcelAdapter";
import { WordAdapter } from "../adapters/office/WordAdapter";
import { PowerPointAdapter } from "../adapters/office/PowerPointAdapter";
import type { IAIProvider } from "../../domain/index.js";
import {
  LoginUseCase,
  RegisterUseCase,
  RefreshTokenUseCase,
  UpdatePasswordUseCase,
  UpdateUserUseCase,
  SendVerificationEmailUseCase,
  VerifyEmailUseCase,
  RequestPasswordResetUseCase,
  ResetPasswordUseCase,
} from "../../application/use-cases/index.js";
import {
  InitiateGoogleOAuthUseCase,
  HandleGoogleOAuthCallbackUseCase,
} from "../../application/use-cases/auth/index.js";

/**
 * Register all services in the DI Container
 */
export function registerServices(): void {
  // ============================================
  // Adapters (Singleton - shared instances)
  // ============================================

  container.register(
    "DatabaseAdapter",
    () => new DatabaseCoreAdapter(),
    "singleton",
  );
  container.register(
    "GoogleOAuthAdapter",
    () => new GoogleOAuthAdapter(),
    "singleton",
  );

  // Email Provider Adapter (Infrastructure Layer)
  container.register(
    "EmailProvider",
    () => new NodemailerAdapter(),
    "singleton",
  );

  // ============================================
  // Services (Singleton - shared instances)
  // ============================================

  // Token Service (Auth Cluster)
  container.register("TokenService", () => new TokenService(), "singleton");

  // Email Service (Communication Cluster)
  container.register(
    "EmailService",
    (c) => new EmailService(c.resolve("EmailProvider")),
    "singleton",
  );
  container.register("CacheManager", () => getCacheManager(), "singleton");

  // Rate Limit Store (Memory or Redis based on config)
  container.register(
    "RateLimitStore",
    () => createRateLimitStore(),
    "singleton",
  );
  container.register(
    "LoginRateLimiter",
    (c) => new LoginRateLimiter(c.resolve("RateLimitStore")),
    "singleton",
  );

  // ============================================
  // Repositories (Transient - new instance per request)
  // ============================================

  container.register(
    "RefreshTokenRepository",
    (c) => new RefreshTokenRepository(c.resolve("DatabaseAdapter")),
    "transient",
  );

  container.register(
    "VerificationTokenRepository",
    (c) => new VerificationTokenRepository(c.resolve("DatabaseAdapter")),
    "transient",
  );

  container.register(
    "AuthRepository",
    (c) =>
      new AuthRepository(
        c.resolve("DatabaseAdapter"),
        c.resolve("TokenService"),
        c.resolve("RefreshTokenRepository"),
      ),
    "transient",
  );

  container.register(
    "GoogleOAuthRepository",
    (c) => new GoogleOAuthRepository(c.resolve("DatabaseAdapter")),
    "transient",
  );

  container.register(
    "WhitelistRepository",
    (c) => new WhitelistRepository(c.resolve("DatabaseAdapter")),
    "transient",
  );

  container.register(
    "NotificationRepository",
    (c) => new NotificationRepository(c.resolve("DatabaseAdapter")),
    "transient",
  );

  container.register(
    "UserRepository",
    (c) => new UserRepository(c.resolve("DatabaseAdapter")),
    "transient",
  );

  // OAuth State Repository (Memory or Redis based on OAUTH_STATE_STORAGE)
  container.register(
    "OAuthStateRepository",
    () => createOAuthStateRepository(),
    "singleton",
  );

  // ============================================
  // Application Services (Singleton)
  // ============================================

  // Auth Service (Auth Cluster) - NEW IMPLEMENTATION
  container.register(
    "AuthService",
    (c) =>
      new AuthService(
        c.resolve("AuthRepository"),
        c.resolve("DatabaseAdapter"),
        c.resolve("TokenService"),
      ),
    "singleton",
  );

  container.register(
    "OAuthStateService",
    (c) => new OAuthStateService(c.resolve("OAuthStateRepository")),
    "singleton",
  );

  container.register(
    "WhitelistService",
    (c) =>
      new WhitelistService(
        c.resolve("DatabaseAdapter"),
        c.resolve("WhitelistRepository"),
      ),
    "singleton",
  );

  container.register(
    "GoogleOAuthService",
    (c) =>
      new GoogleOAuthService(
        c.resolve("GoogleOAuthAdapter"),
        c.resolve("GoogleOAuthRepository"),
        c.resolve("OAuthStateService"),
        c.resolve("TokenService"),
        c.resolve("RefreshTokenRepository"),
        c.resolve("WhitelistService"), // Optional - will be undefined if not registered
      ),
    "singleton",
  );

  container.register(
    "NotificationService",
    (c) =>
      new NotificationService(
        c.resolve("NotificationRepository"),
        c.resolve("CacheManager"),
      ),
    "singleton",
  );

  // AI Provider will be initialized at app startup (see index.ts)
  // For now, register a placeholder that will throw if accessed before initialization
  let aiProviderInstance: IAIProvider | null = null;
  container.register(
    "AIProvider",
    () => {
      if (!aiProviderInstance) {
        // Fallback to Mock Provider to prevent application crash
        // This allows non-AI features (like getLessons) to work even if AI is dead.
        return {
          chatCompletion: async () => ({ content: "AI Provider Unavailable" }),
          generateEmbedding: async () => [],
          generateImage: async () => "pixel_shim",
          // Add other required methods mock
        } as unknown as IAIProvider;
      }
      return aiProviderInstance;
    },
    "singleton",
  );

  // Export function to set AI Provider instance
  (globalThis as unknown as typeof global).setAIProvider = (
    provider: IAIProvider,
  ) => {
    aiProviderInstance = provider;
  };

  container.register(
    "AITokenizerService",
    () => new AITokenizerService(),
    "singleton",
  );

  container.register(
    "LearningService",
    (c) =>
      new LearningService(
        c.resolve("AIProvider"),
        c.resolve("DatabaseAdapter"),
      ),
    "singleton",
  );

  container.register(
    "CodeGenerationService",
    (c) =>
      new CodeGenerationService(
        c.resolve("AIProvider"),
        c.resolve("DatabaseAdapter"),
      ),
    "singleton",
  );

  // Office Adapters (Singleton)
  container.register("ExcelAdapter", () => new ExcelAdapter(), "singleton");
  container.register("WordAdapter", () => new WordAdapter(), "singleton");
  container.register(
    "PowerPointAdapter",
    () => new PowerPointAdapter(),
    "singleton",
  );

  container.register(
    "OfficeGenerationService",
    (c) =>
      new OfficeGenerationService(
        c.resolve("AIProvider"),
        c.resolve("ExcelAdapter"),
        c.resolve("WordAdapter"),
        c.resolve("PowerPointAdapter"),
        c.resolve("DatabaseAdapter"),
      ),
    "singleton",
  );

  container.register(
    "ContentManagementService",
    (c) => new ContentManagementService(c.resolve("DatabaseAdapter")),
    "singleton",
  );

  container.register(
    "AdminService",
    (c) =>
      new AdminService(
        c.resolve("DatabaseAdapter"),
        c.resolve("KnowledgeBaseService"),
      ),
    "singleton",
  );

  container.register(
    "DeveloperService",
    (c) => new DeveloperService(c.resolve("DatabaseAdapter")),
    "singleton",
  );

  container.register(
    "AssessmentService",
    (c) => new AssessmentService(c.resolve("DatabaseAdapter")),
    "singleton",
  );

  container.register(
    "SecurityService",
    (c) => new SecurityService(c.resolve("DatabaseAdapter")),
    "singleton",
  );

  container.register(
    "SessionService",
    (c) => new SessionService(c.resolve("DatabaseAdapter")),
    "singleton",
  );

  container.register(
    "SecurityAnalyticsService",
    (c) => new SecurityAnalyticsService(c.resolve("DatabaseAdapter")),
    "singleton",
  );

  container.register(
    "SecurityMonitoringService",
    (c) => new SecurityMonitoringService(c.resolve("DatabaseAdapter")),
    "singleton",
  );

  container.register(
    "StorageService",
    (c) => new StorageService(c.resolve("DatabaseAdapter")),
    "singleton",
  );

  // Project Service
  container.register(
    "ProjectService",
    (c) => new ProjectService(c.resolve("DatabaseAdapter")),
    "singleton",
  );

  // Vector Store (RAG)
  container.register(
    "VectorStoreService",
    () => new VectorStoreService(),
    "singleton",
  );

  container.register(
    "KnowledgeBaseService",
    (c) =>
      new KnowledgeBaseService(
        c.resolve("AIProvider"),
        c.resolve("VectorStoreService"),
      ),
    "singleton",
  );

  // AI Kernel - The Brain
  container.register(
    "AgentDispatcher",
    (c) =>
      new AgentDispatcher(
        c.resolve("AIProvider"),
        c.resolve("KnowledgeBaseService"),
      ),
    "singleton",
  );

  // ============================================
  // API Handlers (Singleton)
  // ============================================

  container.register(
    "AIHandler",
    (c) => new AIHandler(c.resolve("AITokenizerService")),
    "singleton",
  );

  container.register(
    "ProjectHandler",
    (c) => new ProjectHandler(c.resolve("ProjectService")),
    "singleton",
  );

  container.register(
    "AuthHandler",
    (c) => new AuthHandler(c.resolve("AuthService")),
    "singleton",
  );

  container.register(
    "AssessmentHandler",
    (c) => new AssessmentHandler(c.resolve("AssessmentService")),
    "singleton",
  );

  container.register(
    "AdminHandler",
    (c) => new AdminHandler(c.resolve("AdminService")),
    "singleton",
  );

  container.register(
    "DeveloperHandler",
    (c) => new DeveloperHandler(c.resolve("DeveloperService")),
    "singleton",
  );

  container.register(
    "ContentManagementHandler",
    (c) => new ContentManagementHandler(c.resolve("ContentManagementService")),
    "singleton",
  );

  container.register(
    "LearningHandler",
    (c) =>
      new LearningHandler(
        c.resolve("LearningService"),
        c.resolve("AgentDispatcher"),
      ),
    "singleton",
  );

  container.register(
    "CodeGenerationHandler",
    (c) => new CodeGenerationHandler(c.resolve("CodeGenerationService")),
    "singleton",
  );

  container.register(
    "SecurityHandler",
    (c) => new SecurityHandler(c.resolve("SecurityService")),
    "singleton",
  );

  container.register(
    "SecurityAnalyticsHandler",
    (c) => new SecurityAnalyticsHandler(c.resolve("SecurityAnalyticsService")),
    "singleton",
  );

  container.register(
    "SecurityMonitoringHandler",
    (c) =>
      new SecurityMonitoringHandler(c.resolve("SecurityMonitoringService")),
    "singleton",
  );

  container.register(
    "NotificationHandler",
    (c) => new NotificationHandler(c.resolve("NotificationService")),
    "singleton",
  );

  container.register(
    "StorageHandler",
    (c) => new StorageHandler(c.resolve("StorageService")),
    "singleton",
  );

  container.register(
    "SessionHandler",
    (c) => new SessionHandler(c.resolve("SessionService")),
    "singleton",
  );

  container.register(
    "MonitoringHandler",
    (_c) =>
      new MonitoringHandler(
        new PerformanceTrackingService(),
        new ErrorTrackingService(),
      ),
    "singleton",
  );

  container.register(
    "OfficeHandler",
    (c) => new OfficeHandler(c.resolve("OfficeGenerationService")),
    "singleton",
  );

  container.register(
    "UserHandler",
    (c) => new UserHandler(c.resolve("UserRepository")),
    "singleton",
  );

  // ============================================
  // Use Cases (Transient - new instance per request)
  // ============================================

  container.register(
    "LoginUseCase",
    (c) => new LoginUseCase(c.resolve("AuthRepository")),
    "transient",
  );

  container.register(
    "RegisterUseCase",
    (c) =>
      new RegisterUseCase(
        c.resolve("AuthRepository"),
        c.resolve("EmailService"),
        c.resolve("VerificationTokenRepository"),
      ),
    "transient",
  );

  container.register(
    "RefreshTokenUseCase",
    (c) =>
      new RefreshTokenUseCase(
        c.resolve("AuthRepository"),
        c.resolve("TokenService"),
        c.resolve("RefreshTokenRepository"),
      ),
    "transient",
  );

  container.register(
    "UpdatePasswordUseCase",
    (c) => new UpdatePasswordUseCase(c.resolve("AuthService")),
    "transient",
  );

  container.register(
    "UpdateUserUseCase",
    (c) => new UpdateUserUseCase(c.resolve("AuthService")),
    "transient",
  );

  container.register(
    "SendVerificationEmailUseCase",
    (c) =>
      new SendVerificationEmailUseCase(
        c.resolve("AuthRepository"),
        c.resolve("EmailService"),
        c.resolve("VerificationTokenRepository"),
      ),
    "transient",
  );

  container.register(
    "VerifyEmailUseCase",
    (c) =>
      new VerifyEmailUseCase(
        c.resolve("AuthRepository"),
        c.resolve("VerificationTokenRepository"),
      ),
    "transient",
  );

  container.register(
    "RequestPasswordResetUseCase",
    (c) =>
      new RequestPasswordResetUseCase(
        c.resolve("AuthService"),
        c.resolve("EmailService"),
      ),
    "transient",
  );

  container.register(
    "ResetPasswordUseCase",
    (c) => new ResetPasswordUseCase(c.resolve("AuthService")),
    "transient",
  );

  container.register(
    "InitiateGoogleOAuthUseCase",
    (c) => new InitiateGoogleOAuthUseCase(c.resolve("GoogleOAuthService")),
    "transient",
  );

  container.register(
    "HandleGoogleOAuthCallbackUseCase",
    (c) =>
      new HandleGoogleOAuthCallbackUseCase(c.resolve("GoogleOAuthService")),
    "transient",
  );
}

/**
 * Initialize services (call this at application startup)
 */
export function initializeServices(): void {
  registerServices();
}
