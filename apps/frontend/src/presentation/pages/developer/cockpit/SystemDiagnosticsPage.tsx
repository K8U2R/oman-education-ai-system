
import React, { useEffect, useState } from 'react';
import { RefreshCw, CheckCircle, XCircle, AlertTriangle, Globe, Server, Shield, Activity } from 'lucide-react';
// Corrected Imports
import { Card, Button } from '@/presentation/components/ui';
import { authService } from '@/presentation/features/user-authentication-management/api/auth.service';
import { API_BASE_URL } from '@/domain/constants/api.constants';

interface DiagnosticResult {
    status: 'pending' | 'success' | 'error' | 'warning';
    message: string;
    latency?: number;
    details?: any;
}

interface DiagnosticsState {
    api: DiagnosticResult;
    auth: DiagnosticResult;
    env: DiagnosticResult;
    network: DiagnosticResult;
}

import { useTranslation } from 'react-i18next';

export const SystemDiagnosticsPage: React.FC = () => {
    const { t } = useTranslation();
    const [results, setResults] = useState<DiagnosticsState>({
        api: { status: 'pending', message: 'Ready to check' },
        auth: { status: 'pending', message: 'Ready to check' },
        env: { status: 'pending', message: 'Ready to check' },
        network: { status: 'pending', message: 'Ready to check' }
    });

    const checkApiHealth = async () => {
        const start = performance.now();
        try {
            setResults(prev => ({ ...prev, api: { status: 'pending', message: 'Checking...' } }));
            // Using generic fetch to avoid interceptors that might redirect
            const response = await fetch(`${API_BASE_URL}/health`);
            const end = performance.now();

            if (response.ok) {
                setResults(prev => ({
                    ...prev,
                    api: {
                        status: 'success',
                        message: `Connected (HTTP ${response.status})`,
                        latency: Math.round(end - start)
                    }
                }));
            } else {
                const text = await response.text();
                setResults(prev => ({
                    ...prev,
                    api: {
                        status: 'error',
                        message: `Failed (HTTP ${response.status})`,
                        latency: Math.round(end - start),
                        details: text
                    }
                }));
            }
        } catch (error) {
            setResults(prev => ({
                ...prev,
                api: {
                    status: 'error',
                    message: 'Connection Failed (Network Error)',
                    details: String(error)
                }
            }));
        }
    };

    const checkEnvironment = () => {
        const vars = {
            VITE_API_BASE_URL: import.meta.env.VITE_API_BASE_URL,
            VITE_APP_URL: import.meta.env.VITE_APP_URL,
            VITE_GOOGLE_CLIENT_ID: import.meta.env.VITE_GOOGLE_CLIENT_ID ? 'Configured ✅' : 'Missing ❌',
            MODE: import.meta.env.MODE
        };

        setResults(prev => ({
            ...prev,
            env: {
                status: 'success',
                message: 'Environment Variables Loaded',
                details: vars
            }
        }));
    };

    const checkAuthConfiguration = () => {
        try {
            const googleUrl = authService.getOAuthUrl('google', 'https://k8u2r.online/auth/success');
            setResults(prev => ({
                ...prev,
                auth: {
                    status: 'success',
                    message: 'OAuth URL Construction Valid',
                    details: { googleUrl }
                }
            }));
        } catch (error) {
            setResults(prev => ({
                ...prev,
                auth: {
                    status: 'error',
                    message: 'Auth Configuration Error',
                    details: String(error)
                }
            }));
        }
    };

    const runAllChecks = () => {
        checkApiHealth();
        checkEnvironment();
        checkAuthConfiguration();
    };

    useEffect(() => {
        runAllChecks();
    }, []);

    const StatusIcon = ({ status }: { status: string }) => {
        switch (status) {
            case 'success': return <CheckCircle className="w-5 h-5 text-green-500" />;
            case 'error': return <XCircle className="w-5 h-5 text-red-500" />;
            case 'warning': return <AlertTriangle className="w-5 h-5 text-yellow-500" />;
            default: return <RefreshCw className="w-5 h-5 text-gray-400" />;
        }
    };

    // Helper for Card Layout since atomic components don't exist
    const CardSection = ({ title, icon, status, children, colSpan = 1 }: any) => (
        <Card className={`bg-neutral-800 border-neutral-700 p-4 ${colSpan === 2 ? 'md:col-span-2' : ''}`}>
            <div className="flex flex-row items-center justify-between pb-4 border-b border-neutral-700 mb-4">
                <div className="flex items-center gap-2">
                    {icon}
                    <h3 className="text-lg font-semibold text-white">{title}</h3>
                </div>
                <StatusIcon status={status} />
            </div>
            <div>{children}</div>
        </Card>
    );

    return (
        <div className="p-6 space-y-6 text-white min-h-screen bg-neutral-900">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400">
                        {t('diagnostics.title')}
                    </h1>
                    <p className="text-gray-400">{t('diagnostics.subtitle')}</p>
                </div>
                <Button onClick={runAllChecks} variant="outline" className="gap-2">
                    <RefreshCw className="w-4 h-4" />
                    {t('diagnostics.run_checks')}
                </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* API Health */}
                <CardSection
                    title={t('diagnostics.backend_status')}
                    icon={<Server className="w-5 h-5 text-blue-400" />}
                    status={results.api.status}
                >
                    <div className="text-2xl font-bold mb-2">{results.api.message}</div>
                    {results.api.latency && (
                        <div className="text-sm text-gray-400 flex items-center gap-1">
                            <Activity className="w-4 h-4" /> Latency: {results.api.latency}ms
                        </div>
                    )}
                    {results.api.details && (
                        <pre className="mt-4 p-2 bg-black/50 rounded text-xs text-red-300 overflow-auto">
                            {typeof results.api.details === 'string' ? results.api.details : JSON.stringify(results.api.details, null, 2)}
                        </pre>
                    )}
                </CardSection>

                {/* Environment Config */}
                <CardSection
                    title={t('diagnostics.frontend_env')}
                    icon={<Globe className="w-5 h-5 text-purple-400" />}
                    status={results.env.status}
                >
                    <div className="text-sm text-gray-300 space-y-2">
                        {results.env.details && Object.entries(results.env.details).map(([key, value]) => (
                            <div key={key} className="flex justify-between border-b border-neutral-700 pb-1">
                                <span className="font-mono text-gray-500">{key}</span>
                                <span className="font-mono text-blue-300 truncate max-w-[200px]" title={String(value)}>{String(value)}</span>
                            </div>
                        ))}
                    </div>
                </CardSection>

                {/* Auth Config */}
                <CardSection
                    title="Authentication Configuration"
                    icon={<Shield className="w-5 h-5 text-amber-400" />}
                    status={results.auth.status}
                    colSpan={2}
                >
                    <div className="text-lg font-semibold mb-2">{results.auth.message}</div>
                    {results.auth.details && (
                        <div className="space-y-4">
                            <div>
                                <div className="text-sm text-gray-400 mb-1">Generated Google OAuth URL:</div>
                                <div className="p-3 bg-black/30 rounded border border-neutral-700 font-mono text-xs text-green-300 break-all">
                                    {results.auth.details.googleUrl}
                                </div>
                            </div>
                            <div className="text-xs text-gray-500">
                                * Verify that this URL does not contain double prefixes (e.g. /api/v1/api/v1) and points to the correct backend host.
                            </div>
                        </div>
                    )}
                </CardSection>
            </div>
        </div>
    );
};
