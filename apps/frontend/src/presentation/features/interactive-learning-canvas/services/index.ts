/**
 * Learning Services - خدمات التعلم
 */

export * from './learning-assistant.service'
export { learningAssistantService } from './learning-assistant.service'
export { assessmentService } from '../api/assessment.service'
export type {
  Assessment,
  AssessmentType,
  AssessmentStatus,
  SubmissionStatus,
  QuestionType,
  AssessmentQuestion,
  AssessmentSubmission,
  CreateAssessmentRequest,
  SubmitAssessmentRequest,
  AssessmentStats,
  GetAssessmentsFilters,
  GetAssessmentsResponse,
} from '../types/assessment.types'
