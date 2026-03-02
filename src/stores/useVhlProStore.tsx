/* eslint-disable @typescript-eslint/no-explicit-any */
import { create } from "zustand";
import { toast } from "react-toastify";
import React from "react";
import axiosAuth from "../utils/axiosAuth";

// Interfaces
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
}

interface VhlState {
  // Données principales
  allVhls: Vhl[];
  selectedVhl: Vhl | null;

  // Données de référence
  agences: ReferenceData[];
  categories: ReferenceData[];
  intitules: ReferenceData[];
  services: ReferenceData[];
  utilisateurs: ReferenceData[];
  statuts: ReferenceData[];

  // État
  loading: boolean;
  error: string | null;

  // Actions principales
  setSelectedVhl: (vhl: Vhl | null) => void;

  // Actions API
  fetchAllVhls: () => Promise<void>;
  fetchReferenceData: () => Promise<void>;
  fetchVhlById: (id: string) => Promise<Vhl | undefined>;
  createVhl: (
    vhlData: Omit<Vhl, "id" | "created_at" | "updated_at" | "deleted_at">,
  ) => Promise<Vhl | undefined>;
  updateVhl: (id: string, vhlData: Partial<Vhl>) => Promise<Vhl | undefined>;
  deleteVhl: (id: string) => Promise<boolean>;
  softDeleteVhl: (id: string) => Promise<boolean>;
  restoreVhl: (id: string) => Promise<boolean>;

  // Recherche et filtres
  searchVhls: (searchTerm: string, filters?: FilterParams) => Vhl[];

  // Actions locales
  addVhl: (vhl: Vhl) => void;
  removeVhl: (id: string) => void;
  updateLocalVhl: (id: string, updatedVhl: Vhl) => void;
  clearError: () => void;
}

interface FilterParams {
  agence_id?: string;
  categorie_id?: string;
  statut_id?: string;
  search?: string;
}

