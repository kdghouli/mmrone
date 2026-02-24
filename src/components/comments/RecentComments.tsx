import { useEffect } from "react";
import { useComments } from "../../stores/useCommentsStore";
import { FaComments, FaCar, FaUser, FaCalendar } from "react-icons/fa";
import { Link } from "react-router-dom";

interface RecentCommentsProps {
  vhlId?: string; // Optionnel - si non fourni, montre tous les commentaires récents
  limit?: number;
}

const RecentComments: React.FC<RecentCommentsProps> = ({
  vhlId,
  limit = 10,
}) => {
  const { comments, loading, fetchTousComments } = useComments();

  useEffect(() => {
    const loadData = async () => {
      await fetchTousComments();
    };
    loadData();
  }, []);

  const recentComments = comments
    .sort(
      (a, b) =>
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
    )
    .slice(0, limit);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));

    if (diffHours < 24) {
      return `Il y a ${diffHours} heure${diffHours > 1 ? "s" : ""}`;
    }

    return date.toLocaleDateString("fr-FR", {
      day: "2-digit",
      month: "short",
    });
  };

  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-100 rounded-lg">
            <FaComments className="text-blue-600" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-gray-900">
              Commentaires récents
            </h3>
            <p className="text-sm text-gray-600">
              {vhlId ? "Ce véhicule" : "Tous les véhicules"}
            </p>
          </div>
        </div>
        <Link
          to={vhlId ? `/vhls/${vhlId}/comments` : "/comments"}
          className="text-sm text-blue-600 hover:text-blue-700 font-medium"
        >
          Voir tous
        </Link>
      </div>

      {loading ? (
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500 mx-auto"></div>
        </div>
      ) : recentComments.length === 0 ? (
        <div className="text-center py-8">
          <FaComments className="text-4xl text-gray-300 mx-auto mb-3" />
          <p className="text-gray-600">Aucun commentaire récent</p>
        </div>
      ) : (
        <div className="space-y-4">
          {recentComments.map((comment) => (
            <div
              key={comment.id}
              className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors group"
            >
              <div className="flex justify-between items-start mb-2">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 bg-linear-to-r from-blue-500 to-cyan-500 rounded-full flex items-center justify-center text-white text-xs">
                    <FaUser />
                  </div>
                  <span className="font-medium text-gray-900">
                    {comment.user?.name || "Utilisateur"}
                  </span>
                  {comment.vhl && (
                    <Link
                      to={`/vhls/${comment.vhl.id}`}
                      className="flex items-center gap-1 text-sm text-blue-600 hover:text-blue-700"
                    >
                      <FaCar className="text-xs" />
                      {comment.vhl.matricule}
                    </Link>
                  )}
                </div>
                <span className="text-xs text-gray-500 flex items-center gap-1">
                  <FaCalendar className="text-gray-400" />
                  {formatDate(comment.created_at)}
                </span>
              </div>
              <p className="text-gray-700 text-sm line-clamp-2">
                {comment.comment}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default RecentComments;
