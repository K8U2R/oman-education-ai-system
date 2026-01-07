/**
 * AI Status Indicator - مؤشر حالة الذكاء الاصطناعي
 *
 * يعرض حالة الاتصال بالذكاء الاصطناعي في الهيدر
 */

import React, { useState, useEffect } from 'react'
import { Brain, Wifi, WifiOff } from 'lucide-react'
import './AIStatusIndicator.scss'

type AIStatus = 'connected' | 'disconnected' | 'thinking'

const AIStatusIndicator: React.FC = () => {
  const [status, setStatus] = useState<AIStatus>('connected')
  const [isVisible] = useState(true)

  useEffect(() => {
    // Simulate AI status checking
    // In production, this would check actual AI service status
    const checkAIStatus = () => {
      // For now, simulate connected status
      // You can replace this with actual API call to check AI service
      const isConnected = true // Replace with actual check
      setStatus(isConnected ? 'connected' : 'disconnected')
    }

    checkAIStatus()
    const interval = setInterval(checkAIStatus, 30000) // Check every 30 seconds

    return () => clearInterval(interval)
  }, [])

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

  return (
    <div className="ai-status" title={`حالة الذكاء الاصطناعي: ${getStatusText()}`}>
      <div className="ai-status__container">
        {getStatusIcon()}
        <span className="ai-status__text">{getStatusText()}</span>
      </div>
    </div>
  )
}

export default AIStatusIndicator
