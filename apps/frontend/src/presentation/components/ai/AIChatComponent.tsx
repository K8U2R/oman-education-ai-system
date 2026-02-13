import React, { useState, useRef, useEffect } from 'react'
import { Send, Bot, User, Loader2 } from 'lucide-react'
import { Button, Card } from '../common'
import { useTranslation } from 'react-i18next'
import styles from './AIChatComponent.module.scss'

export interface ChatMessage {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
}

interface AIChatComponentProps {
  onSendMessage?: (message: string) => Promise<string>
  onStreamMessage?: (message: string, onToken: (token: string) => void) => Promise<void>
  initialMessages?: ChatMessage[]
  placeholder?: string
  title?: string
}

export const AIChatComponent: React.FC<AIChatComponentProps> = ({
  onSendMessage,
  onStreamMessage,
  initialMessages = [],
  placeholder,
  title,
}) => {
  const { t } = useTranslation()
  const [messages, setMessages] = useState<ChatMessage[]>(initialMessages)
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLTextAreaElement>(null)

  const effectivePlaceholder = placeholder || t('ai.input_placeholder')
  const effectiveTitle = title || t('ai.chat_title')

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  const handleSend = async () => {
    if (!input.trim() || isLoading) return

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: input.trim(),
      timestamp: new Date(),
    }

    setMessages(prev => [...prev, userMessage])
    setInput('')
    setIsLoading(true)

    try {
      if (onStreamMessage) {
        // Prepare assistant message placeholder
        const assistantMsgId = (Date.now() + 1).toString()
        const assistantMessage: ChatMessage = {
          id: assistantMsgId,
          role: 'assistant',
          content: '',
          timestamp: new Date(),
        }
        setMessages(prev => [...prev, assistantMessage])

        // Stream Callback
        await onStreamMessage(userMessage.content, (token) => {
          setMessages(prev => prev.map(msg =>
            msg.id === assistantMsgId ? { ...msg, content: msg.content + token } : msg
          ))
        })

      } else if (onSendMessage) {
        // Fallback for non-streaming
        const response = await onSendMessage(userMessage.content)
        const assistantMessage: ChatMessage = {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content: response,
          timestamp: new Date(),
        }
        setMessages(prev => [...prev, assistantMessage])
      } else {
        const assistantMessage: ChatMessage = {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content: t('ai.default_response'),
          timestamp: new Date(),
        }
        setMessages(prev => [...prev, assistantMessage])
      }
    } catch (error) {
      console.error('Failed to send message:', error)
      const errorMessage: ChatMessage = {
        id: (Date.now() + 2).toString(),
        role: 'assistant',
        content: t('ai.error_response'),
        timestamp: new Date(),
      }
      setMessages(prev => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
      inputRef.current?.focus()
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  return (
    <Card className={styles.container}>
      <div className={styles.header}>
        <div className={styles.title}>
          <Bot className={styles.icon} />
          <h3>{effectiveTitle}</h3>
        </div>
      </div>

      <div className={styles.messages}>
        {messages.length === 0 ? (
          <div className={styles.empty}>
            <Bot className={styles.emptyIcon} />
            <p>{t('ai.start_chat')}</p>
          </div>
        ) : (
          messages.map(message => (
            <div key={message.id} className={`${styles.message} ${message.role === 'user' ? styles['message--user'] : styles['message--assistant']}`}>
              <div className={styles.avatar}>
                {message.role === 'user' ? <User /> : <Bot />}
              </div>
              <div className={styles.contentWrapper}>
                <div className={styles.text}>{message.content}</div>
                <div className={styles.time}>
                  {message.timestamp.toLocaleTimeString('ar-SA', {
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </div>
              </div>
            </div>
          ))
        )}
        {isLoading && (
          <div className={`${styles.message} ${styles['message--assistant']}`}>
            <div className={styles.avatar}>
              <Bot />
            </div>
            <div className={styles.contentWrapper}>
              <div className={`${styles.text} ${styles['text--loading']}`}>
                <Loader2 className={styles.loader} />
                <span>{t('ai.typing')}</span>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className={styles.inputContainer}>
        <textarea
          ref={inputRef}
          className={styles.input}
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder={effectivePlaceholder}
          rows={1}
          disabled={isLoading}
        />
        <Button
          variant="primary"
          size="md"
          onClick={handleSend}
          disabled={!input.trim() || isLoading}
          leftIcon={isLoading ? <Loader2 /> : <Send />}
          className={styles.sendButton}
        >
          {t('ai.send')}
        </Button>
      </div>
    </Card>
  )
}
