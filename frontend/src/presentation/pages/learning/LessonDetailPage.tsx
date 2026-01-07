import React, { useEffect, useState, useCallback } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import {
  BookOpen,
  Lightbulb,
  Video,
  Network,
  ArrowRight,
  Loader2,
  Bot,
  Edit,
  Trash2,
} from 'lucide-react'
import {
  learningAssistantService,
  Lesson,
  LessonExplanation,
  LessonExamples,
  LessonExample,
  LessonVideos,
  LessonVideo,
  LessonMindMap,
  MindMapNode,
  MindMapEdge,
} from '@/application'
import { Card, Button, OptimizedImage } from '../../components/common'
import { ProtectedButton } from '../../components/auth'
import { AIAssistantPanel } from '../../components/ai'
import { apiClient } from '@/infrastructure/api'
import { API_ENDPOINTS, ROUTES } from '@/domain/constants'
import './LessonDetailPage.scss'

const LessonDetailPage: React.FC = () => {
  const { lessonId } = useParams<{ lessonId: string }>()
  const navigate = useNavigate()
  const [lesson, setLesson] = useState<Lesson | null>(null)
  const [explanation, setExplanation] = useState<LessonExplanation | null>(null)
  const [examples, setExamples] = useState<LessonExamples | null>(null)
  const [videos, setVideos] = useState<LessonVideos | null>(null)
  const [mindMap, setMindMap] = useState<LessonMindMap | null>(null)
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<'explanation' | 'examples' | 'videos' | 'mindmap'>(
    'explanation'
  )
  const [loadingExplanation, setLoadingExplanation] = useState(false)
  const [loadingExamples, setLoadingExamples] = useState(false)
  const [loadingVideos, setLoadingVideos] = useState(false)
  const [loadingMindMap, setLoadingMindMap] = useState(false)
  const [isAssistantOpen, setIsAssistantOpen] = useState(false)

  const loadExplanation = useCallback(async () => {
    if (!lessonId) return

    try {
      setLoadingExplanation(true)
      const data = await learningAssistantService.getLessonExplanation(lessonId, 'ar', 'detailed')
      setExplanation(data)
      setActiveTab('explanation')
    } catch (err) {
      // Error logging is handled by the error interceptor
    } finally {
      setLoadingExplanation(false)
    }
  }, [lessonId])

  const loadLesson = useCallback(async () => {
    if (!lessonId) return

    try {
      setLoading(true)
      const data = await learningAssistantService.getLesson(lessonId)
      setLesson(data)
      // Load explanation by default
      loadExplanation()
    } catch (err) {
      // Error logging is handled by the error interceptor
    } finally {
      setLoading(false)
    }
  }, [lessonId, loadExplanation])

  useEffect(() => {
    if (lessonId) {
      loadLesson()
    }
  }, [lessonId, loadLesson])

  const loadExamples = async () => {
    if (!lessonId) return

    try {
      setLoadingExamples(true)
      const data = await learningAssistantService.getLessonExamples(lessonId, 5, 'medium', 'ar')
      setExamples(data)
      setActiveTab('examples')
    } catch (err) {
      // Error logging is handled by the error interceptor
    } finally {
      setLoadingExamples(false)
    }
  }

  const loadVideos = async () => {
    if (!lessonId) return

    try {
      setLoadingVideos(true)
      const data = await learningAssistantService.getLessonVideos(lessonId)
      setVideos(data)
      setActiveTab('videos')
    } catch (err) {
      // Error logging is handled by the error interceptor
    } finally {
      setLoadingVideos(false)
    }
  }

  const loadMindMap = async () => {
    if (!lessonId) return

    try {
      setLoadingMindMap(true)
      const data = await learningAssistantService.getLessonMindMap(lessonId, 'json', 'ar')
      setMindMap(data)
      setActiveTab('mindmap')
    } catch (err) {
      // Error logging is handled by the error interceptor
    } finally {
      setLoadingMindMap(false)
    }
  }

  const handleAssistantMessage = async (message: string): Promise<string> => {
    if (!lessonId) {
      return 'الرجاء تحديد درس أولاً'
    }

    try {
      // استخدام Learning API للرد على أسئلة المستخدم
      const response = await apiClient.post<{ success: boolean; data: { answer: string } }>(
        `${API_ENDPOINTS.LEARNING.LESSON(lessonId)}/chat`,
        {
          message,
          context: {
            lesson_id: lessonId,
            lesson_title: lesson?.title,
          },
        }
      )

      if (response.success && response.data?.answer) {
        return response.data.answer
      }

      return 'عذراً، لم أتمكن من الإجابة على سؤالك. الرجاء المحاولة مرة أخرى.'
    } catch (error) {
      // Error logging is handled by the error interceptor
      // Fallback: استخدام Learning Service مباشرة
      try {
        const explanation = await learningAssistantService.getLessonExplanation(
          lessonId,
          'ar',
          'simple'
        )
        return `بناءً على الدرس "${lesson?.title}"، ${explanation.explanation.substring(0, 200)}...`
      } catch (err) {
        return 'عذراً، حدث خطأ أثناء معالجة سؤالك.'
      }
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
      {/* Header */}
      <div className="lesson-detail-page__header">
        <div className="lesson-detail-page__header-top">
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate('/lessons')}
            className="lesson-detail-page__back-button"
          >
            <ArrowRight className="w-4 h-4 ml-2" />
            العودة إلى الدروس
          </Button>
          <div className="lesson-detail-page__header-actions">
            <ProtectedButton
              variant="outline"
              size="sm"
              onClick={() => navigate(ROUTES.LESSON_EDIT(lesson.id))}
              leftIcon={<Edit />}
              requiredPermissions={['lessons.update', 'lessons.manage']}
              className="lesson-detail-page__edit-button"
            >
              تعديل
            </ProtectedButton>
            <ProtectedButton
              variant="outline"
              size="sm"
              onClick={() => {
                // TODO: Add delete confirmation modal
                // Delete action handled
              }}
              leftIcon={<Trash2 />}
              requiredPermissions={['lessons.delete', 'lessons.manage']}
              className="lesson-detail-page__delete-button"
            >
              حذف
            </ProtectedButton>
            <Button
              variant="primary"
              size="sm"
              onClick={() => setIsAssistantOpen(true)}
              leftIcon={<Bot />}
              className="lesson-detail-page__assistant-button"
            >
              المساعد الذكي
            </Button>
          </div>
        </div>
        <h1 className="lesson-detail-page__title">{lesson.title}</h1>
        {lesson.content && (
          <p className="lesson-detail-page__description">{lesson.content.substring(0, 200)}...</p>
        )}
      </div>

      {/* Tabs */}
      <div className="lesson-detail-page__tabs">
        <nav className="lesson-detail-page__tab-list" aria-label="Tabs">
          <button
            onClick={loadExplanation}
            className={`lesson-detail-page__tab ${
              activeTab === 'explanation' ? 'lesson-detail-page__tab--active' : ''
            }`}
          >
            <BookOpen className="w-4 h-4 ml-2" />
            الشرح
          </button>
          <button
            onClick={loadExamples}
            className={`lesson-detail-page__tab ${
              activeTab === 'examples' ? 'lesson-detail-page__tab--active' : ''
            }`}
          >
            <Lightbulb className="w-4 h-4 ml-2" />
            الأمثلة
          </button>
          <button
            onClick={loadVideos}
            className={`lesson-detail-page__tab ${
              activeTab === 'videos' ? 'lesson-detail-page__tab--active' : ''
            }`}
          >
            <Video className="w-4 h-4 ml-2" />
            الفيديوهات
          </button>
          <button
            onClick={loadMindMap}
            className={`lesson-detail-page__tab ${
              activeTab === 'mindmap' ? 'lesson-detail-page__tab--active' : ''
            }`}
          >
            <Network className="w-4 h-4 ml-2" />
            الخريطة الذهنية
          </button>
        </nav>
      </div>

      {/* Content */}
      <Card>
        {activeTab === 'explanation' && (
          <div>
            {loadingExplanation ? (
              <div className="lesson-detail-page__content-loading">
                <Loader2 className="lesson-detail-page__content-spinner" />
                <p className="lesson-detail-page__content-text">جارٍ توليد الشرح...</p>
              </div>
            ) : explanation ? (
              <div className="lesson-explanation">
                <div className="lesson-explanation__text">{explanation.explanation}</div>
              </div>
            ) : (
              <div className="lesson-detail-page__content-loading">
                <p className="lesson-detail-page__content-text">اضغط على "الشرح" لتحميل المحتوى</p>
              </div>
            )}
          </div>
        )}

        {activeTab === 'examples' && (
          <div>
            {loadingExamples ? (
              <div className="lesson-detail-page__content-loading">
                <Loader2 className="lesson-detail-page__content-spinner" />
                <p className="lesson-detail-page__content-text">جارٍ توليد الأمثلة...</p>
              </div>
            ) : examples && examples.examples.length > 0 ? (
              <div className="lesson-examples">
                <div className="lesson-examples__list">
                  {examples.examples.map((example: LessonExample, index: number) => (
                    <div key={index} className="lesson-examples__item">
                      <div className="lesson-examples__item-header">
                        <h3 className="lesson-examples__item-title">مثال {index + 1}</h3>
                        <p className="lesson-examples__item-question">{example.question}</p>
                      </div>
                      <div className="lesson-examples__item-solution">
                        <p className="lesson-examples__item-solution-label">الحل:</p>
                        <p className="lesson-examples__item-solution-text">{example.solution}</p>
                      </div>
                      <div className="lesson-examples__item-explanation">
                        <p className="lesson-examples__item-explanation-label">الشرح:</p>
                        <p className="lesson-examples__item-explanation-text">
                          {example.explanation}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="lesson-detail-page__content-loading">
                <p className="lesson-detail-page__content-text">
                  اضغط على "الأمثلة" لتحميل المحتوى
                </p>
              </div>
            )}
          </div>
        )}

        {activeTab === 'videos' && (
          <div>
            {loadingVideos ? (
              <div className="lesson-detail-page__content-loading">
                <Loader2 className="lesson-detail-page__content-spinner" />
                <p className="lesson-detail-page__content-text">جارٍ البحث عن الفيديوهات...</p>
              </div>
            ) : videos && videos.videos.length > 0 ? (
              <div className="lesson-videos">
                <div className="lesson-videos__grid">
                  {videos.videos.map((video: LessonVideo) => (
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
                            <Video className="w-12 h-12 text-gray-400" />
                          </div>
                        )}
                      </div>
                      <div className="lesson-videos__item-content">
                        <h3 className="lesson-videos__item-title">{video.title}</h3>
                        {video.channel && (
                          <p className="lesson-videos__item-channel">{video.channel}</p>
                        )}
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
            ) : (
              <div className="lesson-detail-page__content-loading">
                <p className="lesson-detail-page__content-text">
                  اضغط على "الفيديوهات" للبحث عن المحتوى
                </p>
              </div>
            )}
          </div>
        )}

        {activeTab === 'mindmap' && (
          <div>
            {loadingMindMap ? (
              <div className="lesson-detail-page__content-loading">
                <Loader2 className="lesson-detail-page__content-spinner" />
                <p className="lesson-detail-page__content-text">جارٍ توليد الخريطة الذهنية...</p>
              </div>
            ) : mindMap ? (
              <div className="lesson-mindmap">
                <div className="lesson-mindmap__nodes">
                  <h3 className="lesson-mindmap__nodes-title">العقد الرئيسية</h3>
                  <div className="lesson-mindmap__nodes-list">
                    {mindMap.nodes.map((node: MindMapNode) => (
                      <div
                        key={node.id}
                        className={`lesson-mindmap__node lesson-mindmap__node--${node.type}`}
                      >
                        {node.label}
                      </div>
                    ))}
                  </div>
                </div>
                {mindMap.edges.length > 0 && (
                  <div className="lesson-mindmap__edges">
                    <h3 className="lesson-mindmap__edges-title">العلاقات</h3>
                    <div className="lesson-mindmap__edges-list">
                      {mindMap.edges.map((edge: MindMapEdge, index: number) => {
                        const fromNode = mindMap.nodes.find((n: MindMapNode) => n.id === edge.from)
                        const toNode = mindMap.nodes.find((n: MindMapNode) => n.id === edge.to)
                        return (
                          <div key={index} className="lesson-mindmap__edge">
                            {fromNode?.label} → {toNode?.label}
                          </div>
                        )
                      })}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="lesson-detail-page__content-loading">
                <p className="lesson-detail-page__content-text">
                  اضغط على "الخريطة الذهنية" لتحميل المحتوى
                </p>
              </div>
            )}
          </div>
        )}
      </Card>

      {/* AI Assistant Panel */}
      <AIAssistantPanel
        isOpen={isAssistantOpen}
        onClose={() => setIsAssistantOpen(false)}
        onSendMessage={handleAssistantMessage}
        context={{
          type: 'lesson',
          data: lesson ? (lesson as unknown as Record<string, unknown>) : undefined,
        }}
      />
    </div>
  )
}

export default LessonDetailPage
