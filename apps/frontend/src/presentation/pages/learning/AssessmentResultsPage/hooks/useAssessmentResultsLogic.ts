import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'

export const useAssessmentResultsLogic = () => {
    const { id } = useParams<{ id: string }>()
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    const [assessment, setAssessment] = useState<any>(null)
    const [submission, setSubmission] = useState<any>(null)
    const [answers, setAnswers] = useState<any>({})
    const [questions, setQuestions] = useState<any[]>([])

    // Computed
    const [isPassed, setIsPassed] = useState(false)

    useEffect(() => {
        // Mock data load
        setTimeout(() => {
            setIsLoading(false)
            if (id === 'error') {
                setError('Failed to load results')
                return
            }

            setAssessment({
                id: id || '1',
                title: 'Mock Assessment Result',
                passingScore: 60
            })

            setSubmission({
                id: 'sub_1',
                score: 85,
                totalScore: 100,
                completedAt: new Date().toISOString()
            })

            setIsPassed(true)

            setQuestions([
                { id: 'q1', text: 'Question 1', correctAnswer: 'A' },
                { id: 'q2', text: 'Question 2', correctAnswer: 'B' }
            ])

            setAnswers({
                'q1': 'A',
                'q2': 'C' // Wrong answer
            })

        }, 500)
    }, [id])

    return {
        assessment,
        submission,
        answers,
        questions,
        isLoading,
        error,
        isPassed
    }
}
