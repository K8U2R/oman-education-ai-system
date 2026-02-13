import React from 'react';
import { cn } from '@/presentation/components/common/utils/classNames';

interface TokenRingProps {
    percentage: number;
    size?: number;
    strokeWidth?: number;
    children?: React.ReactNode;
    className?: string; // For wrapper styling
}

export const TokenRing: React.FC<TokenRingProps> = ({
    percentage,
    size = 40,
    strokeWidth = 3,
    children,
    className
}) => {
    const radius = (size - strokeWidth) / 2;
    const circumference = radius * 2 * Math.PI;
    const offset = circumference - (percentage / 100) * circumference;

    // Determine color based on usage
    let colorClass = 'text-emerald-500'; // Green (< 50%)
    if (percentage > 50) colorClass = 'text-yellow-500'; // Warning
    if (percentage > 80) colorClass = 'text-red-500'; // Critical

    return (
        <div className={cn("relative flex items-center justify-center", className)} style={{ width: size, height: size }}>
            {/* Background Ring */}
            <svg width={size} height={size} className="transform -rotate-90">
                <circle
                    cx={size / 2}
                    cy={size / 2}
                    r={radius}
                    fill="transparent"
                    stroke="currentColor"
                    strokeWidth={strokeWidth}
                    className="text-gray-200 dark:text-gray-700"
                />
                {/* Progress Ring */}
                <circle
                    cx={size / 2}
                    cy={size / 2}
                    r={radius}
                    fill="transparent"
                    stroke="currentColor"
                    strokeWidth={strokeWidth}
                    strokeDasharray={circumference}
                    strokeDashoffset={offset}
                    strokeLinecap="round"
                    className={cn("transition-all duration-1000 ease-out", colorClass)}
                />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
                {children}
            </div>
        </div>
    );
};
