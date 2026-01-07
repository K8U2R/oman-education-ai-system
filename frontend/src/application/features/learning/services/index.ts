/**
 * Learning Services - خدمات التعلم
 */

export * from './learning-assistant.service'
export { learningAssistantService } from './learning-assistant.service'
export { assessmentService } from './assessment.service'
export type {
  Assessment,
  AssessmentType,
  AssessmentStatus,
  SubmissionStatus,
  QuestionType,
  AssessmentQuestion,
  AssessmentSubmission,
  CreateAssessmentRequest,
  UpdateAssessmentRequest,
  SubmitAssessmentRequest,
  AssessmentStats,
  GetAssessmentsFilters,
  GetAssessmentsResponse,
} from './assessment.service'
