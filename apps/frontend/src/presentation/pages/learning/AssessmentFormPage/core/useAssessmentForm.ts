import { useState, useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { assessmentService } from '@/presentation/features/interactive-learning-canvas'
import { ROUTES } from '@/domain/constants'
import type {
  CreateAssessmentRequest,
  UpdateAssessmentRequest,
  AssessmentQuestion,
  AssessmentType,
  AssessmentStatus,
} from '@/presentation/features/interactive-learning-canvas'

export interface AssessmentFormData {
  title: string
  description: string
  type: AssessmentType
  status: AssessmentStatus
  total_points: number
  passing_score: number
  time_limit: number
  due_date?: string
  subject_id?: string
  grade_level_id?: string
}

const generateId = (): string => {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
}

export const useAssessmentFormLogic = (assessmentId?: string) => {
  const navigate = useNavigate()
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

  // Local state for questions might need 'order' for UI purposes, but we can manage with index
  // We use AssessmentQuestion type which uses 'text' and 'correctAnswer'
  const [questions, setQuestions] = useState<AssessmentQuestion[]>([])

  useEffect(() => {
    // Auto-calculate total points
    const total = questions.reduce((sum, q) => sum + q.points, 0)
    setFormData(prev => ({ ...prev, total_points: total }))
  }, [questions])

  const loadAssessment = useCallback(async () => {
    if (!assessmentId) return

    try {
      setLoadingAssessment(true)
      const assessment = await assessmentService.getAssessment(assessmentId)

      if (assessment) {
        setFormData({
          title: assessment.title,
          description: assessment.description || '',
          type: assessment.type,
          status: assessment.status === 'archived' ? 'draft' : assessment.status,
          total_points: assessment.questions.reduce((sum, q) => sum + q.points, 0),
          passing_score: assessment.passingScore,
          time_limit: assessment.durationMinutes || 0,
          subject_id: assessment.subjectId,
          grade_level_id: assessment.gradeLevelId,
          due_date: (assessment as unknown as { dueDate?: string }).dueDate
            ? new Date((assessment as unknown as { dueDate?: string }).dueDate!)
                .toISOString()
                .split('T')[0]
            : undefined,
        })

        // Ensure questions match the structure
        setQuestions(
          assessment.questions.map(q => ({
            ...q,
            options: q.options || [],
            // Ensure ID exists
            id: q.id || generateId(),
          }))
        )
      }
    } catch (error) {
      console.error('Failed to load assessment', error)
      alert('فشل تحميل التقييم')
      navigate(ROUTES.ASSESSMENTS)
    } finally {
      setLoadingAssessment(false)
    }
  }, [assessmentId, navigate])

  useEffect(() => {
    if (isEdit && assessmentId) {
      loadAssessment()
    }
  }, [isEdit, assessmentId, loadAssessment])

  const handleAddQuestion = () => {
    const newQuestion: AssessmentQuestion = {
      id: generateId(),
      text: '', // Sovereign field name
      type: 'multiple_choice',
      points: 1,
      options: ['', '', '', ''],
      correctAnswer: '', // Sovereign field name
      explanation: '',
    }
    setQuestions([...questions, newQuestion])
  }

  const handleRemoveQuestion = (id: string) => {
    if (questions.length === 1) return
    setQuestions(questions.filter(q => q.id !== id))
  }

  const handleQuestionChange = (id: string, field: keyof AssessmentQuestion, value: unknown) => {
    setQuestions(
      questions.map(q => {
        if (q.id === id) {
          return { ...q, [field]: value }
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
    const target = newQuestions[newIndex]

    if (temp && target) {
      newQuestions[index] = target
      newQuestions[newIndex] = temp
      setQuestions(newQuestions)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      if (!formData.title.trim()) {
        alert('يرجى إدخال عنوان التقييم')
        return
      }

      if (questions.length === 0) {
        alert('يرجى إضافة سؤال واحد على الأقل')
        return
      }

      // Validation
      for (let i = 0; i < questions.length; i++) {
        const question = questions[i]
        if (!question) continue

        if (!question.text.trim()) {
          alert(`يرجى إدخال نص السؤال ${i + 1}`)
          return
        }
        if (
          question.type === 'multiple_choice' &&
          (!question.options || question.options.length < 2)
        ) {
          alert(`يرجى إضافة خيارين على الأقل للسؤال ${i + 1}`)
          return
        }
        if (question.points <= 0) {
          alert(`يرجى إدخال نقاط صحيحة للسؤال ${i + 1}`)
          return
        }
      }

      // Cleanup
      const cleanedQuestions = questions.map(q => {
        if (q.type === 'multiple_choice' && q.options) {
          return {
            ...q,
            options: q.options.filter(opt => opt.trim().length > 0),
          }
        }
        return q
      })

      const commonData = {
        title: formData.title,
        description: formData.description || undefined,
        type: formData.type,
        status: formData.status,
        // total_points handled by backend logic technically but we send what we have
        passingScore: formData.passing_score,
        durationMinutes: formData.time_limit > 0 ? formData.time_limit : undefined,
        questions: cleanedQuestions,
        dueDate: formData.due_date || undefined,
        subjectId: formData.subject_id || 'default-subject', // TODO: Get from context or form
        gradeLevelId: formData.grade_level_id || 'default-grade', // TODO: Get from context or form
      }

      if (isEdit && assessmentId) {
        await assessmentService.updateAssessment(
          assessmentId,
          commonData as UpdateAssessmentRequest
        )
        navigate(ROUTES.ASSESSMENT_DETAIL(assessmentId))
      } else {
        const assessment = await assessmentService.createAssessment(
          commonData as CreateAssessmentRequest
        )
        navigate(ROUTES.ASSESSMENT_DETAIL(assessment.id))
      }
    } catch (error) {
      console.error('Submit error:', error)
      alert('فشل حفظ التقييم')
    } finally {
      setLoading(false)
    }
  }

  return {
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
  }
}
