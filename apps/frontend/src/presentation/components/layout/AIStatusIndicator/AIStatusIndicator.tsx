/**
 * AI Status Indicator - مؤشر حالة الذكاء الاصطناعي
 *
 * يعرض حالة الاتصال بالذكاء الاصطناعي في الهيدر
 * تم تحسينه مع Tooltip و Click to View Details
 */

import React, { useState, useEffect, useRef } from 'react'
import { Brain, Wifi, WifiOff, ChevronRight } from 'lucide-react'
import { cn } from '../../common/utils/classNames'

type AIStatus = 'connected' | 'disconnected' | 'thinking'

interface AIStatusDetails {
  status: AIStatus
  message: string
  lastChecked: Date
  responseTime?: number
}

/**
 * AIStatusIndicator Component
 *
 * @example
 * ```tsx
 * <AIStatusIndicator />
 * ```
 */
const AIStatusIndicator: React.FC = () => {
  const [status, setStatus] = useState<AIStatus>('connected')
  const [isVisible] = useState(true)
  const [showTooltip, setShowTooltip] = useState(false)
  const [showDetails, setShowDetails] = useState(false)
  const [details, setDetails] = useState<AIStatusDetails>({
    status: 'connected',
    message: 'متصل',
    lastChecked: new Date(),
  })
  const tooltipRef = useRef<HTMLDivElement>(null)
  const indicatorRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // Simulate AI status checking
    // In production, this would check actual AI service status
    const checkAIStatus = () => {
      // For now, simulate connected status
      // You can replace this with actual API call to check AI service
      const isConnected = true // Replace with actual check
      const newStatus = isConnected ? 'connected' : 'disconnected'
      setStatus(newStatus)

      setDetails({
        status: newStatus,
        message: isConnected ? 'متصل' : 'غير متصل',
        lastChecked: new Date(),
        responseTime: isConnected ? Math.floor(Math.random() * 100) + 50 : undefined,
      })
    }

    checkAIStatus()
    const interval = setInterval(checkAIStatus, 30000) // Check every 30 seconds

    return () => clearInterval(interval)
  }, [])

  // Calculate tooltip/details position to prevent overflow
  useEffect(() => {
    const updatePosition = () => {
      if (!indicatorRef.current) return

      const indicatorRect = indicatorRef.current.getBoundingClientRect()
      const viewportWidth = window.innerWidth
      const viewportHeight = window.innerHeight

      // Update tooltip position
      if (tooltipRef.current && showTooltip && !showDetails) {
        const tooltip = tooltipRef.current

        // First render to get dimensions
        tooltip.style.visibility = 'hidden'
        tooltip.style.display = 'block'
        const tooltipRect = tooltip.getBoundingClientRect()

        // Calculate position
        let top = indicatorRect.top - tooltipRect.height - 8 // 8px spacing
        let right = viewportWidth - indicatorRect.right

        // Adjust if tooltip would overflow top
        if (top < 8) {
          top = indicatorRect.bottom + 8 // Show below instead
        }

        // Adjust if tooltip would overflow right
        if (right + tooltipRect.width > viewportWidth - 8) {
          right = viewportWidth - tooltipRect.width - 8
        }

        // Adjust if tooltip would overflow left
        if (right < 8) {
          right = 8
        }

        // Apply position
        tooltip.style.top = `${top}px`
        tooltip.style.right = `${right}px`
        tooltip.style.bottom = 'auto'
        tooltip.style.left = 'auto'
        tooltip.style.visibility = 'visible'
      }

      // Update details position
      if (tooltipRef.current && showDetails) {
        const details = tooltipRef.current

        // First render to get dimensions
        details.style.visibility = 'hidden'
        details.style.display = 'block'
        const detailsRect = details.getBoundingClientRect()

        // Calculate position
        let top = indicatorRect.top - detailsRect.height - 8 // 8px spacing
        let right = viewportWidth - indicatorRect.right

        // Adjust if details would overflow top
        if (top < 8) {
          top = indicatorRect.bottom + 8 // Show below instead
        }

        // Adjust if details would overflow right
        if (right + detailsRect.width > viewportWidth - 8) {
          right = viewportWidth - detailsRect.width - 8
        }

        // Adjust if details would overflow left
        if (right < 8) {
          right = 8
        }

        // Adjust if details would overflow bottom
        if (top + detailsRect.height > viewportHeight - 8) {
          top = Math.max(8, viewportHeight - detailsRect.height - 8)
        }

        // Apply position
        details.style.top = `${top}px`
        details.style.right = `${right}px`
        details.style.bottom = 'auto'
        details.style.left = 'auto'
        details.style.visibility = 'visible'
      }
    }

    if (showTooltip || showDetails) {
      updatePosition()
      window.addEventListener('resize', updatePosition)
      window.addEventListener('scroll', updatePosition, true)
    }

    return () => {
      window.removeEventListener('resize', updatePosition)
      window.removeEventListener('scroll', updatePosition, true)
    }
  }, [showTooltip, showDetails])

  // Close tooltip when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        tooltipRef.current &&
        indicatorRef.current &&
        !tooltipRef.current.contains(event.target as Node) &&
        !indicatorRef.current.contains(event.target as Node)
      ) {
        setShowTooltip(false)
        setShowDetails(false)
      }
    }

    if (showTooltip || showDetails) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [showTooltip, showDetails])

  if (!isVisible) return null

  const getStatusIcon = () => {
    switch (status) {
      case 'connected':
        return <Wifi className="ai-status__icon ai-status__icon--connected" />
      case 'disconnected':
        return <WifiOff className="ai-status__icon ai-status__icon--disconnected" />
      case 'thinking':
        return <Brain className="ai-status__icon ai-status__icon--thinking" />
      default:
        return <Brain className="ai-status__icon" />
    }
  }

  const getStatusText = () => {
    switch (status) {
      case 'connected':
        return 'متصل'
      case 'disconnected':
        return 'غير متصل'
      case 'thinking':
        return 'جاري المعالجة...'
      default:
        return 'غير معروف'
    }
  }

  const getStatusColor = () => {
    switch (status) {
      case 'connected':
        return 'var(--color-success-500, #10b981)'
      case 'disconnected':
        return 'var(--color-error-500, #ef4444)'
      case 'thinking':
        return 'var(--color-warning-500, #f59e0b)'
      default:
        return 'var(--color-gray-500, #6b7280)'
    }
  }

  const handleClick = () => {
    setShowDetails(true)
    setShowTooltip(false)
  }

  const formatTime = (date: Date): string => {
    return new Intl.DateTimeFormat('ar-OM', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    }).format(date)
  }

  return (
    <div className="ai-status" ref={indicatorRef}>
      <button
        className={cn('ai-status__button', status && `ai-status__button--${status}`)}
        onClick={handleClick}
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => !showDetails && setShowTooltip(false)}
        aria-label={`حالة الذكاء الاصطناعي: ${getStatusText()}`}
        aria-expanded={showDetails}
      >
        {getStatusIcon()}
      </button>

      {/* Tooltip */}
      {showTooltip && !showDetails && (
        <div ref={tooltipRef} className="ai-status__tooltip" role="tooltip">
          <div className="ai-status__tooltip-content">
            <div className="ai-status__tooltip-header">
              <span className="ai-status__tooltip-status">{getStatusText()}</span>
              <span
                className="ai-status__tooltip-dot"
                style={{ backgroundColor: getStatusColor() }}
              />
            </div>
            <p className="ai-status__tooltip-message">{details.message}</p>
            <p className="ai-status__tooltip-hint">انقر لعرض التفاصيل</p>
          </div>
        </div>
      )}

      {/* Details Panel */}
      {showDetails && (
        <div
          ref={tooltipRef}
          className="ai-status__details"
          role="dialog"
          aria-labelledby="ai-status-details-title"
        >
          <div className="ai-status__details-header">
            <h3 id="ai-status-details-title" className="ai-status__details-title">
              تفاصيل حالة الذكاء الاصطناعي
            </h3>
            <button
              className="ai-status__details-close"
              onClick={() => setShowDetails(false)}
              aria-label="إغلاق التفاصيل"
            >
              ×
            </button>
          </div>

          <div className="ai-status__details-content">
            <div className="ai-status__details-item">
              <span className="ai-status__details-label">الحالة:</span>
              <span
                className={cn('ai-status__details-value', `ai-status__details-value--${status}`)}
              >
                {getStatusIcon()}
                {getStatusText()}
              </span>
            </div>

            <div className="ai-status__details-item">
              <span className="ai-status__details-label">الرسالة:</span>
              <span className="ai-status__details-value">{details.message}</span>
            </div>

            <div className="ai-status__details-item">
              <span className="ai-status__details-label">آخر فحص:</span>
              <span className="ai-status__details-value">{formatTime(details.lastChecked)}</span>
            </div>

            {details.responseTime && (
              <div className="ai-status__details-item">
                <span className="ai-status__details-label">وقت الاستجابة:</span>
                <span className="ai-status__details-value">{details.responseTime}ms</span>
              </div>
            )}
          </div>

          <div className="ai-status__details-footer">
            <button
              className="ai-status__details-action"
              onClick={() => {
                // Refresh status
                setDetails({
                  ...details,
                  lastChecked: new Date(),
                })
              }}
            >
              <ChevronRight className="ai-status__details-action-icon" />
              تحديث الحالة
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default AIStatusIndicator
