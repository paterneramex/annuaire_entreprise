import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8000/api/',
});

// intercepteur pour AJOUTER le jeton à chaque requête sortante
api.interceptors.request.use(
  (config) => {
    // On récupère le jeton d'accès stocké localement
    const token = localStorage.getItem('access_token');
    
    // Si le jeton existe, on l'ajoute dans l'en-tête Authorization
    // C'est le format "Bearer <token>" configuré dans Django settings.py
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;