import React from 'react'
import { Card, Input } from '../../../../components/common'
import { HelpCircle } from 'lucide-react'
import {
  AssessmentStatus,
  AssessmentType,
} from '@/presentation/features/interactive-learning-canvas'
import { AssessmentFormData } from '../hooks/useAssessmentFormLogic'

interface AssessmentBasicInfoProps {
  formData: AssessmentFormData
  setFormData: React.Dispatch<React.SetStateAction<AssessmentFormData>>
  isEdit: boolean
}

export const AssessmentBasicInfo: React.FC<AssessmentBasicInfoProps> = ({
  formData,
  setFormData,
  isEdit,
}) => {
  return (
    <Card className="assessment-form-page__section">
      <h3 className="assessment-form-page__section-title">المعلومات الأساسية</h3>
      <div className="assessment-form-page__row">
        <div className="assessment-form-page__field">
          <label className="assessment-form-page__label">العنوان *</label>
          <Input
            value={formData.title}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setFormData({ ...formData, title: e.target.value })
            }
            required
            placeholder="عنوان التقييم"
          />
        </div>

        <div className="assessment-form-page__field">
          <label className="assessment-form-page__label">النوع *</label>
          <select
            className="assessment-form-page__select"
            value={formData.type}
            onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
              setFormData({ ...formData, type: e.target.value as AssessmentType })
            }
            required
          >
            <option value="quiz">اختبار قصير</option>
            <option value="assignment">واجب</option>
            <option value="exam">امتحان</option>
            <option value="project">مشروع</option>
          </select>
        </div>
      </div>

      <div className="assessment-form-page__field">
        <label className="assessment-form-page__label">الوصف</label>
        <textarea
          className="assessment-form-page__textarea"
          value={formData.description}
          onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
            setFormData({ ...formData, description: e.target.value })
          }
          rows={3}
          placeholder="وصف التقييم..."
        />
      </div>

      <div className="assessment-form-page__row">
        <div className="assessment-form-page__field">
          <label className="assessment-form-page__label">نقاط النجاح *</label>
          <Input
            type="number"
            value={formData.passing_score}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setFormData({ ...formData, passing_score: parseInt(e.target.value) || 0 })
            }
            required
            min={0}
            max={formData.total_points}
          />
        </div>

        <div className="assessment-form-page__field">
          <label className="assessment-form-page__label">الوقت المحدد (بالدقائق)</label>
          <Input
            type="number"
            value={formData.time_limit}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setFormData({ ...formData, time_limit: parseInt(e.target.value) || 0 })
            }
            min={0}
            placeholder="0 = غير محدد"
          />
        </div>

        <div className="assessment-form-page__field">
          <label className="assessment-form-page__label">تاريخ الاستحقاق</label>
          <Input
            type="date"
            value={formData.due_date || ''}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setFormData({ ...formData, due_date: e.target.value || undefined })
            }
          />
        </div>
      </div>

      {isEdit && (
        <div className="assessment-form-page__field">
          <label className="assessment-form-page__label">الحالة</label>
          <select
            className="assessment-form-page__select"
            value={formData.status}
            onChange={e => setFormData({ ...formData, status: e.target.value as AssessmentStatus })}
          >
            <option value="draft">مسودة</option>
            <option value="published">منشور</option>
            <option value="archived">مؤرشف</option>
          </select>
        </div>
      )}

      <div className="assessment-form-page__info">
        <HelpCircle className="assessment-form-page__info-icon" />
        <span>
          النقاط الإجمالية: {formData.total_points} (محسوبة تلقائياً من مجموع نقاط الأسئلة)
        </span>
      </div>
    </Card>
  )
}
