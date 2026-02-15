/**
 * OAuthCallback Handler - Sovereign Messenger
 * @law Law-10 (Component Modularity) - Under 50 lines
 * @law Law-7 (Diagnostic Integration)
 */
import React, { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { LoadingOverlay } from '@/presentation/routing/guards/components/LoadingOverlay';
import { ROUTES } from '@/domain/constants/routes.constants';
import { useOAuthExecution } from '../../hooks/useOAuthExecution';
import { AuthDiagnosticView } from '../../components/AuthDiagnosticViews';
import { useTranslation } from 'react-i18next';

export const OAuthCallbackHandler: React.FC = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const { t } = useTranslation();
    const { isLoading, error, timeoutError } = useOAuthExecution(
        searchParams.get('code'),
        searchParams.get('state')
    );

    useEffect(() => {
        if (!isLoading && !error && !timeoutError) {
            navigate(ROUTES.DASHBOARD, { replace: true });
        }
    }, [isLoading, error, timeoutError, navigate]);

    if (timeoutError) {
        return <AuthDiagnosticView code="SOVEREIGN_TIMEOUT" message={t('auth.oauth_callback.timeout_error')} onRetry={() => window.location.reload()} />;
    }

    if (error) {
        return <AuthDiagnosticView code="OAUTH_FAILURE" message={error} onRetry={() => navigate(ROUTES.LOGIN)} />;
    }

    return (
        <LoadingOverlay
            message={t('auth.oauth_callback.verifying_identity')}
            context="Sovereign Auth Protocol"
        />
    );
};
