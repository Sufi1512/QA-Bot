export const API_BASE_URL = 'http://localhost:5001/api';
export const CALLS_ENDPOINT = `${API_BASE_URL}/calls`;
export const API_CONFIG = {
  headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/json'
  },
  mode: 'cors' as RequestMode,
  credentials: 'include' as RequestCredentials
};
