import React, { useState } from 'react'
import { useAuthStore } from '@/features/user-authentication-management'
import { ProfessionalErrorPanel } from '@/presentation/features/diagnostic-system-ads/components/ProfessionalErrorPanel/ProfessionalErrorPanel'
import { ChatPanel, Message } from './chat/ChatPanel'
import { WorkspacePanel } from './WorkspacePanel'
import { useMastermindStream } from '@/features/ai-orchestration-mastermind/hooks/useMastermindStream'

export const AICanvasPage: React.FC = () => {
  const { user } = useAuthStore()

  // Use Sovereign Mastermind Hook
  const { sendMessage, isStreaming, currentExplanation, error, resetError } = useMastermindStream()

  // Local Chat State (UI only)
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome',
      role: 'assistant',
      content: `أهلاً بك يا ${user?.fullName || 'صديقي'}! 🎓\nأنا معلمك الذكي. كيف يمكنني مساعدتك في رحلتك التعليمية اليوم؟`,
      timestamp: new Date(),
    },
  ])
  const [codeContext, setCodeContext] = useState<string>('')

  // Dynamic Code Extraction (Real-time)
  React.useEffect(() => {
    if (!currentExplanation) return;

    // Simple regex to find the last code block
    // Matches ```language ... ```
    const codeBlockRegex = /```(\w+)?\n([\s\S]*?)```/g;
    let match;
    let lastCode = '';

    while ((match = codeBlockRegex.exec(currentExplanation)) !== null) {
      lastCode = match[2] || ''; // The code content
    }

    if (lastCode) {
      setCodeContext(lastCode.trim());
    }
  }, [currentExplanation]);

  const handleSendMessage = async (text: string) => {
    // 1. Add User Message immediately
    const userMsg: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: text,
      timestamp: new Date(),
    }
    setMessages(prev => [...prev, userMsg])

    // 2. Trigger Mastermind
    await sendMessage(text, user?.id)
  }

  if (error) {
    return (
      <div className="h-screen bg-background p-8 flex items-center justify-center">
        <div className="w-full max-w-3xl">
          <ProfessionalErrorPanel error={error} onRetry={resetError} />
        </div>
      </div>
    )
  }

  return (
    <div className="h-[calc(100vh-4rem)] flex overflow-hidden border-t border-border">
      {/* Chat Side - 30% */}
      <div className="w-[350px] shrink-0 border-l border-border hidden md:block">
        <ChatPanel messages={messages} onSendMessage={handleSendMessage} isLoading={isStreaming} />
      </div>

      {/* Workspace Side - Remaining */}
      <div className="flex-1 min-w-0">
        <WorkspacePanel
          explanation={currentExplanation} // Connected to Stream
          codeContext={codeContext}
          isStreaming={isStreaming}
        />
      </div>
    </div>
  )
}
