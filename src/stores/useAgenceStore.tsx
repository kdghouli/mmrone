/* eslint-disable @typescript-eslint/no-explicit-any */
// stores/useAgenceStore.ts
import React from "react";
import { create } from "zustand";
import axios from "axios";
import { toast } from "react-toastify";
import { API_BASE_URL } from "../utils/donnee";

interface Agence {
  id: string;
  nom: string;
  site: string;
  division: string;
  created_at?: string;
  updated_at?: string;
}

interface AgenceState {
  agences: Agence[];
  loading: boolean;
  error: string | null;

  // Actions pour l'API
  fetchAgences: () => Promise<void>;
  fetchAgenceById: (id: string) => Promise<Agence | undefined>;
  createAgence: (agenceData: Omit<Agence, "id">) => Promise<Agence | undefined>;
  updateAgence: (
    id: string,
    agenceData: Partial<Agence>,
  ) => Promise<Agence | undefined>;
  deleteAgence: (id: string) => Promise<boolean>;

  // Getters (utilitaires)
  getAgenceById: (id: string) => Agence | undefined;
  getAgencesByDivision: (division: string) => Agence[];
  searchAgences: (searchTerm: string) => Agence[];

  // Actions pour le state local
  addAgence: (agence: Agence) => void;
  removeAgence: (id: string) => void;
  updateLocalAgence: (id: string, updatedAgence: Agence) => void;
  clearError: () => void;
}

// À adapter

