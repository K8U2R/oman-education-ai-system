import React, { useState, useEffect, useRef } from 'react'
import { Brain, WifiOff, RefreshCw, X } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { cn } from '../../common/utils/classNames'
import { useAIStatusStore } from '@/stores/useAIStatusStore'
import { TokenRing } from './components/TokenRing'
import { DevConsole } from './components/DevConsole'
import { useRole } from '@/features/user-authentication-management'
import styles from './AIStatusIndicator.module.scss'

type AIStatus = 'connected' | 'disconnected' | 'thinking'

const AIStatusIndicator: React.FC = () => {
  const { t } = useTranslation('common')
  const { usage, fetchUsage, logs, isLoading } = useAIStatusStore()
  const { isDeveloper } = useRole()

  const [status] = useState<AIStatus>('connected')
  const [isVisible] = useState(true)
  const [showTooltip, setShowTooltip] = useState(false)
  const [showDetails, setShowDetails] = useState(false)
  const [isMobile, setIsMobile] = useState(false)

  const tooltipRef = useRef<HTMLDivElement>(null)
  const indicatorRef = useRef<HTMLDivElement>(null)

  // Detect Mobile
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Initial Fetch & Polling
  useEffect(() => {
    fetchUsage();
    const interval = setInterval(fetchUsage, 60000);
    return () => clearInterval(interval);
  }, []);

  // Determine Visual State
  const usagePercentage = usage ? Math.min(100, Math.round((usage.used / usage.limit) * 100)) : 0;

  // Calculate Position Logic (Desktop Only)
  useEffect(() => {
    if (isMobile) return; // Skip for mobile

    const updatePosition = () => {
      if (!indicatorRef.current || !tooltipRef.current) return

      const indicatorRect = indicatorRef.current.getBoundingClientRect()
      const viewportWidth = window.innerWidth
      const element = tooltipRef.current

      // Reset to get dimensions
      element.style.visibility = 'hidden'
      element.style.display = 'block'
      const rect = element.getBoundingClientRect()

      let top = indicatorRect.bottom + 8
      let right = viewportWidth - indicatorRect.right

      // Boundary checks
      if (right + rect.width > viewportWidth - 8) {
        right = 8
      }

      element.style.top = `${top}px`
      element.style.right = `${right}px`
      element.style.visibility = 'visible'
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
  }, [showTooltip, showDetails, isMobile])

  // Close clicks outside (Desktop)
  useEffect(() => {
    if (isMobile) return;

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
    if (showTooltip || showDetails) document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [showTooltip, showDetails, isMobile])

  if (!isVisible) return null

  // Helper colors
  const getStatusColor = () => {
    if (status === 'disconnected') return 'var(--color-error-500, #ef4444)';
    if (status === 'thinking') return 'var(--color-warning-500, #f59e0b)';
    return 'var(--color-success-500, #10b981)';
  }

  return (
    <div className={styles['ai-status']} ref={indicatorRef} dir="rtl">
      <button
        className={cn(styles['ai-status__button'])}
        onClick={() => { setShowDetails(!showDetails); setShowTooltip(false); }}
        onMouseEnter={() => !isMobile && setShowTooltip(true)}
        onMouseLeave={() => !isMobile && !showDetails && setShowTooltip(false)}
        aria-label={t('ai_status.connection_status')}
        aria-expanded={showDetails}
      >
        <TokenRing percentage={usagePercentage} size={38} strokeWidth={2.5}>
          {status === 'thinking' ? (
            <Brain className="w-5 h-5 text-amber-500 animate-pulse" />
          ) : status === 'disconnected' ? (
            <WifiOff className="w-5 h-5 text-red-500" />
          ) : (
            <Brain className="w-5 h-5 text-primary-600 dark:text-primary-400" />
          )}
        </TokenRing>
      </button>

      {/* Hover Tooltip (Desktop Only) */}
      {!isMobile && showTooltip && !showDetails && (
        <div ref={tooltipRef} className={styles['ai-status__tooltip']} role="tooltip">
          <div className="flex justify-between items-center mb-2 gap-2">
            <span className="text-sm font-semibold text-gray-900 dark:text-white">{t('ai_status.connection_status')}</span>
            <span className="w-2 h-2 rounded-full" style={{ backgroundColor: getStatusColor() }} />
          </div>
          {usage && (
            <div className="text-xs text-gray-600 dark:text-gray-400 font-medium">
              <div className="flex justify-between w-full mb-1">
                <span>{t('ai_status.consumed')}</span>
                <span dir="ltr">{usage.used} / {usage.limit}</span>
              </div>
              <div className="mt-1 h-1 w-full bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                <div
                  className="h-full bg-primary-500"
                  style={{ width: `${usagePercentage}%` }}
                />
              </div>
            </div>
          )}
          <div className="mt-2 text-[10px] text-gray-400 text-center">{t('ai_status.click_details')}</div>
        </div>
      )}

      {/* Command Center Panel (Responsive) */}
      {showDetails && (
        <>
          {/* Mobile Backdrop */}
          {isMobile && (
            <div
              className={styles['ai-status__backdrop']}
              onClick={() => setShowDetails(false)}
            />
          )}

          <div
            ref={tooltipRef}
            className={cn(
              styles['ai-status__panel'],
              isMobile ? styles['ai-status__panel--mobile'] : styles['ai-status__panel--desktop']
            )}
            role="dialog"
          >
            <div className={styles['ai-status__header']}>
              <h3>
                <Brain className="w-4 h-4 text-primary-500 ml-2" />
                {t('ai_status.command_center')}
              </h3>
              <div className="flex gap-2">
                <button
                  onClick={(e) => { e.stopPropagation(); fetchUsage(); }}
                  className={cn("p-1.5 rounded-md hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors", isLoading && "animate-spin")}
                  title={t('ai_status.refresh_data')}
                >
                  <RefreshCw className="w-3.5 h-3.5 text-gray-500" />
                </button>
                {isMobile && (
                  <button
                    onClick={() => setShowDetails(false)}
                    className="p-1.5 rounded-md hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                  >
                    <X className="w-4 h-4 text-gray-500" />
                  </button>
                )}
              </div>
            </div>

            <div className={styles['ai-status__body']}>
              {/* Usage Stats Dashboard */}
              <div className={styles['ai-status__stats']}>
                <div className="flex justify-between items-baseline mb-2">
                  <span className="text-sm font-medium text-gray-600 dark:text-gray-300">{t('ai_status.daily_quota')}</span>
                  <span className="text-lg font-bold text-gray-900 dark:text-white font-mono" dir="ltr">
                    {usage ? `${usage.used.toLocaleString()} / ${usage.limit.toLocaleString()}` : '...'}
                  </span>
                </div>

                <div className="relative pt-1">
                  <div className="flex mb-2 items-center justify-between">
                    <div className="text-left w-full">
                      <span className={cn(
                        "text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full",
                        usagePercentage > 90 ? "text-red-600 bg-red-200" :
                          usagePercentage > 75 ? "text-yellow-600 bg-yellow-200" : "text-green-600 bg-green-200"
                      )} dir="ltr">
                        {usagePercentage}%
                      </span>
                    </div>
                  </div>
                  <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-gray-200 dark:bg-gray-700">
                    <div
                      style={{ width: `${usagePercentage}%` }}
                      className={cn("shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center transition-all duration-500",
                        usagePercentage > 90 ? 'bg-red-500' :
                          usagePercentage > 75 ? 'bg-yellow-500' : 'bg-green-500'
                      )}
                    ></div>
                  </div>
                </div>

                <div className="flex justify-between text-xs text-gray-500 border-t border-gray-100 dark:border-gray-700 pt-2">
                  <div className="flex items-center gap-1">
                    <span>{t('ai_status.tier')}</span>
                    <span className="font-medium text-gray-900 dark:text-gray-200">
                      {usage?.tier === 'professional' ? t('ai_status.tier_professional') : usage?.tier === 'enterprise' ? t('ai_status.tier_enterprise') : t('ai_status.tier_free')}
                    </span>
                  </div>
                  <div className="flex items-center gap-1">
                    <RefreshCw className="w-3 h-3" />
                    <span>{t('ai_status.resets_at')} {usage ? new Date(usage.resetDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '--:--'}</span>
                  </div>
                </div>
              </div>

              {/* Developer Console (Restricted & Responsive) */}
              {isDeveloper && (
                <div className="animate-in slide-in-from-bottom duration-500 delay-100">
                  <DevConsole logs={logs} isVisible={true} />
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  )
}

export default AIStatusIndicator
