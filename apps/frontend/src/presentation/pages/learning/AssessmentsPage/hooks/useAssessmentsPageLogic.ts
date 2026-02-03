import { useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAssessments } from '@/presentation/features/interactive-learning-canvas'
import { ROUTES } from '@/domain/constants'
import type {
  AssessmentType,
  AssessmentStatus,
} from '@/presentation/features/interactive-learning-canvas'

export const useAssessmentsPageLogic = () => {
  const navigate = useNavigate()
  const { assessments, isLoading, error } = useAssessments()

  // State
  const [searchTerm, setSearchTerm] = useState('')
  const [typeFilter, setTypeFilter] = useState<AssessmentType | 'all'>('all')
  const [statusFilter, setStatusFilter] = useState<AssessmentStatus | 'all'>('all')
  const [page, setPage] = useState(1)
  const itemsPerPage = 9

  // Logic
  const filteredAssessments = useMemo(() => {
    return assessments.filter(assessment => {
      const matchesSearch =
        assessment.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        assessment.description?.toLowerCase().includes(searchTerm.toLowerCase())

      const matchesType = typeFilter === 'all' || assessment.type === typeFilter
      const matchesStatus = statusFilter === 'all' || assessment.status === statusFilter

      return matchesSearch && matchesType && matchesStatus
    })
  }, [assessments, searchTerm, typeFilter, statusFilter])

  // Pagination Logic
  const totalPages = Math.ceil(filteredAssessments.length / itemsPerPage)
  const paginatedAssessments = filteredAssessments.slice(
    (page - 1) * itemsPerPage,
    page * itemsPerPage
  )

  const handleAssessmentClick = (assessmentId: string) => {
    navigate(ROUTES.ASSESSMENT_DETAIL(assessmentId))
  }

  const handleNewAssessment = () => {
    navigate(ROUTES.ASSESSMENT_NEW)
  }

  return {
    // Data
    assessments: paginatedAssessments,
    isLoading,
    error,

    // Pagination
    page,
    setPage,
    totalPages,

    // Filters State
    searchTerm,
    setSearchTerm,
    typeFilter,
    setTypeFilter,
    statusFilter,
    setStatusFilter,

    // Handlers
    handleAssessmentClick,
    handleNewAssessment,
  }
}
