import { create } from "zustand";
import { persist } from "zustand/middleware";
import { API_BASE_URL } from "../utils/donnee";
import axiosAuth from "../utils/axiosAuth";

interface User {
  id: string;
  name: string;
  email: string;
  image?: string;
  created_at?: string;
  updated_at?: string;
}

interface LoginResponse {
  message: string;
  access_token: string;
  token_type: string;
  user: User;
}

interface RegisterResponse {
  data: User;
  access_token: string;
  token_type: string;
}

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;

  // Actions
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  updateProfile: (
    userData: Partial<User> & { password?: string; image?: File },
  ) => Promise<void>;
  clearError: () => void;
  setLoading: (loading: boolean) => void;
}

// Configuration API
// Changez selon votre configuration
const headers = {
  "Content-Type": "application/json",
  Accept: "application/json",
  enctype: "multipart/form-data",
};

// Fonctions API
const loginAPI = async (
  email: string,
  password: string,
): Promise<LoginResponse> => {
  const response = await axiosAuth.post(`login`, { email, password });

  if (!response) {
    const errorData = await response;
    throw new Error(errorData || "Identifiants incorrects");
  }

  return response.data;
};

const registerAPI = async (
  name: string,
  email: string,
  password: string,
): Promise<RegisterResponse> => {
  const response = await axiosAuth.post(`register`, 
    { name, email, password })

  if (!response) {
    const errorData = await response;

    // Gestion des erreurs de validation Laravel
    if (errorData) {
      const firstError = Object.values(errorData)[0];
      throw new Error(
        Array.isArray(firstError) ? firstError[0] : "Erreur de validation",
      );
    }

    throw new Error(errorData|| "Erreur lors de l'inscription");
  }

  return response.data;
};

const logoutAPI = async (token: string): Promise<void> => {
  const response = await axiosAuth.post(`logout`, {
    headers: {
      ...headers,
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response) {
    console.error("Erreur lors de la déconnexion:", await response);
  }
};

const updateProfileAPI = async (
  token: string,
  userData: Partial<User> & { password?: string; image?: File },
): Promise<User> => {
  const formData = new FormData();

  // Ajouter les champs texte
  if (userData.name) formData.append("name", userData.name);
  if (userData.email) formData.append("email", userData.email);
  if (userData.password) formData.append("password", userData.password);

  // Ajouter l'image si présente
  if (userData.image) {
    formData.append("image", userData.image);
  }

  const response = await fetch(`${API_BASE_URL}update-profile`, {
    method: "POST",
    headers: {
      Accept: "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: formData,
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(
      errorData.message || "Erreur lors de la mise à jour du profil",
    );
  }

  const data = await response.json();
  return data.user;
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,

      login: async (email: string, password: string) => {
        set({ isLoading: true, error: null });

        try {
          const response = await loginAPI(email, password);

          set({
            user: response.user,
            token: response.access_token,
            isAuthenticated: true,
            isLoading: false,
            error: null,
          });

          // Stocker le token dans localStorage pour les requêtes futures
          localStorage.setItem("auth_token", response.access_token);
        } catch (error: any) {
          set({
            isLoading: false,
            error: error.message || "Identifiants incorrects",
            isAuthenticated: false,
          });
          throw error;
        }
      },

      register: async (name: string, email: string, password: string) => {
        set({ isLoading: true, error: null });

        try {
          const response = await registerAPI(name, email, password);

          set({
            user: response.data,
            token: response.access_token,
            isAuthenticated: true,
            isLoading: false,
            error: null,
          });

          localStorage.setItem("auth_token", response.access_token);
        } catch (error: any) {
          set({
            isLoading: false,
            error: error.message || "Erreur lors de la création du compte",
            isAuthenticated: false,
          });
          throw error;
        }
      },

      logout: async () => {
        const { token } = get();

        try {
          if (token) {
            await logoutAPI(token);
          }
        } catch (error) {
          console.error("Erreur lors de la déconnexion:", error);
        } finally {
          set({
            user: null,
            token: null,
            isAuthenticated: false,
            error: null,
          });

          localStorage.removeItem("auth_token");
          localStorage.removeItem("rememberMe");
        }
      },

      updateProfile: async (userData) => {
        set({ isLoading: true, error: null });
        const { token } = get();

        if (!token) {
          set({ isLoading: false, error: "Non authentifié" });
          throw new Error("Non authentifié");
        }

        try {
          const updatedUser = await updateProfileAPI(token, userData);

          set((state) => ({
            user: { ...state.user, ...updatedUser },
            isLoading: false,
            error: null,
          }));
        } catch (error: any) {
          set({
            isLoading: false,
            error: error.message || "Erreur lors de la mise à jour",
          });
          throw error;
        }
      },

      clearError: () => {
        set({ error: null });
      },

      setLoading: (loading: boolean) => {
        set({ isLoading: loading });
      },
    }),
    {
      name: "auth-storage",
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        isAuthenticated: state.isAuthenticated,
      }),
      onRehydrateStorage: () => {
        return (state) => {
          // Vérifier si le token est expiré au rechargement
          if (state?.token) {
            // Vous pourriez ajouter une vérification de token ici
            localStorage.setItem("auth_token", state.token);
          }
        };
      },
    },
  ),
);

// Hook personnalisé pour vérifier l'authentification
export const useAuth = () => {
  const {
    user,
    token,
    isAuthenticated,
    isLoading,
    error,
    login,
    register,
    logout,
    updateProfile,
    clearError,
    setLoading,
  } = useAuthStore();

  return {
    user,
    token,
    isAuthenticated,
    isLoading,
    error,
    login,
    register,
    logout,
    updateProfile,
    clearError,
    setLoading,
  };
};

// Helper pour les requêtes API authentifiées
export const authFetch = async (url: string, options: RequestInit = {}) => {
  const token =
    localStorage.getItem("auth_token") || useAuthStore.getState().token;

  const headers = {
    "Content-Type": "application/json",
    Accept: "application/json",
    ...options.headers,
  };

  if (token) {
    (headers as any)["Authorization"] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE_URL}${url}`, {
    ...options,
    headers,
  });

  if (response.status === 401) {
    // Token expiré ou invalide
    useAuthStore.getState().logout();
    throw new Error("Session expirée. Veuillez vous reconnecter.");
  }

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || "Erreur serveur");
  }

  return response.json();
};

// Hook pour vérifier l'authentification dans les composants
export const useAuthCheck = () => {
  const { isAuthenticated, isLoading } = useAuth();

  return {
    isAuthenticated,
    isLoading,
    isGuest: !isAuthenticated && !isLoading,
  };
};
