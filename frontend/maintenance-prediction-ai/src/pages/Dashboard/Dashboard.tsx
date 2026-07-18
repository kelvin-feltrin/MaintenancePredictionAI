import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { getPredictionHistory } from '../../services/predictionService';
import type { PredictionHistoryItem } from '../../types/prediction';
import { MetricCard } from '../../components/MetricCard/MetricCard';
import { FiCpu, FiAlertOctagon, FiCheckCircle, FiAlertTriangle, FiPlus, FiArrowRight } from 'react-icons/fi';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';
import styles from './Dashboard.module.css';

export const Dashboard: React.FC = () => {
  const [history, setHistory] = useState<PredictionHistoryItem[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    setHistory(getPredictionHistory());

    const handleUpdate = () => {
      setHistory(getPredictionHistory());
    };
    window.addEventListener('historyUpdate', handleUpdate);
    return () => window.removeEventListener('historyUpdate', handleUpdate);
  }, []);

  // Compute metrics
  const totalPredictions = history.length;
  const maintenanceRequired = history.filter(item => item.response.prediction === 1).length;
  const mediumRiskCount = history.filter(item => item.response.prediction === 0 && item.response.probability >= 25).length;
  const healthyCount = totalPredictions - maintenanceRequired - mediumRiskCount;

  // Recent predictions (max 5)
  const recentPredictions = history.slice(0, 5);

  // Prepare chart data (risk distribution L vs M vs H variant types)
  const typeData = ['L', 'M', 'H'].map(type => {
    const items = history.filter(item => item.request.type === type);
    const failures = items.filter(item => item.response.prediction === 1).length;
    return {
      name: type === 'L' ? 'Low Class (L)' : type === 'M' ? 'Med Class (M)' : 'High Class (H)',
      Total: items.length,
      Falhas: failures
    };
  });

  // Prepare line chart data (probability trend over recent 8 predictions, reversed to be chronological)
  const timelineData = [...history]
    .slice(0, 8)
    .reverse()
    .map((item, index) => ({
      index: index + 1,
      device: item.equipmentName.split(' ').pop() || `Ativo-${index + 1}`,
      Probability: item.response.probability,
    }));

  return (
    <div className={`${styles.container} animate-fade-in`}>
      {/* Metric Cards Top */}
      <div className={styles.metricsGrid}>
        <MetricCard
          title="Total Analisado"
          value={totalPredictions}
          icon={<FiCpu />}
          type="info"
          trend={{ value: totalPredictions > 0 ? '+100%' : '0%', isPositive: true, label: 'ativo' }}
        />
        <MetricCard
          title="Parada Requerida"
          value={maintenanceRequired}
          icon={<FiAlertOctagon />}
          type="danger"
          trend={{
            value: totalPredictions > 0 ? `${Math.round((maintenanceRequired / totalPredictions) * 100)}%` : '0%',
            isPositive: false,
            label: 'do total'
          }}
        />
        <MetricCard
          title="Atenção / Risco Médio"
          value={mediumRiskCount}
          icon={<FiAlertTriangle />}
          type="warning"
          trend={{
            value: totalPredictions > 0 ? `${Math.round((mediumRiskCount / totalPredictions) * 100)}%` : '0%',
            isPositive: false,
            label: 'dos ativos'
          }}
        />
        <MetricCard
          title="Operação Saudável"
          value={healthyCount}
          icon={<FiCheckCircle />}
          type="success"
          trend={{
            value: totalPredictions > 0 ? `${Math.round((healthyCount / totalPredictions) * 100)}%` : '0%',
            isPositive: true,
            label: 'eficiência'
          }}
        />
      </div>

      {/* Main Charts & Table Area */}
      <div className={styles.dashboardGrid}>
        {/* Left Side: Analytics Charts */}
        <div className={`glass-panel ${styles.chartCard}`}>
          <div className={styles.cardHeader}>
            <h3>Tendência de Risco de Falha</h3>
            <span className={styles.cardSubtitle}>Últimas análises executadas (%)</span>
          </div>
          <div className={styles.chartWrapper}>
            {timelineData.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={timelineData}>
                  <defs>
                    <linearGradient id="colorProbability" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="var(--color-primary)" stopOpacity={0.4}/>
                      <stop offset="95%" stopColor="var(--color-primary)" stopOpacity={0.0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                  <XAxis dataKey="device" stroke="var(--text-muted)" fontSize={11} />
                  <YAxis stroke="var(--text-muted)" fontSize={11} unit="%" domain={[0, 100]} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'var(--bg-sidebar)',
                      borderColor: 'var(--border-color)',
                      borderRadius: '8px',
                      color: 'var(--text-primary)',
                      fontFamily: 'var(--font-sans)',
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="Probability"
                    name="Probabilidade"
                    stroke="var(--color-primary)"
                    fillOpacity={1}
                    fill="url(#colorProbability)"
                    strokeWidth={2}
                  />
                </AreaChart>
              </ResponsiveContainer>
            ) : (
              <div className={styles.emptyChart}>Nenhum dado disponível. Execute análises primeiro.</div>
            )}
          </div>
        </div>

        {/* Right Side: Risk by Class */}
        <div className={`glass-panel ${styles.chartCard}`}>
          <div className={styles.cardHeader}>
            <h3>Falhas por Categoria de Ativo</h3>
            <span className={styles.cardSubtitle}>Total analisado vs. Falhas preditas</span>
          </div>
          <div className={styles.chartWrapper}>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={typeData}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                <XAxis dataKey="name" stroke="var(--text-muted)" fontSize={11} />
                <YAxis stroke="var(--text-muted)" fontSize={11} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'var(--bg-sidebar)',
                    borderColor: 'var(--border-color)',
                    borderRadius: '8px',
                    color: 'var(--text-primary)',
                    fontFamily: 'var(--font-sans)',
                  }}
                />
                <Bar dataKey="Total" fill="var(--color-secondary)" radius={[4, 4, 0, 0]} name="Total Testado" />
                <Bar dataKey="Falhas" fill="var(--color-danger)" radius={[4, 4, 0, 0]} name="Falhas Preditas" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Bottom Full Row: Recent Predictions Table */}
        <div className={`glass-panel ${styles.tableCard}`}>
          <div className={styles.tableHeader}>
            <div>
              <h3>Últimas Previsões Realizadas</h3>
              <span className={styles.cardSubtitle}>Status das telemetrias recebidas em tempo real</span>
            </div>
            <div className={styles.tableActions}>
              <button className={styles.actionBtn} onClick={() => navigate('/predict')}>
                <FiPlus /> Nova Análise
              </button>
            </div>
          </div>

          <div className={styles.tableWrapper}>
            {recentPredictions.length > 0 ? (
              <table className={styles.table}>
                <thead>
                  <tr>
                    <th>Equipamento</th>
                    <th>Tipo</th>
                    <th>Temp. Processo</th>
                    <th>Velocidade</th>
                    <th>Prob. Falha</th>
                    <th>Status de Manutenção</th>
                    <th>Data/Hora</th>
                    <th>Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {recentPredictions.map((item) => {
                    const isHigh = item.response.prediction === 1;
                    const isMed = !isHigh && item.response.probability >= 25;
                    
                    let badgeClass = styles.badgeLow;
                    let badgeText = 'Saudável';

                    if (isHigh) {
                      badgeClass = styles.badgeHigh;
                      badgeText = 'Parada Crítica';
                    } else if (isMed) {
                      badgeClass = styles.badgeMed;
                      badgeText = 'Atenção';
                    }

                    return (
                      <tr key={item.id}>
                        <td className={styles.equipmentName}>{item.equipmentName}</td>
                        <td>
                          <span className={styles.typeBadge}>{item.request.type}</span>
                        </td>
                        <td>{(item.request.process_temperature - 273.15).toFixed(1)} °C</td>
                        <td>{item.request.rotational_speed} rpm</td>
                        <td className={styles.probCell}>
                          <span className={isHigh ? styles.textHigh : isMed ? styles.textMed : styles.textLow}>
                            {item.response.probability}%
                          </span>
                        </td>
                        <td>
                          <span className={`${styles.statusBadge} ${badgeClass}`}>
                            {badgeText}
                          </span>
                        </td>
                        <td className={styles.dateCell}>
                          {new Date(item.timestamp).toLocaleString('pt-BR')}
                        </td>
                        <td>
                          <Link to="/history" className={styles.detailLink}>
                            Ver Detalhes <FiArrowRight size={12} />
                          </Link>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            ) : (
              <div className={styles.emptyTable}>
                Nenhum ativo analisado ainda. Comece criando uma nova previsão de falha!
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