export const useVhlProStore = create<VhlState>()((set, get) => ({
  allVhls: [],
  selectedVhl: null,
  agences: [],
  categories: [],
  intitules: [],
  services: [],
  utilisateurs: [],
  statuts: [],
  loading: false,
  error: null,

  // Sélectionner un véhicule
  setSelectedVhl: (vhl) => set({ selectedVhl: vhl }),

  // Récupérer tous les Vhls
  fetchAllVhls: async () => {
    set({ loading: true, error: null });
    try {
      // Récupérer d'abord les données de référence
      await get().fetchReferenceData();

      // Récupérer tous les véhicules
      const response = await axiosAuth.get(`vhls`);

      // Récupérer les données de référence du store
      const {
        agences,
        categories,
        intitules,
        services,
        utilisateurs,
        statuts,
      } = get();

      const allVhls: Vhl[] = response.data.map((vhl: any) => {
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
          service_nom: findNameById(vhl.service_id, services),
          utilisateur_nom: findNameById(vhl.utilisateur_id, utilisateurs),
          statut_nom: findNameById(vhl.statut_id, statuts),
        };
      });

      set({ allVhls, loading: false });
      toast.success(`${allVhls.length} véhicules chargés`);
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
        axiosAuth.get(`agences`),
        axiosAuth.get(`categories`),
        axiosAuth.get(`intitules`),
        axiosAuth.get(`services`),
        axiosAuth.get(`utilisateurs`),
        axiosAuth.get(`statuts`),
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
      const response = await axiosAuth.get(`vhls/${id}`);
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
        service_nom: response.data.service?.nom,
        utilisateur_nom: response.data.utilisateur?.nom,
        statut_nom: response.data.statut?.nom,
      };

      set((state) => {
        const exists = state.allVhls.find((v) => v.id === id);
        if (exists) {
          return {
            allVhls: state.allVhls.map((v) => (v.id === id ? vhl : v)),
            selectedVhl: vhl,
            loading: false,
          };
        } else {
          return {
            allVhls: [...state.allVhls, vhl],
            selectedVhl: vhl,
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

      const response = await axiosAuth.post(`vhls`, payload);
      const newVhl: Vhl = {
        id: response.data.id.toString(),
        ...vhlData,
        deleted_at: null,
        created_at: response.data.created_at,
        updated_at: response.data.updated_at,
        agence_nom:
          get().agences.find((a) => a.id === vhlData.agence_id)?.nom || "",
        categorie_nom:
          get().categories.find((c) => c.id === vhlData.categorie_id)?.nom ||
          "",
        intitule_nom:
          get().intitules.find((i) => i.id === vhlData.intitule_id)?.nom || "",
        service_nom:
          get().services.find((s) => s.id === vhlData.service_id)?.nom || "",
        utilisateur_nom:
          get().utilisateurs.find((u) => u.id === vhlData.utilisateur_id)
            ?.nom || "",
        statut_nom:
          get().statuts.find((s) => s.id === vhlData.statut_id)?.nom || "",
      };
      set((state) => ({
        allVhls: [...state.allVhls, newVhl],
        selectedVhl: newVhl,
        loading: false,
      }));

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
      console.log("Payload envoyé:", payload);

      const response = await axiosAuth.put(`vhls/${id}`, payload);
      console.log("Réponse mise à jour Vhl:", response.data);
      const updatedVhl: Vhl = {
        ...response.data,
        id: response.data.id.toString(),
        agence_id: response.data.agence_id?.toString() || "",
        categorie_id: response.data.categorie_id?.toString() || "",
        intitule_id: response.data.intitule_id?.toString() || "",
        service_id: response.data.service_id?.toString() || "",
        utilisateur_id: response.data.utilisateur_id?.toString() || "",
        statut_id: response.data.statut_id?.toString() || "",
        agence_nom:
          get().agences.find(
            (a) => a.id === response.data.agence_id?.toString(),
          )?.nom || "",
        categorie_nom:
          get().categories.find(
            (c) => c.id === response.data.categorie_id?.toString(),
          )?.nom || "",
        intitule_nom:
          get().intitules.find(
            (i) => i.id === response.data.intitule_id?.toString(),
          )?.nom || "",
        service_nom:
          get().services.find(
            (s) => s.id === response.data.service_id?.toString(),
          )?.nom || "",
        utilisateur_nom:
          get().utilisateurs.find(
            (u) => u.id === response.data.utilisateur_id?.toString(),
          )?.nom || "",
        statut_nom:
          get().statuts.find(
            (s) => s.id === response.data.statut_id?.toString(),
          )?.nom || "",
      };

      set((state) => ({
        allVhls: state.allVhls.map((vhl) => (vhl.id === id ? updatedVhl : vhl)),
        selectedVhl: updatedVhl,
        loading: false,
      }));

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
      await axiosAuth.delete(`vhls/${id}`);

      set((state) => ({
        allVhls: state.allVhls.filter((vhl) => vhl.id !== id),
        selectedVhl: state.selectedVhl?.id === id ? null : state.selectedVhl,
        loading: false,
      }));

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
      await axiosAuth.delete(`vhls/${id}`);

      set((state) => ({
        allVhls: state.allVhls.filter((vhl) => vhl.id !== id),
        selectedVhl: state.selectedVhl?.id === id ? null : state.selectedVhl,
        loading: false,
      }));

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
      const response = await axiosAuth.put(`vhls/${id}/restore`);
      const restoredVhl: Vhl = {
        ...response.data,
        id: response.data.id.toString(),
        agence_nom:
          get().agences.find(
            (a) => a.id === response.data.agence_id?.toString(),
          )?.nom || "",
        categorie_nom:
          get().categories.find(
            (c) => c.id === response.data.categorie_id?.toString(),
          )?.nom || "",
        intitule_nom:
          get().intitules.find(
            (i) => i.id === response.data.intitule_id?.toString(),
          )?.nom || "",
        service_nom:
          get().services.find(
            (s) => s.id === response.data.service_id?.toString(),
          )?.nom || "",
        utilisateur_nom:
          get().utilisateurs.find(
            (u) => u.id === response.data.utilisateur_id?.toString(),
          )?.nom || "",
        statut_nom:
          get().statuts.find(
            (s) => s.id === response.data.statut_id?.toString(),
          )?.nom || "",
      };

      set((state) => ({
        allVhls: [...state.allVhls, restoredVhl],
        selectedVhl: restoredVhl,
        loading: false,
      }));

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

  // Recherche avec filtres côté client
  searchVhls: (searchTerm: string, filters?: FilterParams) => {
    const { allVhls } = get();

    let filtered = [...allVhls];

    // Filtre par recherche textuelle
    if (searchTerm && searchTerm.trim()) {
      const term = searchTerm.toLowerCase().trim();
      filtered = filtered.filter(
        (vhl) =>
          vhl.matricule.toLowerCase().includes(term) ||
          vhl.marque.toLowerCase().includes(term) ||
          vhl.type?.toLowerCase().includes(term) ||
          vhl.agence_nom?.toLowerCase().includes(term) ||
          vhl.categorie_nom?.toLowerCase().includes(term) ||
          vhl.intitule_nom?.toLowerCase().includes(term),
      );
    }

    // Filtre par agence
    if (filters?.agence_id && filters.agence_id !== "all") {
      filtered = filtered.filter((vhl) => vhl.agence_id === filters.agence_id);
    }

    // Filtre par catégorie
    if (filters?.categorie_id && filters.categorie_id !== "all") {
      filtered = filtered.filter(
        (vhl) => vhl.categorie_id === filters.categorie_id,
      );
    }

    // Filtre par statut
    if (filters?.statut_id && filters.statut_id !== "all") {
      filtered = filtered.filter((vhl) => vhl.statut_id === filters.statut_id);
    }

    return filtered;
  },

  // Actions locales
  addVhl: (vhl: Vhl) => {
    set((state) => ({
      allVhls: [...state.allVhls, vhl],
      selectedVhl: vhl,
    }));
  },

  removeVhl: (id: string) => {
    set((state) => ({
      allVhls: state.allVhls.filter((vhl) => vhl.id !== id),
      selectedVhl: state.selectedVhl?.id === id ? null : state.selectedVhl,
    }));
  },

  updateLocalVhl: (id: string, updatedVhl: Vhl) => {
    set((state) => ({
      allVhls: state.allVhls.map((vhl) => (vhl.id === id ? updatedVhl : vhl)),
      selectedVhl: updatedVhl,
    }));
  },

  clearError: () => {
    set({ error: null });
  },
}));

// Hook personnalisé pour l'interface pro
export const useVhlsPro = () => {
  const {
    allVhls,
    selectedVhl,
    agences,
    categories,
    intitules,
    services,
    utilisateurs,
    statuts,
    loading,
    error,
    setSelectedVhl,
    fetchAllVhls,
    fetchReferenceData,
    createVhl,
    updateVhl,
    deleteVhl,
    softDeleteVhl,
    restoreVhl,
    searchVhls,
    clearError,
  } = useVhlProStore();

  return {
    // Données
    allVhls,
    selectedVhl,
    agences,
    categories,
    intitules,
    services,
    utilisateurs,
    statuts,

    // État
    loading,
    error,

    // Actions de sélection
    setSelectedVhl,

    // Actions API
    fetchAllVhls,
    fetchReferenceData,
    createVhl,
    updateVhl,
    deleteVhl,
    softDeleteVhl,
    restoreVhl,

    // Recherche
    searchVhls,

    // Utilitaires
    clearError,
  };
};

// Hook pour un véhicule spécifique
export const useVhlPro = (id?: string) => {
  const [loading, setLoading] = React.useState(false);
  const { fetchVhlById, allVhls, setSelectedVhl } = useVhlProStore();

  React.useEffect(() => {
    if (id) {
      const cachedVhl = allVhls.find((vhl) => vhl.id === id);
      if (cachedVhl) {
        setSelectedVhl(cachedVhl);
      } else {
        setLoading(true);
        fetchVhlById(id).then((fetchedVhl) => {
          if (fetchedVhl) {
            setSelectedVhl(fetchedVhl);
          }
          setLoading(false);
        });
      }
    }
  }, [id, fetchVhlById, allVhls, setSelectedVhl]);

  return { loading };
};
