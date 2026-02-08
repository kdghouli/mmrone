/* eslint-disable @typescript-eslint/no-explicit-any */
// stores/useVhlStore.ts
import { create } from "zustand";
import axios from "axios";
import { toast } from "react-toastify";
import React from "react";
import { API_BASE_URL } from "../utils/donnee";

interface Vhl {
  id: string;
  matricule: string;
  marque: string;
  type: string;
  ww: string;
  chassis: string;
  puissance: string;
  date_mc: string;
  observation: string;
  agence_id: string;
  categorie_id: string;
  intitule_id: string;
  service_id: string;
  utilisateur_id: string;
  statut_id: string;
  deleted_at: string | null;
  created_at: string;
  updated_at: string;
  // Relations
  agence_nom: string;
  categorie_nom?: string;
  intitule_nom?: string;
  intitule_ref?: string;
  service_nom?: string;
  utilisateur_nom?: string;
  statut_nom?: string;
}

interface ReferenceData {
  id: string;
  nom: string;
  ref?: string;
}

interface VhlState {
  vhls: Vhl[];
  agences: ReferenceData[];
  categories: ReferenceData[];
  intitules: ReferenceData[];
  services: ReferenceData[];
  utilisateurs: ReferenceData[];
  statuts: ReferenceData[];
  loading: boolean;
  error: string | null;
  dashboardStats: {
    total: number;
    byStatut: Record<string, number>;
    byAgence: Record<string, number>;
    byCategorie: Record<string, number>;
  };

  // Actions API
  fetchVhls: () => Promise<void>;
  fetchReferenceData: () => Promise<void>;
  fetchVhlById: (id: string) => Promise<Vhl | undefined>;
  createVhl: (
    vhlData: Omit<Vhl, "id" | "created_at" | "updated_at" | "deleted_at">,
  ) => Promise<Vhl | undefined>;
  updateVhl: (id: string, vhlData: Partial<Vhl>) => Promise<Vhl | undefined>;
  deleteVhl: (id: string) => Promise<boolean>;
  softDeleteVhl: (id: string) => Promise<boolean>;
  restoreVhl: (id: string) => Promise<boolean>;

  // Getters
  getVhlById: (id: string) => Vhl | undefined;
  getVhlsByAgence: (agenceId: string) => Vhl[];
  getVhlsByStatut: (statutId: string) => Vhl[];
  getVhlsByCategorie: (categorieId: string) => Vhl[];
  searchVhls: (searchTerm: string) => Vhl[];

  // Dashboard
  updateDashboardStats: () => void;

  // Actions locales
  addVhl: (vhl: Vhl) => void;
  removeVhl: (id: string) => void;
  updateLocalVhl: (id: string, updatedVhl: Vhl) => void;
  clearError: () => void;
}

