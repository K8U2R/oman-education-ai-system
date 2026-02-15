import { useState, useEffect, useCallback } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { ROUTES } from '@/domain/constants'

export const useAssessmentTakeLogic = () => {
    const { id } = useParams<{ id: string }>()
    const navigate = useNavigate()

    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [isSubmitting, setIsSubmitting] = useState(false)

    const [assessment, setAssessment] = useState<any>(null)
    const [questions, setQuestions] = useState<any[]>([])
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
    const [answers, setAnswers] = useState<Record<string, string | string[]>>({})
    const [timeRemaining, setTimeRemaining] = useState(30 * 60) // 30 minutes

    useEffect(() => {
        // Mock load
        setTimeout(() => {
            setIsLoading(false)
            setAssessment({
                id: id || '1',
                title: 'Mock Assessment',
                duration: 30
            })
            setQuestions([
                { id: 'q1', text: 'Question 1', type: 'multiple_choice', options: ['A', 'B'] },
                { id: 'q2', text: 'Question 2', type: 'text' }
            ])
        }, 500)
    }, [id])

    const handleAnswerChange = (questionId: string, value: any) => {
        setAnswers(prev => ({
            ...prev,
            [questionId]: value
        }))
    }

    const handleNext = () => {
        if (currentQuestionIndex < questions.length - 1) {
            setCurrentQuestionIndex(prev => prev + 1)
        }
    }

    const handlePrevious = () => {
        if (currentQuestionIndex > 0) {
            setCurrentQuestionIndex(prev => prev - 1)
        }
    }

    const handleSubmit = useCallback(async () => {
        setIsSubmitting(true)
        try {
            await new Promise(resolve => setTimeout(resolve, 1000))
            navigate(ROUTES.ASSESSMENT_RESULTS(id!)) // Assuming ROUTES.ASSESSMENT_RESULTS returns a function or string builder
        } catch (e) {
            console.error(e)
        } finally {
            setIsSubmitting(false)
        }
    }, [id, navigate])

    const getProgress = () => {
        if (questions.length === 0) return 0
        return ((currentQuestionIndex + 1) / questions.length) * 100
    }

    const currentQuestion = questions[currentQuestionIndex]

    return {
        assessment,
        isLoading,
        error,
        currentQuestion,
        currentQuestionIndex,
        questions,
        answers,
        timeRemaining,
        isSubmitting,
        handleAnswerChange,
        handleNext,
        handlePrevious,
        handleSubmit,
        getProgress
    }
}
