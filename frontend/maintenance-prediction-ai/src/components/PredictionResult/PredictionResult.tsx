import React from 'react';
import type { PredictionResponse, PredictionRequest } from '../../types/prediction';
import { FiAlertOctagon, FiCheckCircle, FiAlertTriangle, FiInfo } from 'react-icons/fi';
import styles from './PredictionResult.module.css';

interface PredictionResultProps {
  result: PredictionResponse;
  requestData: PredictionRequest;
  equipmentName: string;
}

export const PredictionResult: React.FC<PredictionResultProps> = ({
  result,
  requestData,
  equipmentName,
}) => {
  const { prediction, status, probability, recommendation, message } = result;

  // Determine risk level color scheme:
  // Red = Prediction is 1 (High)
  // Yellow = Prediction is 0, but probability is elevated (Medium: 25% - 50%)
  // Green = Prediction is 0, low probability (Low: < 25%)
  let riskColorClass = styles.lowRisk;
  let riskLabel = 'Baixo Risco';
  let RiskIcon = <FiCheckCircle />;

  if (prediction === 1) {
    riskColorClass = styles.highRisk;
    riskLabel = 'Alto Risco';
    RiskIcon = <FiAlertOctagon />;
  } else if (probability >= 25) {
    riskColorClass = styles.mediumRisk;
    riskLabel = 'Risco Médio';
    RiskIcon = <FiAlertTriangle />;
  }

  // Circular gauge settings
  const radius = 60;
  const stroke = 10;
  const normalizedRadius = radius - stroke * 2;
  const circumference = normalizedRadius * 2 * Math.PI;
  const strokeDashoffset = circumference - (probability / 100) * circumference;

  return (
    <div className={`glass-panel ${styles.container} ${riskColorClass} animate-slide-in`}>
      <div className={styles.header}>
        <div className={styles.headerTitle}>
          <span className={styles.subtitle}>Resultado da Análise</span>
          <h3>{equipmentName}</h3>
        </div>
        <div className={`${styles.badge} ${riskColorClass}`}>
          {RiskIcon}
          <span>{riskLabel}</span>
        </div>
      </div>

      <div className={styles.body}>
        {/* Gauge section */}
        <div className={styles.gaugeSection}>
          <div className={styles.gaugeWrapper}>
            <svg height={radius * 2} width={radius * 2} className={styles.svg}>
              <circle
                stroke="rgba(255,255,255,0.05)"
                fill="transparent"
                strokeWidth={stroke}
                r={normalizedRadius}
                cx={radius}
                cy={radius}
              />
              <circle
                stroke="currentColor"
                fill="transparent"
                strokeWidth={stroke}
                strokeDasharray={circumference + ' ' + circumference}
                style={{ strokeDashoffset }}
                strokeLinecap="round"
                r={normalizedRadius}
                cx={radius}
                cy={radius}
                className={styles.gaugeCircle}
              />
            </svg>
            <div className={styles.gaugeText}>
              <span className={styles.probabilityVal}>{probability}%</span>
              <span className={styles.probabilityLbl}>Probabilidade de Falha</span>
            </div>
          </div>
        </div>

        {/* Status messages */}
        <div className={styles.detailsSection}>
          <div className={styles.statusBox}>
            <span className={styles.detailTitle}>Status de Operação</span>
            <p className={styles.statusText}>{status}</p>
          </div>

          <div className={styles.messageBox}>
            <span className={styles.detailTitle}>Diagnóstico</span>
            <p className={styles.messageText}>{message}</p>
          </div>

          <div className={styles.recommendationBox}>
            <span className={styles.detailTitle}>Recomendação Preventiva</span>
            <p className={styles.recommendationText}>{recommendation}</p>
          </div>
        </div>
      </div>

      {/* Telemetry review summary */}
      <div className={styles.footer}>
        <div className={styles.telemetryTitle}>
          <FiInfo size={14} />
          <span>Telemetria Analisada</span>
        </div>
        <div className={styles.telemetryGrid}>
          <div className={styles.telItem}>
            <span className={styles.telLabel}>Tipo</span>
            <span className={styles.telValue}>{requestData.type}</span>
          </div>
          <div className={styles.telItem}>
            <span className={styles.telLabel}>Temp. Ar</span>
            <span className={styles.telValue}>{(requestData.air_temperature - 273.15).toFixed(1)}°C</span>
          </div>
          <div className={styles.telItem}>
            <span className={styles.telLabel}>Temp. Processo</span>
            <span className={styles.telValue}>{(requestData.process_temperature - 273.15).toFixed(1)}°C</span>
          </div>
          <div className={styles.telItem}>
            <span className={styles.telLabel}>Velocidade</span>
            <span className={styles.telValue}>{requestData.rotational_speed} rpm</span>
          </div>
          <div className={styles.telItem}>
            <span className={styles.telLabel}>Torque</span>
            <span className={styles.telValue}>{requestData.torque} Nm</span>
          </div>
          <div className={styles.telItem}>
            <span className={styles.telLabel}>Desgaste</span>
            <span className={styles.telValue}>{requestData.tool_wear} min</span>
          </div>
        </div>
      </div>
    </div>
  );
};
