export interface PredictionRequest {
  type: 'L' | 'M' | 'H';
  air_temperature: number; // in Kelvin
  process_temperature: number; // in Kelvin
  rotational_speed: number; // in rpm
  torque: number; // in Nm
  tool_wear: number; // in min
}

export interface PredictionResponse {
  prediction: number;
  status: string;
  probability: number; // percentage (e.g. 85.5)
  risk: 'Alto' | 'Baixo' | string;
  recommendation: string;
  message: string;
}

export interface PredictionHistoryItem {
  id: string;
  equipmentName: string;
  timestamp: string;
  request: PredictionRequest;
  response: PredictionResponse;
}
