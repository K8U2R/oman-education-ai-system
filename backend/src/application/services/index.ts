/**
 * Application Services - خدمات التطبيق
 * 
 * ROOT AGGREGATOR - Sovereign Clusters Architecture
 * Constitutional Authority: LAWS.md - Article 2 (Barrel Protocol) & Article 3 (Cluster Sovereignty)
 * 
 * This file exports ONLY the 6 Sovereign Domain Clusters.
 * Direct service imports are PROHIBITED to enforce isolation and modularity.
 * 
 * Migration Date: 2026-01-23
 * Architecture Version: 2.0 (Clustered)
 */

// ═══════════════════════════════════════════════════════════════════
// 🏛️ Cluster 1: Authentication & Security
// ═══════════════════════════════════════════════════════════════════
// export * from './auth';

// ═══════════════════════════════════════════════════════════════════
// 🏛️ Cluster 2: User Management
// ═══════════════════════════════════════════════════════════════════
// export * from './user';

// ═══════════════════════════════════════════════════════════════════
// 🏛️ Cluster 3: AI & Generation
// ═══════════════════════════════════════════════════════════════════
export * from './ai';

// ═══════════════════════════════════════════════════════════════════
// 🏛️ Cluster 4: Educational Services
// ═══════════════════════════════════════════════════════════════════
// export * from './education';

// ═══════════════════════════════════════════════════════════════════
// 🏛️ Cluster 5: Communication
// ═══════════════════════════════════════════════════════════════════
export * from './communication';

// ═══════════════════════════════════════════════════════════════════
// 🏛️ Cluster 6: System Infrastructure
// ═══════════════════════════════════════════════════════════════════
export * from './system';


// ═══════════════════════════════════════════════════════════════════
// 🏗️ Stubs for missing services (Temporary - See Law-13)
// ═══════════════════════════════════════════════════════════════════
export { GoogleOAuthService } from '@/modules/auth/services/strategies/GoogleOAuthService.js';
export { KnowledgeBaseService } from "@/modules/education/services/KnowledgeBaseService.js";
export { OfficeGenerationService } from "@/modules/office/services/OfficeGenerationService.js";
// export class ContentManagementService { } // Moved to modules/education
export { LoginRateLimiter } from '@/modules/auth/services/security/LoginRateLimiter.js';
export { CodeGenerationService } from '@/modules/education/services/CodeGenerationService.js';
