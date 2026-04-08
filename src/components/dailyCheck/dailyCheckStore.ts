/* eslint-disable @typescript-eslint/no-unused-vars */
// store/dailyCheckStore.ts
import { create } from "zustand";
import type { DailyCheck, Chariot, DailyCheckFormData } from "./type";

interface DailyCheckStore {
  // State
  dailyChecks: DailyCheck[];
  chariots: Chariot[];
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

export const useDailyCheckStore = create<DailyCheckStore>((set, get) => ({
  // Initial State
  dailyChecks: [],
  chariots: [],
  selectedCheck: null,
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
        matches = matches && check.vhl_id === filterChariotId;
      }

      return matches;
    });
  },

  getCheckById: (id) => {
    return get().dailyChecks.find((check) => check.id === id);
  },

  getChecksByChariot: (chariotId) => {
    return get().dailyChecks.filter((check) => check.vhl_id === chariotId);
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
      // Simuler un appel API
      // const response = await fetch('/api/dailychecks');
      // const data = await response.json();

      // Données de test
      const mockData: DailyCheck[] = [
        {
          id: "1",
          dateControle: new Date().toISOString(),
          frein: true,
          pneus: true,
          eclairage: true,
          extincteur: true,
          batterie: false,
          fuite: false,
          avertisseur: true,
          ceinture: true,
          retroviseur: true,
          observation: "Batterie à recharger",
          kilometrage: 1234,
          vhl_id: "1",
          user_id: "user1",
          utilisateur_id: "user1",
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        },
      ];

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
      // Données de test pour 15 chariots
      const mockChariots: Chariot[] = Array.from({ length: 15 }, (_, i) => ({
        id: `${i + 1}`,
        nom: `Chariot ${i + 1}`,
        type: i % 3 === 0 ? "Électrique" : i % 3 === 1 ? "Diesel" : "GPL",
        statut: i % 5 === 0 ? "maintenance" : "actif",
      }));

      set({ chariots: mockChariots });
    } catch (error) {
      set({ error: "Erreur lors du chargement des chariots" });
    } finally {
      set({ isLoading: false });
    }
  },

  createDailyCheck: async (data) => {
    set({ isLoading: true, error: null });
    try {
      // const response = await fetch('/api/dailychecks', {
      //   method: 'POST',
      //   body: JSON.stringify(data),
      // });
      // const newCheck = await response.json();

      const newCheck: DailyCheck = {
        id: Date.now().toString(),
        ...data,
        user_id: "current-user",
        utilisateur_id: "current-user",
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      } as DailyCheck;

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
      // await fetch(`/api/dailychecks/${id}`, {
      //   method: 'DELETE',
      // });

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
