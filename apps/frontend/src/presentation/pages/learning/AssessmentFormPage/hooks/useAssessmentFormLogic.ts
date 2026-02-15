import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { ROUTES } from '@/domain/constants'

export const useAssessmentFormLogic = (inputAssessmentId?: string) => {
    const { id: paramId } = useParams<{ id: string }>()
    const assessmentId = inputAssessmentId || paramId
    const isEdit = !!assessmentId

    const navigate = useNavigate()
    const [loading, setLoading] = useState(false)
    const [loadingAssessment, setLoadingAssessment] = useState(isEdit)
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        type: 'quiz', // quiz, exam, assignment
        duration: 30,
        passingScore: 60,
        status: 'draft'
    })
    const [questions, setQuestions] = useState<any[]>([])

    useEffect(() => {
        if (isEdit) {
            // Mock load logic
            setTimeout(() => {
                setFormData({
                    title: 'Mock Assessment',
                    description: 'Loaded for editing',
                    type: 'quiz',
                    duration: 45,
                    passingScore: 70,
                    status: 'draft'
                })
                setQuestions([
                    { id: 'q1', text: 'Sample Question 1', type: 'multiple_choice', options: ['A', 'B', 'C'], correctAnswer: 'A' }
                ])
                setLoadingAssessment(false)
            }, 500)
        }
    }, [isEdit])

    const handleAddQuestion = () => {
        const newQuestion = {
            id: `new_${Date.now()}`,
            text: '',
            type: 'multiple_choice',
            options: ['', '', '', ''],
            correctAnswer: ''
        }
        setQuestions([...questions, newQuestion])
    }

    const handleRemoveQuestion = (id: string) => {
        setQuestions(questions.filter(q => q.id !== id))
    }

    const handleQuestionChange = (id: string, field: string, value: any) => {
        setQuestions(questions.map(q =>
            q.id === id ? { ...q, [field]: value } : q
        ))
    }

    const handleMoveQuestion = (dragIndex: number, hoverIndex: number) => {
        const newQuestions = [...questions]
        const [removed] = newQuestions.splice(dragIndex, 1)
        newQuestions.splice(hoverIndex, 0, removed)
        setQuestions(newQuestions)
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        try {
            // Mock API call
            await new Promise(resolve => setTimeout(resolve, 1000))
            navigate(ROUTES.ASSESSMENTS)
        } catch (error) {
            console.error(error)
        } finally {
            setLoading(false)
        }
    }

    return {
        loading,
        loadingAssessment,
        formData,
        setFormData,
        questions,
        handleAddQuestion,
        handleRemoveQuestion,
        handleQuestionChange,
        handleMoveQuestion,
        handleSubmit,
        isEdit
    }
}
