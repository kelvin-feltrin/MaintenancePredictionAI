import { api } from '../api/api';
import type { PredictionRequest, PredictionResponse, PredictionHistoryItem } from '../types/prediction';

const HISTORY_KEY = 'maintenance_prediction_history';

export async function predictMaintenance(data: PredictionRequest): Promise<PredictionResponse> {
  const response = await api.post<PredictionResponse>('/predict', data);
  return response.data;
}

const MOCK_SEED_DATA: PredictionHistoryItem[] = [
  {
    id: 'seed_1',
    equipmentName: 'Fresa Computarizada F-09',
    timestamp: new Date(Date.now() - 1000 * 60 * 20).toISOString(), // 20 mins ago
    request: { type: 'L', air_temperature: 306.15, process_temperature: 317.15, rotational_speed: 2900, torque: 78.2, tool_wear: 245 },
    response: { prediction: 1, status: 'Manutenção Necessária', probability: 88.7, risk: 'Alto', recommendation: 'Agendar manutenção preventiva.', message: 'Foi identificado um risco elevado de falha por desgaste excessivo da ferramenta e torque elevado.' }
  },
  {
    id: 'seed_2',
    equipmentName: 'Robô de Soldagem Articulado R-05',
    timestamp: new Date(Date.now() - 1000 * 60 * 90).toISOString(), // 1.5 hours ago
    request: { type: 'L', air_temperature: 305.15, process_temperature: 316.15, rotational_speed: 2500, torque: 65.0, tool_wear: 180 },
    response: { prediction: 0, status: 'Sem Necessidade de Manutenção', probability: 42.1, risk: 'Baixo', recommendation: 'Continuar monitorando o equipamento.', message: 'Não foram identificados indícios imediatos de falha, porém a probabilidade de falha é moderada devido ao desgaste acumulado.' }
  },
  {
    id: 'seed_3',
    equipmentName: 'Compressor de Ar C-12',
    timestamp: new Date(Date.now() - 1000 * 60 * 360).toISOString(), // 6 hours ago
    request: { type: 'M', air_temperature: 301.15, process_temperature: 311.15, rotational_speed: 1600, torque: 45.2, tool_wear: 80 },
    response: { prediction: 0, status: 'Sem Necessidade de Manutenção', probability: 12.4, risk: 'Baixo', recommendation: 'Continuar monitorando o equipamento.', message: 'Equipamento saudável operando dentro dos parâmetros de telemetria recomendados.' }
  },
  {
    id: 'seed_4',
    equipmentName: 'Torno CNC Multifuso T-800',
    timestamp: new Date(Date.now() - 1000 * 60 * 1440).toISOString(), // 24 hours ago
    request: { type: 'H', air_temperature: 297.65, process_temperature: 307.35, rotational_speed: 1500, torque: 38.5, tool_wear: 10 },
    response: { prediction: 0, status: 'Sem Necessidade de Manutenção', probability: 5.2, risk: 'Baixo', recommendation: 'Continuar monitorando o equipamento.', message: 'Equipamento saudável operando dentro dos parâmetros de telemetria recomendados.' }
  },
  {
    id: 'seed_5',
    equipmentName: 'Esteira Transportadora E-01',
    timestamp: new Date(Date.now() - 1000 * 60 * 2000).toISOString(), // ~33 hours ago
    request: { type: 'L', air_temperature: 307.15, process_temperature: 319.15, rotational_speed: 2750, torque: 72.0, tool_wear: 210 },
    response: { prediction: 1, status: 'Manutenção Necessária', probability: 82.5, risk: 'Alto', recommendation: 'Agendar manutenção preventiva.', message: 'Foi identificado um risco elevado de falha por superaquecimento térmico do processo.' }
  },
  {
    id: 'seed_6',
    equipmentName: 'Prensa Hidráulica P-02',
    timestamp: new Date(Date.now() - 1000 * 60 * 2800).toISOString(), // ~46 hours ago
    request: { type: 'M', air_temperature: 302.15, process_temperature: 312.15, rotational_speed: 1200, torque: 50.0, tool_wear: 120 },
    response: { prediction: 0, status: 'Sem Necessidade de Manutenção', probability: 10.2, risk: 'Baixo', recommendation: 'Continuar monitorando o equipamento.', message: 'Equipamento saudável operando dentro dos parâmetros de telemetria recomendados.' }
  }
];

export function getPredictionHistory(): PredictionHistoryItem[] {
  try {
    const raw = localStorage.getItem(HISTORY_KEY);
    if (!raw) {
      // Seed default data if empty
      localStorage.setItem(HISTORY_KEY, JSON.stringify(MOCK_SEED_DATA));
      // Dispatch event to update components (e.g. Header notification)
      window.dispatchEvent(new CustomEvent('historyUpdate'));
      return MOCK_SEED_DATA;
    }
    return JSON.parse(raw);
  } catch (error) {
    console.error('Error loading history from localStorage', error);
    return [];
  }
}

export function savePredictionToHistory(
  equipmentName: string,
  request: PredictionRequest,
  response: PredictionResponse
): PredictionHistoryItem {
  const newItem: PredictionHistoryItem = {
    id: `item_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    equipmentName: equipmentName || 'Equipamento Genérico',
    timestamp: new Date().toISOString(),
    request,
    response,
  };

  try {
    const history = getPredictionHistory();
    const updatedHistory = [newItem, ...history];
    localStorage.setItem(HISTORY_KEY, JSON.stringify(updatedHistory));
  } catch (error) {
    console.error('Error saving history to localStorage', error);
  }

  return newItem;
}

export function deleteHistoryItem(id: string): PredictionHistoryItem[] {
  try {
    const history = getPredictionHistory();
    const updatedHistory = history.filter((item) => item.id !== id);
    localStorage.setItem(HISTORY_KEY, JSON.stringify(updatedHistory));
    return updatedHistory;
  } catch (error) {
    console.error('Error deleting history item', error);
    return getPredictionHistory();
  }
}

export function clearPredictionHistory(): void {
  try {
    localStorage.removeItem(HISTORY_KEY);
  } catch (error) {
    console.error('Error clearing history', error);
  }
}
