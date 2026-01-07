/**
 * Lesson Form Page - صفحة نموذج الدرس
 *
 * صفحة لإنشاء أو تعديل درس
 */

import React, { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { Save, X } from 'lucide-react'
import { Card, Button } from '../../components/common'
import { apiClient } from '@/infrastructure/api'
import { API_ENDPOINTS } from '@/domain/constants'
import { PageHeader, LoadingState } from '../components'
import type { Lesson } from '@/application/features/learning/services/learning-assistant.service'
import './LessonFormPage.scss'

interface Subject {
  id: string
  name: string
}

interface GradeLevel {
  id: string
  name: string
}

interface LessonFormData {
  subject_id: string
  grade_level_id: string
  title: string
  content: string
  order: number
  difficulty_level: 'beginner' | 'intermediate' | 'advanced'
  tags: string[]
  is_published: boolean
}

const LessonFormPage: React.FC = () => {
  const navigate = useNavigate()
  const { id } = useParams<{ id: string }>()
  const isEdit = Boolean(id)

  const [loading, setLoading] = useState(false)
  const [subjects, setSubjects] = useState<Subject[]>([])
  const [gradeLevels, setGradeLevels] = useState<GradeLevel[]>([])
  const [formData, setFormData] = useState<LessonFormData>({
    subject_id: '',
    grade_level_id: '',
    title: '',
    content: '',
    order: 0,
    difficulty_level: 'beginner',
    tags: [],
    is_published: false,
  })
  const [tagsInput, setTagsInput] = useState('')

  useEffect(() => {
    loadSubjectsAndGradeLevels()
    if (isEdit && id) {
      loadLesson(id)
    }
  }, [id, isEdit])

  const loadSubjectsAndGradeLevels = async () => {
    try {
      const [subjectsRes, gradeLevelsRes] = await Promise.all([
        apiClient.get<{ success: boolean; data: Subject[] }>(API_ENDPOINTS.CONTENT.SUBJECTS),
        apiClient.get<{ success: boolean; data: GradeLevel[] }>(API_ENDPOINTS.CONTENT.GRADE_LEVELS),
      ])

      if (subjectsRes.success) setSubjects(subjectsRes.data || [])
      if (gradeLevelsRes.success) setGradeLevels(gradeLevelsRes.data || [])
    } catch (error) {
      console.error('Failed to load data:', error)
    }
  }

  const loadLesson = async (lessonId: string) => {
    try {
      setLoading(true)
      const response = await apiClient.get<{ success: boolean; data: Lesson }>(
        API_ENDPOINTS.CONTENT.LESSON(lessonId)
      )

      if (response.success && response.data) {
        const lesson = response.data
        setFormData({
          subject_id: lesson.subject_id,
          grade_level_id: lesson.grade_level_id,
          title: lesson.title,
          content: lesson.content || '',
          order: lesson.order || 0,
          difficulty_level:
            (lesson.difficulty_level as 'beginner' | 'intermediate' | 'advanced') || 'beginner',
          tags: lesson.tags || [],
          is_published: (lesson as { is_published?: boolean }).is_published || false,
        })
        setTagsInput((lesson.tags || []).join(', '))
      }
    } catch (error) {
      console.error('Failed to load lesson:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const tags = tagsInput
        .split(',')
        .map(tag => tag.trim())
        .filter(tag => tag.length > 0)

      const data = {
        ...formData,
        tags,
      }

      if (isEdit && id) {
        await apiClient.put(API_ENDPOINTS.CONTENT.LESSON(id), data)
      } else {
        await apiClient.post(API_ENDPOINTS.CONTENT.LESSONS, data)
      }

      navigate('/content/lessons')
    } catch (error) {
      console.error('Failed to save lesson:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading && isEdit) {
    return <LoadingState fullScreen message="جاري تحميل الدرس..." />
  }

  return (
    <div className="lesson-form-page">
      <PageHeader
        title={isEdit ? 'تعديل الدرس' : 'إضافة درس جديد'}
        description={isEdit ? 'تعديل معلومات الدرس' : 'إنشاء درس تعليمي جديد'}
      />

      <Card className="lesson-form-page__form-card">
        <form onSubmit={handleSubmit} className="lesson-form-page__form">
          <div className="lesson-form-page__row">
            <div className="lesson-form-page__field">
              <label className="lesson-form-page__label">العنوان *</label>
              <input
                className="lesson-form-page__input"
                value={formData.title}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setFormData({ ...formData, title: e.target.value })
                }
                required
                placeholder="عنوان الدرس"
              />
            </div>

            <div className="lesson-form-page__field">
              <label className="lesson-form-page__label">الترتيب</label>
              <input
                className="lesson-form-page__input"
                type="number"
                value={formData.order}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setFormData({ ...formData, order: parseInt(e.target.value) || 0 })
                }
                min={0}
              />
            </div>
          </div>

          <div className="lesson-form-page__row">
            <div className="lesson-form-page__field">
              <label className="lesson-form-page__label">المادة *</label>
              <select
                className="lesson-form-page__select"
                value={formData.subject_id}
                onChange={e => setFormData({ ...formData, subject_id: e.target.value })}
                required
              >
                <option value="">اختر المادة</option>
                {subjects.map(subject => (
                  <option key={subject.id} value={subject.id}>
                    {subject.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="lesson-form-page__field">
              <label className="lesson-form-page__label">المستوى *</label>
              <select
                className="lesson-form-page__select"
                value={formData.grade_level_id}
                onChange={e => setFormData({ ...formData, grade_level_id: e.target.value })}
                required
              >
                <option value="">اختر المستوى</option>
                {gradeLevels.map(level => (
                  <option key={level.id} value={level.id}>
                    {level.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="lesson-form-page__field">
              <label className="lesson-form-page__label">مستوى الصعوبة</label>
              <select
                className="lesson-form-page__select"
                value={formData.difficulty_level}
                onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                  setFormData({
                    ...formData,
                    difficulty_level: e.target.value as 'beginner' | 'intermediate' | 'advanced',
                  })
                }
              >
                <option value="beginner">مبتدئ</option>
                <option value="intermediate">متوسط</option>
                <option value="advanced">متقدم</option>
              </select>
            </div>
          </div>

          <div className="lesson-form-page__field">
            <label className="lesson-form-page__label">المحتوى</label>
            <textarea
              className="lesson-form-page__textarea"
              value={formData.content}
              onChange={e => setFormData({ ...formData, content: e.target.value })}
              rows={10}
              placeholder="محتوى الدرس..."
            />
          </div>

          <div className="lesson-form-page__field">
            <label className="lesson-form-page__label">الوسوم (مفصولة بفواصل)</label>
            <input
              className="lesson-form-page__input"
              value={tagsInput}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setTagsInput(e.target.value)}
              placeholder="وسم1, وسم2, وسم3"
            />
          </div>

          <div className="lesson-form-page__field">
            <label className="lesson-form-page__checkbox">
              <input
                type="checkbox"
                checked={formData.is_published}
                onChange={e => setFormData({ ...formData, is_published: e.target.checked })}
              />
              <span>نشر الدرس</span>
            </label>
          </div>

          <div className="lesson-form-page__actions">
            <Button
              variant="secondary"
              onClick={() => navigate('/content/lessons')}
              leftIcon={<X />}
            >
              إلغاء
            </Button>
            <Button variant="primary" type="submit" isLoading={loading} leftIcon={<Save />}>
              حفظ
            </Button>
          </div>
        </form>
      </Card>
    </div>
  )
}

export default LessonFormPage
