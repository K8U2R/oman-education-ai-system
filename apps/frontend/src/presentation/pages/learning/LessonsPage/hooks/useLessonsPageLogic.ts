import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

export const useLessonsPageLogic = () => {
    const navigate = useNavigate()
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    const [lessons, setLessons] = useState<any[]>([])
    const [searchQuery, setSearchQuery] = useState('')

    const loadLessons = () => {
        setLoading(true)
        setError(null)
        // Mock API
        setTimeout(() => {
            setLessons([
                { id: '1', title: 'Introduction to Algebra', description: 'Basic algebra concepts', thumbnail: '' },
                { id: '2', title: 'Calculus I', description: 'Limits and Derivatives', thumbnail: '' }
            ])
            setLoading(false)
        }, 500)
    }

    useEffect(() => {
        loadLessons()
    }, [])

    const filteredLessons = lessons.filter(lesson =>
        lesson.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        lesson.description.toLowerCase().includes(searchQuery.toLowerCase())
    )

    return {
        navigate,
        loading,
        error,
        searchQuery,
        setSearchQuery,
        filteredLessons,
        loadLessons
    }
}
