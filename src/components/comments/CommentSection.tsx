/* eslint-disable @typescript-eslint/no-explicit-any */
// components/comments/CommentSection.tsx
import { useState, useEffect } from "react";
import { useComments } from "../../stores/useCommentsStore";
import {
  FaComments,
  FaCalendar,
  FaEdit,
  FaTrash,
  FaReply,
  FaCheck,
  FaTimes,
} from "react-icons/fa";
import CommandeAddForm from "./CommandeAddForm";
import { STORAGE_BASE_URL } from "../../utils/donnee";

interface CommentSectionProps {
  vhlId: string;
  vhlMatricule?: string;
}

const CommentSection: React.FC<CommentSectionProps> = ({ vhlId }) => {
  const {
    comments,
    loading,
    error,
    handAddToggle,
    statuts,
    fetchStatuts,
    fetchComments,
    addCommentReplay,
    updateComment,
    deleteComment,
  } = useComments();

  const [kilometrage] = useState("");

  const [editingCommentId, setEditingCommentId] = useState<string | null>(null);
  const [editContent, setEditContent] = useState("");
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [replyContent, setReplyContent] = useState("");
  const [isActive] = useState(true);
  const [formData, setFormData] = useState<{ statut_id: string }>({
    statut_id: "",
  });
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    fetchStatuts();
    fetchComments(vhlId);
  }, [fetchComments, fetchStatuts, vhlId]);

  const handleReplySubmit = async (parentId: string, e: React.FormEvent) => {
    e.preventDefault();
    if (!replyContent.trim()) return;

    await addCommentReplay(
      vhlId,
      replyContent,
      formData.statut_id,
      isActive,
      kilometrage,
      parentId,
    );
    console.log(
      `Reply added: ${replyContent} with statut_id: ${formData.statut_id} for parent comment ID: ${parentId} and vhlId: ${vhlId}`,
    );
    setReplyContent("");
    setReplyingTo(null);
  };
  const handleEditSubmit = async (commentId: string) => {
    if (!editContent.trim()) return;

    await updateComment(commentId, { comment: editContent });
    setEditingCommentId(null);
    setEditContent("");
  };

  const handleDelete = async (commentId: string) => {
    if (window.confirm("Êtes-vous sûr de vouloir supprimer ce commentaire ?")) {
      await deleteComment(commentId);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("fr-FR", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const CommentItem = ({
    comment,
    depth = 0,
  }: {
    comment: any;
    depth?: number;
  }) => {
    const isEditing = editingCommentId === comment.id;
    const isReplying = replyingTo === comment.id;

    return (
      <div
        className={`mt-2  ${
          depth > 0 ? "ml-4 pl-2 border-l-2 border-gray-400" : ""
        }`}
        style={{ marginLeft: depth * 24 }}
      >
        <div className="bg-white rounded-lg border border-gray-200 p-2 shadow-sm">
          {/* Comment Header */}
          <div className="flex justify-between items-start mb-2">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-linear-to-r from-blue-500 to-cyan-500 rounded-full flex items-center justify-center text-white text-sm">
                {/* Photo */}
                <div className="shrink-0">
                  <div className="relative">
                    {comment.user?.image ? (
                      <div className="rounded-full overflow-hidden border-4 border-white shadow-lg">
                        <img
                          src={`${STORAGE_BASE_URL}${comment.user.image}`}
                          alt={comment.user?.name || "Utilisateur"}
                          className="h-9 w-9 object-cover"
                        />
                      </div>
                    ) : (
                      <div className="rounded-full bg-linear-to-r from-blue-500 to-cyan-500 flex items-center justify-center text-white text-2xl font-bold shadow-lg">
                        {comment.user?.name?.charAt(0).toUpperCase() || "U"}
                      </div>
                    )}
                  </div>
                </div>
              </div>
              <div>
                <div className="flex items-center gap-4">
                  <span className="font-medium text-gray-900">
                    {comment.user?.name || "Utilisateur"}
                  </span>
                  {comment.statut && (
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${
                        comment.statut.nom.toLowerCase() === "ok"
                          ? "bg-green-200 text-green-800"
                          : "bg-red-200 text-red-800 "
                      }`}
                    >
                      {comment.statut.nom}
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-2 text-xs text-gray-500">
                  <FaCalendar className="text-gray-400" />
                  <span>{formatDate(comment.created_at)}</span>
                  {comment.updated_at !== comment.created_at && (
                    <span className="text-gray-400">(modifié)</span>
                  )}
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-2">
              <button
                onClick={() => setReplyingTo(comment.id)}
                className="p-1.5 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded"
                title="Répondre"
              >
                <FaReply />
              </button>
              <button
                onClick={() => {
                  setEditingCommentId(comment.id);
                  setEditContent(comment.comment);
                }}
                className="p-1.5 text-green-600 hover:text-green-800 hover:bg-green-50 rounded"
                title="Modifier"
              >
                <FaEdit />
              </button>
              <button
                onClick={() => handleDelete(comment.id)}
                className="p-1.5 text-red-600 hover:text-red-800 hover:bg-red-50 rounded"
                title="Supprimer"
              >
                <FaTrash />
              </button>
            </div>
          </div>

          {/* Comment Content */}

          {isEditing ? (
            <div className="mb-3">
              <textarea
                value={editContent}
                onChange={(e) => setEditContent(e.target.value)}
                className=" px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                rows={2}
              />
              <div className="flex gap-2 mt-2">
                <button
                  onClick={() => handleEditSubmit(comment.id)}
                  className="px-3 py-1.5 bg-green-600 text-white text-sm rounded-lg hover:bg-green-700 flex items-center gap-1"
                >
                  <FaCheck /> Enregistrer
                </button>
                <button
                  onClick={() => setEditingCommentId(null)}
                  className="px-3 py-1.5 bg-gray-200 text-gray-700 text-sm rounded-lg hover:bg-gray-300 flex items-center gap-1"
                >
                  <FaTimes /> Annuler
                </button>
              </div>
            </div>
          ) : (
            <p className="bg-gray-100 rounded-md text-gray-900  mb-4 py-2 px-4 font-bold text-xl">
              {comment.comment}
            </p>
          )}

          {/* Reply Form */}

          {isReplying && (
            <form
              onSubmit={(e) => handleReplySubmit(comment.id, e)}
              className="mt-2"
            >
              <textarea
                value={replyContent}
                name="replyContent"
                onChange={(e) => setReplyContent(e.target.value)}
                placeholder="Votre réponse..."
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                rows={2}
              />
              <div>
                <select
                  name="statut_id"
                  value={formData.statut_id}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-600"
                >
                  <option value="">
                    Sélectionnez l'état actuel du véhicule ...{" "}
                  </option>
                  {statuts?.map((statut) => (
                    <option key={statut.id} value={statut.id}>
                      {statut.nom}
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex gap-2 mt-2">
                <button
                  type="submit"
                  className="px-3 py-1.5 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700"
                >
                  Publier la réponse
                </button>
                <button
                  type="button"
                  onClick={() => setReplyingTo(null)}
                  className="px-3 py-1.5 bg-gray-200 text-gray-700 text-sm rounded-lg hover:bg-gray-300"
                >
                  Annuler
                </button>
              </div>
            </form>
          )}

          {/* {isReplying && (
            <form
              onSubmit={(e) => handleReplySubmit(comment.id,e)}
              className="mt-3"
            >
              <textarea
                value={replyContent}
                onChange={(e) => setReplyContent(e.target.value)}
                placeholder="Votre réponse..."
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                rows={2}
              />
              <div className="flex gap-2 mt-2">
                <button
                  type="submit"
                  className="px-3 py-1.5 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700"
                >
                  Publier la réponse
                </button>
                <button
                  type="button"
                  onClick={() => setReplyingTo(null)}
                  className="px-3 py-1.5 bg-gray-200 text-gray-700 text-sm rounded-lg hover:bg-gray-300"
                >
                  Annuler
                </button>
              </div>
            </form>
          )} */}

          {/* Replies */}
          {comment.replies && comment.replies.length > 0 && (
            <div className="mt-4">
              {comment.replies.map((reply: any) => (
                <CommentItem key={reply.id} comment={reply} depth={depth + 1} />
              ))}
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-200">
      {/* Header */}
      <div className="border-b border-gray-200 px-6 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <FaComments className="text-blue-600" />
            </div>

            <div>
              <h3 className="text-lg font-bold text-gray-900">Commentaires</h3>
            </div>
          </div>
          <div className="text-sm text-gray-500">
            {comments.length} commentaire{comments.length !== 1 ? "s" : ""}
          </div>
        </div>
      </div>

      {handAddToggle && <CommandeAddForm statuts={statuts} vhlId={vhlId} />}

      {/* Comments List */}
      <div className="p-4">
        {loading && !comments.length ? (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-3"></div>
            <p className="text-gray-600">Chargement des commentaires...</p>
          </div>
        ) : error ? (
          <div className="text-center py-8 text-red-600">
            <p>Erreur: {error}</p>
            <button
              onClick={() => fetchComments(vhlId)}
              className="mt-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
            >
              Réessayer
            </button>
          </div>
        ) : comments.length === 0 ? (
          <div className="text-center py-12">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 mb-4">
              <FaComments className="text-2xl text-gray-400" />
            </div>
            <h4 className="text-lg font-medium text-gray-900 mb-2">
              Aucun commentaire
            </h4>
            <p className="text-gray-600 max-w-md mx-auto">
              Soyez le premier à commenter ce véhicule.
            </p>
          </div>
        ) : (
          <div>
            {comments.map((comment) => (
              <CommentItem key={comment.id} comment={comment} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default CommentSection;
