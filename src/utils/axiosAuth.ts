import axios from "axios";
import { useAuthStore } from "../stores/useAuthStore";
import { API_BASE_URL } from "./donnee";

// Configuration de base unique
const axiosAuth = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

// Fonction utilitaire pour récupérer le token
const getToken = () => {
  return useAuthStore.getState().token || localStorage.getItem("auth_token");
};

// Intercepteur requête
axiosAuth.interceptors.request.use(
  (config) => {
    const token = getToken();
    const user = useAuthStore.getState().user;

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    if (user) {
      config.headers["X-User-ID"] = user.id;
      config.headers["X-User-Email"] = user.email;
    }

    return config;
  },
  (error) => Promise.reject(error),
);

// Intercepteur réponse - Gestion des erreurs et rafraîchissement
axiosAuth.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Éviter les boucles infinies
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        // Utiliser refreshAccessToken au lieu de refreshToken
        const newToken = await useAuthStore.getState().refreshAccessToken();

        if (newToken) {
          originalRequest.headers.Authorization = `Bearer ${newToken}`;
          return axiosAuth(originalRequest);
        }
      } catch (refreshError) {
        console.error("Erreur lors du rafraîchissement:", refreshError);
      }
    }

    // Si 401 après tentative de rafraîchissement, déconnecter
    if (error.response?.status === 401) {
      useAuthStore.getState().logout();

      if (!window.location.pathname.includes("/login")) {
        window.location.href = "/login";
      }
    }

    return Promise.reject(error);
  },
);

export default axiosAuth;
