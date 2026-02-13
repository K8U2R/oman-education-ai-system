/**
 * Domain Types - Main Export Point
 *
 * Organized by bounded contexts:
 * - auth: Authentication & authorization
 * - user: User management
 * - communication: Email, notifications, websockets
 * - features: Business features (education, productivity, data, analytics, project)
 * - shared: Cross-cutting infrastructure types
 *
 * @compliance LAW_05 - Functional organization
 * @compliance LAW_14 - Package sovereignty for SaaS tiers
 */

// 1. Shared & Fundamentals (Core)
export * from "./shared/index.js";

// 2. Bounded Contexts
export * from "./auth/index.js";
export * from "./user/index.js";
export * from "./communication/index.js";

// 3. Feature Contexts (NEW - LAW_05 compliance)
export * from "./features/index.js";