export const useAgenceStore = create<AgenceState>()((set, get) => ({
  agences: [],
  loading: false,
  error: null,

  // Récupérer toutes les agences depuis l'API
  fetchAgences: async () => {
    set({ loading: true, error: null });
    try {
      const response = await axios.get(`${API_BASE_URL}agences`);
      const agences: Agence[] = response.data.map((agence: any) => ({
        id: agence.id.toString(),
        nom: agence.nom,
        site: agence.site || "",
        division: agence.division || "",
        created_at: agence.created_at,
        updated_at: agence.updated_at,
      }));

      set({ agences, loading: false });
      toast.success(`${agences.length} agences chargées avec succès`);
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "Erreur lors du chargement des agences";
      set({ error: errorMessage, loading: false });
      toast.error(errorMessage);
      console.error("Erreur fetchAgences:", error);
    }
  },

  // Récupérer une agence par son ID depuis l'API
  fetchAgenceById: async (id: string) => {
    set({ loading: true, error: null });
    try {
      const response = await axios.get(`${API_BASE_URL}agences/${id}`);
      const agence: Agence = {
        id: response.data.id.toString(),
        nom: response.data.nom,
        site: response.data.site || "",
        division: response.data.division || "",
        created_at: response.data.created_at,
        updated_at: response.data.updated_at,
      };

      // Mettre à jour le store avec l'agence récupérée
      set((state) => {
        const exists = state.agences.find((a) => a.id === id);
        if (exists) {
          return {
            agences: state.agences.map((a) => (a.id === id ? agence : a)),
            loading: false,
          };
        } else {
          return {
            agences: [...state.agences, agence],
            loading: false,
          };
        }
      });

      return agence;
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        `Erreur lors du chargement de l'agence ${id}`;
      set({ error: errorMessage, loading: false });
      toast.error(errorMessage);
      console.error("Erreur fetchAgenceById:", error);
      return undefined;
    }
  },

  // Créer une nouvelle agence via l'API
  createAgence: async (agenceData: Omit<Agence, "id">) => {
    set({ loading: true, error: null });
    try {
      const response = await axios.post(`${API_BASE_URL}agences`, agenceData);
      const newAgence: Agence = {
        id: response.data.id.toString(),
        ...agenceData,
      };

      // Ajouter au store
      set((state) => ({
        agences: [...state.agences, newAgence],
        loading: false,
      }));

      toast.success("Agence créée avec succès");
      return newAgence;
    } catch (error: any) {
      let errorMessage = "Erreur lors de la création de l'agence";

      if (error.response?.data?.errors) {
        // Gestion des erreurs de validation Laravel
        const validationErrors = Object.values(
          error.response.data.errors,
        ).flat();
        errorMessage = validationErrors.join(", ");
      } else if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      }

      set({ error: errorMessage, loading: false });
      toast.error(errorMessage);
      console.error("Erreur createAgence:", error);
      return undefined;
    }
  },

  // Mettre à jour une agence via l'API
  updateAgence: async (id: string, agenceData: Partial<Agence>) => {
    set({ loading: true, error: null });
    try {
      const response = await axios.put(
        `${API_BASE_URL}agences/${id}`,
        agenceData,
      );
      const updatedAgence: Agence = {
        ...response.data,
        id: response.data.id.toString(),
      };

      // Mettre à jour dans le store
      set((state) => ({
        agences: state.agences.map((agence) =>
          agence.id === id ? updatedAgence : agence,
        ),
        loading: false,
      }));

      toast.success("Agence mise à jour avec succès");
      return updatedAgence;
    } catch (error: any) {
      let errorMessage = `Erreur lors de la mise à jour de l'agence ${id}`;

      if (error.response?.data?.errors) {
        const validationErrors = Object.values(
          error.response.data.errors,
        ).flat();
        errorMessage = validationErrors.join(", ");
      } else if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      }

      set({ error: errorMessage, loading: false });
      toast.error(errorMessage);
      console.error("Erreur updateAgence:", error);
      return undefined;
    }
  },

  // Supprimer une agence via l'API
  deleteAgence: async (id: string) => {
    set({ loading: true, error: null });
    try {
      await axios.delete(`${API_BASE_URL}agences/${id}`);

      // Retirer du store
      set((state) => ({
        agences: state.agences.filter((agence) => agence.id !== id),
        loading: false,
      }));

      toast.success("Agence supprimée avec succès");
      return true;
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        `Erreur lors de la suppression de l'agence ${id}`;
      set({ error: errorMessage, loading: false });
      toast.error(errorMessage);
      console.error("Erreur deleteAgence:", error);
      return false;
    }
  },

  // Getters (synchrones)
  getAgenceById: (id: string) => {
    return get().agences.find((agence) => agence.id === id);
  },

  getAgencesByDivision: (division: string) => {
    return get().agences.filter((agence) =>
      agence.division.toLowerCase().includes(division.toLowerCase()),
    );
  },

  searchAgences: (searchTerm: string) => {
    if (!searchTerm.trim()) return get().agences;

    const term = searchTerm.toLowerCase();
    return get().agences.filter(
      (agence) =>
        agence.nom.toLowerCase().includes(term) ||
        agence.site.toLowerCase().includes(term) ||
        agence.division.toLowerCase().includes(term),
    );
  },

  // Actions locales (sans API)
  addAgence: (agence: Agence) => {
    set((state) => ({
      agences: [...state.agences, agence],
    }));
  },

  removeAgence: (id: string) => {
    set((state) => ({
      agences: state.agences.filter((agence) => agence.id !== id),
    }));
  },

  updateLocalAgence: (id: string, updatedAgence: Agence) => {
    set((state) => ({
      agences: state.agences.map((agence) =>
        agence.id === id ? updatedAgence : agence,
      ),
    }));
  },

  clearError: () => {
    set({ error: null });
  },
}));

// Hook personnalisé pour une utilisation simplifiée
export const useAgences = () => {
  const {
    agences,
    loading,
    error,
    fetchAgences,
    createAgence,
    updateAgence,
    deleteAgence,
    getAgenceById,
    searchAgences,
  } = useAgenceStore();

  return {
    agences,
    loading,
    error,
    fetchAgences,
    createAgence,
    updateAgence,
    deleteAgence,
    getAgenceById,
    searchAgences,
  };
};

// Hook pour une agence spécifique
export const useAgence = (id?: string) => {
  const [agence, setAgence] = React.useState<Agence | undefined>(undefined);
  const [loading, setLoading] = React.useState(false);
  const { fetchAgenceById, getAgenceById } = useAgenceStore();

  React.useEffect(() => {
    if (id) {
      // Vérifier d'abord dans le store
      const cachedAgence = getAgenceById(id);
      if (cachedAgence) {
        setAgence(cachedAgence);
      } else {
        // Sinon, récupérer depuis l'API
        setLoading(true);
        fetchAgenceById(id).then((fetchedAgence) => {
          setAgence(fetchedAgence);
          setLoading(false);
        });
      }
    }
  }, [id, fetchAgenceById, getAgenceById]);

  return { agence, loading };
};
