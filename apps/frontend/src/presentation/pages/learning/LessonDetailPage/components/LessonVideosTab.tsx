import React from 'react'
import { Loader2, Video } from 'lucide-react'
import { Button, OptimizedImage } from '@/presentation/components/common'
import { type LessonVideos } from '@/presentation/features/interactive-learning-canvas/types/learning.types'

interface LessonVideosTabProps {
  loading: boolean
  videos: LessonVideos | null
}

export const LessonVideosTab: React.FC<LessonVideosTabProps> = ({ loading, videos }) => {
  if (loading) {
    return (
      <div className="lesson-detail-page__content-loading">
        <Loader2 className="lesson-detail-page__content-spinner" />
        <p className="lesson-detail-page__content-text">جارٍ البحث عن الفيديوهات...</p>
      </div>
    )
  }

  if (videos && videos.videos.length > 0) {
    return (
      <div className="lesson-videos">
        <div className="lesson-videos__grid">
          {videos.videos.map(video => (
            <div key={video.id} className="lesson-videos__item">
              <div className="lesson-videos__item-thumbnail">
                {video.thumbnail ? (
                  <OptimizedImage
                    src={video.thumbnail}
                    alt={video.title}
                    loading="lazy"
                    width={320}
                    objectFit="cover"
                    height={180}
                  />
                ) : (
                  <div className="lesson-videos__item-thumbnail-placeholder">
                    <Video className="w-12 h-12 text-text-tertiary" />
                  </div>
                )}
              </div>
              <div className="lesson-videos__item-content">
                <h3 className="lesson-videos__item-title">{video.title}</h3>
                {video.channel && <p className="lesson-videos__item-channel">{video.channel}</p>}
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => window.open(video.url, '_blank')}
                  className="lesson-videos__item-button"
                >
                  مشاهدة الفيديو
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="lesson-detail-page__content-loading">
      <p className="lesson-detail-page__content-text">اضغط على "الفيديوهات" لتحميل المحتوى</p>
    </div>
  )
}
