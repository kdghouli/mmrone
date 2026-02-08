/* eslint-disable @typescript-eslint/no-explicit-any */
// stores/useIntituleStore.ts
import { create } from "zustand";
import axios from "axios";
import { toast } from "react-toastify";
import { API_BASE_URL } from "../utils/donnee";
import React from "react";

interface Intitule {
  id: string;
  nom: string;
  ville: string;
  location: boolean;
  tel: string;
  created_at?: string;
  updated_at?: string;
}

interface IntituleState {
  intitules: Intitule[];
  loading: boolean;
  error: string | null;

  // Actions API
  fetchIntitules: () => Promise<void>;
  fetchIntituleById: (id: string) => Promise<Intitule | undefined>;
  createIntitule: (
    intituleData: Omit<Intitule, "id">,
  ) => Promise<Intitule | undefined>;
  updateIntitule: (
    id: string,
    intituleData: Partial<Intitule>,
  ) => Promise<Intitule | undefined>;
  deleteIntitule: (id: string) => Promise<boolean>;

  // Getters
  getIntituleById: (id: string) => Intitule | undefined;
  getIntitulesByVille: (ville: string) => Intitule[];
  getIntitulesByLocation: (location: boolean) => Intitule[];
  searchIntitules: (searchTerm: string) => Intitule[];

  // Actions locales
  addIntitule: (intitule: Intitule) => void;
  removeIntitule: (id: string) => void;
  updateLocalIntitule: (id: string, updatedIntitule: Intitule) => void;
  clearError: () => void;
}

