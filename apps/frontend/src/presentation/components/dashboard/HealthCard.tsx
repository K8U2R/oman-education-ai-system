import React from 'react';
import { Card } from '../common';
// import { Activity, Database, Cpu } from 'lucide-react'; // Removed unused

export interface HealthMetric {
    label: string;
    value: string;
    status: 'healthy' | 'warning' | 'critical';
    icon: React.ReactNode;
}

export interface HealthCardProps {
    overallStatus: 'healthy' | 'warning' | 'critical';
    metrics: HealthMetric[];
    lastUpdated?: string;
}

export const HealthCard: React.FC<HealthCardProps> = ({
    overallStatus,
    metrics,
    lastUpdated
}) => {
    const getStatusColor = (status: string) => {
        switch (status) {
            case 'healthy': return 'bg-success-500';
            case 'warning': return 'bg-warning-500';
            case 'critical': return 'bg-error-500';
            default: return 'bg-gray-500';
        }
    };

    const getStatusTextColor = (status: string) => {
        switch (status) {
            case 'healthy': return 'text-success-500';
            case 'warning': return 'text-warning-500';
            case 'critical': return 'text-error-500';
            default: return 'text-gray-500';
        }
    };

    return (
        <Card className="h-full">
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                    <div className="relative flex h-3 w-3">
                        <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${getStatusColor(overallStatus)}`}></span>
                        <span className={`relative inline-flex rounded-full h-3 w-3 ${getStatusColor(overallStatus)}`}></span>
                    </div>
                    <h3 className="font-bold text-lg text-text-primary">صحة النظام</h3>
                </div>
                {lastUpdated && (
                    <span className="text-xs text-text-tertiary font-mono">
                        {lastUpdated}
                    </span>
                )}
            </div>

            <div className="space-y-4">
                {metrics.map((metric, idx) => (
                    <div key={idx} className="flex items-center justify-between p-3 rounded-xl bg-bg-tertiary/50 border border-transparent hover:border-border-primary transition-colors">
                        <div className="flex items-center gap-3">
                            <div className={`text-text-secondary`}>
                                {React.cloneElement(metric.icon as React.ReactElement, { className: 'w-4 h-4' })}
                            </div>
                            <span className="text-sm font-medium text-text-secondary">{metric.label}</span>
                        </div>
                        <span className={`text-sm font-bold font-mono ${getStatusTextColor(metric.status)}`}>
                            {metric.value}
                        </span>
                    </div>
                ))}
            </div>
        </Card>
    );
};
