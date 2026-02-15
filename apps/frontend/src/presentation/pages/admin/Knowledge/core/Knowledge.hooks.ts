import { useState } from 'react'
import { KnowledgeService } from '@/infrastructure/services/admin/KnowledgeService'
import { useAuth } from '@/presentation/hooks/useAuth'

export const useKnowledge = () => {
    const { user } = useAuth()
    const [title, setTitle] = useState('')
    const [category, setCategory] = useState('curriculum')
    const [content, setContent] = useState('')
    const [loading, setLoading] = useState(false)
    const [status, setStatus] = useState<{ type: 'success' | 'error', message: string } | null>(null)

    const handleIngest = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!title || !content) return

        setLoading(true)
        setStatus(null)

        try {
            const result = await KnowledgeService.ingestText({
                text: content,
                metadata: {
                    source: title,
                    category: category,
                    description: `Uploaded by ${user?.email}`
                }
            })

            setStatus({
                type: 'success',
                message: `تم الرفع بنجاح! تم تقسيم النص إلى ${result.chunks} جزء.`
            })
            setTitle('')
            setContent('')
        } catch (error) {
            setStatus({
                type: 'error',
                message: 'حدث خطأ أثناء الرفع. الرجاء المحاولة مرة أخرى.'
            })
            console.error(error)
        } finally {
            setLoading(false)
        }
    }

    return {
        title, setTitle,
        category, setCategory,
        content, setContent,
        loading, status,
        handleIngest
    }
}
