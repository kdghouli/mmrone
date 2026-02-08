// components/vhl/VhlDashboard.tsx
import React from "react";
import { useVhls } from "../../stores/useVhlStore";

import {
  FaCar,
  FaBuilding,
  FaTags,
  FaCheckCircle,
  FaChartBar,
  FaExclamationTriangle,
  FaArrowRight,
} from "react-icons/fa";
import { Link } from "react-router-dom";

interface VhlDashboardProps {
  onViewList: () => void;
}

const VhlDashboard: React.FC<VhlDashboardProps> = ({ onViewList }) => {
  const { dashboardStats, vhls, agences, categories } = useVhls();

  // Derniers véhicules ajoutés
  const recentVhls = [...vhls]
    .sort(
      (a, b) =>
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    )
    .slice(0, 5);

  // Véhicules nécessitant attention
  const attentionVhls = vhls
    .filter(
      (vhl) =>
        !vhl.statut_id ||
        vhl.statut_nom?.toLowerCase().includes("maintenance") ||
        vhl.statut_nom?.toLowerCase().includes("panne")
    )
    .slice(0, 3);

  // Statistiques par statut avec couleurs
  const getStatutColor = (statut: string) => {
    switch (statut.toLowerCase()) {
      case "disponible":
        return "bg-emerald-500";
      case "en mission":
        return "bg-blue-500";
      case "maintenance":
        return "bg-amber-500";
      case "panne":
        return "bg-red-500";
      default:
        return "bg-gray-500";
    }
  };

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Total Véhicules */}
        <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-200 hover:shadow-xl transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">
                Total Véhicules
              </p>
              <p className="text-3xl font-bold text-gray-900 mt-2">
                {dashboardStats.total}
              </p>
              <p className="text-sm text-gray-500 mt-1">
                Tous statuts confondus
              </p>
            </div>
            <div className="p-3 bg-linear-to-r from-blue-500 to-cyan-500 rounded-lg text-white">
              <FaCar className="text-2xl" />
            </div>
          </div>
        </div>

        {/* Agences */}
        <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-200 hover:shadow-xl transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Agences</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">
                {agences.length}
              </p>
              <p className="text-sm text-gray-500 mt-1">
                Répartition des véhicules
              </p>
            </div>
            <div className="p-3 bg-linear-to-r from-purple-500 to-pink-500 rounded-lg text-white">
              <FaBuilding className="text-2xl" />
            </div>
          </div>
        </div>

        {/* Catégories */}
        <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-200 hover:shadow-xl transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Catégories</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">
                {categories.length}
              </p>
              <p className="text-sm text-gray-500 mt-1">Types de véhicules</p>
            </div>
            <div className="p-3 bg-gradient-to-r from-green-500 to-emerald-500 rounded-lg text-white">
              <FaTags className="text-2xl" />
            </div>
          </div>
        </div>

        {/* Statuts */}
        <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-200 hover:shadow-xl transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">
                Statuts actifs
              </p>
              <p className="text-3xl font-bold text-gray-900 mt-2">
                {Object.keys(dashboardStats.byStatut).length}
              </p>
              <p className="text-sm text-gray-500 mt-1">
                Répartition des statuts
              </p>
            </div>
            <div className="p-3 bg-gradient-to-r from-amber-500 to-orange-500 rounded-lg text-white">
              <FaChartBar className="text-2xl" />
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Distribution par Statut */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-gray-900">
                Distribution par Statut
              </h3>
              <button
                onClick={onViewList}
                className="text-sm text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1"
              >
                Voir tous <FaArrowRight />
              </button>
            </div>
            <div className="space-y-4">
              {Object.entries(dashboardStats.byStatut).map(
                ([statut, count]) => {
                  const percentage =
                    dashboardStats.total > 0
                      ? (count / dashboardStats.total) * 100
                      : 0;
                  return (
                    <div key={statut} className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <div className="flex items-center gap-2">
                          <div
                            className={`w-3 h-3 rounded-full ${getStatutColor(
                              statut
                            )}`}
                          ></div>
                          <span className="font-medium text-gray-700">
                            {statut}
                          </span>
                        </div>
                        <span className="font-bold text-gray-900">
                          {count} véhicules
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className={`h-2 rounded-full ${getStatutColor(
                            statut
                          )} transition-all duration-1000`}
                          style={{ width: `${percentage}%` }}
                        ></div>
                      </div>
                      <div className="text-xs text-gray-500 flex justify-between">
                        <span>{percentage.toFixed(1)}% de la flotte</span>
                        <span>
                          {count} / {dashboardStats.total}
                        </span>
                      </div>
                    </div>
                  );
                }
              )}
            </div>
          </div>
        </div>

        {/* Véhicules nécessitant attention */}
        <div>
          <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
            <div className="flex items-center gap-2 mb-6">
              <div className="p-2 bg-red-100 rounded-lg">
                <FaExclamationTriangle className="text-red-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900">
                Nécessite attention
              </h3>
            </div>
            <div className="space-y-4">
              {attentionVhls.length > 0 ? (
                attentionVhls.map((vhl) => (
                  <div
                    key={vhl.id}
                    className="p-4 bg-red-50 border border-red-200 rounded-lg hover:bg-red-100 transition-colors"
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-medium text-gray-900">
                          {vhl.matricule}
                        </p>
                        <p className="text-sm text-gray-600">
                          {vhl.marque} • {vhl.type}
                        </p>
                      </div>
                      <span className="px-2 py-1 bg-red-100 text-red-800 text-xs font-medium rounded">
                        {vhl.statut_nom || "Problème"}
                      </span>
                    </div>
                    <p className="text-sm text-gray-500 mt-2">
                      {vhl.observation || "Aucune observation"}
                    </p>
                  </div>
                ))
              ) : (
                <div className="text-center py-8">
                  <FaCheckCircle className="text-4xl text-green-400 mx-auto mb-3" />
                  <p className="text-gray-600">
                    Aucun véhicule nécessite attention
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Derniers véhicules ajoutés et répartition par agence */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Derniers véhicules */}
        <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-bold text-gray-900">
              Derniers véhicules ajoutés
            </h3>
            <button
              onClick={onViewList}
              className="text-sm text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1"
            >
              Voir tous <FaArrowRight />
            </button>
          </div>
          <div className="space-y-4">
            {recentVhls.map((vhl) => (
              <div
                key={vhl.id}
                className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg transition-colors group"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-100 rounded-lg group-hover:bg-blue-200 transition-colors">
                    <FaCar className="text-blue-600" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{vhl.matricule}</p>
                    <p className="text-sm text-gray-500">
                      {vhl.marque} • {vhl.type}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-sm font-medium text-gray-900">
                    {vhl.agence_nom || "Non affecté"}
                  </span>
                  <p className="text-xs text-gray-500">
                    {new Date(vhl.created_at).toLocaleDateString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Répartition par Agence */}
        <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
          <h3 className="text-xl font-bold text-gray-900 mb-6">
            Répartition par Agence
          </h3>
          <div className="space-y-4">
            {Object.entries(dashboardStats.byAgence).map(([agence, count]) => {
              const percentage =
                dashboardStats.total > 0
                  ? (count / dashboardStats.total) * 100
                  : 0;
              return (
                <div key={agence} className="space-y-2">
                  <div className="flex justify-between">
                    <span className="font-medium text-gray-700">{agence}</span>
                    <span className="font-bold text-gray-900">{count}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="h-2 rounded-full bg-linear-to-r from-purple-500 to-pink-500 transition-all duration-1000"
                      style={{ width: `${percentage}%` }}
                    ></div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-linear-to-r from-blue-600 to-indigo-700 rounded-xl p-6 text-white">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          <div>
            <h3 className="text-xl font-bold mb-2">
              Gérez votre flotte efficacement
            </h3>
            <p className="text-blue-100">
              Ajoutez de nouveaux véhicules, suivez les maintenances et
              optimisez votre parc
            </p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={onViewList}
              className="px-6 py-3 bg-white text-blue-700 font-medium rounded-lg hover:bg-blue-50 transition-all duration-300"
            >
              Voir tous les véhicules
            </button>
            <Link
              to="/create"
              className="px-6 py-3 bg-transparent border-2 border-white text-white font-medium rounded-lg hover:bg-white/10 transition-all duration-300"
            >
              Ajouter un véhicule
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VhlDashboard;
