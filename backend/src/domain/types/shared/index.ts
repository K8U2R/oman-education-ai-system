/**
 * Shared Types Cluster - الأنواع المشتركة
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
export type * from "./storage.types.js";
export type * from "./job.types.js";
export type * from "./report.types.js";
export type * from "./analytics.types.js";
export type * from "./export-import.types.js";
export type * from "./utility.types.js";
export type * from "./event.types.js";

// Validation
export type * from "./validation.types.js";
export { BuiltInValidators, ValidationHelper } from "./validation.types.js";

export type * from "./assessment.types.js";
export type * from "./code-generation.types.js";
export type * from "./office.types.js";
export type * from "./project.types.js";

// Content Management (Explicit exports to avoid conflicts)
export type {
    ContentLesson,
    CreateLessonRequest,
    UpdateLessonRequest,
    Subject,
    GradeLevel,
    LearningPath,
    CreateLearningPathRequest,
    UpdateLearningPathRequest,
} from "./content-management.types.js";

// Learning
export type {
    LearningLesson,
    LessonExplanation,
    LessonExample,
    LessonExamples,
    LessonVideo,
    LessonVideos,
    LessonMindMap,
    MindMapNode,
    MindMapEdge,
    ExplanationRequest,
    ExamplesRequest,
    MindMapRequest,
} from "./learning.types.js";

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
