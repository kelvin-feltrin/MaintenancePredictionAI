import React, { useState } from 'react';
import { PredictionForm } from '../../components/PredictionForm/PredictionForm';
import { PredictionResult } from '../../components/PredictionResult/PredictionResult';
import { LoadingSpinner } from '../../components/LoadingSpinner/LoadingSpinner';
import { predictMaintenance, savePredictionToHistory } from '../../services/predictionService';
import type { PredictionRequest, PredictionResponse } from '../../types/prediction';
import { FiCpu, FiAlertTriangle } from 'react-icons/fi';
import styles from './Prediction.module.css';

export const Prediction: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<PredictionResponse | null>(null);
  const [lastRequest, setLastRequest] = useState<PredictionRequest | null>(null);
  const [equipmentName, setEquipmentName] = useState('');

  const handlePredict = async (name: string, requestData: PredictionRequest) => {
    setLoading(true);
    setError(null);
    setResult(null);
    setEquipmentName(name);
    setLastRequest(requestData);

    try {
      // Call prediction API
      const predictionResponse = await predictMaintenance(requestData);
      setResult(predictionResponse);
      
      // Save to localStorage history
      savePredictionToHistory(name, requestData, predictionResponse);
      
      // Fire history update event for header/dashboard
      window.dispatchEvent(new CustomEvent('historyUpdate'));
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Falha ao processar previsão de manutenção. Verifique se o servidor FastAPI está ligado.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`${styles.container} animate-fade-in`}>
      <div className={styles.grid}>
        {/* Left Side: Parameters Form */}
        <div className={styles.formContainer}>
          <PredictionForm onSubmit={handlePredict} loading={loading} />
        </div>

        {/* Right Side: Results Display */}
        <div className={styles.resultContainer}>
          {loading && (
            <div className={`glass-panel ${styles.centerBox}`}>
              <LoadingSpinner message="Analisando telemetria e calculando probabilidades via modelo Random Forest..." />
            </div>
          )}

          {error && (
            <div className={`glass-panel ${styles.errorBox}`}>
              <FiAlertTriangle size={32} className={styles.errorIcon} />
              <h3>Erro de Comunicação</h3>
              <p className={styles.errorText}>{error}</p>
              <div className={styles.errorHelp}>
                <span>Dica:</span> Certifique-se de que a API FastAPI está ativa na porta 8000.
              </div>
            </div>
          )}

          {!loading && !error && result && lastRequest && (
            <PredictionResult
              result={result}
              requestData={lastRequest}
              equipmentName={equipmentName}
            />
          )}

          {!loading && !error && !result && (
            <div className={`glass-panel ${styles.emptyState}`}>
              <div className={styles.pulseIcon}>
                <FiCpu size={36} />
              </div>
              <h3>Análise Preditiva em Tempo Real</h3>
              <p>
                Insira as leituras de telemetria do ativo industrial no formulário para executar o modelo 
                de Machine Learning. O diagnóstico retornará o status de manutenção imediato.
              </p>
              <div className={styles.tips}>
                <h4>Variáveis Chave Analisadas:</h4>
                <ul>
                  <li><strong>Temperatura Termodinâmica:</strong> Dissipação de calor do motor/cabeçote.</li>
                  <li><strong>Velocidade de Rotação (RPM):</strong> Rotação do eixo mecânico principal.</li>
                  <li><strong>Torque Aplicado (Nm):</strong> Força de torção solicitada pelo processo.</li>
                  <li><strong>Tempo de Ferramenta (min):</strong> Tempo acumulado de uso da peça.</li>
                </ul>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
