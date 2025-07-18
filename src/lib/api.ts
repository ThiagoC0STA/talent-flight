import axios from "axios";

// Cliente axios otimizado
const api = axios.create({
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Interceptor para requests
api.interceptors.request.use(
  (config) => {
    // Deixar o Next.js cuidar do cache automaticamente
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor para responses
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    console.error("API Error:", error);
    return Promise.reject(error);
  }
);

export default api;
