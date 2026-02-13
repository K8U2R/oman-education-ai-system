import React from 'react';
import { Card } from '../common';
import { ArrowLeft } from 'lucide-react';
import styles from './QuickActionCard.module.scss';

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
            className={styles.card}
            onClick={onClick}
            hoverable
        >
            <div className={styles.content}>
                <div className={styles.iconWrapper}>
                    {React.cloneElement(icon as React.ReactElement, { size: 24 })}
                </div>
                <div className={styles.details}>
                    <h3 className={styles.title}>
                        {title}
                    </h3>
                    <p className={styles.description}>
                        {description}
                    </p>
                </div>
                <div className={styles.arrow}>
                    <ArrowLeft size={20} />
                </div>
            </div>
        </Card>
    );
};
