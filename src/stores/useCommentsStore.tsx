/* eslint-disable @typescript-eslint/no-explicit-any */
import { create } from "zustand";
import { immer } from "zustand/middleware/immer";
import { toast } from "react-toastify";
import axios from "axios";
import axiosAuth from "../utils/axiosAuth";

// ==================== Types ====================

export interface User {
  id: string;
  name: string;
  email: string;
  image?: string;
}

export interface Statut {
  id: string;
  nom: string;
  couleur?: string;
  ordre?: number;
}

export interface Vhl {
  id: string;
  matricule: string;
  marque: string;
  modele?: string;
  statut_id?: string;
  kilometrage?: number;
  [key: string]: any;
}

export interface Comment {
  id: string;
  comment: string;
  vhl_id: string;
  active: boolean;
  user_id: string;
  statut_id?: string;
  parent_id?: string;
  kilometrage?: number;
  created_at: string;
  updated_at: string;
  user?: User;
  statut?: Statut;
  replies?: Comment[];
  vhl?: Vhl;
  _count?: {
    replies: number;
  };
}

export interface CommentFilters {
  vhlId?: string;
  userId?: string;
  statutId?: string;
  active?: boolean;
  parentId?: string | null;
  search?: string;
  startDate?: string;
  endDate?: string;
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}

export interface PaginatedResponse<T> {
  data: T[];
  meta: {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    itemsPerPage: number;
  };
}

export interface ApiError {
  message: string;
  errors?: Record<string, string[]>;
  status?: number;
}

// ==================== Types d'état ====================

interface CommentState {
  // Données
  comments: Comment[];
  currentComment: Comment | null;
  statuts: Statut[];
  filters: CommentFilters;
  pagination: {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    itemsPerPage: number;
  };

  // États UI
  loading: boolean;
  loadingComments: boolean;
  loadingStatuts: boolean;
  loadingActions: {
    add: boolean;
    update: boolean;
    delete: boolean;
    fetch: boolean;
  };
  error: string | null;
  success: string | null;
  handAddToggle: boolean;

  // Cache
  lastFetched: number | null;
  cacheDuration: number;
}

// ==================== Types d'actions ====================

interface CommentActions {
  // Fetch
  fetchComments: (
    filters?: CommentFilters,
    forceRefresh?: boolean,
  ) => Promise<Comment[]>;
  fetchComment: (
    commentId: string,
    forceRefresh?: boolean,
  ) => Promise<Comment | null>;
  fetchStatuts: (forceRefresh?: boolean) => Promise<void>;
  fetchCommentsByVhl: (
    vhlId: string,
    filters?: Omit<CommentFilters, "vhlId">,
  ) => Promise<Comment[]>;
  fetchCommentsByUser: (userId: string) => Promise<Comment[]>;

  // CRUD
  addComment: (data: {
    vhlId: string;
    comment: string;
    statut_id?: string;
    active?: boolean;
    kilometrage?: number;
    parentId?: string;
  }) => Promise<Comment | null>;

  updateComment: (
    commentId: string,
    data: {
      comment?: string;
      statut_id?: string;
      active?: boolean;
    },
  ) => Promise<boolean>;

  deleteComment: (commentId: string) => Promise<boolean>;
  deleteMultipleComments: (commentIds: string[]) => Promise<boolean>;

  // Actions VHL
  updateVhlComment: (
    id: string,
    vhlData: Partial<Vhl>,
  ) => Promise<Vhl | undefined>;

  // Gestion d'état
  setComments: (comments: Comment[]) => void;
  setFilters: (filters: Partial<CommentFilters>) => void;
  resetFilters: () => void;
  setHandAddToggle: (handAdd: boolean) => void;
  clearComments: () => void;
  clearError: () => void;
  clearSuccess: () => void;

  // Cache
  invalidateCache: () => void;
  refreshData: () => Promise<void>;

  // Pagination
  nextPage: () => void;
  prevPage: () => void;
  goToPage: (page: number) => void;
}

// ==================== Helpers ====================

const handleApiError = (error: unknown): ApiError => {
  if (axios.isAxiosError(error)) {
    const axiosError = error as any;

    if (axiosError.response) {
      const data = axiosError.response.data;

      if (data.errors) {
        return {
          message: data.message || "Erreur de validation",
          errors: data.errors,
          status: axiosError.response.status,
        };
      }

      return {
        message: data.message || "Une erreur est survenue",
        status: axiosError.response.status,
      };
    }

    if (axiosError.request) {
      return {
        message:
          "Impossible de contacter le serveur. Vérifiez votre connexion.",
      };
    }
  }

  if (error instanceof Error) {
    return { message: error.message };
  }

  return { message: "Une erreur inconnue est survenue" };
};

