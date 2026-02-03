import React from 'react'
import { Loader2 } from 'lucide-react'
import { type LessonMindMap } from '@/presentation/features/interactive-learning-canvas/types/learning.types'

interface LessonMindMapTabProps {
  loading: boolean
  mindMap: LessonMindMap | null
}

export const LessonMindMapTab: React.FC<LessonMindMapTabProps> = ({ loading, mindMap }) => {
  if (loading) {
    return (
      <div className="lesson-detail-page__content-loading">
        <Loader2 className="lesson-detail-page__content-spinner" />
        <p className="lesson-detail-page__content-text">جارٍ إنشاء الخريطة الذهنية...</p>
      </div>
    )
  }

  if (mindMap) {
    return (
      <div className="lesson-mindmap">
        <div className="lesson-mindmap__nodes">
          <h3 className="lesson-mindmap__nodes-title">المفاهيم الأساسية</h3>
          <div className="lesson-mindmap__nodes-list">
            {mindMap.nodes.map(node => (
              <div
                key={node.id}
                className={`lesson-mindmap__node lesson-mindmap__node--${node.type}`}
              >
                {node.label}
              </div>
            ))}
          </div>
        </div>
        <div className="lesson-mindmap__edges">
          <h3 className="lesson-mindmap__edges-title">العلاقات</h3>
          <div className="lesson-mindmap__edges-list">
            {mindMap.edges.map((edge, index) => (
              <div key={`${edge.from}-${edge.to}-${index}`} className="lesson-mindmap__edge">
                {edge.from} ➝ {edge.to}
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="lesson-detail-page__content-loading">
      <p className="lesson-detail-page__content-text">اضغط على "الخريطة الذهنية" لتحميل المحتوى</p>
    </div>
  )
}
