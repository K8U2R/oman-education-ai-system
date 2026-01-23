import React from 'react'
import { BookOpen, Search, Filter, Inbox } from 'lucide-react'
import { Button, Input } from '@/presentation/components/common'
import { PageHeader, LoadingState, ErrorState, EmptyState } from '../../components'
import { useLessonsPageLogic } from './hooks/useLessonsPageLogic'
import { LessonCard } from './components/LessonCard'


const LessonsPage: React.FC = () => {
  const { navigate, loading, error, searchQuery, setSearchQuery, filteredLessons, loadLessons } =
    useLessonsPageLogic()

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
