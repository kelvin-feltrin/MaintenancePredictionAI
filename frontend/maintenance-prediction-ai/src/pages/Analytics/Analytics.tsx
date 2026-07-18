import React, { useEffect, useState } from 'react';
import { getPredictionHistory } from '../../services/predictionService';
import type { PredictionHistoryItem } from '../../types/prediction';
import { ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, Cell, BarChart, Bar } from 'recharts';
import { FiTrendingUp } from 'react-icons/fi';
import styles from './Analytics.module.css';

export const Analytics: React.FC = () => {
  const [history, setHistory] = useState<PredictionHistoryItem[]>([]);

  useEffect(() => {
    setHistory(getPredictionHistory());
  }, []);

  // Format data for Scatter Plots (convert K to C)
  const scatterData = history.map((item) => ({
    name: item.equipmentName,
    rpm: item.request.rotational_speed,
    torque: item.request.torque,
    airTempC: parseFloat((item.request.air_temperature - 273.15).toFixed(1)),
    procTempC: parseFloat((item.request.process_temperature - 273.15).toFixed(1)),
    wear: item.request.tool_wear,
    probability: item.response.probability,
    prediction: item.response.prediction,
    type: item.request.type,
  }));

  // Group data by wear bins (0-50, 50-100, 100-150, 150-200, 200+) to show average failure probability
  const bins = [
    { label: '0-50 min', min: 0, max: 50, sumProb: 0, count: 0 },
    { label: '51-100 min', min: 51, max: 100, sumProb: 0, count: 0 },
    { label: '101-150 min', min: 101, max: 150, sumProb: 0, count: 0 },
    { label: '151-200 min', min: 151, max: 200, sumProb: 0, count: 0 },
    { label: '201+ min', min: 201, max: Infinity, sumProb: 0, count: 0 },
  ];

  scatterData.forEach((item) => {
    const bin = bins.find((b) => item.wear >= b.min && item.wear <= b.max);
    if (bin) {
      bin.sumProb += item.probability;
      bin.count += 1;
    }
  });

  const wearChartData = bins.map((b) => ({
    range: b.label,
    'Média Risco (%)': b.count > 0 ? parseFloat((b.sumProb / b.count).toFixed(1)) : 0,
    Ativos: b.count,
  }));

  return (
    <div className={`${styles.container} animate-fade-in`}>
      <div className={styles.intro}>
        <FiTrendingUp className={styles.introIcon} />
        <div>
          <h2>Análise de Correlações e Falhas</h2>
          <p>Visualize as interações entre as variáveis físicas da telemetria e o risco calculado pelo modelo preditivo.</p>
        </div>
      </div>

      <div className={styles.grid}>
        {/* Chart 1: Torque vs Speed Scatter Plot */}
        <div className={`glass-panel ${styles.chartCard}`}>
          <div className={styles.cardHeader}>
            <h3>Mapeamento Torque vs. Velocidade</h3>
            <span className={styles.cardSubtitle}>Correlação entre força torcional (Nm) e velocidade angular (rpm)</span>
          </div>
          
          <div className={styles.chartWrapper}>
            {scatterData.length > 0 ? (
              <ResponsiveContainer width="100%" height={320}>
                <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 10 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                  <XAxis 
                    type="number" 
                    dataKey="rpm" 
                    name="Velocidade" 
                    unit=" rpm" 
                    stroke="var(--text-muted)" 
                    fontSize={11}
                    domain={['auto', 'auto']}
                  />
                  <YAxis 
                    type="number" 
                    dataKey="torque" 
                    name="Torque" 
                    unit=" Nm" 
                    stroke="var(--text-muted)" 
                    fontSize={11}
                    domain={['auto', 'auto']}
                  />
                  <Tooltip 
                    cursor={{ strokeDasharray: '3 3' }}
                    content={({ active, payload }) => {
                      if (active && payload && payload.length) {
                        const data = payload[0].payload;
                        return (
                          <div className={styles.customTooltip}>
                            <h4>{data.name}</h4>
                            <p>Velocidade: <strong>{data.rpm} rpm</strong></p>
                            <p>Torque: <strong>{data.torque} Nm</strong></p>
                            <p>Prob. Falha: <strong>{data.probability}%</strong></p>
                            <p>Status: <span className={data.prediction === 1 ? styles.textHigh : styles.textLow}>
                              {data.prediction === 1 ? 'Parada Crítica' : 'Saudável'}
                            </span></p>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                  <Scatter name="Ativos" data={scatterData}>
                    {scatterData.map((entry, index) => {
                      const color = entry.prediction === 1 
                        ? 'var(--color-danger)' 
                        : entry.probability >= 25 
                          ? 'var(--color-warning)' 
                          : 'var(--color-primary)';
                      return <Cell key={`cell-${index}`} fill={color} />;
                    })}
                  </Scatter>
                  <Legend 
                    verticalAlign="top" 
                    height={36} 
                    content={() => (
                      <div className={styles.legendContainer}>
                        <div className={styles.legendItem}>
                          <span className={`${styles.legendDot} ${styles.dotPrimary}`}></span>
                          <span>Saudável (&lt;25%)</span>
                        </div>
                        <div className={styles.legendItem}>
                          <span className={`${styles.legendDot} ${styles.dotWarning}`}></span>
                          <span>Atenção (25%-50%)</span>
                        </div>
                        <div className={styles.legendItem}>
                          <span className={`${styles.legendDot} ${styles.dotDanger}`}></span>
                          <span>Falha Detectada (&gt;50%)</span>
                        </div>
                      </div>
                    )}
                  />
                </ScatterChart>
              </ResponsiveContainer>
            ) : (
              <div className={styles.emptyChart}>Nenhum registro para mapeamento.</div>
            )}
          </div>
        </div>

        {/* Chart 2: Temp Processo vs Temp Ar Scatter Plot */}
        <div className={`glass-panel ${styles.chartCard}`}>
          <div className={styles.cardHeader}>
            <h3>Mapeamento de Temperaturas</h3>
            <span className={styles.cardSubtitle}>Correlação entre temperatura do processo (°C) e do ar (°C)</span>
          </div>

          <div className={styles.chartWrapper}>
            {scatterData.length > 0 ? (
              <ResponsiveContainer width="100%" height={320}>
                <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 10 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                  <XAxis 
                    type="number" 
                    dataKey="airTempC" 
                    name="Temp. Ar" 
                    unit=" °C" 
                    stroke="var(--text-muted)" 
                    fontSize={11}
                    domain={['auto', 'auto']}
                  />
                  <YAxis 
                    type="number" 
                    dataKey="procTempC" 
                    name="Temp. Processo" 
                    unit=" °C" 
                    stroke="var(--text-muted)" 
                    fontSize={11}
                    domain={['auto', 'auto']}
                  />
                  <Tooltip 
                    cursor={{ strokeDasharray: '3 3' }}
                    content={({ active, payload }) => {
                      if (active && payload && payload.length) {
                        const data = payload[0].payload;
                        return (
                          <div className={styles.customTooltip}>
                            <h4>{data.name}</h4>
                            <p>Temp. Ar: <strong>{data.airTempC} °C</strong></p>
                            <p>Temp. Processo: <strong>{data.procTempC} °C</strong></p>
                            <p>Diferencial Térmico: <strong>{(data.procTempC - data.airTempC).toFixed(1)} °C</strong></p>
                            <p>Status: <span className={data.prediction === 1 ? styles.textHigh : styles.textLow}>
                              {data.prediction === 1 ? 'Parada Crítica' : 'Saudável'}
                            </span></p>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                  <Scatter name="Ativos" data={scatterData}>
                    {scatterData.map((entry, index) => {
                      const color = entry.prediction === 1 
                        ? 'var(--color-danger)' 
                        : entry.probability >= 25 
                          ? 'var(--color-warning)' 
                          : 'var(--color-success)';
                      return <Cell key={`cell-${index}`} fill={color} />;
                    })}
                  </Scatter>
                </ScatterChart>
              </ResponsiveContainer>
            ) : (
              <div className={styles.emptyChart}>Nenhum registro para mapeamento.</div>
            )}
          </div>
        </div>

        {/* Chart 3: Wear Bins avg probability Bar Chart */}
        <div className={`glass-panel ${styles.chartCard} ${styles.fullWidth}`}>
          <div className={styles.cardHeader}>
            <h3>Impacto do Desgaste de Ferramenta</h3>
            <span className={styles.cardSubtitle}>Média de risco de falha (%) por tempo acumulado de desgaste da ferramenta (minutos)</span>
          </div>

          <div className={styles.chartWrapper}>
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={wearChartData} margin={{ top: 20, right: 20, bottom: 10, left: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                <XAxis dataKey="range" stroke="var(--text-muted)" fontSize={11} />
                <YAxis unit="%" stroke="var(--text-muted)" fontSize={11} domain={[0, 100]} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'var(--bg-sidebar)',
                    borderColor: 'var(--border-color)',
                    borderRadius: '8px',
                    color: 'var(--text-primary)',
                    fontFamily: 'var(--font-sans)',
                  }}
                />
                <Bar dataKey="Média Risco (%)" fill="var(--color-primary)" radius={[4, 4, 0, 0]}>
                  {wearChartData.map((entry, index) => {
                    const val = entry['Média Risco (%)'];
                    const color = val >= 50 
                      ? 'var(--color-danger)' 
                      : val >= 20 
                        ? 'var(--color-warning)' 
                        : 'var(--color-success)';
                    return <Cell key={`cell-${index}`} fill={color} />;
                  })}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};
