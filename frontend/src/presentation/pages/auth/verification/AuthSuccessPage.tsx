/**
 * Auth Success Page - صفحة نجاح تسجيل الدخول (النسخة المعززة)
 * 
 * This page handles the landing after a successful OAuth redirect from the backend.
 * It is designed to be robust against varying query parameter naming conventions.
 */

import React, { useEffect, useRef, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuthStore } from '@/presentation/features/user-authentication-management';
import { authService } from '@/presentation/features/user-authentication-management';
import { User } from '@/domain/entities/User';
import { ROUTES } from '@/domain/constants/routes.constants';
import { DefaultRouteLoader } from '@/presentation/components/common';
import { useToastContext } from '@/presentation/providers/ToastProvider';
import { useModalStore } from '@/stores/useModalStore';

const AuthSuccessPage: React.FC = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const { login, setLoading, setError } = useAuthStore();
    const { success, error: toastError } = useToastContext();
    const processedRef = useRef(false);
    const [debugInfo, setDebugInfo] = useState<string | null>(null);
    const openModal = useModalStore(state => state.open);

    useEffect(() => {
        const processOAuthSuccess = async () => {
            if (processedRef.current) return;
            processedRef.current = true;

            // ... (keep existing logs)
            const paramsObj = Object.fromEntries(searchParams.entries());
            const hashParams = new URLSearchParams(window.location.hash.substring(1));
            const hashObj = Object.fromEntries(hashParams.entries());

            console.log("🔍 OAuth Callback Params:", { query: paramsObj, hash: hashObj });

            // Extract tokens
            const accessToken =
                searchParams.get('access_token') ||
                searchParams.get('accessToken') ||
                searchParams.get('token') ||
                hashParams.get('access_token') ||
                hashParams.get('accessToken');

            const refreshToken =
                searchParams.get('refresh_token') ||
                searchParams.get('refreshToken') ||
                hashParams.get('refresh_token') ||
                hashParams.get('refreshToken');

            const rawUser = searchParams.get('user') || hashParams.get('user');
            const errorParam = searchParams.get('error') || searchParams.get('message') || hashParams.get('error_description');

            if (errorParam) {
                const decodedError = decodeURIComponent(errorParam.replace(/\+/g, ' '));
                toastError(decodedError);
                setError(decodedError);
                return;
            }

            // ⚠️ If no tokens found, try to check if we already have a valid session
            if (!accessToken) {
                try {
                    console.log("🔍 No tokens in URL, checking for existing session...");
                    const currentUser = await authService.getCurrentUser();

                    if (currentUser) {
                        console.log("✅ Existing session found, redirecting...");

                        // Hydrate store manually since we have a confirmed session
                        // We use placeholder tokens because the real ones are in HttpOnly cookies
                        // The backend will validate requests via cookies anyway
                        login(currentUser, {
                            access_token: 'SESSION_ACTIVE',
                            refresh_token: 'SESSION_ACTIVE',
                            token_type: 'Bearer',
                            expires_in: 3600
                        });

                        success('تم التحقق من الجلسة بنجاح');
                        navigate(ROUTES.DASHBOARD);
                        return;
                    } else {
                        throw new Error("No active session returned");
                    }
                } catch (e) {
                    console.warn("⚠️ No active session found and no tokens provided.");

                    const msg = 'لم يتم العثور على رمز الدخول أو جلسة نشطة.';
                    setDebugInfo(
                        `Technical Details:\n` +
                        `- Query Params: ${JSON.stringify(paramsObj)}\n` +
                        `- Hash Params: ${JSON.stringify(hashObj)}\n` +
                        `- Session Check: Failed (${e instanceof Error ? e.message : String(e)})`
                    );
                    setError(msg);
                    // Do NOT toast error here to avoid annoying popup, just show the UI
                }
                return;
            }

            // ... proceed with token login if tokens exist
            try {
                setLoading(true);
                // (keep existing token handling logic)
                if (accessToken && refreshToken) {
                    localStorage.setItem('access_token', accessToken);
                    localStorage.setItem('refresh_token', refreshToken);
                }

                let user: User;
                if (rawUser) {
                    try {
                        const parsedUser = JSON.parse(decodeURIComponent(rawUser));
                        user = User.fromData(parsedUser);
                    } catch (e) {
                        user = await authService.getCurrentUser();
                    }
                } else {
                    user = await authService.getCurrentUser();
                }

                login(user, {
                    access_token: accessToken,
                    refresh_token: refreshToken || '',
                    token_type: 'Bearer',
                    expires_in: 3600
                });

                success('تم تسجيل الدخول بنجاح');
                navigate(ROUTES.DASHBOARD);
            } catch (err: any) {
                console.error('Core OAuth Processing Error:', err);
                const errorMessage = err.message || 'فشل استكمال عملية تسجيل الدخول';
                setError(errorMessage);
                setDebugInfo(`Error: ${errorMessage}\nParams: ${JSON.stringify(paramsObj, null, 2)}`);
            } finally {
                setLoading(false);
            }
        };

        processOAuthSuccess();
    }, [searchParams, navigate, login, setLoading, setError, success, toastError]);

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-background p-6">
            <DefaultRouteLoader />
            <div className="mt-8 text-center max-w-md">
                <p className="text-lg font-medium animate-pulse">
                    جاري تهيئة الجلسة والدخول للمنصة...
                </p>

                {debugInfo && (
                    <div className="mt-10 p-4 bg-muted rounded-lg border text-left overflow-auto max-h-64">
                        <p className="text-xs font-bold text-red-500 mb-2 uppercase">Debug Information (Technical):</p>
                        <pre className="text-[10px] whitespace-pre-wrap break-all">
                            {debugInfo}
                        </pre>
                        <button
                            onClick={() => {
                                navigate(ROUTES.HOME);
                                // Small timeout to ensure navigation completes before opening modal (optional but safer)
                                setTimeout(() => openModal('login'), 50);
                            }}
                            className="mt-4 w-full py-2 bg-primary-600 text-white rounded-md text-sm transition-all hover:bg-primary-700 shadow-lg shadow-primary-500/20"
                        >
                            العودة للصفحة الرئيسية وتسجيل الدخول
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AuthSuccessPage;
