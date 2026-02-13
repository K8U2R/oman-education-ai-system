import React, { useMemo } from 'react';
import { Card } from '../common';
import styles from './HealthCard.module.scss';
import { useTranslation } from 'react-i18next';
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
    const { t } = useTranslation();

    const indicatorClass = useMemo(() => {
        return styles[`indicator--${overallStatus}`] || styles['indicator--healthy'];
    }, [overallStatus]);

    return (
        <Card className={styles.card}>
            <div className={styles.header}>
                <div className={styles.titleWrapper}>
                    <div className={`${styles.indicator} ${indicatorClass}`}>
                        <span className={styles.indicator__ping}></span>
                        <span className={styles.indicator__dot}></span>
                    </div>
                    <h3 className={styles.title}>{t('dashboard.system_health')}</h3>
                </div>
                {lastUpdated && (
                    <span className={styles.lastUpdated}>
                        {lastUpdated}
                    </span>
                )}
            </div>

            <div className={styles.metrics}>
                {metrics.map((metric, idx) => (
                    <div key={idx} className={styles.metricItem}>
                        <div className={styles.metricLabelWrapper}>
                            <div>
                                {React.cloneElement(metric.icon as React.ReactElement, { size: 16 })}
                            </div>
                            <span className={styles.metricLabel}>{metric.label}</span>
                        </div>
                        <span className={`${styles.metricValue} ${styles[`metricValue--${metric.status}`]}`}>
                            {metric.value}
                        </span>
                    </div>
                ))}
            </div>
        </Card>
    );
};
