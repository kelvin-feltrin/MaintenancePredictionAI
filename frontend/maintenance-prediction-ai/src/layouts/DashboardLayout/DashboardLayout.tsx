import React, { useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { Sidebar } from '../../components/Sidebar/Sidebar';
import { Header } from '../../components/Header/Header';
import styles from './DashboardLayout.module.css';

export const DashboardLayout: React.FC = () => {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const location = useLocation();

  // Helper to determine the header title based on current path
  const getPageTitle = (pathname: string): string => {
    switch (pathname) {
      case '/':
        return 'Dashboard de Operação';
      case '/predict':
        return 'Previsão de Falhas de Ativos';
      case '/history':
        return 'Histórico de Análises';
      case '/analytics':
        return 'Analytics & Correlação';
      default:
        return 'Maintenance Prediction AI';
    }
  };

  return (
    <div className={styles.layout}>
      <Sidebar isCollapsed={isSidebarCollapsed} setIsCollapsed={setIsSidebarCollapsed} />
      
      <div className={`${styles.mainWrapper} ${isSidebarCollapsed ? styles.collapsed : ''}`}>
        <Header title={getPageTitle(location.pathname)} />
        
        <main className={styles.content}>
          <Outlet />
        </main>
      </div>
    </div>
  );
};
