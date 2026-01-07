/**
 * Assessment Results Page - صفحة نتائج التقييم
 *
 * صفحة عرض نتائج التقييم التعليمي
 */

import React, { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import {
  ClipboardList,
  CheckCircle2,
  XCircle,
  ArrowLeft,
  Trophy,
  Target,
  Clock,
  FileText,
} from 'lucide-react'
import { useAssessment } from '@/application/features/learning/hooks/useAssessments'
import type { AssessmentQuestion } from '@/application/features/learning/services/assessment.service'
import { Card, Button } from '../../components/common'
import { PageHeader, LoadingState, ErrorState } from '../components'
import { ROUTES } from '@/domain/constants'
import './AssessmentResultsPage.scss'

interface SubmissionAnswer {
  question_id: string
  answer: string | string[]
  is_correct?: boolean
  points_earned?: number
}

const AssessmentResultsPage: React.FC = () => {
  const { assessmentId } = useParams<{ assessmentId: string }>()
  const navigate = useNavigate()
  const { assessment, submission, isLoading, error, loadAssessment, loadSubmission } =
    useAssessment(assessmentId || null)
  const [answers, setAnswers] = useState<Record<string, SubmissionAnswer>>({})

  useEffect(() => {
    if (assessmentId) {
      loadAssessment()
      loadSubmission()
    }
  }, [assessmentId, loadAssessment, loadSubmission])

  useEffect(() => {
    if (submission?.answers) {
      const parsedAnswers =
        typeof submission.answers === 'string'
          ? (JSON.parse(submission.answers) as SubmissionAnswer[])
          : (submission.answers as SubmissionAnswer[])
      const answersMap: Record<string, SubmissionAnswer> = {}
      parsedAnswers.forEach((answer: SubmissionAnswer) => {
        answersMap[answer.question_id] = answer
      })
      setAnswers(answersMap)
    }
  }, [submission])

  if (isLoading) {
    return <LoadingState fullScreen message="جارٍ تحميل النتائج..." />
  }

  if (error || !assessment) {
    return (
      <ErrorState
        title="فشل تحميل النتائج"
        message={error || 'التقييم غير موجود'}
        onRetry={loadAssessment}
      />
    )
  }

  if (!submission) {
    return (
      <ErrorState
        title="لا توجد نتائج"
        message="لم يتم تقديم هذا التقييم بعد"
        onRetry={() => navigate(ROUTES.ASSESSMENT_DETAIL(assessmentId!))}
      />
    )
  }

  const questions =
    typeof assessment.questions === 'string'
      ? JSON.parse(assessment.questions)
      : assessment.questions || []

  const isPassed =
    submission.percentage >= (assessment.passing_score / assessment.total_points) * 100

  return (
    <div className="assessment-results">
      <PageHeader
        title="نتائج التقييم"
        description={assessment.title}
        icon={<ClipboardList />}
        actions={
          <Button
            variant="secondary"
            onClick={() => navigate(ROUTES.ASSESSMENT_DETAIL(assessmentId!))}
            leftIcon={<ArrowLeft />}
          >
            العودة
          </Button>
        }
      />

      <div className="assessment-results__content">
        {/* Summary Card */}
        <Card className="assessment-results__summary-card">
          <div className="assessment-results__summary-header">
            <div className="assessment-results__summary-icon">
              {isPassed ? (
                <Trophy className="assessment-results__trophy-icon" />
              ) : (
                <XCircle className="assessment-results__fail-icon" />
              )}
            </div>
            <div className="assessment-results__summary-content">
              <h2 className="assessment-results__summary-title">
                {isPassed ? 'تهانينا! لقد نجحت' : 'لم تنجح هذه المرة'}
              </h2>
              <p className="assessment-results__summary-subtitle">
                {isPassed ? 'لقد حصلت على النتيجة المطلوبة للنجاح' : 'حاول مرة أخرى لتحسين نتيجتك'}
              </p>
            </div>
          </div>

          <div className="assessment-results__stats">
            <div className="assessment-results__stat">
              <Target className="assessment-results__stat-icon" />
              <div className="assessment-results__stat-content">
                <span className="assessment-results__stat-label">النتيجة</span>
                <span className="assessment-results__stat-value">
                  {submission.total_score} / {assessment.total_points}
                </span>
              </div>
            </div>

            <div className="assessment-results__stat">
              <CheckCircle2 className="assessment-results__stat-icon" />
              <div className="assessment-results__stat-content">
                <span className="assessment-results__stat-label">النسبة المئوية</span>
                <span className="assessment-results__stat-value">
                  {submission.percentage.toFixed(1)}%
                </span>
              </div>
            </div>

            <div className="assessment-results__stat">
              <Target className="assessment-results__stat-icon" />
              <div className="assessment-results__stat-content">
                <span className="assessment-results__stat-label">نقاط النجاح</span>
                <span className="assessment-results__stat-value">
                  {assessment.passing_score} / {assessment.total_points}
                </span>
              </div>
            </div>

            {submission.submitted_at && (
              <div className="assessment-results__stat">
                <Clock className="assessment-results__stat-icon" />
                <div className="assessment-results__stat-content">
                  <span className="assessment-results__stat-label">تاريخ التقديم</span>
                  <span className="assessment-results__stat-value">
                    {new Date(submission.submitted_at).toLocaleDateString('ar-SA')}
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Progress Bar */}
          <div className="assessment-results__progress">
            <div className="assessment-results__progress-label">
              <span>التقدم</span>
              <span>{submission.percentage.toFixed(1)}%</span>
            </div>
            <div className="assessment-results__progress-bar">
              <div
                className={`assessment-results__progress-bar-fill ${
                  isPassed ? 'assessment-results__progress-bar-fill--passed' : ''
                }`}
                style={{ width: `${submission.percentage}%` }}
              />
            </div>
          </div>
        </Card>

        {/* Questions Review */}
        {questions.length > 0 && (
          <Card className="assessment-results__questions-card">
            <h3 className="assessment-results__questions-title">مراجعة الأسئلة</h3>
            <div className="assessment-results__questions-list">
              {questions.map((question: AssessmentQuestion, index: number) => {
                const answer = answers[question.id]
                const isCorrect = answer?.is_correct !== false

                return (
                  <div
                    key={question.id || index}
                    className={`assessment-results__question-item ${
                      isCorrect
                        ? 'assessment-results__question-item--correct'
                        : 'assessment-results__question-item--incorrect'
                    }`}
                  >
                    <div className="assessment-results__question-header">
                      <div className="assessment-results__question-info">
                        <span className="assessment-results__question-number">
                          سؤال {index + 1}
                        </span>
                        {isCorrect ? (
                          <CheckCircle2 className="assessment-results__question-icon assessment-results__question-icon--correct" />
                        ) : (
                          <XCircle className="assessment-results__question-icon assessment-results__question-icon--incorrect" />
                        )}
                      </div>
                      <span className="assessment-results__question-points">
                        {answer?.points_earned || 0} / {question.points} نقطة
                      </span>
                    </div>

                    <p className="assessment-results__question-text">{question.question}</p>

                    {answer && (
                      <div className="assessment-results__answer-section">
                        <div className="assessment-results__answer-item">
                          <span className="assessment-results__answer-label">إجابتك:</span>
                          <span className="assessment-results__answer-value">
                            {Array.isArray(answer.answer)
                              ? answer.answer.join(', ')
                              : answer.answer}
                          </span>
                        </div>
                        {question.correct_answer && (
                          <div className="assessment-results__answer-item">
                            <span className="assessment-results__answer-label">
                              الإجابة الصحيحة:
                            </span>
                            <span className="assessment-results__answer-value">
                              {Array.isArray(question.correct_answer)
                                ? question.correct_answer.join(', ')
                                : question.correct_answer}
                            </span>
                          </div>
                        )}
                      </div>
                    )}

                    {question.explanation && (
                      <div className="assessment-results__explanation">
                        <FileText className="assessment-results__explanation-icon" />
                        <p className="assessment-results__explanation-text">
                          {question.explanation}
                        </p>
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          </Card>
        )}

        {/* Feedback */}
        {submission.feedback && (
          <Card className="assessment-results__feedback-card">
            <h3 className="assessment-results__feedback-title">التعليقات</h3>
            <p className="assessment-results__feedback-text">{submission.feedback}</p>
          </Card>
        )}
      </div>
    </div>
  )
}

export default AssessmentResultsPage
