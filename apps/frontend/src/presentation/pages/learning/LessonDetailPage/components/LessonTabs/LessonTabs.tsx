import React from 'react'
import { BookOpen, Lightbulb, Video, Network } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { useLessonDetail } from '../../core/useLessonDetail'

interface LessonTabsProps {
  activeTab: ActiveTab
  onTabChange: (tab: ActiveTab) => void
}

export const LessonTabs: React.FC<LessonTabsProps> = ({ activeTab, onTabChange }) => {
  const { t } = useTranslation()

  return (
    <div className="lesson-detail-page__tabs">
      <nav className="lesson-detail-page__tab-list" aria-label="Tabs">
        <button
          onClick={() => onTabChange('explanation')}
          className={`lesson-detail-page__tab ${activeTab === 'explanation' ? 'lesson-detail-page__tab--active' : ''
            }`}
        >
          <BookOpen className="w-4 h-4 ml-2" />
          {t('lesson.tabs.explanation')}
        </button>
        <button
          onClick={() => onTabChange('examples')}
          className={`lesson-detail-page__tab ${activeTab === 'examples' ? 'lesson-detail-page__tab--active' : ''
            }`}
        >
          <Lightbulb className="w-4 h-4 ml-2" />
          {t('lesson.tabs.examples')}
        </button>
        <button
          onClick={() => onTabChange('videos')}
          className={`lesson-detail-page__tab ${activeTab === 'videos' ? 'lesson-detail-page__tab--active' : ''
            }`}
        >
          <Video className="w-4 h-4 ml-2" />
          {t('lesson.tabs.videos')}
        </button>
        <button
          onClick={() => onTabChange('mindmap')}
          className={`lesson-detail-page__tab ${activeTab === 'mindmap' ? 'lesson-detail-page__tab--active' : ''
            }`}
        >
          <Network className="w-4 h-4 ml-2" />
          {t('lesson.tabs.mindmap')}
        </button>
      </nav>
    </div>
  )
}
