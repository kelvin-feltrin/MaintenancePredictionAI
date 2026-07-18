import React, { useEffect, useState } from 'react';
import { FiBell, FiUser, FiInfo } from 'react-icons/fi';
import { getPredictionHistory } from '../../services/predictionService';
import styles from './Header.module.css';

interface HeaderProps {
  title: string;
}

export const Header: React.FC<HeaderProps> = ({ title }) => {
  const [highRiskCount, setHighRiskCount] = useState(0);
  const [showNotifications, setShowNotifications] = useState(false);

  useEffect(() => {
    // Scan history for High Risk items
    const updateNotifications = () => {
      const history = getPredictionHistory();
      const highRisk = history.filter((item) => item.response.prediction === 1);
      setHighRiskCount(highRisk.length);
    };

    updateNotifications();

    // Listen for custom event or storage updates
    window.addEventListener('storage', updateNotifications);
    window.addEventListener('historyUpdate', updateNotifications);

    return () => {
      window.removeEventListener('storage', updateNotifications);
      window.removeEventListener('historyUpdate', updateNotifications);
    };
  }, []);

  const handleToggleNotifications = () => {
    setShowNotifications(!showNotifications);
  };

  return (
    <header className={styles.header}>
      <h1 className={styles.title}>{title}</h1>

      <div className={styles.actions}>
        <div className={styles.notificationWrapper}>
          <button 
            className={styles.iconBtn} 
            onClick={handleToggleNotifications}
            aria-label="Notificações"
          >
            <FiBell />
            {highRiskCount > 0 && <span className={styles.badge}>{highRiskCount}</span>}
          </button>

          {showNotifications && (
            <div className={`glass-panel ${styles.dropdown}`}>
              <div className={styles.dropdownHeader}>
                <h3>Alertas do Sistema</h3>
              </div>
              <div className={styles.dropdownContent}>
                {highRiskCount > 0 ? (
                  <div className={styles.notificationItem}>
                    <span className={styles.warningIcon}>⚠️</span>
                    <div>
                      <p className={styles.notificationText}>
                        Existem <strong>{highRiskCount}</strong> ativos com alto risco de falha necessitando de manutenção.
                      </p>
                      <span className={styles.time}>Verifique o histórico</span>
                    </div>
                  </div>
                ) : (
                  <div className={styles.emptyState}>
                    <FiInfo size={20} />
                    <p>Nenhum alerta crítico ativo. Todos os sistemas operando normalmente.</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        <div className={styles.profile}>
          <div className={styles.profileInfo}>
            <span className={styles.userName}>Operador Industrial</span>
            <span className={styles.userRole}>Supervisor Técnico</span>
          </div>
          <div className={styles.avatar}>
            <FiUser />
          </div>
        </div>
      </div>
    </header>
  );
};
