export type AssessmentType = 'quiz' | 'exam' | 'assignment'
export type AssessmentStatus = 'draft' | 'published' | 'archived'
export type SubmissionStatus = 'pending' | 'submitted' | 'graded'
export type QuestionType = 'multiple_choice' | 'true_false' | 'short_answer' | 'essay'

export interface AssessmentQuestion {
  id: string
  type: QuestionType
  text: string
  options?: string[]
  points: number
  correctAnswer?: string | string[] // Only for auto-grading
  explanation?: string // Feedback/Explanation for the answer
}

export interface Assessment {
  id: string
  title: string
  description?: string
  type: AssessmentType
  status: AssessmentStatus
  subjectId: string
  gradeLevelId: string
  durationMinutes?: number // Time limit
  passingScore: number
  questions: AssessmentQuestion[]
  createdAt: string
  updatedAt: string
  createdBy: string
}

export interface AssessmentSubmission {
  id: string
  assessmentId: string
  studentId: string
  status: SubmissionStatus
  answers: Record<string, string | string[]> // questionId -> answer
  score?: number
  submittedAt?: string
  gradedAt?: string
  feedback?: string
}

export interface CreateAssessmentRequest {
  title: string
  description?: string
  type: AssessmentType
  subjectId: string
  gradeLevelId: string
  durationMinutes?: number
  passingScore: number
  questions: Omit<AssessmentQuestion, 'id'>[]
}

export interface UpdateAssessmentRequest extends Partial<CreateAssessmentRequest> {
  status?: AssessmentStatus
}

export interface SubmitAssessmentRequest {
  answers: Record<string, string | string[]>
}

export interface AssessmentStats {
  totalAssessments: number
  totalSubmissions: number
  averageScore: number
  passRate: number
}

export interface GetAssessmentsFilters {
  page?: number
  per_page?: number
  status?: AssessmentStatus
  type?: AssessmentType
  subjectId?: string
}

export interface GetAssessmentsResponse {
  assessments: Assessment[]
  total: number
  page: number
  per_page: number
  total_pages: number
}
