// pages/CommentsManager.tsx
import { useState } from "react";
import { FaComments, FaSearch, FaFilter } from "react-icons/fa";
import RecentComments from "./RecentComments";
import { useComments } from "../../stores/useCommentsStore";

const CommentsManager = () => {
  const [filter, setFilter] = useState("all"); // all, urgent, resolved, etc.
  const [search, setSearch] = useState("");
  const { comments} = useComments();

  // Données simulées - à remplacer par votre store

  return (
    <div className="min-h-screen bg-linear-to-br from-gray-50 to-blue-100">
      {/* Header */}
      <div className="bg-linear-to-r from-gray-900 to-gray-800 text-white">
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-white/20 rounded-xl">
              <FaComments className="text-3xl" />
            </div>
            <div>
              <h1 className="text-3xl md:text-4xl font-bold">
                Gestion des Commentaires
              </h1>
              <p className="text-gray-300">
                Gérez tous les commentaires de votre flotte
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6 sticky top-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Filtres</h3>

              {/* Search */}
              <div className="mb-6">
                <div className="relative">
                  <input
                    type="text"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Rechercher..."
                  />
                  <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                </div>
              </div>

              {/* Filter by status */}
              <div className="mb-6">
                <h4 className="text-sm font-medium text-gray-700 mb-3 flex items-center gap-2">
                  <FaFilter />
                  Par statut
                </h4>
                <div className="space-y-2">
                  {["Tous", "Urgent", "Important", "Info", "Résolu"].map(
                    (status) => (
                      <button
                        key={status}
                        onClick={() => setFilter(status.toLowerCase())}
                        className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                          filter === status.toLowerCase()
                            ? "bg-blue-100 text-blue-700"
                            : "text-gray-600 hover:bg-gray-100"
                        }`}
                      >
                        {status}
                      </button>
                    ),
                  )}
                </div>
              </div>

              {/* Stats */}
              <div className="pt-6 border-t border-gray-200">
                <h4 className="text-sm font-medium text-gray-700 mb-3">
                  Statistiques
                </h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Total commentaires</span>
                    <span className="font-medium">{comments.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">En attente</span>
                    <span className="font-medium text-amber-600">
                      {
                        comments.filter((comment) => comment.statut_id != "1")
                          .length
                      }
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Résolus</span>
                    <span className="font-medium text-green-600">
                      {
                        comments.filter((comment) => comment.statut_id == "1")
                          .length
                      }
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
              <div className="text-center py-4">
                <RecentComments />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CommentsManager;
