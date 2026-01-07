/**
 * Assessment Form Page - صفحة نموذج التقييم
 *
 * صفحة لإنشاء أو تعديل تقييم تعليمي مع إدارة الأسئلة
 */

import React, { useState, useEffect, useCallback } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { Save, X, ClipboardList, Plus, Trash2, ArrowUp, ArrowDown, HelpCircle } from 'lucide-react'
import { Card, Button, Input } from '../../components/common'
import { assessmentService } from '@/application/features/learning/services/assessment.service'
import { PageHeader, LoadingState } from '../components'
import { ROUTES } from '@/domain/constants'
import type {
  CreateAssessmentRequest,
  UpdateAssessmentRequest,
  AssessmentQuestion,
  AssessmentType,
  AssessmentStatus,
  QuestionType,
} from '@/application/features/learning/services/assessment.service'

// Helper function to generate unique IDs
const generateId = (): string => {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
}
import './AssessmentFormPage.scss'

interface AssessmentFormData {
  title: string
  description: string
  type: AssessmentType
  status: AssessmentStatus
  total_points: number
  passing_score: number
  time_limit: number
  due_date?: string
  lesson_id?: string
  learning_path_id?: string
}

const AssessmentFormPage: React.FC = () => {
  const navigate = useNavigate()
  const { assessmentId } = useParams<{ assessmentId: string }>()
  const isEdit = Boolean(assessmentId)

  const [loading, setLoading] = useState(false)
  const [loadingAssessment, setLoadingAssessment] = useState(false)
  const [formData, setFormData] = useState<AssessmentFormData>({
    title: '',
    description: '',
    type: 'quiz',
    status: 'draft',
    total_points: 0,
    passing_score: 0,
    time_limit: 0,
  })
  const [questions, setQuestions] = useState<AssessmentQuestion[]>([])

  useEffect(() => {
    // حساب total_points تلقائياً عند تغيير الأسئلة
    const total = questions.reduce((sum, q) => sum + q.points, 0)
    setFormData(prev => ({ ...prev, total_points: total }))
  }, [questions])

  const loadAssessment = useCallback(
    async (id: string) => {
      try {
        setLoadingAssessment(true)
        const assessment = await assessmentService.getAssessment(id)
        const parsedQuestions =
          typeof assessment.questions === 'string'
            ? JSON.parse(assessment.questions)
            : assessment.questions || []

        setFormData({
          title: assessment.title || '',
          description: assessment.description || '',
          type: assessment.type,
          status: assessment.status,
          total_points: assessment.total_points || 0,
          passing_score: assessment.passing_score || 0,
          time_limit: assessment.time_limit || 0,
          due_date: assessment.due_date
            ? new Date(assessment.due_date).toISOString().split('T')[0]
            : undefined,
          lesson_id: assessment.lesson_id,
          learning_path_id: assessment.learning_path_id,
        })

        // ترتيب الأسئلة حسب order وتأكيد وجود id لكل سؤال
        const sortedQuestions = parsedQuestions
          .map((q: AssessmentQuestion) => ({
            ...q,
            id: q.id || generateId(),
            order: q.order || 0,
          }))
          .sort((a: AssessmentQuestion, b: AssessmentQuestion) => a.order - b.order)
        setQuestions(sortedQuestions)
      } catch (error) {
        // Error logging is handled by the error interceptor
        alert('فشل تحميل التقييم')
        navigate(ROUTES.ASSESSMENTS)
      } finally {
        setLoadingAssessment(false)
      }
    },
    [navigate]
  )

  useEffect(() => {
    if (isEdit && assessmentId) {
      loadAssessment(assessmentId)
    }
  }, [isEdit, assessmentId, loadAssessment])

  const handleAddQuestion = () => {
    const newQuestion: AssessmentQuestion = {
      id: generateId(),
      question: '',
      type: 'multiple_choice',
      points: 1,
      options: ['', '', '', ''],
      correct_answer: '',
      explanation: '',
      order: questions.length + 1,
    }
    setQuestions([...questions, newQuestion])
  }

  const handleRemoveQuestion = (questionId: string) => {
    setQuestions(
      questions.filter(q => q.id !== questionId).map((q, index) => ({ ...q, order: index + 1 }))
    )
  }

  const handleQuestionChange = (
    questionId: string,
    field: keyof AssessmentQuestion,
    value: string | number | string[] | undefined
  ): void => {
    setQuestions(
      questions.map(q => {
        if (q.id === questionId) {
          if (field === 'options' && Array.isArray(value)) {
            return { ...q, [field]: value }
          }
          return { ...q, [field]: value }
        }
        return q
      })
    )
  }

  const handleOptionChange = (questionId: string, optionIndex: number, value: string) => {
    setQuestions(
      questions.map(q => {
        if (q.id === questionId) {
          const newOptions = [...(q.options || [])]
          newOptions[optionIndex] = value
          return { ...q, options: newOptions }
        }
        return q
      })
    )
  }

  const handleMoveQuestion = (questionId: string, direction: 'up' | 'down') => {
    const index = questions.findIndex(q => q.id === questionId)
    if (index === -1) return

    const newIndex = direction === 'up' ? index - 1 : index + 1
    if (newIndex < 0 || newIndex >= questions.length) return

    const newQuestions = [...questions]
    const temp = newQuestions[index]
    if (temp && newQuestions[newIndex]) {
      newQuestions[index] = newQuestions[newIndex]
      newQuestions[newIndex] = temp
    }

    // تحديث order
    newQuestions.forEach((q, i) => {
      q.order = i + 1
    })

    setQuestions(newQuestions)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      // التحقق من صحة البيانات
      if (!formData.title.trim()) {
        alert('يرجى إدخال عنوان التقييم')
        return
      }

      if (questions.length === 0) {
        alert('يرجى إضافة سؤال واحد على الأقل')
        return
      }

      // التحقق من صحة الأسئلة
      for (const question of questions) {
        if (!question.question.trim()) {
          alert(`يرجى إدخال نص السؤال ${question.order}`)
          return
        }

        if (
          question.type === 'multiple_choice' &&
          (!question.options || question.options.length < 2)
        ) {
          alert(`يرجى إضافة خيارين على الأقل للسؤال ${question.order}`)
          return
        }

        if (question.points <= 0) {
          alert(`يرجى إدخال نقاط صحيحة للسؤال ${question.order}`)
          return
        }
      }

      // تنظيف الأسئلة (إزالة الخيارات الفارغة)
      const cleanedQuestions = questions.map(q => {
        if (q.type === 'multiple_choice' && q.options) {
          return {
            ...q,
            options: q.options.filter(opt => opt.trim().length > 0),
          }
        }
        return q
      })

      if (isEdit && assessmentId) {
        const updateRequest: UpdateAssessmentRequest = {
          title: formData.title,
          description: formData.description || undefined,
          type: formData.type,
          status: formData.status,
          total_points: formData.total_points,
          passing_score: formData.passing_score,
          time_limit: formData.time_limit > 0 ? formData.time_limit : undefined,
          questions: cleanedQuestions,
          due_date: formData.due_date || undefined,
        }
        await assessmentService.updateAssessment(assessmentId, updateRequest)
        navigate(ROUTES.ASSESSMENT_DETAIL(assessmentId))
      } else {
        const createRequest: CreateAssessmentRequest = {
          title: formData.title,
          description: formData.description || undefined,
          type: formData.type,
          status: formData.status,
          total_points: formData.total_points,
          passing_score: formData.passing_score,
          time_limit: formData.time_limit > 0 ? formData.time_limit : undefined,
          questions: cleanedQuestions,
          due_date: formData.due_date || undefined,
        }
        const assessment = await assessmentService.createAssessment(createRequest)
        navigate(ROUTES.ASSESSMENT_DETAIL(assessment.id))
      }
    } catch (error) {
      // Error logging is handled by the error interceptor
      alert('فشل حفظ التقييم')
    } finally {
      setLoading(false)
    }
  }

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
        {/* Basic Info */}
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
                onChange={e =>
                  setFormData({ ...formData, status: e.target.value as AssessmentStatus })
                }
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

        {/* Questions */}
        <Card className="assessment-form-page__section">
          <div className="assessment-form-page__section-header">
            <h3 className="assessment-form-page__section-title">الأسئلة ({questions.length})</h3>
            <Button type="button" variant="primary" onClick={handleAddQuestion} leftIcon={<Plus />}>
              إضافة سؤال
            </Button>
          </div>

          {questions.length === 0 ? (
            <div className="assessment-form-page__empty-questions">
              <p>لا توجد أسئلة. اضغط على "إضافة سؤال" لبدء إضافة الأسئلة.</p>
            </div>
          ) : (
            <div className="assessment-form-page__questions">
              {questions.map((question, index) => {
                if (!question) return null
                return (
                  <Card key={question.id} className="assessment-form-page__question-card">
                    <div className="assessment-form-page__question-header">
                      <div className="assessment-form-page__question-number">
                        سؤال {question.order}
                      </div>
                      <div className="assessment-form-page__question-actions">
                        <Button
                          type="button"
                          variant="secondary"
                          size="sm"
                          onClick={() => handleMoveQuestion(question.id, 'up')}
                          disabled={index === 0}
                          leftIcon={<ArrowUp />}
                        >
                          أعلى
                        </Button>
                        <Button
                          type="button"
                          variant="secondary"
                          size="sm"
                          onClick={() => handleMoveQuestion(question.id, 'down')}
                          disabled={index === questions.length - 1}
                          leftIcon={<ArrowDown />}
                        >
                          أسفل
                        </Button>
                        <Button
                          type="button"
                          variant="danger"
                          size="sm"
                          onClick={() => handleRemoveQuestion(question.id)}
                          leftIcon={<Trash2 />}
                        >
                          حذف
                        </Button>
                      </div>
                    </div>

                    <div className="assessment-form-page__question-content">
                      <div className="assessment-form-page__row">
                        <div className="assessment-form-page__field assessment-form-page__field--full">
                          <label className="assessment-form-page__label">نص السؤال *</label>
                          <textarea
                            className="assessment-form-page__textarea"
                            value={question.question}
                            onChange={e =>
                              handleQuestionChange(question.id, 'question', e.target.value)
                            }
                            rows={2}
                            required
                            placeholder="اكتب السؤال هنا..."
                          />
                        </div>
                      </div>

                      <div className="assessment-form-page__row">
                        <div className="assessment-form-page__field">
                          <label className="assessment-form-page__label">نوع السؤال *</label>
                          <select
                            className="assessment-form-page__select"
                            value={question.type}
                            onChange={e => {
                              const newType = e.target.value as QuestionType
                              handleQuestionChange(question.id, 'type', newType)
                              // إعادة تعيين options للأنواع الجديدة
                              if (newType === 'multiple_choice' && !question.options) {
                                handleQuestionChange(question.id, 'options', ['', '', '', ''])
                              }
                              if (newType === 'true_false') {
                                handleQuestionChange(question.id, 'options', ['صحيح', 'خطأ'])
                              }
                            }}
                            required
                          >
                            <option value="multiple_choice">اختيار متعدد</option>
                            <option value="true_false">صح/خطأ</option>
                            <option value="short_answer">إجابة قصيرة</option>
                            <option value="essay">مقال</option>
                            <option value="code">كود</option>
                          </select>
                        </div>

                        <div className="assessment-form-page__field">
                          <label className="assessment-form-page__label">النقاط *</label>
                          <Input
                            type="number"
                            value={question.points}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                              handleQuestionChange(
                                question.id,
                                'points',
                                parseInt(e.target.value) || 0
                              )
                            }
                            required
                            min={1}
                          />
                        </div>
                      </div>

                      {/* Options for Multiple Choice */}
                      {question.type === 'multiple_choice' && (
                        <div className="assessment-form-page__field assessment-form-page__field--full">
                          <label className="assessment-form-page__label">الخيارات *</label>
                          <div className="assessment-form-page__options">
                            {(question.options || []).map((option, optIndex) => (
                              <div key={optIndex} className="assessment-form-page__option-row">
                                <Input
                                  value={option}
                                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                                    handleOptionChange(question.id, optIndex, e.target.value)
                                  }
                                  placeholder={`خيار ${optIndex + 1}`}
                                  required={optIndex < 2}
                                />
                                {optIndex >= 2 && (
                                  <Button
                                    type="button"
                                    variant="danger"
                                    size="sm"
                                    onClick={() => {
                                      const newOptions = [...(question.options || [])]
                                      newOptions.splice(optIndex, 1)
                                      handleQuestionChange(question.id, 'options', newOptions)
                                    }}
                                    leftIcon={<Trash2 />}
                                  >
                                    حذف
                                  </Button>
                                )}
                              </div>
                            ))}
                            <Button
                              type="button"
                              variant="secondary"
                              size="sm"
                              onClick={() => {
                                const newOptions = [...(question.options || []), '']
                                handleQuestionChange(question.id, 'options', newOptions)
                              }}
                              leftIcon={<Plus />}
                            >
                              إضافة خيار
                            </Button>
                          </div>
                          <div className="assessment-form-page__field">
                            <label className="assessment-form-page__label">الإجابة الصحيحة *</label>
                            <select
                              className="assessment-form-page__select"
                              value={(question.correct_answer as string) || ''}
                              onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                                handleQuestionChange(question.id, 'correct_answer', e.target.value)
                              }
                              required
                            >
                              <option value="">اختر الإجابة الصحيحة</option>
                              {(question.options || [])
                                .filter(opt => opt.trim().length > 0)
                                .map((opt, idx) => (
                                  <option key={idx} value={opt}>
                                    {opt}
                                  </option>
                                ))}
                            </select>
                          </div>
                        </div>
                      )}

                      {/* Correct Answer for True/False */}
                      {question.type === 'true_false' && (
                        <div className="assessment-form-page__field">
                          <label className="assessment-form-page__label">الإجابة الصحيحة *</label>
                          <select
                            className="assessment-form-page__select"
                            value={(question.correct_answer as string) || ''}
                            onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                              handleQuestionChange(question.id, 'correct_answer', e.target.value)
                            }
                            required
                          >
                            <option value="">اختر الإجابة الصحيحة</option>
                            <option value="true">صحيح</option>
                            <option value="false">خطأ</option>
                          </select>
                        </div>
                      )}

                      {/* Correct Answer for Short Answer */}
                      {(question.type === 'short_answer' ||
                        question.type === 'essay' ||
                        question.type === 'code') && (
                        <div className="assessment-form-page__field assessment-form-page__field--full">
                          <label className="assessment-form-page__label">
                            الإجابة الصحيحة (اختياري)
                          </label>
                          <Input
                            value={(question.correct_answer as string) || ''}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                              handleQuestionChange(question.id, 'correct_answer', e.target.value)
                            }
                            placeholder="الإجابة الصحيحة (للمراجعة)"
                          />
                        </div>
                      )}

                      {/* Explanation */}
                      <div className="assessment-form-page__field assessment-form-page__field--full">
                        <label className="assessment-form-page__label">شرح الإجابة (اختياري)</label>
                        <textarea
                          className="assessment-form-page__textarea"
                          value={question.explanation || ''}
                          onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                            handleQuestionChange(question.id, 'explanation', e.target.value)
                          }
                          rows={2}
                          placeholder="شرح الإجابة الصحيحة..."
                        />
                      </div>
                    </div>
                  </Card>
                )
              })}
            </div>
          )}
        </Card>

        {/* Actions */}
        <div className="assessment-form-page__actions">
          <Button variant="secondary" onClick={() => navigate(ROUTES.ASSESSMENTS)} leftIcon={<X />}>
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
