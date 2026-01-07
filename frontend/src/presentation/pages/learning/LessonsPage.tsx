import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { BookOpen, Search, Filter, Inbox } from 'lucide-react'
import { learningAssistantService, Lesson } from '@/application'
import { Card, Button, Input } from '../../components/common'
import { PageHeader, LoadingState, ErrorState, EmptyState } from '../components'
import './LessonsPage.scss'

const LessonsPage: React.FC = () => {
  const navigate = useNavigate()
  const [lessons, setLessons] = useState<Lesson[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState('')

  useEffect(() => {
    loadLessons()
  }, [])

  const loadLessons = async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await learningAssistantService.getLessons()
      setLessons(response.lessons || [])
    } catch (err: unknown) {
      // Use logging service instead of console.error
      import('@/infrastructure/services/logging.service').then(({ loggingService }) => {
        loggingService.error(
          'Failed to load lessons',
          err instanceof Error ? err : new Error(String(err))
        )
      })
      setError(err instanceof Error ? err.message : 'فشل تحميل الدروس. يرجى المحاولة مرة أخرى.')
      setLessons([])
    } finally {
      setLoading(false)
    }
  }

  const filteredLessons = lessons.filter(lesson =>
    lesson.title.toLowerCase().includes(searchQuery.toLowerCase())
  )

  if (loading) {
    return <LoadingState fullScreen message="جارٍ تحميل الدروس..." />
  }

  if (error) {
    return <ErrorState title="فشل تحميل الدروس" message={error} onRetry={loadLessons} />
  }

  return (
    <div className="lessons-page">
      <PageHeader
        title="الدروس"
        description="استكشف جميع الدروس المتاحة وابدأ رحلتك التعليمية"
        icon={<BookOpen />}
      />

      {/* Search and Filter */}
      <div className="lessons-page__search">
        <div className="lessons-page__search-container">
          <div className="lessons-page__search-input">
            <Input
              type="text"
              placeholder="ابحث عن درس..."
              value={searchQuery}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchQuery(e.target.value)}
              leftIcon={<Search className="w-5 h-5" />}
            />
          </div>
          <Button variant="outline">
            <Filter className="w-4 h-4 ml-2" />
            فلترة
          </Button>
        </div>
      </div>

      {/* Lessons Grid */}
      {filteredLessons.length === 0 ? (
        <EmptyState
          icon={<Inbox />}
          title={searchQuery ? 'لم يتم العثور على دروس' : 'لا توجد دروس متاحة حالياً'}
          description={searchQuery ? 'جرب البحث بكلمات مختلفة' : 'سيتم إضافة دروس جديدة قريباً'}
        />
      ) : (
        <div className="lessons-page__grid">
          {filteredLessons.map(lesson => (
            <Card key={lesson.id} onClick={() => navigate(`/lessons/${lesson.id}`)}>
              <div className="lesson-card">
                <div className="lesson-card__header">
                  <div className="lesson-card__icon">
                    <BookOpen className="w-6 h-6" />
                  </div>
                  <div className="lesson-card__info">
                    <h3 className="lesson-card__title">{lesson.title}</h3>
                    {lesson.difficulty_level && (
                      <span className="lesson-card__difficulty">{lesson.difficulty_level}</span>
                    )}
                  </div>
                </div>

                {lesson.content && (
                  <p className="lesson-card__content">{lesson.content.substring(0, 100)}...</p>
                )}

                <div className="lesson-card__actions">
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
                      e.stopPropagation()
                      navigate(`/lessons/${lesson.id}`)
                    }}
                  >
                    عرض الدرس
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}

export default LessonsPage
