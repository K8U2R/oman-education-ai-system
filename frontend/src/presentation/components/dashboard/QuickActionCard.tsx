import React from 'react';
import { Card } from '../common';
import { ArrowLeft } from 'lucide-react';

export interface QuickActionCardProps {
    title: string;
    description: string;
    icon: React.ReactNode;
    onClick: () => void;
    color?: 'primary' | 'secondary' | 'accent';
}

export const QuickActionCard: React.FC<QuickActionCardProps> = ({
    title,
    description,
    icon,
    onClick,
    // color = 'primary'
}) => {
    return (
        <Card
            className="group cursor-pointer relative overflow-hidden transition-all duration-300 hover:shadow-lg hover:border-primary-500/50"
            onClick={onClick}
            hoverable
        >
            <div className="flex items-start gap-4">
                <div className="p-3 rounded-2xl bg-bg-tertiary text-primary-500 group-hover:bg-primary-500 group-hover:text-white transition-colors duration-300">
                    {React.cloneElement(icon as React.ReactElement, { className: 'w-6 h-6' })}
                </div>
                <div className="flex-1">
                    <h3 className="font-bold text-lg text-text-primary group-hover:text-primary-500 transition-colors">
                        {title}
                    </h3>
                    <p className="text-sm text-text-secondary mt-1 leading-relaxed">
                        {description}
                    </p>
                </div>
                <div className="absolute top-4 left-4 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300">
                    <ArrowLeft className="w-5 h-5 text-primary-500" />
                </div>
            </div>
        </Card>
    );
};
