import React, { useMemo } from 'react';
import { Card } from '../common';
import styles from './StatCard.module.scss';
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

    const iconClass = useMemo(() => {
        return styles[`iconWrapper--${variant}`] || styles['iconWrapper--default'];
    }, [variant]);

    return (
        <Card className={styles.card}>
            <div className={styles.header}>
                <div>
                    <h3 className={styles.title}>{title}</h3>
                    <div className={styles.value}>
                        {value}
                    </div>
                </div>
                <div className={`${styles.iconWrapper} ${iconClass}`}>
                    {React.cloneElement(icon as React.ReactElement, { size: 20 })}
                </div>
            </div>

            {trend && (
                <div className={styles.trend}>
                    <span className={`${styles.trendValue} ${trend.isPositive ? styles['trendValue--positive'] : styles['trendValue--negative']}`}>
                        {trend.isPositive ? '+' : ''}{trend.value}%
                    </span>
                    <span className={styles.trendLabel}>{trend.label}</span>
                </div>
            )}
        </Card>
    );
};
