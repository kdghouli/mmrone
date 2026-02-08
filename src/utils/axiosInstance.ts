// utils/axiosInstance.ts
import axios from "axios";
import { useAuthStore } from "../stores/useAuthStore";

// Configuration de base d'Axios
const axiosInstance = axios.create({
  baseURL: "http://localhost:8000/api", // Changez selon votre configuration
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

// Intercepteur pour ajouter le token aux requêtes
axiosInstance.interceptors.request.use(
  (config) => {
    const token =
      localStorage.getItem("auth_token") || useAuthStore.getState().token;

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

// Intercepteur pour gérer les erreurs d'authentification
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expiré ou invalide
      useAuthStore.getState().logout();
      window.location.href = "/login";
    }

    return Promise.reject(error);
  },
);

export default axiosInstance;
