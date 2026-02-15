import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { ROUTES } from '@/domain/constants'

export const useAssessmentsPageLogic = () => {
    const navigate = useNavigate()
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [assessments, setAssessments] = useState<any[]>([])

    // Filters
    const [searchTerm, setSearchTerm] = useState('')
    const [typeFilter, setTypeFilter] = useState('all')
    const [statusFilter, setStatusFilter] = useState('all')

    // Pagination
    const [page, setPage] = useState(1)
    const [totalPages, setTotalPages] = useState(1)

    useEffect(() => {
        setIsLoading(true)
        // Mock API call
        setTimeout(() => {
            setAssessments([
                { id: '1', title: 'Math Quiz', type: 'quiz', status: 'published', questionsCount: 10, duration: 15 },
                { id: '2', title: 'Physics Exam', type: 'exam', status: 'draft', questionsCount: 25, duration: 60 },
            ].filter(a => {
                if (searchTerm && !a.title.toLowerCase().includes(searchTerm.toLowerCase())) return false
                if (typeFilter !== 'all' && a.type !== typeFilter) return false
                if (statusFilter !== 'all' && a.status !== statusFilter) return false
                return true
            }))
            setTotalPages(1)
            setIsLoading(false)
        }, 500)
    }, [searchTerm, typeFilter, statusFilter, page])

    const handleAssessmentClick = (id: string) => {
        navigate(ROUTES.ASSESSMENT_DETAIL(id))
    }

    const handleNewAssessment = () => {
        navigate(ROUTES.ASSESSMENT_FORM())
    }

    return {
        assessments,
        isLoading,
        error,
        searchTerm,
        setSearchTerm,
        typeFilter,
        setTypeFilter,
        statusFilter,
        setStatusFilter,
        page,
        setPage,
        totalPages,
        handleAssessmentClick,
        handleNewAssessment
    }
}
