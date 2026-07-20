import React from 'react';
import { NavLink } from 'react-router-dom';
import { FiCpu, FiBarChart2, FiChevronLeft, FiChevronRight, FiAlertTriangle } from 'react-icons/fi';
import styles from './Sidebar.module.css';

interface SidebarProps {
  isCollapsed: boolean;
  setIsCollapsed: (collapsed: boolean) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ isCollapsed, setIsCollapsed }) => {
  const toggleCollapse = () => {
    setIsCollapsed(!isCollapsed);
  };

  const navItems = [
    { path: '/', label: 'Dashboard', icon: <FiBarChart2 /> },
    { path: '/predict', label: 'Nova Previsão', icon: <FiCpu /> },
  ];

  return (
    <aside className={`${styles.sidebar} ${isCollapsed ? styles.collapsed : ''}`}>
      <div className={styles.logoArea}>
        <div className={styles.logoIcon}>
          <FiAlertTriangle className={styles.iconWarning} />
        </div>
        {!isCollapsed && (
          <div className={styles.logoText}>
            <span className={styles.brandName}>Predictive</span>
            <span className={styles.brandSub}>MAINTENANCE AI</span>
          </div>
        )}
      </div>

      <button className={styles.collapseBtn} onClick={toggleCollapse} aria-label="Recolher menu">
        {isCollapsed ? <FiChevronRight /> : <FiChevronLeft />}
      </button>

      <nav className={styles.nav}>
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) => `${styles.navLink} ${isActive ? styles.active : ''}`}
            title={isCollapsed ? item.label : undefined}
          >
            <span className={styles.navIcon}>{item.icon}</span>
            {!isCollapsed && <span className={styles.navLabel}>{item.label}</span>}
          </NavLink>
        ))}
      </nav>

      <div className={styles.footer}>
        {!isCollapsed ? (
          <div className={styles.footerContent}>
            <div className={styles.statusDot}></div>
            <span>Sistema Online</span>
          </div>
        ) : (
          <div className={`${styles.statusDot} ${styles.centeredDot}`}></div>
        )}
      </div>
    </aside>
  );
};
