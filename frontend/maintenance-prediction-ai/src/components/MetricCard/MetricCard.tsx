import React from 'react';
import styles from './MetricCard.module.css';

interface MetricCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  trend?: {
    value: string | number;
    isPositive?: boolean;
    label?: string;
  };
  type?: 'primary' | 'success' | 'warning' | 'danger' | 'info';
}

export const MetricCard: React.FC<MetricCardProps> = ({
  title,
  value,
  icon,
  trend,
  type = 'info',
}) => {
  return (
    <div className={`glass-panel glass-panel-hover ${styles.card} ${styles[type]}`}>
      <div className={styles.header}>
        <span className={styles.title}>{title}</span>
        <div className={`${styles.iconContainer} ${styles[`icon-${type}`]}`}>
          {icon}
        </div>
      </div>
      
      <div className={styles.content}>
        <span className={styles.value}>{value}</span>
        {trend && (
          <div className={styles.trendContainer}>
            <span className={`${styles.trendValue} ${trend.isPositive ? styles.positive : styles.negative}`}>
              {trend.value}
            </span>
            {trend.label && <span className={styles.trendLabel}>{trend.label}</span>}
          </div>
        )}
      </div>
    </div>
  );
};
