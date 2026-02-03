import React from 'react';
import { Card } from '../common';
// import { type LucideIcon } from 'lucide-react'; // Removed unused

export interface StatCardProps {
    title: string;
    value: string | number;
    icon: React.ReactNode;
    variant?: 'default' | 'success' | 'warning' | 'danger' | 'info';
    trend?: {
        value: number;
        label: string;
        isPositive: boolean;
    };
}

export const StatCard: React.FC<StatCardProps> = ({
    title,
    value,
    icon,
    variant = 'default',
    trend
}) => {
    // Law 06: Semantic Color Mapping
    const getIconColorClass = () => {
        switch (variant) {
            case 'success': return 'text-success-500 bg-success-500/10 border-success-500/20';
            case 'warning': return 'text-warning-500 bg-warning-500/10 border-warning-500/20';
            case 'danger': return 'text-error-500 bg-error-500/10 border-error-500/20';
            case 'info': return 'text-info-500 bg-info-500/10 border-info-500/20';
            default: return 'text-primary-500 bg-primary-500/10 border-primary-500/20';
        }
    };

    return (
        <Card className="flex flex-col justify-between h-full transition-all duration-300 hover:shadow-md hover:-translate-y-1">
            <div className="flex justify-between items-start mb-4">
                <div>
                    <h3 className="text-sm font-medium text-text-secondary">{title}</h3>
                    <div className="mt-1 text-2xl font-bold tracking-tight text-text-primary">
                        {value}
                    </div>
                </div>
                <div className={`p-3 rounded-xl border ${getIconColorClass()} transition-colors`}>
                    {React.cloneElement(icon as React.ReactElement, { className: 'w-5 h-5' })}
                </div>
            </div>

            {trend && (
                <div className="flex items-center gap-2 text-xs">
                    <span className={`font-medium ${trend.isPositive ? 'text-success-500' : 'text-error-500'}`}>
                        {trend.isPositive ? '+' : ''}{trend.value}%
                    </span>
                    <span className="text-text-tertiary">{trend.label}</span>
                </div>
            )}
        </Card>
    );
};
