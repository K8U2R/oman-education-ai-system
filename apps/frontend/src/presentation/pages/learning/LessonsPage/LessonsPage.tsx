import React from 'react'
import { BookOpen, Search, Filter, Inbox } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { Button, Input } from '@/presentation/components/common'
import { PageHeader, LoadingState, ErrorState, EmptyState } from '../../components'
import { useLessonsPageLogic } from './hooks/useLessonsPageLogic'
import { LessonCard } from './components/LessonCard'


const LessonsPage: React.FC = () => {
  const { t } = useTranslation()
  const { navigate, loading, error, searchQuery, setSearchQuery, filteredLessons, loadLessons } =
    useLessonsPageLogic()

  if (loading) {
    return <LoadingState fullScreen message={t('loading')} />
  }

  if (error) {
    return <ErrorState title={t('error')} message={error} onRetry={loadLessons} />
  }

  return (
    <div className="lessons-page">
      <PageHeader
        title={t('lessons.title')}
        description={t('lessons.subtitle')}
        icon={<BookOpen />}
      />

      {/* Search and Filter */}
      <div className="lessons-page__search">
        <div className="lessons-page__search-container">
          <div className="lessons-page__search-input">
            <Input
              type="text"
              placeholder={t('lessons.search_placeholder')}
              value={searchQuery}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchQuery(e.target.value)}
              leftIcon={<Search className="w-5 h-5" />}
            />
          </div>
          <Button variant="outline">
            <Filter className="w-4 h-4 ml-2" />
            {t('lessons.filter')}
          </Button>
        </div>
      </div>

      {/* Lessons Grid */}
      {filteredLessons.length === 0 ? (
        <EmptyState
          icon={<Inbox />}
          title={searchQuery ? t('lessons.no_lessons') : t('lessons.empty')}
          description={searchQuery ? t('lessons.no_lessons_desc') : t('lessons.empty_desc')}
        />
      ) : (
        <div className="lessons-page__grid">
          {filteredLessons.map(lesson => (
            <LessonCard
              key={lesson.id}
              lesson={lesson}
              onClick={() => navigate(`/lessons/${lesson.id}`)}
            />
          ))}
        </div>
      )}
    </div>
  )
}

export default LessonsPage
