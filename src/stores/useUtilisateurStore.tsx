/* eslint-disable @typescript-eslint/no-explicit-any */
// stores/useUtilisateurStore.ts
import { create } from "zustand";
import axios from "axios";
import { toast } from "react-toastify";
import { API_BASE_URL } from "../utils/donnee";
import React from "react";

interface Utilisateur {
  id: string;
  nom: string;
  poste: string;
  service_id: string;
  agence_id: string;
  tel: string;
  mail: string;
  service_nom?: string;
  agence_nom?: string;
  created_at?: string;
  updated_at?: string;
}

interface Service {
  id: string;
  nom: string;
}

interface Agence {
  id: string;
  nom: string;
}

interface UtilisateurState {
  utilisateurs: Utilisateur[];
  services: Service[];
  agences: Agence[];
  loading: boolean;
  error: string | null;

  // Actions API
  fetchUtilisateurs: () => Promise<void>;
  fetchServices: () => Promise<void>;
  fetchAgences: () => Promise<void>;
  fetchUtilisateurById: (id: string) => Promise<Utilisateur | undefined>;
  createUtilisateur: (
    utilisateurData: Omit<Utilisateur, "id">,
  ) => Promise<Utilisateur | undefined>;
  updateUtilisateur: (
    id: string,
    utilisateurData: Partial<Utilisateur>,
  ) => Promise<Utilisateur | undefined>;
  deleteUtilisateur: (id: string) => Promise<boolean>;

  // Getters
  getUtilisateurById: (id: string) => Utilisateur | undefined;
  getUtilisateursByAgence: (agenceId: string) => Utilisateur[];
  getUtilisateursByService: (serviceId: string) => Utilisateur[];
  getUtilisateursByPoste: (poste: string) => Utilisateur[];
  searchUtilisateurs: (searchTerm: string) => Utilisateur[];

  // Actions locales
  addUtilisateur: (utilisateur: Utilisateur) => void;
  removeUtilisateur: (id: string) => void;
  updateLocalUtilisateur: (id: string, updatedUtilisateur: Utilisateur) => void;
  clearError: () => void;
}

