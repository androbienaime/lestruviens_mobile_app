// Configuration de l'API
const API_CONFIG = {
    BASE_URL: 'http://192.168.1.28:8000/api',
    TIMEOUT: 15000, // 15 secondes
    RETRY_ATTEMPTS: 3,
    HEADERS: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    },
  };
  
  export default API_CONFIG;