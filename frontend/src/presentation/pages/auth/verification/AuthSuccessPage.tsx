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

const AuthSuccessPage: React.FC = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const { login, setLoading, setError } = useAuthStore();
    const { success, error: toastError } = useToastContext();
    const processedRef = useRef(false);
    const [debugInfo, setDebugInfo] = useState<string | null>(null);

    useEffect(() => {
        const processOAuthSuccess = async () => {
            if (processedRef.current) return;
            processedRef.current = true;

            // 🔍 Debug Logging: See exactly what the backend sent
            const paramsObj = Object.fromEntries(searchParams.entries());
            console.log("🔍 OAuth Callback Params:", paramsObj);

            // Try all common variations for Access Token
            const accessToken =
                searchParams.get('access_token') ||
                searchParams.get('accessToken') ||
                searchParams.get('token');

            // Try all common variations for Refresh Token
            const refreshToken =
                searchParams.get('refresh_token') ||
                searchParams.get('refreshToken');

            // Try to extract user data if passed directly
            const rawUser = searchParams.get('user');
            const errorParam = searchParams.get('error') || searchParams.get('message');

            if (errorParam) {
                const decodedError = decodeURIComponent(errorParam);
                toastError(decodedError);
                console.error("❌ OAuth Backend Error:", decodedError);
                setError(decodedError);
                return;
            }

            if (!accessToken) {
                const msg = 'فشل استلام رمز الدخول (Access Token missing)';
                console.error(`❌ ${msg}. Received keys:`, Object.keys(paramsObj));
                setDebugInfo(JSON.stringify(paramsObj, null, 2));
                toastError(msg);
                return;
            }

            try {
                setLoading(true);

                // Ensure tokens are stored in the shared storageAdapter for authService consistency
                // We manually set them if handleOAuthCallback doesn't catch them due to naming differences
                if (accessToken && refreshToken) {
                    localStorage.setItem('access_token', accessToken);
                    localStorage.setItem('refresh_token', refreshToken);
                }

                // 2. Fetch or Parse User Profile
                let user: User;
                if (rawUser) {
                    try {
                        const parsedUser = JSON.parse(decodeURIComponent(rawUser));
                        user = User.fromData(parsedUser);
                    } catch (e) {
                        console.warn("⚠️ Failed to parse user param, fetching from /me instead");
                        user = await authService.getCurrentUser();
                    }
                } else {
                    user = await authService.getCurrentUser();
                }

                // 3. Update Global Auth Store
                login(user, {
                    access_token: accessToken,
                    refresh_token: refreshToken || '',
                    token_type: 'Bearer',
                    expires_in: 3600
                });

                success('تم تسجيل الدخول بنجاح');

                // 4. Final Redirect
                navigate(ROUTES.DASHBOARD);
            } catch (err: any) {
                console.error('Core OAuth Processing Error:', err);
                const errorMessage = err.message || 'فشل استكمال عملية تسجيل الدخول';
                setError(errorMessage);
                toastError(errorMessage);
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
                            onClick={() => navigate(ROUTES.LOGIN)}
                            className="mt-4 w-full py-2 bg-primary text-primary-foreground rounded text-sm transition-opacity hover:opacity-90"
                        >
                            العودة لصفحة الدخول
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AuthSuccessPage;
