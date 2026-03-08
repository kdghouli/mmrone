/* eslint-disable @typescript-eslint/no-unused-vars */
import { create } from "zustand";
import type {
  Task,
  TaskFormData,
  TaskFilters,
} from "../components/tasks/task.types";
import { taskService } from "../services/api";

interface TaskStore {
  tasks: Task[];
  filteredTasks: Task[];
  loading: boolean;
  error: string | null;
  filters: TaskFilters;

  // Actions
  fetchTasks: () => Promise<void>;
  addTask: (task: TaskFormData) => Promise<void>;
  updateTask: (id: number, task: Partial<TaskFormData>) => Promise<void>;
  deleteTask: (id: number) => Promise<void>;
  updateTaskStatus: (id: number, status: Task["status"]) => Promise<void>;
  setFilters: (filters: TaskFilters) => void;
  clearFilters: () => void;
}

export const useTaskStore = create<TaskStore>((set, get) => ({
  tasks: [],
  filteredTasks: [],
  loading: false,
  error: null,
  filters: {},

  fetchTasks: async () => {
    set({ loading: true, error: null });
    try {
      const tasks = await taskService.getAll();
      console.log("Fetched tasks:", tasks);
      set({ tasks, filteredTasks: tasks, loading: false });
    } catch (error) {
      set({ error: "Erreur lors du chargement des tâches", loading: false });
    }
  },

  addTask: async (taskData) => {
    set({ loading: true, error: null });
    try {
      console.log("Adding task:", taskData);
      const newTask = await taskService.create(taskData);
      set((state) => ({
        tasks: [...state.tasks, newTask],
        filteredTasks: [...state.tasks, newTask],
        loading: false,
      }));
      get().fetchTasks();
    } catch (error) {
      set({ error: "Erreur lors de la création de la tâche", loading: false });
    }
  },

  updateTask: async (id, taskData) => {
    set({ loading: true, error: null });
    try {
      const updatedTask = await taskService.update(id, taskData);
      set((state) => ({
        tasks: state.tasks.map((task) => (task.id === id ? updatedTask : task)),
        filteredTasks: state.filteredTasks.map((task) =>
          task.id === id ? updatedTask : task,
        ),
        loading: false,
      }));
    } catch (error) {
      set({
        error: "Erreur lors de la mise à jour de la tâche",
        loading: false,
      });
    }
  },

  deleteTask: async (id) => {
    set({ loading: true, error: null });
    try {
      await taskService.delete(id);
      set((state) => ({
        tasks: state.tasks.filter((task) => task.id !== id),
        filteredTasks: state.filteredTasks.filter((task) => task.id !== id),
        loading: false,
      }));
    } catch (error) {
      set({
        error: "Erreur lors de la suppression de la tâche",
        loading: false,
      });
    }
  },

  updateTaskStatus: async (id, status) => {
    set({ loading: true, error: null });
    try {
      const updatedTask = await taskService.updateStatus(id, status);
      set((state) => ({
        tasks: state.tasks.map((task) => (task.id === id ? updatedTask : task)),
        filteredTasks: state.filteredTasks.map((task) =>
          task.id === id ? updatedTask : task,
        ),
        loading: false,
      }));
    } catch (error) {
      set({ error: "Erreur lors de la mise à jour du statut", loading: false });
    }
  },

  setFilters: (newFilters) => {
    set((state) => {
      const filters = { ...state.filters, ...newFilters };
      const filtered = state.tasks.filter((task) => {
        if (filters.priority && task.priority !== filters.priority)
          return false;
        if (filters.status && task.status !== filters.status) return false;
        if (filters.urgence && task.urgence !== filters.urgence) return false;
        if (filters.search) {
          const searchLower = filters.search.toLowerCase();
          return (
            task.title.toLowerCase().includes(searchLower) ||
            task.description.toLowerCase().includes(searchLower)
          );
        }
        return true;
      });
      return { filters, filteredTasks: filtered };
    });
  },

  clearFilters: () => {
    set((state) => ({
      filters: {},
      filteredTasks: state.tasks,
    }));
  },
}));
