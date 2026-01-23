/**
 * AI Assistant Panel - لوحة المساعد الذكي
 *
 * لوحة جانبية للمساعد الذكي مع خيارات سريعة
 */

import React, { useState } from 'react'
import { Bot, X, Lightbulb, BookOpen, Code2, HelpCircle } from 'lucide-react'
import { Button } from '../common'
import { AIChatComponent, ChatMessage } from './AIChatComponent'

interface AIAssistantPanelProps {
  isOpen: boolean
  onClose: () => void
  onSendMessage?: (message: string) => Promise<string>
  onStreamMessage?: (message: string, onToken: (token: string) => void) => Promise<void>
  context?: {
    type: 'lesson' | 'code' | 'general'
    data?: Record<string, unknown>
  }
}

// ... (Quick Actions Logic)



const QUICK_ACTIONS = [
  {
    id: 'explain',
    label: 'شرح الدرس',
    icon: BookOpen,
    prompt: 'اشرح لي هذا الدرس بطريقة مبسطة',
  },
  {
    id: 'examples',
    label: 'أمثلة عملية',
    icon: Lightbulb,
    prompt: 'أعطني أمثلة عملية على هذا الموضوع',
  },
  {
    id: 'code',
    label: 'شرح الكود',
    icon: Code2,
    prompt: 'اشرح لي هذا الكود خطوة بخطوة',
  },
  {
    id: 'help',
    label: 'مساعدة',
    icon: HelpCircle,
    prompt: 'كيف يمكنني استخدام هذه الميزة؟',
  },
]

export const AIAssistantPanel: React.FC<AIAssistantPanelProps> = ({
  isOpen,
  onClose,
  onSendMessage,
  onStreamMessage,
  context: _context,
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([])

  const handleQuickAction = async (prompt: string) => {
    if (!onSendMessage) return

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: prompt,
      timestamp: new Date(),
    }

    setMessages(prev => [...prev, userMessage])

    try {
      const response = await onSendMessage(prompt)
      const assistantMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: response,
        timestamp: new Date(),
      }
      setMessages(prev => [...prev, assistantMessage])
    } catch (_error) {
      // Error logging is handled by the error interceptor
    }
  }



  if (!isOpen) return null

  return (
    <div className="ai-assistant-panel">
      <div className="ai-assistant-panel__overlay" onClick={onClose} />
      <div className="ai-assistant-panel__content">
        <div className="ai-assistant-panel__header">
          <div className="ai-assistant-panel__title">
            <Bot className="ai-assistant-panel__icon" />
            <h2>المساعد الذكي</h2>
          </div>
          <Button variant="ghost" size="sm" onClick={onClose} leftIcon={<X />}>
            إغلاق
          </Button>
        </div>

        <div className="ai-assistant-panel__quick-actions">
          <h3 className="ai-assistant-panel__section-title">إجراءات سريعة</h3>
          <div className="ai-assistant-panel__actions-grid">
            {QUICK_ACTIONS.map(action => {
              const Icon = action.icon
              return (
                <Button
                  key={action.id}
                  variant="secondary"
                  size="sm"
                  onClick={() => handleQuickAction(action.prompt)}
                  leftIcon={<Icon />}
                  className="ai-assistant-panel__action-button"
                >
                  {action.label}
                </Button>
              )
            })}
          </div>
        </div>

        <div className="ai-assistant-panel__chat">
          <AIChatComponent
            onSendMessage={onSendMessage}
            onStreamMessage={onStreamMessage}
            initialMessages={messages}
            title=""
            placeholder="اسأل المساعد الذكي..."
          />
        </div>
      </div>
    </div>
  )
}
