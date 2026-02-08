/* eslint-disable @typescript-eslint/no-explicit-any */
import { create } from "zustand";
import { API_BASE_URL } from "../utils/donnee";
import { toast } from "react-toastify";
import axios from "axios";
import { useAuthStore } from "./useAuthStore";

export interface Comment {
  id: string;
  comment: string;
  vhl_id: string;
  active: boolean;
  user_id: string;
  statut_id?: string;
  parent_id?: string;
  created_at: string;
  updated_at: string;
  user?: {
    id: string;
    name: string;
    email: string;
    image?: string;
  };
  statut?: {
    id: string;
    nom: string;
  };
  replies?: Comment[];
  vhl?: {
    id: string;
    matricule: string;
    marque: string;
  };
}

// Créer une instance axios configurée
const authAxios = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Intercepteur pour ajouter le token et user info
authAxios.interceptors.request.use(
  (config) => {
    const token = useAuthStore.getState().token;
    const user = useAuthStore.getState().user;

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    if (user) {
      // Ajouter l'ID utilisateur dans un header personnalisé
      config.headers["X-User-ID"] = user.id;
      config.headers["X-User-Email"] = user.email;
    }

    return config;
  },
  (error) => Promise.reject(error),
);

export interface Vhl {
  id: string;
  matricule: string;
  marque: string;
  statut_id?: string;
  [key: string]: any;
}

interface CommentStore {
  comments: Comment[];
  statuts?: { id: string; nom: string }[];
  loading: boolean;
  user: any;
  error: string | null;
  handAddToggle: boolean;
  // Actions
  fetchComments: (vhlId: string) => Promise<void>;
  fetchComment: (commentId: string) => Promise<Comment | null>;
  fetchStatuts: () => Promise<void>;
  addComment: (
    vhlId: string,
    comment: string,
    statut_id?: string,
    active?: boolean,
    kilometrage?: string,
    parentId?: string,
  ) => Promise<Comment | null>;
  updateComment: (
    commentId: string,
    data: { comment: string; statut_id?: string },
  ) => Promise<boolean>;
  updateVhlComment: (
    id: string,
    vhlData: Partial<Vhl>,
  ) => Promise<Vhl | undefined>;
  deleteComment: (commentId: string) => Promise<boolean>;
  setComments: (comments: Comment[]) => void;
  sethandAddToggle: (handAdd: boolean) => void;
  clearComments: () => void;
}