export const useUtilisateurStore = create<UtilisateurState>()((set, get) => ({
  utilisateurs: [],
  services: [],
  agences: [],
  loading: false,
  error: null,

  // Récupérer tous les utilisateurs avec leurs relations
  fetchUtilisateurs: async () => {
    set({ loading: true, error: null });
    try {
      const response = await axios.get(`${API_BASE_URL}utilisateurs`);
      const utilisateurs: Utilisateur[] = response.data.map(
        (utilisateur: any) => ({
          id: utilisateur.id.toString(),
          nom: utilisateur.nom,
          poste: utilisateur.poste,
          service_id: utilisateur.service_id?.toString() || "",
          agence_id: utilisateur.agence_id?.toString() || "",
          tel: utilisateur.tel || "",
          mail: utilisateur.mail || "",
          service_nom: utilisateur.service?.nom,
          agence_nom: utilisateur.agence?.nom,
          created_at: utilisateur.created_at,
          updated_at: utilisateur.updated_at,
        }),
      );

      set({ utilisateurs, loading: false });
      toast.success(`${utilisateurs.length} utilisateurs chargés`);
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "Erreur lors du chargement des utilisateurs";
      set({ error: errorMessage, loading: false });
      toast.error(errorMessage);
    }
  },

  // Récupérer les services
  fetchServices: async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}services`);
      const services: Service[] = response.data.map((service: any) => ({
        id: service.id.toString(),
        nom: service.nom,
      }));
      set({ services });
    } catch (error) {
      console.error("Erreur fetchServices:", error);
    }
  },

  // Récupérer les agences
  fetchAgences: async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}agences`);
      const agences: Agence[] = response.data.map((agence: any) => ({
        id: agence.id.toString(),
        nom: agence.nom,
      }));
      set({ agences });
    } catch (error) {
      console.error("Erreur fetchAgences:", error);
    }
  },

  // Récupérer un utilisateur par ID
  fetchUtilisateurById: async (id: string) => {
    set({ loading: true, error: null });
    try {
      const response = await axios.get(`${API_BASE_URL}utilisateurs/${id}`);
      const utilisateur: Utilisateur = {
        id: response.data.id.toString(),
        nom: response.data.nom,
        poste: response.data.poste,
        service_id: response.data.service_id?.toString() || "",
        agence_id: response.data.agence_id?.toString() || "",
        tel: response.data.tel || "",
        mail: response.data.mail || "",
        service_nom: response.data.service?.nom,
        agence_nom: response.data.agence?.nom,
        created_at: response.data.created_at,
        updated_at: response.data.updated_at,
      };

      set((state) => {
        const exists = state.utilisateurs.find((u) => u.id === id);
        if (exists) {
          return {
            utilisateurs: state.utilisateurs.map((u) =>
              u.id === id ? utilisateur : u,
            ),
            loading: false,
          };
        } else {
          return {
            utilisateurs: [...state.utilisateurs, utilisateur],
            loading: false,
          };
        }
      });

      return utilisateur;
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        `Erreur lors du chargement de l'utilisateur`;
      set({ error: errorMessage, loading: false });
      toast.error(errorMessage);
      return undefined;
    }
  },

  // Créer un utilisateur
  createUtilisateur: async (utilisateurData: Omit<Utilisateur, "id">) => {
    set({ loading: true, error: null });
    try {
      const payload = {
        ...utilisateurData,
        service_id: utilisateurData.service_id || null,
        agence_id: utilisateurData.agence_id || null,
      };

      const response = await axios.post(`${API_BASE_URL}utilisateurs`, payload);
      const newUtilisateur: Utilisateur = {
        id: response.data.id.toString(),
        ...utilisateurData,
      };

      set((state) => ({
        utilisateurs: [...state.utilisateurs, newUtilisateur],
        loading: false,
      }));

      toast.success("Utilisateur créé avec succès");
      return newUtilisateur;
    } catch (error: any) {
      let errorMessage = "Erreur lors de la création de l'utilisateur";

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

  // Mettre à jour un utilisateur
  updateUtilisateur: async (
    id: string,
    utilisateurData: Partial<Utilisateur>,
  ) => {
    set({ loading: true, error: null });
    try {
      const payload = {
        ...utilisateurData,
        service_id: utilisateurData.service_id || null,
        agence_id: utilisateurData.agence_id || null,
      };

      const response = await axios.put(
        `${API_BASE_URL}utilisateurs/${id}`,
        payload,
      );
      const updatedUtilisateur: Utilisateur = {
        ...response.data,
        id: response.data.id.toString(),
        service_id: response.data.service_id?.toString() || "",
        agence_id: response.data.agence_id?.toString() || "",
      };

      set((state) => ({
        utilisateurs: state.utilisateurs.map((utilisateur) =>
          utilisateur.id === id ? updatedUtilisateur : utilisateur,
        ),
        loading: false,
      }));

      toast.success("Utilisateur mis à jour avec succès");
      return updatedUtilisateur;
    } catch (error: any) {
      let errorMessage = `Erreur lors de la mise à jour de l'utilisateur`;

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

  // Supprimer un utilisateur
  deleteUtilisateur: async (id: string) => {
    set({ loading: true, error: null });
    try {
      await axios.delete(`${API_BASE_URL}utilisateurs/${id}`);

      set((state) => ({
        utilisateurs: state.utilisateurs.filter(
          (utilisateur) => utilisateur.id !== id,
        ),
        loading: false,
      }));

      toast.success("Utilisateur supprimé avec succès");
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
  getUtilisateurById: (id: string) => {
    return get().utilisateurs.find((utilisateur) => utilisateur.id === id);
  },

  getUtilisateursByAgence: (agenceId: string) => {
    return get().utilisateurs.filter(
      (utilisateur) => utilisateur.agence_id === agenceId,
    );
  },

  getUtilisateursByService: (serviceId: string) => {
    return get().utilisateurs.filter(
      (utilisateur) => utilisateur.service_id === serviceId,
    );
  },

  getUtilisateursByPoste: (poste: string) => {
    return get().utilisateurs.filter((utilisateur) =>
      utilisateur.poste.toLowerCase().includes(poste.toLowerCase()),
    );
  },

  searchUtilisateurs: (searchTerm: string) => {
    if (!searchTerm.trim()) return get().utilisateurs;

    const term = searchTerm.toLowerCase();
    return get().utilisateurs.filter(
      (utilisateur) =>
        utilisateur.nom.toLowerCase().includes(term) ||
        utilisateur.poste.toLowerCase().includes(term) ||
        utilisateur.mail.toLowerCase().includes(term) ||
        utilisateur.tel.toLowerCase().includes(term) ||
        utilisateur.service_nom?.toLowerCase().includes(term) ||
        utilisateur.agence_nom?.toLowerCase().includes(term),
    );
  },

  // Actions locales
  addUtilisateur: (utilisateur: Utilisateur) => {
    set((state) => ({
      utilisateurs: [...state.utilisateurs, utilisateur],
    }));
  },

  removeUtilisateur: (id: string) => {
    set((state) => ({
      utilisateurs: state.utilisateurs.filter(
        (utilisateur) => utilisateur.id !== id,
      ),
    }));
  },

  updateLocalUtilisateur: (id: string, updatedUtilisateur: Utilisateur) => {
    set((state) => ({
      utilisateurs: state.utilisateurs.map((utilisateur) =>
        utilisateur.id === id ? updatedUtilisateur : utilisateur,
      ),
    }));
  },

  clearError: () => {
    set({ error: null });
  },
}));

// Hooks personnalisés
export const useUtilisateurs = () => {
  const {
    utilisateurs,
    services,
    agences,
    loading,
    error,
    fetchUtilisateurs,
    fetchServices,
    fetchAgences,
    createUtilisateur,
    updateUtilisateur,
    deleteUtilisateur,
    getUtilisateurById,
    searchUtilisateurs,
  } = useUtilisateurStore();

  return {
    utilisateurs,
    services,
    agences,
    loading,
    error,
    fetchUtilisateurs,
    fetchServices,
    fetchAgences,
    createUtilisateur,
    updateUtilisateur,
    deleteUtilisateur,
    getUtilisateurById,
    searchUtilisateurs,
  };
};

export const useUtilisateur = (id?: string) => {
  const [utilisateur, setUtilisateur] = React.useState<Utilisateur | undefined>(
    undefined,
  );
  const [loading, setLoading] = React.useState(false);
  const { fetchUtilisateurById, getUtilisateurById } = useUtilisateurStore();

  React.useEffect(() => {
    if (id) {
      const cachedUtilisateur = getUtilisateurById(id);
      if (cachedUtilisateur) {
        setUtilisateur(cachedUtilisateur);
      } else {
        setLoading(true);
        fetchUtilisateurById(id).then((fetchedUtilisateur) => {
          setUtilisateur(fetchedUtilisateur);
          setLoading(false);
        });
      }
    }
  }, [id, fetchUtilisateurById, getUtilisateurById]);

  return { utilisateur, loading };
};
