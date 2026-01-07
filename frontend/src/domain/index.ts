/**
 * Domain Layer - طبقة المجال
 *
 * نقطة الدخول الرئيسية لـ Domain Layer
 * تصدير جميع الكيانات، القيم، الواجهات، والأنواع
 */

// Entities
export * from './entities'

// Value Objects
export * from './value-objects'

// Interfaces
export * from './interfaces/repositories'

// Types - Export types only to avoid conflicts with entities
export type {
  LoginRequest,
  RegisterRequest,
  LoginResponse,
  AuthTokens,
  UserData,
  OAuthProvider,
  OAuthCallbackResult,
} from './types/auth.types'

export type {
  Lesson as LessonType,
  LessonExplanation,
  LessonExample,
  LessonExamples,
  LessonVideo,
  LessonVideos,
  MindMapNode,
  MindMapEdge,
  LessonMindMap,
} from './types/lesson.types'

export type {
  StorageProviderType,
  ConnectionStatus,
  StorageProvider,
  UserStorageConnection,
  StorageFile,
  StorageFolder,
  OfficeExportFormat,
} from './types/storage.types'

// Constants
export * from './constants'
