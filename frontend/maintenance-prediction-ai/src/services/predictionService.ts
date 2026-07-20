import { api } from '../api/api';
import type { PredictionRequest, PredictionResponse, PredictionHistoryItem } from '../types/prediction';

const HISTORY_KEY = 'maintenance_prediction_history';

export async function predictMaintenance(data: PredictionRequest): Promise<PredictionResponse> {
  const response = await api.post<PredictionResponse>('/predict', data);
  return response.data;
}

export function getPredictionHistory(): PredictionHistoryItem[] {
  try {
    const raw = localStorage.getItem(HISTORY_KEY);
    if (!raw) {
      return [];
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
    id: `item_${Date.now()}_${Math.random().toString(36).substring(2, 11)}`,
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
