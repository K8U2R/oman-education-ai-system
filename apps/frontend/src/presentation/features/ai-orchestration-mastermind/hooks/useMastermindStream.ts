import { useState, useRef, useCallback, useEffect } from 'react'
import { aiService, type AIInteractionRequest } from '../services'
import { ProfessionalErrorPanelProps } from '@/presentation/features/diagnostic-system-ads/components/ProfessionalErrorPanel/ProfessionalErrorPanel'
import { SSEService, type SSEEvent } from '@/infrastructure/services/communication/sse.service'
import { API_BASE_URL, API_ENDPOINTS } from '@/domain/constants/api.constants'

interface UseMastermindStreamResult {
  sendMessage: (text: string, userId?: string) => Promise<void>
  isStreaming: boolean
  currentExplanation: string
  currentExamples: string[]
  error: ProfessionalErrorPanelProps['error'] | null
  resetError: () => void
  latency: number | null
}

export const useMastermindStream = (): UseMastermindStreamResult => {
  const [isStreaming, setIsStreaming] = useState(false)
  const [currentExplanation, setCurrentExplanation] = useState('')
  const [currentExamples, setCurrentExamples] = useState<string[]>([])
  const [error, setError] = useState<ProfessionalErrorPanelProps['error'] | null>(null)
  const [latency, setLatency] = useState<number | null>(null)

  // Monitoring Refs
  const startTimeRef = useRef<number | 0>(0)
  const isFirstTokenRef = useRef<boolean>(true)

  // SSE Service Instance
  const sseService = useRef<SSEService | null>(null)

  // Auth Integration
  // Using direct service access or hook if available. 
  // Assuming authService is available via dependency or singleton.
  // For hooks, we usually pass user as prop or use context. 
  // But here we are inside a hook, so we can use useAuth if it exists, or just get from storage for the connection.

  // Let's import authService to get the current token.
  // import { authService } from '@/infrastructure/services/auth/auth.service'; (Need to add import at top)

  // Initialize SSE Connection
  useEffect(() => {
    const initializeStream = async () => {
      // Correct URL construction using the new constant
      const streamUrl = `${API_BASE_URL}${API_ENDPOINTS.AI.STREAM}`
      sseService.current = new SSEService(streamUrl)

      // Handler for incoming tokens
      const handleToken = (event: SSEEvent) => {
        const data = event.data as {
          start?: boolean
          token?: string
          done?: boolean
          examples?: string[]
        }

        if (data.start) {
          setIsStreaming(true)
        }

        if (data.token) {
          // Calculate TTFT on first token
          if (isFirstTokenRef.current && startTimeRef.current > 0) {
            const now = performance.now()
            setLatency(now - startTimeRef.current)
            isFirstTokenRef.current = false
          }
          setCurrentExplanation(prev => prev + data.token)
        }

        if (data.examples) {
          setCurrentExamples(data.examples)
        }

        if (data.done) {
          setIsStreaming(false)
          isFirstTokenRef.current = true // Reset for next turn
        }
      }

      // Handler for errors
      const handleError = (event: SSEEvent) => {
        console.error('Mastermind SSE Error:', event)
        setIsStreaming(false)
        // Only show error if not a normal close/disconnect or if persistent
        // For now, keep it visible
        setError({
          code: 'MASTERMIND_STREAM_ERROR',
          message: 'انقطع الاتصال بالمعلم الذكي.',
          technicalDetails: {
            service: 'MastermindSSE',
            file: 'hooks/useMastermindStream.ts',
            context: {
              error: JSON.stringify(event.data),
            },
          },
        })
      }

      // Get missing Token
      // Dynamic import to avoid cycles or context issues if simple
      // Get missing Token
      const { authService } = await import('@/presentation/features/user-authentication-management/api/auth.service');
      const token = authService.getAccessToken();

      sseService.current.connect(token || undefined)

      sseService.current.on('message', handleToken)
      sseService.current.on('token', handleToken) // Support named event if backend sends it
      sseService.current.on('error', handleError)
    };

    initializeStream();

    return () => {
      sseService.current?.disconnect()
    }
  }, [])

  const sendMessage = useCallback(async (text: string, userIdInput?: string) => {
    setIsStreaming(true) // Optimistic streaming state
    setError(null)
    setLatency(null) // Reset latency display
    setCurrentExplanation('') // Clear previous text
    setCurrentExamples([])

    startTimeRef.current = performance.now()
    isFirstTokenRef.current = true

    try {
      // Get real User ID if not provided
      let finalUserId = userIdInput;
      if (!finalUserId) {
        const { authService } = await import('@/presentation/features/user-authentication-management/api/auth.service');
        try {
          const user = await authService.getCurrentUser();
          finalUserId = user?.id || 'guest';
        } catch (error) {
          console.warn('Could not fetch user, defaulting to guest', error);
          finalUserId = 'guest';
        }
      }

      const request: AIInteractionRequest = {
        message: text,
        userId: finalUserId,
        context: {
          proficiencyLevel: 3, // Default
          currentSubject: 'general',
        },
      }

      // Trigger AI generation via POST.
      // The backend should recognize the userId/session and push tokens to the SSE channel.
      await aiService.interact(request)
    } catch (err: unknown) {
      const errorObj = err as Error
      setIsStreaming(false)

      const adsError = {
        code: 'MASTERMIND_CONNECTION_FAILURE',
        message: 'فشل إرسال الطلب للمعلم الذكي.',
        technicalDetails: {
          service: 'MastermindEmbassy',
          file: 'hooks/useMastermindStream.ts',
          functionName: 'sendMessage',
          stack: errorObj.stack,
          context: {
            error: errorObj.message,
            latencyMs: performance.now() - startTimeRef.current,
          },
        },
      }
      setError(adsError)
    }
  }, [])

  const resetError = () => setError(null)

  return {
    sendMessage,
    isStreaming,
    currentExplanation,
    currentExamples,
    error,
    resetError,
    latency,
  }
}
