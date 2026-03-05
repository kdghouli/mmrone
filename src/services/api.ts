import axios from "axios";
import type {
  Task,
  TaskFormData,
  ApiResponse,
} from "../components/tasks/task.types";
import { API_BASE_URL } from "../utils/donnee";
import { useAuthStore } from "../stores/useAuthStore";

const api = axios.create({
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
api.interceptors.request.use(
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

// Intercepteur pour gérer les erreurs
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error("API Error:", error.response?.data || error.message);
    return Promise.reject(error);
  },
);

export const taskService = {
  // Récupérer toutes les tâches
  getAll: async (): Promise<Task[]> => {
    const response = await api.get<ApiResponse<Task[]>>("/tasks");
    console.log("Get API Response:", response.data);
    return response.data.data;
  },

  // Récupérer une tâche par ID
  getById: async (id: number): Promise<Task> => {
    const response = await api.get<ApiResponse<Task>>(`/tasks/${id}`);
    return response.data.data;
  },

  // Créer une nouvelle tâche
  create: async (task: TaskFormData): Promise<Task> => {
    const response = await api.post<ApiResponse<Task>>("/tasks", task);
    return response.data.data;
  },

  // Mettre à jour une tâche
  update: async (id: number, task: Partial<TaskFormData>): Promise<Task> => {
    const response = await api.put<ApiResponse<Task>>(`/tasks/${id}`, task);
    return response.data.data;
  },

  // Supprimer une tâche
  delete: async (id: number): Promise<void> => {
    await api.delete(`/tasks/${id}`);
  },

  // Mettre à jour le statut
  updateStatus: async (id: number, status: Task["status"]): Promise<Task> => {
    const response = await api.patch<ApiResponse<Task>>(`/tasks/${id}/status`, {
      status,
    });
    return response.data.data;
  },
};
