import { useEffect, useRef, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { useAuthStore, authService } from '@/presentation/features/user-authentication-management'
import { useToastContext } from '@/presentation/providers/ToastProvider'
import { User } from '@/domain/entities/User'
import { ROUTES } from '@/domain/constants/routes.constants'
import { useTranslation } from 'react-i18next'

export const useAuthSuccess = () => {
    const [searchParams] = useSearchParams()
    const navigate = useNavigate()
    const { login, setLoading, setError } = useAuthStore()
    const { success, error: toastError } = useToastContext()
    const { t } = useTranslation()

    const processedRef = useRef(false)
    const [debugInfo, setDebugInfo] = useState<string | null>(null)

    useEffect(() => {
        const processOAuthSuccess = async () => {
            if (processedRef.current) return
            processedRef.current = true

            const paramsObj = Object.fromEntries(searchParams.entries())
            const hashParams = new URLSearchParams(window.location.hash.substring(1))
            const hashObj = Object.fromEntries(hashParams.entries())

            console.log("🔍 OAuth Callback Params:", { query: paramsObj, hash: hashObj })

            const accessToken =
                searchParams.get('access_token') ||
                searchParams.get('accessToken') ||
                searchParams.get('token') ||
                hashParams.get('access_token') ||
                hashParams.get('accessToken')

            const refreshToken =
                searchParams.get('refresh_token') ||
                searchParams.get('refreshToken') ||
                hashParams.get('refresh_token') ||
                hashParams.get('refreshToken')

            const rawUser = searchParams.get('user') || hashParams.get('user')
            const errorParam = searchParams.get('error') || searchParams.get('message') || hashParams.get('error_description')

            if (errorParam) {
                const decodedError = decodeURIComponent(errorParam.replace(/\+/g, ' '))
                toastError(decodedError)
                setError(decodedError)
                return
            }

            if (!accessToken) {
                try {
                    console.log("🔍 No tokens in URL, checking for existing session...")
                    const currentUser = await authService.getCurrentUser()

                    if (currentUser) {
                        console.log("✅ Existing session found, redirecting...")
                        login(currentUser, {
                            access_token: 'SESSION_ACTIVE',
                            refresh_token: 'SESSION_ACTIVE',
                            token_type: 'Bearer',
                            expires_in: 3600
                        })

                        success(t('auth.success_page.session_verified'))
                        navigate(ROUTES.DASHBOARD)
                        return
                    } else {
                        throw new Error("No active session returned")
                    }
                } catch (e) {
                    console.warn("⚠️ No active session found and no tokens provided.")
                    const msg = t('auth.success_page.session_missing')
                    setDebugInfo(
                        `Technical Details:\n` +
                        `- Query Params: ${JSON.stringify(paramsObj)}\n` +
                        `- Hash Params: ${JSON.stringify(hashObj)}\n` +
                        `- Session Check: Failed (${e instanceof Error ? e.message : String(e)})`
                    )
                    setError(msg)
                }
                return
            }

            try {
                setLoading(true)
                if (accessToken && refreshToken) {
                    localStorage.setItem('access_token', accessToken)
                    localStorage.setItem('refresh_token', refreshToken)
                }

                let user: User
                if (rawUser) {
                    try {
                        const parsedUser = JSON.parse(decodeURIComponent(rawUser))
                        user = User.fromData(parsedUser)
                    } catch (e) {
                        user = await authService.getCurrentUser()
                    }
                } else {
                    user = await authService.getCurrentUser()
                }

                login(user, {
                    access_token: accessToken,
                    refresh_token: refreshToken || '',
                    token_type: 'Bearer',
                    expires_in: 3600
                })

                success(t('auth.success_page.login_success'))
                navigate(ROUTES.DASHBOARD)
            } catch (err: any) {
                console.error('Core OAuth Processing Error:', err)
                const errorMessage = err.message || t('auth.success_page.login_failed_generic')
                setError(errorMessage)
                setDebugInfo(`Error: ${errorMessage}\nParams: ${JSON.stringify(paramsObj, null, 2)}`)
            } finally {
                setLoading(false)
            }
        }

        processOAuthSuccess()
    }, [searchParams, navigate, login, setLoading, setError, success, toastError, t])

    return { debugInfo }
}
