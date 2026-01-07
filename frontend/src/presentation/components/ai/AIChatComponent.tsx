/**
 * AI Chat Component - مكون محادثة AI
 *
 * مكون تفاعلي للمحادثة مع الذكاء الاصطناعي
 */

import React, { useState, useRef, useEffect } from 'react'
import { Send, Bot, User, Loader2 } from 'lucide-react'
import { Button, Card } from '../common'
import './AIChatComponent.scss'

export interface ChatMessage {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
}

interface AIChatComponentProps {
  onSendMessage?: (message: string) => Promise<string>
  initialMessages?: ChatMessage[]
  placeholder?: string
  title?: string
}

export const AIChatComponent: React.FC<AIChatComponentProps> = ({
  onSendMessage,
  initialMessages = [],
  placeholder = 'اكتب رسالتك هنا...',
  title = 'محادثة مع المساعد الذكي',
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>(initialMessages)
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLTextAreaElement>(null)

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
      let assistantResponse = ''

      if (onSendMessage) {
        assistantResponse = await onSendMessage(userMessage.content)
      } else {
        // Default response if no handler provided
        assistantResponse = 'شكراً لرسالتك. أنا هنا لمساعدتك!'
      }

      const assistantMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: assistantResponse,
        timestamp: new Date(),
      }

      setMessages(prev => [...prev, assistantMessage])
    } catch (error) {
      console.error('Failed to send message:', error)
      const errorMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: 'عذراً، حدث خطأ أثناء معالجة رسالتك. الرجاء المحاولة مرة أخرى.',
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
    <Card className="ai-chat">
      <div className="ai-chat__header">
        <div className="ai-chat__title">
          <Bot className="ai-chat__icon" />
          <h3>{title}</h3>
        </div>
      </div>

      <div className="ai-chat__messages">
        {messages.length === 0 ? (
          <div className="ai-chat__empty">
            <Bot className="ai-chat__empty-icon" />
            <p>ابدأ محادثة مع المساعد الذكي</p>
          </div>
        ) : (
          messages.map(message => (
            <div key={message.id} className={`ai-chat__message ai-chat__message--${message.role}`}>
              <div className="ai-chat__message-avatar">
                {message.role === 'user' ? <User /> : <Bot />}
              </div>
              <div className="ai-chat__message-content">
                <div className="ai-chat__message-text">{message.content}</div>
                <div className="ai-chat__message-time">
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
          <div className="ai-chat__message ai-chat__message--assistant">
            <div className="ai-chat__message-avatar">
              <Bot />
            </div>
            <div className="ai-chat__message-content">
              <div className="ai-chat__message-text ai-chat__message-text--loading">
                <Loader2 className="ai-chat__loader" />
                <span>جاري الكتابة...</span>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="ai-chat__input-container">
        <textarea
          ref={inputRef}
          className="ai-chat__input"
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder={placeholder}
          rows={1}
          disabled={isLoading}
        />
        <Button
          variant="primary"
          size="md"
          onClick={handleSend}
          disabled={!input.trim() || isLoading}
          leftIcon={isLoading ? <Loader2 /> : <Send />}
          className="ai-chat__send-button"
        >
          إرسال
        </Button>
      </div>
    </Card>
  )
}
