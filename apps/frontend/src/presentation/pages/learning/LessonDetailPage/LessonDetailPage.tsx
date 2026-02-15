import React from 'react'
import { Loader2 } from 'lucide-react'
import { Card, Button } from '@/presentation/components/common'
import { AIAssistantPanel } from '@/presentation/components/ai'
import { ROUTES } from '@/domain/constants'
import { useLessonDetail, ActiveTab } from './core/useLessonDetail'
import { LessonHeader } from './components/LessonHeader/LessonHeader'
import { LessonTabs } from './components/LessonTabs/LessonTabs'
import { LessonExplanationTab } from './components/LessonContent/LessonExplanationTab'
import { LessonExamplesTab } from './components/LessonContent/LessonExamplesTab'
import { LessonVideosTab } from './components/LessonVideoPlayer/LessonVideosTab'
import { LessonMindMapTab } from './components/LessonContent/LessonMindMapTab'

const LessonDetailPage: React.FC = () => {
  const {
    lesson,
    loading,
    activeTab,
    explanation,
    examples,
    videos,
    mindMap,
    loadingExplanation,
    loadingExamples,
    loadingVideos,
    loadingMindMap,
    isAssistantOpen,
    setIsAssistantOpen,
    loadExplanation,
    loadExamples,
    loadVideos,
    loadMindMap,
    handleAssistantMessage,
    handleAssistantStream,
    handleDeleteLesson,
    navigate,
    setActiveTab,
  } = useLessonDetail()

  const handleTabChange = (tab: ActiveTab) => {
    setActiveTab(tab)
    switch (tab) {
      case 'explanation': loadExplanation(); break;
      case 'examples': loadExamples(); break;
      case 'videos': loadVideos(); break;
      case 'mindmap': loadMindMap(); break;
    }
  }

  if (loading) return <LoadingState />
  if (!lesson) return <NotFoundState navigate={navigate} />

  return (
    <div className="lesson-detail-page">
      <LessonHeader
        lesson={lesson}
        onBack={() => navigate('/lessons')}
        onEdit={() => navigate(ROUTES.LESSON_EDIT(lesson.id))}
        onDelete={handleDeleteLesson}
        onAssistantOpen={() => setIsAssistantOpen(true)}
      />

      <LessonTabs activeTab={activeTab} onTabChange={handleTabChange} />

      <Card>
        {activeTab === 'explanation' && <LessonExplanationTab loading={loadingExplanation} explanation={explanation} />}
        {activeTab === 'examples' && <LessonExamplesTab loading={loadingExamples} examples={examples} />}
        {activeTab === 'videos' && <LessonVideosTab loading={loadingVideos} videos={videos} />}
        {activeTab === 'mindmap' && <LessonMindMapTab loading={loadingMindMap} mindMap={mindMap} />}
      </Card>

      <AIAssistantPanel
        isOpen={isAssistantOpen}
        onClose={() => setIsAssistantOpen(false)}
        onSendMessage={handleAssistantMessage}
        onStreamMessage={handleAssistantStream}
      />
    </div>
  )
}

const LoadingState = () => (
  <div className="lesson-detail-page__loading">
    <div className="lesson-detail-page__loading-content">
      <Loader2 className="lesson-detail-page__loading-spinner" />
      <p className="lesson-detail-page__loading-text">جارٍ تحميل الدرس...</p>
    </div>
  </div>
)

const NotFoundState = ({ navigate }: { navigate: any }) => (
  <div className="lesson-detail-page">
    <Card>
      <div className="lesson-detail-page__not-found">
        <p className="lesson-detail-page__not-found-text">الدرس غير موجود</p>
        <Button variant="primary" onClick={() => navigate('/lessons')}>
          العودة إلى الدروس
        </Button>
      </div>
    </Card>
  </div>
)

export default LessonDetailPage
