import React from 'react'
import { Loader2 } from 'lucide-react'
import { Card, Button } from '@/presentation/components/common'
import { AIAssistantPanel } from '@/presentation/components/ai'
import { ROUTES } from '@/domain/constants'
import { useLessonDetailLogic, ActiveTab } from './hooks/useLessonDetailLogic'
import { LessonHeader } from './components/LessonHeader'
import { LessonTabs } from './components/LessonTabs'
import { LessonExplanationTab } from './components/LessonExplanationTab'
import { LessonExamplesTab } from './components/LessonExamplesTab'
import { LessonVideosTab } from './components/LessonVideosTab'
import { LessonMindMapTab } from './components/LessonMindMapTab'

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
    navigate,
  } = useLessonDetailLogic()

  const handleTabChange = (tab: ActiveTab) => {
    switch (tab) {
      case 'explanation':
        loadExplanation()
        break
      case 'examples':
        loadExamples()
        break
      case 'videos':
        loadVideos()
        break
      case 'mindmap':
        loadMindMap()
        break
    }
  }

  if (loading) {
    return (
      <div className="lesson-detail-page__loading">
        <div className="lesson-detail-page__loading-content">
          <Loader2 className="lesson-detail-page__loading-spinner" />
          <p className="lesson-detail-page__loading-text">جارٍ تحميل الدرس...</p>
        </div>
      </div>
    )
  }

  if (!lesson) {
    return (
      <div className="lesson-detail-page">
        <Card>
          <div className="lesson-detail-page__not-found">
            <p className="lesson-detail-page__not-found-text">الدرس غير موجود</p>
            <Button
              variant="primary"
              className="lesson-detail-page__not-found-button"
              onClick={() => navigate('/lessons')}
            >
              العودة إلى الدروس
            </Button>
          </div>
        </Card>
      </div>
    )
  }

  return (
    <div className="lesson-detail-page">
      <LessonHeader
        lesson={lesson}
        onBack={() => navigate('/lessons')}
        onEdit={() => navigate(ROUTES.LESSON_EDIT(lesson.id))}
        onDelete={() => {
          // TODO: Add delete logic/modal
        }}
        onAssistantOpen={() => setIsAssistantOpen(true)}
      />

      <LessonTabs activeTab={activeTab} onTabChange={handleTabChange} />

      <Card>
        {activeTab === 'explanation' && (
          <LessonExplanationTab loading={loadingExplanation} explanation={explanation} />
        )}
        {activeTab === 'examples' && (
          <LessonExamplesTab loading={loadingExamples} examples={examples} />
        )}
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

export default LessonDetailPage