export const useIntituleStore = create<IntituleState>()((set, get) => ({
  intitules: [],
  loading: false,
  error: null,

  // Récupérer tous les intitules
  fetchIntitules: async () => {
    set({ loading: true, error: null });
    try {
      const response = await axios.get(`${API_BASE_URL}intitules`);
      const intitules: Intitule[] = response.data.map((intitule: any) => ({
        id: intitule.id.toString(),
        nom: intitule.nom,
        ville: intitule.ville || "",
        location: Boolean(intitule.location),
        tel: intitule.tel || "",
        created_at: intitule.created_at,
        updated_at: intitule.updated_at,
      }));

      set({ intitules, loading: false });
      toast.success(`${intitules.length} intitulés chargés avec succès`);
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "Erreur lors du chargement des intitulés";
      set({ error: errorMessage, loading: false });
      toast.error(errorMessage);
      console.error("Erreur fetchIntitules:", error);
    }
  },

  // Récupérer un intitulé par ID
  fetchIntituleById: async (id: string) => {
    set({ loading: true, error: null });
    try {
      const response = await axios.get(`${API_BASE_URL}intitules/${id}`);
      const intitule: Intitule = {
        id: response.data.id.toString(),
        nom: response.data.nom,
        ville: response.data.ville || "",
        location: Boolean(response.data.location),
        tel: response.data.tel || "",
        created_at: response.data.created_at,
        updated_at: response.data.updated_at,
      };

      set((state) => {
        const exists = state.intitules.find((i) => i.id === id);
        if (exists) {
          return {
            intitules: state.intitules.map((i) => (i.id === id ? intitule : i)),
            loading: false,
          };
        } else {
          return {
            intitules: [...state.intitules, intitule],
            loading: false,
          };
        }
      });

      return intitule;
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        `Erreur lors du chargement de l'intitulé`;
      set({ error: errorMessage, loading: false });
      toast.error(errorMessage);
      return undefined;
    }
  },

  // Créer un intitulé
  createIntitule: async (intituleData: Omit<Intitule, "id">) => {
    set({ loading: true, error: null });
    try {
      // Convertir boolean en 1/0 pour Laravel
      const payload = {
        ...intituleData,
        location: intituleData.location ? 1 : 0,
      };

      const response = await axios.post(`${API_BASE_URL}intitules`, payload);
      const newIntitule: Intitule = {
        id: response.data.id.toString(),
        ...intituleData,
      };

      set((state) => ({
        intitules: [...state.intitules, newIntitule],
        loading: false,
      }));

      toast.success("Intitulé créé avec succès");
      return newIntitule;
    } catch (error: any) {
      let errorMessage = "Erreur lors de la création de l'intitulé";

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
      return undefined;
    }
  },

  // Mettre à jour un intitulé
  updateIntitule: async (id: string, intituleData: Partial<Intitule>) => {
    set({ loading: true, error: null });
    try {
      // Convertir boolean en 1/0 pour Laravel si présent
      const payload =
        intituleData.location !== undefined
          ? { ...intituleData, location: intituleData.location ? 1 : 0 }
          : intituleData;

      const response = await axios.put(
        `${API_BASE_URL}intitules/${id}`,
        payload,
      );
      const updatedIntitule: Intitule = {
        ...response.data,
        id: response.data.id.toString(),
        location: Boolean(response.data.location),
      };

      set((state) => ({
        intitules: state.intitules.map((intitule) =>
          intitule.id === id ? updatedIntitule : intitule,
        ),
        loading: false,
      }));

      toast.success("Intitulé mis à jour avec succès");
      return updatedIntitule;
    } catch (error: any) {
      let errorMessage = `Erreur lors de la mise à jour de l'intitulé`;

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
      return undefined;
    }
  },

  // Supprimer un intitulé
  deleteIntitule: async (id: string) => {
    set({ loading: true, error: null });
    try {
      await axios.delete(`${API_BASE_URL}intitules/${id}`);

      set((state) => ({
        intitules: state.intitules.filter((intitule) => intitule.id !== id),
        loading: false,
      }));

      toast.success("Intitulé supprimé avec succès");
      return true;
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        `Erreur lors de la suppression`;
      set({ error: errorMessage, loading: false });
      toast.error(errorMessage);
      return false;
    }
  },

  // Getters
  getIntituleById: (id: string) => {
    return get().intitules.find((intitule) => intitule.id === id);
  },

  getIntitulesByVille: (ville: string) => {
    return get().intitules.filter((intitule) =>
      intitule.ville.toLowerCase().includes(ville.toLowerCase()),
    );
  },

  getIntitulesByLocation: (location: boolean) => {
    return get().intitules.filter((intitule) => intitule.location === location);
  },

  searchIntitules: (searchTerm: string) => {
    if (!searchTerm.trim()) return get().intitules;

    const term = searchTerm.toLowerCase();
    return get().intitules.filter(
      (intitule) =>
        intitule.nom.toLowerCase().includes(term) ||
        intitule.ville.toLowerCase().includes(term) ||
        intitule.tel.toLowerCase().includes(term),
    );
  },

  // Actions locales
  addIntitule: (intitule: Intitule) => {
    set((state) => ({
      intitules: [...state.intitules, intitule],
    }));
  },

  removeIntitule: (id: string) => {
    set((state) => ({
      intitules: state.intitules.filter((intitule) => intitule.id !== id),
    }));
  },

  updateLocalIntitule: (id: string, updatedIntitule: Intitule) => {
    set((state) => ({
      intitules: state.intitules.map((intitule) =>
        intitule.id === id ? updatedIntitule : intitule,
      ),
    }));
  },

  clearError: () => {
    set({ error: null });
  },
}));

// Hooks personnalisés
export const useIntitules = () => {
  const {
    intitules,
    loading,
    error,
    fetchIntitules,
    createIntitule,
    updateIntitule,
    deleteIntitule,
    getIntituleById,
    searchIntitules,
  } = useIntituleStore();

  return {
    intitules,
    loading,
    error,
    fetchIntitules,
    createIntitule,
    updateIntitule,
    deleteIntitule,
    getIntituleById,
    searchIntitules,
  };
};

export const useIntitule = (id?: string) => {
  const [intitule, setIntitule] = React.useState<Intitule | undefined>(
    undefined,
  );
  const [loading, setLoading] = React.useState(false);
  const { fetchIntituleById, getIntituleById } = useIntituleStore();

  React.useEffect(() => {
    if (id) {
      const cachedIntitule = getIntituleById(id);
      if (cachedIntitule) {
        setIntitule(cachedIntitule);
      } else {
        setLoading(true);
        fetchIntituleById(id).then((fetchedIntitule) => {
          setIntitule(fetchedIntitule);
          setLoading(false);
        });
      }
    }
  }, [id, fetchIntituleById, getIntituleById]);

  return { intitule, loading };
};