export const useComments = create<CommentStore>((set, get) => ({
  comments: [],
  loading: false,
  handAddToggle: false,
  error: null,
  user: useAuthStore.getState().user,

  fetchComments: async (vhlId: string) => {
    set({ loading: true, error: null });
    try {
      // Using axios with auth headers instead of fetch
      const token = useAuthStore.getState().token;
      const response = await axios.get(
        `${API_BASE_URL}vhls/${vhlId}/comments`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        },
      );

      const comments = response.data;
      set({ comments, loading: false });
    } catch (error) {
      set({ error: (error as Error).message, loading: false });
    }
  },
  fetchStatuts: async () => {
    set({ loading: true, error: null });
    try {
      const response = await fetch(`${API_BASE_URL}statuts`);
      if (!response.ok) throw new Error("Failed to fetch statuts");
      const statuts = await response.json();
      set({ statuts, loading: false });
    } catch (error) {
      set({ error: (error as Error).message, loading: false });
    }
  },

  fetchComment: async (commentId: string) => {
    try {
      const response = await fetch(`${API_BASE_URL}comments/${commentId}`);
      if (!response.ok) throw new Error("Failed to fetch comment");

      return await response.json();
    } catch (error) {
      set({ error: (error as Error).message });
      return null;
    }
  },

  addComment: async (
    vhlId: string,
    comment: string,
    statut_id?: string,
    active?: boolean,
    kilometrage?: string,
    parentId?: string,
  ) => {
    set({ loading: true, error: null });
    try {
      console.log(
        `Comment -1-: vhl: ${vhlId} comment: ${comment} stat:${statut_id} active: ${active} kilo:${kilometrage} user: ${get().user?.id} parentId:${parentId}`,
      );

      const response = await fetch(`${API_BASE_URL}comments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          vhl_id: vhlId,
          comment,
          statut_id: statut_id ?? 1,
          active,
          kilometrage,
          user_id: get().user?.id,
          parent_id: parentId,
        }),
      });
      console.log(
        `Comment -2- : vhl: ${vhlId} comment: ${comment} stat:${statut_id} active: ${active} kilo:${kilometrage} user: ${get().user?.id} parentId:${parentId}`,
      );

      if (!response.ok) throw new Error("Failed to add comment");

      const newComment = await response.json();

      get().updateVhlComment(vhlId, { statut_id });

      // Update local state
      if (parentId) {
        // Ajouter comme réponse
        const updatedComments = get().comments.map((comment) => {
          if (comment.id === parentId) {
            return {
              ...comment,
              replies: [...(comment.replies || []), newComment],
            };
          }
          return comment;
        });
        set({ comments: updatedComments });
      } else {
        // Ajouter comme commentaire principal
        set({ comments: [newComment, ...get().comments] });
      }

      set({ loading: false });
      return newComment;
    } catch (error) {
      set({ error: (error as Error).message, loading: false });
      return null;
    }
  },

  updateComment: async (
    commentId: string,

    data: { comment: string; statut_id?: string },
  ) => {
    set({ loading: true, error: null });
    try {
      const response = await fetch(`${API_BASE_URL}comments/${commentId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!response.ok) throw new Error("Failed to update comment");

      const updatedComment = await response.json();

      // Mettre à jour l'état local
      const updateCommentsRecursive = (comments: Comment[]): Comment[] => {
        return comments.map((comment) => {
          if (comment.id === commentId) {
            return { ...comment, ...updatedComment };
          }
          if (comment.replies) {
            return {
              ...comment,
              replies: updateCommentsRecursive(comment.replies),
            };
          }
          return comment;
        });
      };

      set({
        comments: updateCommentsRecursive(get().comments),
        loading: false,
      });

      return true;
    } catch (error) {
      set({ error: (error as Error).message, loading: false });
      return false;
    }
  },

  deleteComment: async (commentId: string) => {
    set({ loading: true, error: null });
    try {
      const response = await fetch(`${API_BASE_URL}comments/${commentId}`, {
        method: "DELETE",
      });

      if (!response.ok) throw new Error("Failed to delete comment");

      // Mettre à jour l'état local
      const removeCommentRecursive = (comments: Comment[]): Comment[] => {
        return comments
          .filter((comment) => comment.id !== commentId)
          .map((comment) => {
            if (comment.replies) {
              return {
                ...comment,
                replies: removeCommentRecursive(comment.replies),
              };
            }
            return comment;
          });
      };

      set({
        comments: removeCommentRecursive(get().comments),
        loading: false,
      });

      return true;
    } catch (error) {
      set({ error: (error as Error).message, loading: false });
      return false;
    }
  },

  // Mettre à jour un Vhl
  updateVhlComment: async (id: string, vhlData: Partial<Vhl>) => {
    set({ loading: true, error: null });
    try {
      // Convert empty strings to null values
      const payload = {
        ...vhlData,
        statut_id: vhlData.statut_id,
      };
      console.log("Payload envoyé:", payload);

      const response = await authAxios.put(`vhls/${id}`, payload);
      console.log("Réponse mise à jour Vhl:", response.data);

      set(() => ({
        loading: false,
      }));

      toast.success("Véhicule mis à jour avec succès");
      return response.data;
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

  setComments: (comments: Comment[]) => set({ comments }),

  sethandAddToggle: (handAddToggle: boolean) => set({ handAddToggle }),

  clearComments: () => set({ comments: [], error: null }),
}));
