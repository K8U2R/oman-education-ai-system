import React from 'react'
import { Card } from '../../../../components/common'
import { Trophy, XCircle, Target, CheckCircle2, Clock } from 'lucide-react'
import {
  Assessment,
  AssessmentSubmission,
} from '@/presentation/features/interactive-learning-canvas'

interface SummaryCardProps {
  assessment: Assessment
  submission: AssessmentSubmission
  isPassed: boolean
}

export const SummaryCard: React.FC<SummaryCardProps> = ({ assessment, submission, isPassed }) => {
  return (
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
            <span className="assessment-results__stat-label">التيجة</span>
            <span className="assessment-results__stat-value">
              {/* Handle potential field name mismatches gently */}
              {(submission as unknown as { total_score?: number }).total_score ||
                submission.score ||
                0}{' '}
              / {(assessment as unknown as { total_points?: number }).total_points || 0}
            </span>
          </div>
        </div>

        <div className="assessment-results__stat">
          <CheckCircle2 className="assessment-results__stat-icon" />
          <div className="assessment-results__stat-content">
            <span className="assessment-results__stat-label">النسبة المئوية</span>
            <span className="assessment-results__stat-value">
              {(submission as unknown as { percentage?: number }).percentage?.toFixed(1) || 0}%
            </span>
          </div>
        </div>

        <div className="assessment-results__stat">
          <Target className="assessment-results__stat-icon" />
          <div className="assessment-results__stat-content">
            <span className="assessment-results__stat-label">نقاط النجاح</span>
            <span className="assessment-results__stat-value">
              {assessment.passingScore} /{' '}
              {(assessment as unknown as { total_points?: number }).total_points || 0}
            </span>
          </div>
        </div>

        {(submission as unknown as { submitted_at?: string }).submitted_at && (
          <div className="assessment-results__stat">
            <Clock className="assessment-results__stat-icon" />
            <div className="assessment-results__stat-content">
              <span className="assessment-results__stat-label">تاريخ التقديم</span>
              <span className="assessment-results__stat-value">
                {new Date(
                  (submission as unknown as { submitted_at?: string }).submitted_at!
                ).toLocaleDateString('ar-SA')}
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Progress Bar */}
      <div className="assessment-results__progress">
        <div className="assessment-results__progress-label">
          <span>التقدم</span>
          <span>
            {(submission as unknown as { percentage?: number }).percentage?.toFixed(1) || 0}%
          </span>
        </div>
        <div className="assessment-results__progress-bar">
          <div
            className={`assessment-results__progress-bar-fill ${
              isPassed ? 'assessment-results__progress-bar-fill--passed' : ''
            }`}
            style={{
              width: `${(submission as unknown as { percentage?: number }).percentage || 0}%`,
            }}
          />
        </div>
      </div>
    </Card>
  )
}