// ==================== Configuration ====================

const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes
const ITEMS_PER_PAGE = 20;

// ==================== Store principal ====================

export const useComments = create<CommentState & CommentActions>()(
  immer((set, get) => ({
    // État initial
    comments: [],
    currentComment: null,
    statuts: [],
    filters: {
      page: 1,
      limit: ITEMS_PER_PAGE,
      active: true,
      sortBy: "created_at",
      sortOrder: "desc",
    },
    pagination: {
      currentPage: 1,
      totalPages: 1,
      totalItems: 0,
      itemsPerPage: ITEMS_PER_PAGE,
    },

    loading: false,
    loadingComments: false,
    loadingStatuts: false,
    loadingActions: {
      add: false,
      update: false,
      delete: false,
      fetch: false,
    },
    error: null,
    success: null,
    handAddToggle: false,

    lastFetched: null,
    cacheDuration: CACHE_DURATION,

    // ==================== Fetch ====================

    fetchComments: async (filters?: CommentFilters, forceRefresh = false) => {
      const currentFilters = { ...get().filters, ...filters };
      const lastFetched = get().lastFetched;
      const now = Date.now();

      // Vérifier le cache
      if (!forceRefresh && lastFetched && now - lastFetched < CACHE_DURATION) {
        return get().comments;
      }

      set((state) => {
        state.loadingComments = true;
        state.loadingActions.fetch = true;
        state.error = null;
      });

      try {
        // Construire les paramètres
        const params = new URLSearchParams();
        Object.entries(currentFilters).forEach(([key, value]) => {
          if (value !== undefined && value !== null && value !== "") {
            params.append(key, String(value));
          }
        });

        const response = await axiosAuth.get<PaginatedResponse<Comment>>(
          `comments?${params.toString()}`,
        );

        const { data, meta } = response.data;

        set((state) => {
          state.comments = data;
          state.pagination = {
            currentPage: meta.currentPage,
            totalPages: meta.totalPages,
            totalItems: meta.totalItems,
            itemsPerPage: meta.itemsPerPage,
          };
          state.lastFetched = Date.now();
          state.loadingComments = false;
          state.loadingActions.fetch = false;
        });

        return data;
      } catch (error) {
        const apiError = handleApiError(error);
        set((state) => {
          state.error = apiError.message;
          state.loadingComments = false;
          state.loadingActions.fetch = false;
        });
        toast.error(apiError.message);
        return [];
      }
    },

    fetchComment: async (commentId: string, forceRefresh = false) => {
      // Vérifier le cache
      if (!forceRefresh) {
        const cachedComment = get().comments.find((c) => c.id === commentId);
        if (cachedComment) return cachedComment;
      }

      set((state) => {
        state.loading = true;
        state.error = null;
      });

      try {
        const response = await axiosAuth.get<Comment>(`comments/${commentId}`);

        set((state) => {
          state.currentComment = response.data;
          state.loading = false;
        });

        return response.data;
      } catch (error) {
        const apiError = handleApiError(error);
        set((state) => {
          state.error = apiError.message;
          state.loading = false;
        });
        toast.error(apiError.message);
        return null;
      }
    },

    fetchStatuts: async (forceRefresh = false) => {
      const { statuts, lastFetched } = get();
      const now = Date.now();

      // Vérifier le cache
      if (
        !forceRefresh &&
        statuts.length > 0 &&
        lastFetched &&
        now - lastFetched < CACHE_DURATION
      ) {
        return;
      }

      set((state) => {
        state.loadingStatuts = true;
        state.error = null;
      });

      try {
        const response = await axiosAuth.get<Statut[]>("statuts");

        set((state) => {
          state.statuts = response.data;
          state.loadingStatuts = false;
          state.lastFetched = Date.now();
        });
      } catch (error) {
        const apiError = handleApiError(error);
        set((state) => {
          state.error = apiError.message;
          state.loadingStatuts = false;
        });
        toast.error(apiError.message);
      }
    },

    fetchCommentsByVhl: async (
      vhlId: string,
      filters?: Omit<CommentFilters, "vhlId">,
    ) => {
      return get().fetchComments({ ...filters, vhlId }, true);
    },

    fetchCommentsByUser: async (userId: string) => {
      return get().fetchComments({ userId }, true);
    },

    // ==================== CRUD ====================

    addComment: async ({
      vhlId,
      comment,
      statut_id,
      active,
      kilometrage,
      parentId,
    }) => {
      set((state) => {
        state.loadingActions.add = true;
        state.error = null;
      });

      try {
        const payload: any = {
          vhl_id: vhlId,
          comment,
          statut_id: statut_id ?? 1,
          parent_id: parentId,
        };

        if (active !== undefined) payload.active = active;
        if (kilometrage !== undefined) payload.kilometrage = kilometrage;

        const response = await axiosAuth.post<Comment>("comments", payload);

        const newComment = response.data;

        // Mettre à jour le statut du VHL
        if (statut_id) {
          get().updateVhlComment(vhlId, { statut_id });
        }

        // Mettre à jour l'état local
        set((state) => {
          if (parentId) {
            // Ajouter comme réponse
            const addReply = (comments: Comment[]): Comment[] => {
              return comments.map((c) => {
                if (c.id === parentId) {
                  return {
                    ...c,
                    replies: [...(c.replies || []), newComment],
                  };
                }
                if (c.replies) {
                  return {
                    ...c,
                    replies: addReply(c.replies),
                  };
                }
                return c;
              });
            };
            state.comments = addReply(state.comments);
          } else {
            // Ajouter comme commentaire principal
            state.comments = [newComment, ...state.comments];
          }
          state.loadingActions.add = false;
        });

        toast.success("Commentaire ajouté avec succès");
        return newComment;
      } catch (error) {
        const apiError = handleApiError(error);
        set((state) => {
          state.error = apiError.message;
          state.loadingActions.add = false;
        });
        toast.error(apiError.message);
        return null;
      }
    },

    updateComment: async (commentId, data) => {
      set((state) => {
        state.loadingActions.update = true;
        state.error = null;
      });

      try {
        const response = await axiosAuth.put<Comment>(
          `comments/${commentId}`,
          data,
        );

        const updatedComment = response.data;

        // Mettre à jour l'état local
        set((state) => {
          const updateRecursive = (comments: Comment[]): Comment[] => {
            return comments.map((c) => {
              if (c.id === commentId) {
                return { ...c, ...updatedComment };
              }
              if (c.replies) {
                return {
                  ...c,
                  replies: updateRecursive(c.replies),
                };
              }
              return c;
            });
          };

          state.comments = updateRecursive(state.comments);
          if (state.currentComment?.id === commentId) {
            state.currentComment = {
              ...state.currentComment,
              ...updatedComment,
            };
          }
          state.loadingActions.update = false;
        });

        toast.success("Commentaire mis à jour");
        return true;
      } catch (error) {
        const apiError = handleApiError(error);
        set((state) => {
          state.error = apiError.message;
          state.loadingActions.update = false;
        });
        toast.error(apiError.message);
        return false;
      }
    },

    deleteComment: async (commentId: string) => {
      set((state) => {
        state.loadingActions.delete = true;
        state.error = null;
      });

      try {
        await axiosAuth.delete(`comments/${commentId}`);

        // Mettre à jour l'état local
        set((state) => {
          const removeRecursive = (comments: Comment[]): Comment[] => {
            return comments
              .filter((c) => c.id !== commentId)
              .map((c) => {
                if (c.replies) {
                  return {
                    ...c,
                    replies: removeRecursive(c.replies),
                  };
                }
                return c;
              });
          };

          state.comments = removeRecursive(state.comments);
          if (state.currentComment?.id === commentId) {
            state.currentComment = null;
          }
          state.loadingActions.delete = false;
        });

        toast.success("Commentaire supprimé");
        return true;
      } catch (error) {
        const apiError = handleApiError(error);
        set((state) => {
          state.error = apiError.message;
          state.loadingActions.delete = false;
        });
        toast.error(apiError.message);
        return false;
      }
    },

    deleteMultipleComments: async (commentIds: string[]) => {
      set((state) => {
        state.loadingActions.delete = true;
        state.error = null;
      });

      try {
        await axiosAuth.post("comments/bulk-delete", { ids: commentIds });

        // Mettre à jour l'état local
        set((state) => {
          const removeMultipleRecursive = (comments: Comment[]): Comment[] => {
            return comments
              .filter((c) => !commentIds.includes(c.id))
              .map((c) => {
                if (c.replies) {
                  return {
                    ...c,
                    replies: removeMultipleRecursive(c.replies),
                  };
                }
                return c;
              });
          };

          state.comments = removeMultipleRecursive(state.comments);
          if (
            state.currentComment &&
            commentIds.includes(state.currentComment.id)
          ) {
            state.currentComment = null;
          }
          state.loadingActions.delete = false;
        });

        toast.success(`${commentIds.length} commentaire(s) supprimé(s)`);
        return true;
      } catch (error) {
        const apiError = handleApiError(error);
        set((state) => {
          state.error = apiError.message;
          state.loadingActions.delete = false;
        });
        toast.error(apiError.message);
        return false;
      }
    },

    // ==================== Actions VHL ====================

    updateVhlComment: async (id: string, vhlData: Partial<Vhl>) => {
      set((state) => {
        state.loading = true;
        state.error = null;
      });

      try {
        const payload = {
          ...vhlData,
          statut_id: vhlData.statut_id,
        };

        const response = await axiosAuth.put<Vhl>(`vhls/${id}`, payload);

        set((state) => {
          state.loading = false;
        });

        toast.success("Véhicule mis à jour avec succès");
        return response.data;
      } catch (error: any) {
        const apiError = handleApiError(error);

        set((state) => {
          state.error = apiError.message;
          state.loading = false;
        });

        toast.error(apiError.message);
        return undefined;
      }
    },

    // ==================== Gestion d'état ====================

    setComments: (comments) => {
      set((state) => {
        state.comments = comments;
      });
    },

    setFilters: (filters) => {
      set((state) => {
        state.filters = { ...state.filters, ...filters };
      });
      // Recharger les commentaires avec les nouveaux filtres
      get().fetchComments(get().filters, true);
    },

    resetFilters: () => {
      set((state) => {
        state.filters = {
          page: 1,
          limit: ITEMS_PER_PAGE,
          active: true,
          sortBy: "created_at",
          sortOrder: "desc",
        };
      });
      get().fetchComments(get().filters, true);
    },

    setHandAddToggle: (handAddToggle) => {
      set((state) => {
        state.handAddToggle = handAddToggle;
      });
    },

    clearComments: () => {
      set((state) => {
        state.comments = [];
        state.currentComment = null;
        state.error = null;
      });
    },

    clearError: () => {
      set((state) => {
        state.error = null;
      });
    },

    clearSuccess: () => {
      set((state) => {
        state.success = null;
      });
    },

    // ==================== Cache ====================

    invalidateCache: () => {
      set((state) => {
        state.lastFetched = null;
      });
    },

    refreshData: async () => {
      get().invalidateCache();
      await get().fetchComments(get().filters, true);
      await get().fetchStatuts(true);
    },

    // ==================== Pagination ====================

    nextPage: () => {
      const { currentPage, totalPages } = get().pagination;
      if (currentPage < totalPages) {
        set((state) => {
          state.filters.page = (state.filters.page || 1) + 1;
        });
        get().fetchComments(get().filters, true);
      }
    },

    prevPage: () => {
      const { currentPage } = get().pagination;
      if (currentPage > 1) {
        set((state) => {
          state.filters.page = (state.filters.page || 1) - 1;
        });
        get().fetchComments(get().filters, true);
      }
    },

    goToPage: (page: number) => {
      set((state) => {
        state.filters.page = page;
      });
      get().fetchComments(get().filters, true);
    },
  })),
);

// ==================== Hooks personnalisés ====================

export const useCommentsByVhl = (vhlId: string) => {
  const { comments, loading, fetchCommentsByVhl } = useComments();

  return {
    comments: comments.filter((c) => c.vhl_id === vhlId),
    loading,
    refresh: () => fetchCommentsByVhl(vhlId),
  };
};

export const useCommentReplies = (commentId: string) => {
  const { comments } = useComments();

  const findComment = (comments: Comment[]): Comment | undefined => {
    for (const c of comments) {
      if (c.id === commentId) return c;
      if (c.replies) {
        const found = findComment(c.replies);
        if (found) return found;
      }
    }
    return undefined;
  };

  const comment = findComment(comments);

  return {
    replies: comment?.replies || [],
    count: comment?._count?.replies || 0,
  };
};

// ==================== Exports ====================

export default useComments;