export const useVhlStore = create<VhlState>()((set, get) => ({
  vhls: [],
  agences: [],
  categories: [],
  intitules: [],
  services: [],
  utilisateurs: [],
  statuts: [],
  loading: false,
  error: null,
  dashboardStats: {
    total: 0,
    byStatut: {},
    byAgence: {},
    byCategorie: {},
  },

  // Récupérer tous les Vhls
  fetchVhls: async () => {
    set({ loading: true, error: null });
    try {
      // Récupérer d'abord les données de référence
      await get().fetchReferenceData();

      // Puis les véhicules
      const response = await axios.get(`${API_BASE_URL}vhls`);

      // Récupérer les données de référence du store
      const {
        agences,
        categories,
        intitules,
        services,
        utilisateurs,
        statuts,
      } = get();

      const vhls: Vhl[] = response.data.map((vhl: any) => {
        // Fonction pour trouver le nom par ID
        const findNameById = (id: string, referenceArray: ReferenceData[]) => {
          const found = referenceArray.find(
            (item) => item.id === id?.toString(),
          );
          return found?.nom || "";
        };

        return {
          id: vhl.id.toString(),
          matricule: vhl.matricule,
          marque: vhl.marque || "",
          type: vhl.type || "",
          ww: vhl.ww || "",
          chassis: vhl.chassis || "",
          puissance: vhl.puissance || "",
          date_mc: vhl.date_mc || "",
          observation: vhl.observation || "",
          agence_id: vhl.agence_id?.toString() || "",
          categorie_id: vhl.categorie_id?.toString() || "",
          intitule_id: vhl.intitule_id?.toString() || "",
          service_id: vhl.service_id?.toString() || "",
          utilisateur_id: vhl.utilisateur_id?.toString() || "",
          statut_id: vhl.statut_id?.toString() || "",
          deleted_at: vhl.deleted_at,
          created_at: vhl.created_at,
          updated_at: vhl.updated_at,
          agence_nom: findNameById(vhl.agence_id, agences),
          categorie_nom: findNameById(vhl.categorie_id, categories),
          intitule_nom: findNameById(vhl.intitule_id, intitules),
          intitule_ref: findNameById(vhl.intitule_id, intitules),
          service_nom: findNameById(vhl.service_id, services),
          utilisateur_nom: findNameById(vhl.utilisateur_id, utilisateurs),
          statut_nom: findNameById(vhl.statut_id, statuts),
        };
      });

      set({ vhls, loading: false });
      get().updateDashboardStats();
      toast.success(`${vhls.length} véhicules chargés`);
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "Erreur lors du chargement des véhicules";
      set({ error: errorMessage, loading: false });
      toast.error(errorMessage);
    }
  },

  // Récupérer les données de référence
  fetchReferenceData: async () => {
    try {
      const [
        agencesRes,
        categoriesRes,
        intitulesRes,
        servicesRes,
        utilisateursRes,
        statutsRes,
      ] = await Promise.all([
        axios.get(`${API_BASE_URL}agences`),
        axios.get(`${API_BASE_URL}categories`),
        axios.get(`${API_BASE_URL}intitules`),
        axios.get(`${API_BASE_URL}services`),
        axios.get(`${API_BASE_URL}utilisateurs`),
        axios.get(`${API_BASE_URL}statuts`),
      ]);

      set({
        agences: agencesRes.data.map((a: any) => ({
          id: a.id.toString(),
          nom: a.nom,
        })),
        categories: categoriesRes.data.map((c: any) => ({
          id: c.id.toString(),
          nom: c.nom,
        })),
        intitules: intitulesRes.data.map((i: any) => ({
          id: i.id.toString(),
          nom: i.nom,
          ref: i.acronym,
        })),
        services: servicesRes.data.map((s: any) => ({
          id: s.id.toString(),
          nom: s.nom,
        })),
        utilisateurs: utilisateursRes.data.map((u: any) => ({
          id: u.id.toString(),
          nom: u.nom,
        })),
        statuts: statutsRes.data.map((s: any) => ({
          id: s.id.toString(),
          nom: s.nom,
        })),
      });
    } catch (error) {
      console.error("Erreur fetchReferenceData:", error);
      toast.error("Erreur lors du chargement des données de référence");
    }
  },

  // Récupérer un Vhl par ID
  fetchVhlById: async (id: string) => {
    set({ loading: true, error: null });
    try {
      const response = await axios.get(`${API_BASE_URL}vhls/${id}`);
      const vhl: Vhl = {
        id: response.data.id.toString(),
        matricule: response.data.matricule,
        marque: response.data.marque || "",
        type: response.data.type || "",
        ww: response.data.ww || "",
        chassis: response.data.chassis || "",
        puissance: response.data.puissance || "",
        date_mc: response.data.date_mc || "",
        observation: response.data.observation || "",
        agence_id: response.data.agence_id?.toString() || "",
        categorie_id: response.data.categorie_id?.toString() || "",
        intitule_id: response.data.intitule_id?.toString() || "",
        service_id: response.data.service_id?.toString() || "",
        utilisateur_id: response.data.utilisateur_id?.toString() || "",
        statut_id: response.data.statut_id?.toString() || "",
        deleted_at: response.data.deleted_at,
        created_at: response.data.created_at,
        updated_at: response.data.updated_at,
        agence_nom: response.data.agence?.nom,
        categorie_nom: response.data.categorie?.nom,
        intitule_nom: response.data.intitule?.nom,
        intitule_ref: response.data.intitule?.acronym,
        service_nom: response.data.service?.nom,
        utilisateur_nom: response.data.utilisateur?.nom,
        statut_nom: response.data.statut?.nom,
      };

      set((state) => {
        const exists = state.vhls.find((v) => v.id === id);
        if (exists) {
          return {
            vhls: state.vhls.map((v) => (v.id === id ? vhl : v)),
            loading: false,
          };
        } else {
          return {
            vhls: [...state.vhls, vhl],
            loading: false,
          };
        }
      });

      return vhl;
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        `Erreur lors du chargement du véhicule`;
      set({ error: errorMessage, loading: false });
      toast.error(errorMessage);
      return undefined;
    }
  },

  // Créer un Vhl
  createVhl: async (
    vhlData: Omit<Vhl, "id" | "created_at" | "updated_at" | "deleted_at">,
  ) => {
    set({ loading: true, error: null });
    try {
      // Convertir les IDs vides en null
      const payload = {
        ...vhlData,
        agence_id: vhlData.agence_id || null,
        categorie_id: vhlData.categorie_id || null,
        intitule_id: vhlData.intitule_id || null,
        service_id: vhlData.service_id || null,
        utilisateur_id: vhlData.utilisateur_id || null,
        statut_id: vhlData.statut_id || null,
      };

      const response = await axios.post(`${API_BASE_URL}vhls`, payload);
      const newVhl: Vhl = {
        id: response.data.id.toString(),
        ...vhlData,
        deleted_at: null,
        created_at: response.data.created_at,
        updated_at: response.data.updated_at,
      };

      set((state) => ({
        vhls: [...state.vhls, newVhl],
        loading: false,
      }));

      get().updateDashboardStats();
      toast.success("Véhicule créé avec succès");
      return newVhl;
    } catch (error: any) {
      let errorMessage = "Erreur lors de la création du véhicule";

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

  // Mettre à jour un Vhl
  updateVhl: async (id: string, vhlData: Partial<Vhl>) => {
    set({ loading: true, error: null });
    try {
      // Convertir les IDs vides en null
      const payload = {
        ...vhlData,
        agence_id: vhlData.agence_id || null,
        categorie_id: vhlData.categorie_id || null,
        intitule_id: vhlData.intitule_id || null,
        service_id: vhlData.service_id || null,
        utilisateur_id: vhlData.utilisateur_id || null,
        statut_id: vhlData.statut_id || null,
      };

      const response = await axios.put(`${API_BASE_URL}vhls/${id}`, payload);
      const updatedVhl: Vhl = {
        ...response.data,
        id: response.data.id.toString(),
        agence_id: response.data.agence_id?.toString() || "",
        categorie_id: response.data.categorie_id?.toString() || "",
        intitule_id: response.data.intitule_id?.toString() || "",
        service_id: response.data.service_id?.toString() || "",
        utilisateur_id: response.data.utilisateur_id?.toString() || "",
        statut_id: response.data.statut_id?.toString() || "",
      };

      set((state) => ({
        vhls: state.vhls.map((vhl) => (vhl.id === id ? updatedVhl : vhl)),
        loading: false,
      }));

      get().updateDashboardStats();
      toast.success("Véhicule mis à jour avec succès");
      return updatedVhl;
    } catch (error: any) {
      let errorMessage = `Erreur lors de la mise à jour du véhicule`;

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

  // Supprimer définitivement un Vhl
  deleteVhl: async (id: string) => {
    set({ loading: true, error: null });
    try {
      await axios.delete(`${API_BASE_URL}vhls/${id}`);

      set((state) => ({
        vhls: state.vhls.filter((vhl) => vhl.id !== id),
        loading: false,
      }));

      get().updateDashboardStats();
      toast.success("Véhicule supprimé définitivement");
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

  // Soft delete
  softDeleteVhl: async (id: string) => {
    set({ loading: true, error: null });
    try {
      await axios.delete(`${API_BASE_URL}vhls/${id}/soft`);

      set((state) => ({
        vhls: state.vhls.filter((vhl) => vhl.id !== id),
        loading: false,
      }));

      get().updateDashboardStats();
      toast.success("Véhicule archivé avec succès");
      return true;
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        `Erreur lors de l'archivage`;
      set({ error: errorMessage, loading: false });
      toast.error(errorMessage);
      return false;
    }
  },

  // Restaurer un Vhl
  restoreVhl: async (id: string) => {
    set({ loading: true, error: null });
    try {
      const response = await axios.put(`${API_BASE_URL}vhls/${id}/restore`);
      const restoredVhl: Vhl = {
        ...response.data,
        id: response.data.id.toString(),
      };

      set((state) => ({
        vhls: [...state.vhls, restoredVhl],
        loading: false,
      }));

      get().updateDashboardStats();
      toast.success("Véhicule restauré avec succès");
      return true;
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        `Erreur lors de la restauration`;
      set({ error: errorMessage, loading: false });
      toast.error(errorMessage);
      return false;
    }
  },

  // Getters
  getVhlById: (id: string) => {
    return get().vhls.find((vhl) => vhl.id === id);
  },

  getVhlsByAgence: (agenceId: string) => {
    return get().vhls.filter((vhl) => vhl.agence_id === agenceId);
  },

  getVhlsByStatut: (statutId: string) => {
    return get().vhls.filter((vhl) => vhl.statut_id === statutId);
  },

  getVhlsByCategorie: (categorieId: string) => {
    return get().vhls.filter((vhl) => vhl.categorie_id === categorieId);
  },

  searchVhls: (searchTerm: string) => {
    if (!searchTerm.trim()) return get().vhls;

    const term = searchTerm.toLowerCase();
    return get().vhls.filter(
      (vhl) =>
        vhl.matricule.toLowerCase().includes(term) ||
        vhl.marque.toLowerCase().includes(term) ||
        vhl.type.toLowerCase().includes(term) ||
        vhl.chassis.toLowerCase().includes(term) ||
        vhl.agence_nom?.toLowerCase().includes(term) ||
        vhl.categorie_nom?.toLowerCase().includes(term),
    );
  },

  // Mettre à jour les statistiques du dashboard
  updateDashboardStats: () => {
    const { vhls } = get();

    const byStatut: Record<string, number> = {};
    const byAgence: Record<string, number> = {};
    const byCategorie: Record<string, number> = {};

    vhls.forEach((vhl) => {
      // Statistiques par statut
      const statutKey = vhl.statut_nom || "Non défini";
      byStatut[statutKey] = (byStatut[statutKey] || 0) + 1;

      // Statistiques par agence
      const agenceKey = vhl.agence_nom || "Non affecté";
      byAgence[agenceKey] = (byAgence[agenceKey] || 0) + 1;

      // Statistiques par catégorie
      const categorieKey = vhl.categorie_nom || "Non catégorisé";
      byCategorie[categorieKey] = (byCategorie[categorieKey] || 0) + 1;
    });

    set({
      dashboardStats: {
        total: vhls.length,
        byStatut,
        byAgence,
        byCategorie,
      },
    });
  },

  // Actions locales
  addVhl: (vhl: Vhl) => {
    set((state) => ({
      vhls: [...state.vhls, vhl],
    }));
    get().updateDashboardStats();
  },

  removeVhl: (id: string) => {
    set((state) => ({
      vhls: state.vhls.filter((vhl) => vhl.id !== id),
    }));
    get().updateDashboardStats();
  },

  updateLocalVhl: (id: string, updatedVhl: Vhl) => {
    set((state) => ({
      vhls: state.vhls.map((vhl) => (vhl.id === id ? updatedVhl : vhl)),
    }));
    get().updateDashboardStats();
  },

  clearError: () => {
    set({ error: null });
  },
}));

// Hooks personnalisés
export const useVhls = () => {
  const {
    vhls,
    agences,
    categories,
    intitules,
    services,
    utilisateurs,
    statuts,
    dashboardStats,
    loading,
    error,
    fetchVhls,
    fetchReferenceData,
    createVhl,
    updateVhl,
    deleteVhl,
    softDeleteVhl,
    restoreVhl,
    getVhlById,
    searchVhls,
    updateDashboardStats,
  } = useVhlStore();

  return {
    vhls,
    agences,
    categories,
    intitules,
    services,
    utilisateurs,
    statuts,
    dashboardStats,
    loading,
    error,
    fetchVhls,
    fetchReferenceData,
    createVhl,
    updateVhl,
    deleteVhl,
    softDeleteVhl,
    restoreVhl,
    getVhlById,
    searchVhls,
    updateDashboardStats,
  };
};

export const useVhl = (id?: string) => {
  const [vhl, setVhl] = React.useState<Vhl | undefined>(undefined);
  const [loading, setLoading] = React.useState(false);
  const { fetchVhlById, getVhlById } = useVhlStore();

  React.useEffect(() => {
    if (id) {
      const cachedVhl = getVhlById(id);
      if (cachedVhl) {
        setVhl(cachedVhl);
      } else {
        setLoading(true);
        fetchVhlById(id).then((fetchedVhl) => {
          setVhl(fetchedVhl);
          setLoading(false);
        });
      }
    }
  }, [id, fetchVhlById, getVhlById]);

  return { vhl, loading };
};
