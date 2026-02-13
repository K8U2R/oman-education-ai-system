/**
 * Shared Types Cluster - الأنواع المشتركة
 *
 * CLEANED: Feature-specific types moved to @/domain/types/features/
 * This now contains ONLY cross-cutting concerns.
 *
 * @compliance LAW_05 - No feature dumping
 */

export type * from "./common.types.js";

// API
export type * from "./api.types.js";
export { APIResponseHelper } from "./api.types.js";

// Error
export type * from "./error.types.js";
export { ErrorHandlerHelper } from "./error.types.js";

export type * from "./database.types.js";
export type * from "./file.types.js";
export type * from "./cache.types.js";
export type * from "./job.types.js";
export type * from "./utility.types.js";
export type * from "./event.types.js";

// Validation
export type * from "./validation.types.js";
export { BuiltInValidators, ValidationHelper } from "./validation.types.js";

// Type Guards
export {
  isLearningLesson,
  isContentLesson,
  isBaseLog,
  isLogLevel,
  isHealthStatus,
  isStatus,
  isMetadata,
  isNonEmptyString,
  isNonEmptyArray,
  isObject,
  isID,
  isEmail,
} from "./type-guards.js";
