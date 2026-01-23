import { lazy } from 'react'

export const AICanvasPage = lazy(() =>
  import('./AICanvasPage').then(module => ({ default: module.AICanvasPage }))
)

export * from './api/assessment.service'
export { learningAssistantService } from './api/learning-assistant.service'
export * from './types/assessment.types'
export * from './types/learning.types'
export * from './state/lessonsStore'
export * from './hooks/useAssessments'
export * from './hooks/useLessons'
export * from './utils/learning.utils'
