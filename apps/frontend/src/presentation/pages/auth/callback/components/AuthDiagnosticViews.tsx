/**
 * Auth Diagnostic Views
 * @law Law-7 (Diagnostic Protocol)
 * @law Law-10 (Modularity)
 */

import React from 'react';
import { ProfessionalErrorPanel } from '@/presentation/features/diagnostic-system-ads/components/ProfessionalErrorPanel/ProfessionalErrorPanel';

interface AuthErrorProps {
    code: string;
    message: string;
    onRetry: () => void;
    details?: any;
}

export const AuthDiagnosticView: React.FC<AuthErrorProps> = ({ code, message, onRetry, details }) => (
    <div className="min-h-screen flex items-center justify-center p-4 bg-app">
        <ProfessionalErrorPanel
            error={{
                code,
                message,
                technicalDetails: {
                    service: 'Sovereign Auth Messenger',
                    file: 'OAuthCallback.tsx',
                    context: details || {}
                }
            }}
            onRetry={onRetry}
        />
    </div>
);
