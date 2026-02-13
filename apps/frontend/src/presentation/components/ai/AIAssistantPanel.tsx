import React, { useState } from 'react'
import { Bot, X, Lightbulb, BookOpen, Code2, HelpCircle } from 'lucide-react'
import { Button } from '../common'
import { AIChatComponent, ChatMessage } from './AIChatComponent'
import { useTranslation } from 'react-i18next'
import styles from './AIAssistantPanel.module.scss'

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

export const AIAssistantPanel: React.FC<AIAssistantPanelProps> = ({
  isOpen,
  onClose,
  onSendMessage,
  onStreamMessage,
  context: _context,
}) => {
  const { t } = useTranslation()
  const [messages, setMessages] = useState<ChatMessage[]>([])

  const QUICK_ACTIONS = [
    {
      id: 'explain',
      label: t('ai.actions.explain'),
      icon: BookOpen,
      prompt: t('ai.actions.explain_prompt'),
    },
    {
      id: 'examples',
      label: t('ai.actions.examples'),
      icon: Lightbulb,
      prompt: t('ai.actions.examples_prompt'),
    },
    {
      id: 'code',
      label: t('ai.actions.code'),
      icon: Code2,
      prompt: t('ai.actions.code_prompt'),
    },
    {
      id: 'help',
      label: t('ai.actions.help'),
      icon: HelpCircle,
      prompt: t('ai.actions.help_prompt'),
    },
  ]

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
    <div className={styles.panel}>
      <div className={styles.overlay} onClick={onClose} />
      <div className={styles.content}>
        <div className={styles.header}>
          <div className={styles.title}>
            <Bot className={styles.icon} />
            <h2>{t('ai.assistant_title')}</h2>
          </div>
          <Button variant="ghost" size="sm" onClick={onClose} leftIcon={<X />}>
            {t('ai.close')}
          </Button>
        </div>

        <div className={styles.quickActions}>
          <h3 className={styles.sectionTitle}>{t('ai.quick_actions')}</h3>
          <div className={styles.actionsGrid}>
            {QUICK_ACTIONS.map(action => {
              const Icon = action.icon
              return (
                <Button
                  key={action.id}
                  variant="secondary"
                  size="sm"
                  onClick={() => handleQuickAction(action.prompt)}
                  leftIcon={<Icon />}
                  className={styles.actionButton}
                >
                  {action.label}
                </Button>
              )
            })}
          </div>
        </div>

        <div className={styles.chat}>
          <AIChatComponent
            onSendMessage={onSendMessage}
            onStreamMessage={onStreamMessage}
            initialMessages={messages}
            title={t('ai.chat_title')}
            placeholder={t('ai.input_placeholder')}
          />
        </div>
      </div>
    </div>
  )
}
