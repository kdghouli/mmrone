/* eslint-disable @typescript-eslint/no-unused-vars */
// store/dailyCheckStore.ts
import { create } from "zustand";
import type {
  DailyCheck,
  Chariot,
  DailyCheckFormData,
  Utilisateur,
} from "./type";
import axiosAuth from "../../utils/axiosAuth";
import { useAuthStore } from "../../stores/useAuthStore";
import axios from "axios";

interface DailyCheckStore {
  // State
  dailyChecks: DailyCheck[];
  chariots: Chariot[];
  utilisateurs: Utilisateur[];
  selectedCheck: DailyCheck | null;
  isLoading: boolean;
  error: string | null;
  filterDate: Date | null;
  filterChariotId: string | null;

  // Actions
  setDailyChecks: (checks: DailyCheck[]) => void;
  setChariots: (chariots: Chariot[]) => void;
  setSelectedCheck: (check: DailyCheck | null) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  setFilterDate: (date: Date | null) => void;
  setFilterChariotId: (id: string | null) => void;

  // CRUD Operations
  fetchDailyChecks: () => Promise<void>;
  fetchChariots: () => Promise<void>;
  fetchUtilisateurs: () => Promise<void>;
  createDailyCheck: (data: DailyCheckFormData) => Promise<void>;
  updateDailyCheck: (
    id: string,
    data: Partial<DailyCheckFormData>,
  ) => Promise<void>;
  deleteDailyCheck: (id: string) => Promise<void>;

  // Computed
  getFilteredChecks: () => DailyCheck[];
  getCheckById: (id: string) => DailyCheck | undefined;
  getChecksByChariot: (chariotId: string) => DailyCheck[];
  getTodayChecks: () => DailyCheck[];
}

const user = useAuthStore.getState().user;

export const useDailyCheckStore = create<DailyCheckStore>((set, get) => ({
  // Initial State
  dailyChecks: [],
  chariots: [],
  selectedCheck: null,
  utilisateurs: [],
  isLoading: false,
  error: null,
  filterDate: new Date(),
  filterChariotId: null,

  // State Setters
  setDailyChecks: (checks) => set({ dailyChecks: checks }),
  setChariots: (chariots) => set({ chariots }),
  setSelectedCheck: (check) => set({ selectedCheck: check }),
  setLoading: (loading) => set({ isLoading: loading }),
  setError: (error) => set({ error }),
  setFilterDate: (date) => set({ filterDate: date }),
  setFilterChariotId: (id) => set({ filterChariotId: id }),

  // Computed Functions
  getFilteredChecks: () => {
    const { dailyChecks, filterDate, filterChariotId } = get();
    return dailyChecks.filter((check) => {
      let matches = true;

      if (filterDate) {
        const checkDate = new Date(check.dateControle);
        matches =
          matches && checkDate.toDateString() === filterDate.toDateString();
      }

      if (filterChariotId) {
        matches = matches && check.vhl_id == filterChariotId;
      }

      return matches;
    });
  },

  getCheckById: (id) => {
    return get().dailyChecks.find((check) => check.id === id);
  },

  getChecksByChariot: (chariotId) => {
    return get().dailyChecks.filter((check) => check.vhl_id == chariotId);
  },

  getTodayChecks: () => {
    const today = new Date().toDateString();
    return get().dailyChecks.filter(
      (check) => new Date(check.dateControle).toDateString() === today,
    );
  },

  // API Operations (à adapter selon votre backend)
  fetchDailyChecks: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await axiosAuth.get("/dailychecks");

      const mockData: DailyCheck[] = response.data;
      {
        console.log("Checks filtrés :", mockData);
      }

      set({ dailyChecks: mockData });
    } catch (error) {
      set({ error: "Erreur lors du chargement des contrôles" });
    } finally {
      set({ isLoading: false });
    }
  },

  fetchChariots: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await axiosAuth.get("/categ/vhls/4");

      const mockChariots: Chariot[] = response.data;

      set({ chariots: mockChariots });
    } catch (error) {
      set({ error: "Erreur lors du chargement des chariots" });
    } finally {
      set({ isLoading: false });
    }
  },

 fetchUtilisateurs: async () => {
  set({ isLoading: true, error: null });

  try {
    const response = await axiosAuth.get<Utilisateur[]>("/utilisateurs");

    const utilisateursFiltres = response.data.filter((utilisateur) =>
      utilisateur.poste?.toLowerCase().includes("chariot")
    );

    if (utilisateursFiltres.length === 0) {
      console.warn("Aucun utilisateur avec le poste contenant 'chariot'");
    }

    set({ utilisateurs: utilisateursFiltres });
  } catch (error) {
    const message =
      axios.isAxiosError(error) && error.response?.data?.message
        ? error.response.data.message
        : "Erreur réseau ou serveur";

    console.error("Erreur fetchUtilisateurs :", error);
    set({ error: message });
  } finally {
    set({ isLoading: false });
  }
},

  createDailyCheck: async (data) => {
    set({ isLoading: true, error: null });
    try {
      const payload = {
        ...data,
        user_id: user?.id,
        
      };
      console.log("Payload envoyé :", payload);

      const newCheck: DailyCheck = await axiosAuth.post("dailychecks", payload);

      set((state) => ({
        dailyChecks: [...state.dailyChecks, newCheck],
      }));
    } catch (error) {
      set({ error: "Erreur lors de la création du contrôle" });
    } finally {
      set({ isLoading: false });
    }
  },

  updateDailyCheck: async (id, data) => {
    set({ isLoading: true, error: null });
    try {
      // const response = await fetch(`/api/dailychecks/${id}`, {
      //   method: 'PUT',
      //   body: JSON.stringify(data),
      // });
      // const updatedCheck = await response.json();

      set((state) => ({
        dailyChecks: state.dailyChecks.map((check) =>
          check.id === id
            ? {
                ...check,
                ...data,
                updated_at: new Date().toISOString(),
              }
            : check,
        ),
      }));
    } catch (error) {
      set({ error: "Erreur lors de la mise à jour du contrôle" });
    } finally {
      set({ isLoading: false });
    }
  },

  deleteDailyCheck: async (id) => {
    set({ isLoading: true, error: null });
    try {
      await axiosAuth.delete(`/dailychecks/${id}`);

      set((state) => ({
        dailyChecks: state.dailyChecks.filter((check) => check.id !== id),
      }));
    } catch (error) {
      set({ error: "Erreur lors de la suppression du contrôle" });
    } finally {
      set({ isLoading: false });
    }
  },
}));
