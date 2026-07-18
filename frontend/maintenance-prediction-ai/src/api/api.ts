import axios from 'axios';

// Get base URL from environment variables, fallback to localhost:8000
const baseURL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

export const api = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Response interceptor for unified error formatting
api.interceptors.response.use(
  (response) => response,
  (error) => {
    let errorMessage = 'Não foi possível processar a requisição. Tente novamente.';
    
    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      const detail = error.response.data?.detail;
      errorMessage = typeof detail === 'string' ? detail : `Erro do servidor (${error.response.status})`;
    } else if (error.request) {
      // The request was made but no response was received
      errorMessage = 'Servidor de previsão offline. Por favor, verifique se a API está em execução.';
    } else {
      // Something happened in setting up the request that triggered an Error
      errorMessage = error.message;
    }

    return Promise.reject(new Error(errorMessage));
  }
);
