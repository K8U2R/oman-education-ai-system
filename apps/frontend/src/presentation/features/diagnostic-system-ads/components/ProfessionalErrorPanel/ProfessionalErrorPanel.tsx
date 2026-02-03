
import React from 'react';
import { Copy, Terminal, XCircle, RefreshCw, Shield } from 'lucide-react';
import { Card } from '@/presentation/components/ui/layout/Card/Card';
import { Button } from '@/presentation/components/ui/inputs/Button/Button';
import { ProtectedComponent } from '@/presentation/features/user-authentication-management/components/ProtectedComponent';
import { useErrorAnalysis } from '../../hooks/useErrorAnalysis';
import { ProfessionalError } from '../../types';

export interface ProfessionalErrorPanelProps {
    error: ProfessionalError | string | null;
    onRetry?: () => void;
    className?: string;
}

export const ProfessionalErrorPanel: React.FC<ProfessionalErrorPanelProps> = ({
    error,
    onRetry,
    className = '',
}) => {
    const { isNetworkError, normalizedError } = useErrorAnalysis(error);

    if (!error) return null;

    const handleCopy = () => {
        navigator.clipboard.writeText(JSON.stringify(normalizedError, null, 2));
    };

    // 1. Network / Offline State (Yellow Tone)
    if (isNetworkError) {
        return (
            <Card className={`professional-error-panel professional-error-panel--network ${className}`}>
                <div className="flex flex-col items-center gap-4 py-6 text-center">
                    <div className="relative">
                        <div className="absolute inset-0 blur-xl animate-pulse" style={{ background: 'var(--color-warning)', opacity: 0.2 }} />
                        <RefreshCw className="professional-error-panel__icon professional-error-panel__icon--warning professional-error-panel__icon--spin relative z-10" style={{ width: '40px', height: '40px' }} />
                    </div>

                    <div>
                        <h3 className="professional-error-panel__message-title" style={{ color: 'var(--color-warning)' }}>جاري محاولة الاتصال بالخادم...</h3>
                        <p className="professional-error-panel__message-text text-sm max-w-md mx-auto" style={{ color: 'var(--color-warning)', opacity: 0.8 }}>
                            يبدو أن الاتصال بالخادم مقطوع حالياً. النظام يحاول استعادة الاتصال تلقائياً.
                        </p>
                    </div>

                    <ProtectedComponent requiredRole="admin">
                        <div className="professional-error-panel__dev-hint">
                            DEV_HINT: Check if backend is running on port 3000
                        </div>
                    </ProtectedComponent>
                </div>
            </Card>
        );
    }

    // 2. Standard Error View (User facing)
    return (
        <Card className={`professional-error-panel ${className}`}>

            {/* Header for Developers (ADS Kernel Panic) */}
            <ProtectedComponent requiredRole="admin">
                <div className="professional-error-panel__header">
                    <div className="professional-error-panel__title">
                        <Shield className="h-4 w-4" />
                        <span>ADS_KERNEL_PANIC</span>
                    </div>
                    <div className="flex gap-2">
                        <button
                            onClick={handleCopy}
                            className="p-1 hover:bg-white/5 rounded text-red-400/60 hover:text-red-400 transition-colors"
                            title="Copy JSON"
                        >
                            <Copy className="h-3 w-3" />
                        </button>
                    </div>
                </div>
            </ProtectedComponent>

            <div className="professional-error-panel__content">
                <div className="flex items-start gap-4">
                    <div className="professional-error-panel__icon-wrapper">
                        <XCircle className="professional-error-panel__icon" />
                    </div>

                    <div className="flex-1 space-y-3">
                        <div>
                            <div className="flex items-center gap-2 mb-1">
                                <h3 className="professional-error-panel__message-title">حدث خطأ غير متوقع</h3>
                                <ProtectedComponent requiredRole="admin">
                                    <span className="professional-error-panel__code-badge">
                                        {normalizedError.code}
                                    </span>
                                </ProtectedComponent>
                            </div>
                            <p className="professional-error-panel__message-text">{normalizedError.message}</p>
                        </div>

                        {/* Actions */}
                        {onRetry && (
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={onRetry}
                                className="gap-2"
                                style={{ color: 'var(--color-error)' }}
                            >
                                <RefreshCw className="h-4 w-4" />
                                إعادة المحاولة
                            </Button>
                        )}

                        {/* Technical Details (Only for Developers) */}
                        <ProtectedComponent requiredRole="admin">
                            {normalizedError.technicalDetails ? (
                                <div className="professional-error-panel__terminal">
                                    <div className="professional-error-panel__terminal-header">
                                        <Terminal className="h-3 w-3" />
                                        <span>Stack Trace Details</span>
                                    </div>

                                    <div className="professional-error-panel__code-grid">
                                        <span className="professional-error-panel__code-label">Service:</span>
                                        <span className="professional-error-panel__code-value professional-error-panel__code-value--warning">{normalizedError.technicalDetails.service}</span>

                                        <span className="professional-error-panel__code-label">File:</span>
                                        <span className="professional-error-panel__code-value professional-error-panel__code-value--success text-nowrap">
                                            {normalizedError.technicalDetails.file}:{normalizedError.technicalDetails.line}
                                        </span>

                                        <span className="professional-error-panel__code-label">Function:</span>
                                        <span className="professional-error-panel__code-value professional-error-panel__code-value--info">
                                            {normalizedError.technicalDetails?.functionName}()
                                        </span>
                                    </div>

                                    {normalizedError.technicalDetails.stack && (
                                        <details className="mt-3 group">
                                            <summary className="cursor-pointer text-gray-500 hover:text-gray-300 select-none text-xs font-mono">
                                                ▶ Raw Stack Trace
                                            </summary>
                                            <div className="mt-2 pl-2 border-l border-gray-700 text-gray-500 whitespace-pre overflow-x-auto pb-2 text-xs font-mono">
                                                {normalizedError.technicalDetails.stack}
                                            </div>
                                        </details>
                                    )}
                                </div>
                            ) : <React.Fragment />}
                        </ProtectedComponent>
                    </div>
                </div>
            </div >
        </Card >
    );
};
