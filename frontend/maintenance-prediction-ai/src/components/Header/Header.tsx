import React from 'react';
import { FiUser } from 'react-icons/fi';
import styles from './Header.module.css';

interface HeaderProps {
  title: string;
}

export const Header: React.FC<HeaderProps> = ({ title }) => {
  return (
    <header className={styles.header}>
      <h1 className={styles.title}>{title}</h1>

      <div className={styles.actions}>
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
