import React from 'react'
import { Card } from '../../../../components/common'
import { CheckCircle2, XCircle, FileText } from 'lucide-react'
import { AssessmentQuestion } from '@/presentation/features/interactive-learning-canvas'
import { SubmissionAnswer } from '../hooks/useAssessmentResultsLogic'

interface QuestionsReviewProps {
  questions: AssessmentQuestion[]
  answers: Record<string, SubmissionAnswer>
}

export const QuestionsReview: React.FC<QuestionsReviewProps> = ({ questions, answers }) => {
  return (
    <Card className="assessment-results__questions-card">
      <h3 className="assessment-results__questions-title">مراجعة الأسئلة</h3>
      <div className="assessment-results__questions-list">
        {questions.map((question, index) => {
          const answer = answers[question.id]
          // isCorrect check removed as unused
          // Better logic: if points_earned > 0 or is_correct explicitly true.
          // Let's rely on is_correct.
          const checkCorrect = answer?.is_correct === true

          return (
            <div
              key={question.id || index}
              className={`assessment-results__question-item ${
                checkCorrect
                  ? 'assessment-results__question-item--correct'
                  : 'assessment-results__question-item--incorrect'
              }`}
            >
              <div className="assessment-results__question-header">
                <div className="assessment-results__question-info">
                  <span className="assessment-results__question-number">سؤال {index + 1}</span>
                  {checkCorrect ? (
                    <CheckCircle2 className="assessment-results__question-icon assessment-results__question-icon--correct" />
                  ) : (
                    <XCircle className="assessment-results__question-icon assessment-results__question-icon--incorrect" />
                  )}
                </div>
                <span className="assessment-results__question-points">
                  {answer?.points_earned || 0} / {question.points} نقطة
                </span>
              </div>

              <p className="assessment-results__question-text">
                {question.text || (question as unknown as { question: string }).question}
              </p>

              {answer && (
                <div className="assessment-results__answer-section">
                  <div className="assessment-results__answer-item">
                    <span className="assessment-results__answer-label">إجابتك:</span>
                    <span className="assessment-results__answer-value">
                      {Array.isArray(answer.answer) ? answer.answer.join(', ') : answer.answer}
                    </span>
                  </div>
                  {question.correctAnswer && (
                    <div className="assessment-results__correct-answer">
                      <strong>الإجابة الصحيحة:</strong>
                      <span className="success-text">
                        {Array.isArray(question.correctAnswer)
                          ? question.correctAnswer.join(', ')
                          : question.correctAnswer}
                      </span>
                    </div>
                  )}
                </div>
              )}

              {question.explanation && (
                <div className="assessment-results__explanation">
                  <FileText className="assessment-results__explanation-icon" />
                  <p className="assessment-results__explanation-text">{question.explanation}</p>
                </div>
              )}
            </div>
          )
        })}
      </div>
    </Card>
  )
}
