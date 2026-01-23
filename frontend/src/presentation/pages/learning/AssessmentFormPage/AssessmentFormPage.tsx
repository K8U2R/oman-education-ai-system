/**
 * Assessment Form Page - صفحة نموذج التقييم
 *
 * صفحة لإنشاء أو تعديل تقييم تعليمي مع إدارة الأسئلة
 */

import React from 'react'
import { Save, X, ClipboardList } from 'lucide-react'
import { Button } from '@/presentation/components/common'
import { PageHeader, LoadingState } from '../../components'
import { ROUTES } from '@/domain/constants'
import { useNavigate } from 'react-router-dom'
import { useAssessmentFormLogic } from './hooks/useAssessmentFormLogic'
import { AssessmentBasicInfo } from './components/AssessmentBasicInfo'
import { QuestionList } from './components/QuestionList'

const AssessmentFormPage: React.FC = () => {
  const navigate = useNavigate()
  const {
    loading,
    loadingAssessment,
    formData,
    setFormData,
    questions,
    handleAddQuestion,
    handleRemoveQuestion,
    handleQuestionChange,
    handleMoveQuestion,
    handleSubmit,
    isEdit,
  } = useAssessmentFormLogic(
    window.location.hash.split('/').pop()?.includes('-')
      ? window.location.hash.split('/').pop()
      : undefined
  )
  // Note: logic hook handles ID retrieval from params, however we didn't pass useParams to it inside the hook in the previous file.
  // Let's rely on the hook's internal useParams.
  // Re-reading logic hook: YES, it uses useParams. So we don't need to pass ID from here unless props.

  if (loadingAssessment) {
    return <LoadingState fullScreen message="جاري تحميل التقييم..." />
  }

  return (
    <div className="assessment-form-page">
      <PageHeader
        title={isEdit ? 'تعديل التقييم' : 'إضافة تقييم جديد'}
        description={isEdit ? 'تعديل معلومات التقييم' : 'إنشاء تقييم تعليمي جديد'}
        icon={<ClipboardList />}
      />

      <form onSubmit={handleSubmit} className="assessment-form-page__form">
        <AssessmentBasicInfo formData={formData} setFormData={setFormData} isEdit={isEdit} />

        <QuestionList
          questions={questions}
          onAddQuestion={handleAddQuestion}
          onRemoveQuestion={handleRemoveQuestion}
          onMoveQuestion={handleMoveQuestion}
          onQuestionChange={handleQuestionChange}
        />

        <div className="assessment-form-page__actions">
          <Button
            variant="secondary"
            type="button"
            onClick={() => navigate(ROUTES.ASSESSMENTS)}
            leftIcon={<X />}
          >
            إلغاء
          </Button>
          <Button variant="primary" type="submit" isLoading={loading} leftIcon={<Save />}>
            حفظ
          </Button>
        </div>
      </form>
    </div>
  )
}

export default AssessmentFormPage
