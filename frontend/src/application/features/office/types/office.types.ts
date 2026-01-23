/**
 * Office Types - أنواع Office
 *
 * @description أنواع TypeScript الخاصة بميزة Office
 * تجميع جميع الأنواع من Service
 */

import type {
  OfficeFileType,
  OfficeLanguage,
  OfficeTemplate,
  OfficeGenerationRequest,
  OfficeGenerationResponse,
  OfficeStyle,
} from '../services/office.service'

export type {
  OfficeFileType,
  OfficeLanguage,
  OfficeTemplate,
  OfficeGenerationRequest,
  OfficeGenerationResponse,
  OfficeStyle,
}

// Application-specific Types

/**
 * حالة توليد الملف
 */
export type OfficeGenerationState = 'idle' | 'generating' | 'success' | 'error'

/**
 * خيارات توليد Excel
 */
export interface GenerateExcelOptions {
  templateId?: string
  data?: Record<string, unknown>
  title?: string
  author?: string
  subject?: string
  language?: OfficeLanguage
  style?: OfficeStyle
  includeCharts?: boolean
  includeImages?: boolean
  userSpecialization?: string
  description?: string
}

/**
 * خيارات توليد Word
 */
export interface GenerateWordOptions {
  templateId?: string
  data?: Record<string, unknown>
  title?: string
  author?: string
  subject?: string
  language?: OfficeLanguage
  style?: OfficeStyle
  includeCharts?: boolean
  includeImages?: boolean
  userSpecialization?: string
  description?: string
}

/**
 * خيارات توليد PowerPoint
 */
export interface GeneratePowerPointOptions {
  templateId?: string
  data?: Record<string, unknown>
  title?: string
  author?: string
  subject?: string
  language?: OfficeLanguage
  style?: OfficeStyle
  includeCharts?: boolean
  includeImages?: boolean
  slides?: number
  userSpecialization?: string
  description?: string
}

/**
 * خيارات توليد PDF
 */
export interface GeneratePDFOptions {
  templateId?: string
  data?: Record<string, unknown>
  title?: string
  author?: string
  subject?: string
  language?: OfficeLanguage
  style?: OfficeStyle
  includeCharts?: boolean
  includeImages?: boolean
  userSpecialization?: string
  description?: string
}

/**
 * نتيجة توليد الملف
 */
export interface OfficeGenerationResult {
  success: boolean
  file?: OfficeGenerationResponse
  error?: string
  progress?: number
}

/**
 * إحصائيات Office
 */
export interface OfficeStats {
  totalGenerated: number
  byType: Record<OfficeFileType, number>
  byStyle: Record<OfficeStyle, number>
  byLanguage: Record<OfficeLanguage, number>
  averageGenerationTime: number
}

/**
 * خطأ Office
 */
export interface OfficeError {
  code: string
  message: string
  field?: string
  details?: Record<string, unknown>
}
