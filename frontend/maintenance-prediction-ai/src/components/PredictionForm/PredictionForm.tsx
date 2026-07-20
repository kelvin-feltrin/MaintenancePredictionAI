import React, { useState } from 'react';
import type { PredictionRequest } from '../../types/prediction';
import { FiAlertTriangle, FiCpu, FiInfo } from 'react-icons/fi';
import styles from './PredictionForm.module.css';

interface PredictionFormProps {
  onSubmit: (equipmentName: string, requestData: PredictionRequest) => void;
  loading: boolean;
}

export const PredictionForm: React.FC<PredictionFormProps> = ({ onSubmit, loading }) => {
  const [equipmentName, setEquipmentName] = useState('Torno CNC-104');
  const [type, setType] = useState<'L' | 'M' | 'H'>('L');

  // Use Celsius in the UI, convert to Kelvin before submitting
  const [airTempC, setAirTempC] = useState('25');
  const [procTempC, setProcTempC] = useState('35');

  const [rotationalSpeed, setRotationalSpeed] = useState('1500');
  const [torque, setTorque] = useState('40');
  const [toolWear, setToolWear] = useState('60');

  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!equipmentName.trim()) {
      newErrors.equipmentName = 'Nome do equipamento é obrigatório.';
    }

    const airC = parseFloat(airTempC);
    if (isNaN(airC) || airC < -50 || airC > 100) {
      newErrors.airTempC = 'Temperatura do ar deve estar entre -50°C e 100°C.';
    }

    const procC = parseFloat(procTempC);
    if (isNaN(procC) || procC < -50 || procC > 100) {
      newErrors.procTempC = 'Temperatura do processo deve estar entre -50°C e 100°C.';
    }

    const rpm = parseInt(rotationalSpeed, 10);
    if (isNaN(rpm) || rpm < 0 || rpm > 10000) {
      newErrors.rotationalSpeed = 'Velocidade de rotação deve estar entre 0 e 10000 rpm.';
    }

    const trq = parseFloat(torque);
    if (isNaN(trq) || trq < 0 || trq > 500) {
      newErrors.torque = 'Torque deve estar entre 0 e 500 Nm.';
    }

    const wear = parseInt(toolWear, 10);
    if (isNaN(wear) || wear < 0 || wear > 1000) {
      newErrors.toolWear = 'Desgaste da ferramenta deve estar entre 0 e 1000 min.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    // Convert C to Kelvin: K = C + 273.15
    const airK = parseFloat(airTempC) + 273.15;
    const procK = parseFloat(procTempC) + 273.15;

    const requestData: PredictionRequest = {
      type,
      air_temperature: parseFloat(airK.toFixed(2)),
      process_temperature: parseFloat(procK.toFixed(2)),
      rotational_speed: parseInt(rotationalSpeed, 10),
      torque: parseFloat(torque),
      tool_wear: parseInt(toolWear, 10),
    };

    onSubmit(equipmentName, requestData);
  };

  // Preset loaders for fast testing
  const loadPreset = (presetType: 'healthy' | 'critical') => {
    if (presetType === 'healthy') {
      setEquipmentName('Gerador G-201 (Saudável)');
      setType('H');
      setAirTempC('24.5');
      setProcTempC('34.2');
      setRotationalSpeed('1420');
      setTorque('38.5');
      setToolWear('12');
    } else {
      // Typically high wear, high torque, high temp causes failure
      setEquipmentName('Prensa Hidráulica P-03 (Crítica)');
      setType('L');
      setAirTempC('31.2');
      setProcTempC('42.5');
      setRotationalSpeed('2800');
      setTorque('75.2');
      setToolWear('230');
    }
  };

  // Live conversions for transparency
  const airKPreview = (parseFloat(airTempC) + 273.15 || 0).toFixed(2);
  const procKPreview = (parseFloat(procTempC) + 273.15 || 0).toFixed(2);

  return (
    <form className={`glass-panel ${styles.form}`} onSubmit={handleSubmit}>
      <div className={styles.formHeader}>
        <FiCpu size={24} className={styles.headerIcon} />
        <h2>Parâmetros de Telemetria</h2>
      </div>

      <div className={styles.presets}>
        <button
          type="button"
          onClick={() => loadPreset('healthy')}
          className={`${styles.presetBtn} ${styles.healthyBtn}`}
          disabled={loading}
        >
          Preset Saudável (Baixo Risco)
        </button>
        <button
          type="button"
          onClick={() => loadPreset('critical')}
          className={`${styles.presetBtn} ${styles.criticalBtn}`}
          disabled={loading}
        >
          Preset Crítico (Alto Risco)
        </button>
      </div>

      <div className={styles.grid}>
        <div className={`${styles.field} ${styles.fullWidth}`}>
          <label htmlFor="equipmentName">Nome / ID do Ativo</label>
          <input
            id="equipmentName"
            type="text"
            value={equipmentName}
            onChange={(e) => setEquipmentName(e.target.value)}
            disabled={loading}
            placeholder="Ex: Torno CNC 04"
          />
          {errors.equipmentName && <span className={styles.error}>{errors.equipmentName}</span>}
        </div>

        <div className={styles.field}>
          <label htmlFor="type">
            Tipo de Variante
            <span className={styles.infoTooltip} title="L (Low), M (Medium), H (High) representam o grau de qualidade/tolerância do maquinário.">
              <FiInfo />
            </span>
          </label>
          <select
            id="type"
            value={type}
            onChange={(e) => setType(e.target.value as 'L' | 'M' | 'H')}
            disabled={loading}
          >
            <option value="L">L (Low - Baixa Qualidade)</option>
            <option value="M">M (Medium - Média Qualidade)</option>
            <option value="H">H (High - Alta Qualidade)</option>
          </select>
        </div>

        <div className={styles.field}>
          <label htmlFor="toolWear">Desgaste da Ferramenta (min)</label>
          <input
            id="toolWear"
            type="number"
            value={toolWear}
            onChange={(e) => setToolWear(e.target.value)}
            disabled={loading}
            min="0"
          />
          {errors.toolWear && <span className={styles.error}>{errors.toolWear}</span>}
        </div>

        <div className={styles.field}>
          <label htmlFor="airTempC">
            Temp. do Ar (°C)
            <span className={styles.conversion}>({airKPreview} K)</span>
          </label>
          <input
            id="airTempC"
            type="number"
            step="0.01"
            value={airTempC}
            onChange={(e) => setAirTempC(e.target.value)}
            disabled={loading}
          />
          {errors.airTempC && <span className={styles.error}>{errors.airTempC}</span>}
        </div>

        <div className={styles.field}>
          <label htmlFor="procTempC">
            Temp. do Processo (°C)
            <span className={styles.conversion}>({procKPreview} K)</span>
          </label>
          <input
            id="procTempC"
            type="number"
            step="0.01"
            value={procTempC}
            onChange={(e) => setProcTempC(e.target.value)}
            disabled={loading}
          />
          {errors.procTempC && <span className={styles.error}>{errors.procTempC}</span>}
        </div>

        <div className={styles.field}>
          <label htmlFor="rotationalSpeed">Velocidade Rotacional (rpm)</label>
          <input
            id="rotationalSpeed"
            type="number"
            value={rotationalSpeed}
            onChange={(e) => setRotationalSpeed(e.target.value)}
            disabled={loading}
            min="0"
          />
          {errors.rotationalSpeed && <span className={styles.error}>{errors.rotationalSpeed}</span>}
        </div>

        <div className={styles.field}>
          <label htmlFor="torque">Torque (Nm)</label>
          <input
            id="torque"
            type="number"
            step="0.1"
            value={torque}
            onChange={(e) => setTorque(e.target.value)}
            disabled={loading}
            min="0"
          />
          {errors.torque && <span className={styles.error}>{errors.torque}</span>}
        </div>
      </div>

      <button type="submit" className={styles.submitBtn} disabled={loading}>
        {loading ? 'Processando Previsão...' : 'Executar Análise Preditiva'}
      </button>

      <div className={styles.field}>
        <label>ATENÇÃO: Por se tratar de uma aplicação com fins acadêmicos, a primeira requisição pode demorar para responder devido à limitação da hospedagem gratuita.</label>
      </div>
    </form>
  );
};
