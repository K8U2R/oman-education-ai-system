import { useEffect, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { ROUTES } from '@/domain/constants/routes.constants'
import { apiClient } from '@/infrastructure/api/api-client'

export const useOAuthCallback = () => {
    const [searchParams] = useSearchParams()
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [timeoutError, setTimeoutError] = useState(false)
    const navigate = useNavigate()

    useEffect(() => {
        const code = searchParams.get('code')
        const state = searchParams.get('state')
        const providerError = searchParams.get('error')

        if (providerError) {
            setError(`Google OAuth Error: ${providerError}`)
            setIsLoading(false)
            return
        }

        if (!code) {
            setError('Missing OAuth code from provider')
            setIsLoading(false)
            return
        }

        const timeoutId = setTimeout(() => {
            if (isLoading) {
                setTimeoutError(true)
                setIsLoading(false)
            }
        }, 10000)

        const completeOAuth = async () => {
            try {
                const response = await apiClient.post<any>('/auth/oauth/exchange-code', {
                    code,
                    state,
                    provider: 'google'
                })

                if (response.success) {
                    navigate(ROUTES.DASHBOARD, { replace: true })
                } else {
                    throw new Error(response.message || 'Authentication failed on backend')
                }
            } catch (err: any) {
                setError(err.response?.data?.error || err.message || 'Backend communication fatal error')
            } finally {
                setIsLoading(false)
                clearTimeout(timeoutId)
            }
        }

        completeOAuth()

        return () => clearTimeout(timeoutId)
    }, [searchParams, navigate])

    return { isLoading, error, timeoutError, retry: () => window.location.reload() }
}
