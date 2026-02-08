// components/vhl/VhlDetails.tsx
import React from "react";
import CommentSection from "../comments/CommentSection";
import { useVhl } from "../../stores/useVhlStore";
import {
  FaCar,
  FaCalendar,
  FaWrench,
  FaBuilding,
  FaTags,
  FaUser,
  FaBriefcase,
  FaFileAlt,
  FaIdCard,
  FaCogs,
  FaPrint,
  FaEdit,
  FaArrowLeft,
  FaHistory,
  FaInfoCircle,
  FaRoad,
} from "react-icons/fa";

interface VhlDetailsProps {
  vhlId: string;
  onEdit: () => void;
  onBack: () => void;
}

const VhlDetails: React.FC<VhlDetailsProps> = ({ vhlId, onEdit, onBack }) => {
  const { vhl, loading } = useVhl(vhlId);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!vhl) {
    return (
      <div className="text-center py-12">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-red-100 mb-4">
          <FaCar className="text-2xl text-red-600" />
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          Véhicule non trouvé
        </h3>
        <button
          onClick={onBack}
          className="px-4 py-2 bg-gray-100 text-gray-800 rounded-lg hover:bg-gray-200"
        >
          Retour à la liste
        </button>
      </div>
    );
  }

  const getStatutColor = (statut?: string) => {
    switch (statut?.toLowerCase()) {
      case "disponible":
        return "bg-emerald-100 text-emerald-800 border-emerald-200";
      case "en mission":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "maintenance":
        return "bg-amber-100 text-amber-800 border-amber-200";
      case "panne":
        return "bg-red-100 text-red-800 border-red-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  return (
    <div className="max-w-7xl mx-auto">
      <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-700 px-6 py-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div className="flex items-center gap-4">
              <button
                onClick={onBack}
                className="p-2 bg-white/20 text-white rounded-lg hover:bg-white/30 transition-colors"
                title="Retour"
              >
                <FaArrowLeft />
              </button>
              <div>
                <h1 className="text-2xl md:text-3xl font-bold text-white">
                  {vhl.matricule}
                </h1>
                <p className="text-blue-100">
                  {vhl.marque} • {vhl.type || "Type non spécifié"}
                </p>
              </div>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => window.print()}
                className="px-4 py-2 bg-white/20 text-white rounded-lg hover:bg-white/30 transition-colors flex items-center gap-2"
              >
                <FaPrint />
                Imprimer
              </button>
              <button
                onClick={onEdit}
                className="px-6 py-2 bg-white text-blue-700 font-medium rounded-lg hover:bg-blue-50 transition-colors flex items-center gap-2"
              >
                <FaEdit />
                Modifier
              </button>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Statut Badge */}
          <div className="mb-6">
            <span
              className={`inline-flex items-center px-4 py-2 rounded-lg border ${getStatutColor(
                vhl.statut_nom
              )}`}
            >
              <FaCogs className="mr-2" />
              <span className="font-semibold">
                {vhl.statut_nom || "Statut non défini"}
              </span>
            </span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Informations principales */}
            <div className="lg:col-span-2">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Informations véhicule */}
                <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <FaCar />
                    Informations du véhicule
                  </h3>
                  <div className="space-y-4">
                    <div>
                      <p className="text-sm text-gray-500">Matricule</p>
                      <p className="font-medium text-gray-900 text-lg">
                        {vhl.matricule}
                      </p>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-gray-500">Marque</p>
                        <p className="font-medium text-gray-900">
                          {vhl.marque}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Type</p>
                        <p className="font-medium text-gray-900">
                          {vhl.type || "-"}
                        </p>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-gray-500">WW</p>
                        <p className="font-medium text-gray-900">
                          {vhl.ww || "-"}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Châssis</p>
                        <p className="font-medium text-gray-900">
                          {vhl.chassis || "-"}
                        </p>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-gray-500">Puissance</p>
                        <p className="font-medium text-gray-900">
                          {vhl.puissance || "-"}
                        </p>
                      </div>
                      {vhl.date_mc && (
                        <div>
                          <p className="text-sm text-gray-500 flex items-center gap-1">
                            <FaCalendar />
                            Date MC
                          </p>
                          <p className="font-medium text-gray-900">
                            {new Date(vhl.date_mc).toLocaleDateString()}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Affectation */}
                <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <FaBuilding />
                    Affectation
                  </h3>
                  <div className="space-y-6">
                    {vhl.agence_nom && (
                      <div>
                        <p className="text-sm text-gray-500">Agence</p>
                        <div className="flex items-center gap-2 mt-1">
                          <FaBuilding className="text-gray-400" />
                          <p className="font-medium text-gray-900">
                            {vhl.agence_nom}
                          </p>
                        </div>
                      </div>
                    )}

                    {vhl.categorie_nom && (
                      <div>
                        <p className="text-sm text-gray-500">Catégorie</p>
                        <div className="flex items-center gap-2 mt-1">
                          <FaTags className="text-gray-400" />
                          <p className="font-medium text-gray-900">
                            {vhl.categorie_nom}
                          </p>
                        </div>
                      </div>
                    )}

                    {vhl.service_nom && (
                      <div>
                        <p className="text-sm text-gray-500">Service</p>
                        <div className="flex items-center gap-2 mt-1">
                          <FaBriefcase className="text-gray-400" />
                          <p className="font-medium text-gray-900">
                            {vhl.service_nom}
                          </p>
                        </div>
                      </div>
                    )}

                    {vhl.utilisateur_nom && (
                      <div>
                        <p className="text-sm text-gray-500">Utilisateur</p>
                        <div className="flex items-center gap-2 mt-1">
                          <FaUser className="text-gray-400" />
                          <p className="font-medium text-gray-900">
                            {vhl.utilisateur_nom}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Observation */}
                {vhl.observation && (
                  <div className="md:col-span-2 bg-yellow-50 rounded-lg p-6 border border-yellow-200">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                      <FaFileAlt />
                      Observation
                    </h3>
                    <p className="text-gray-700 whitespace-pre-wrap">
                      {vhl.observation}
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Informations système */}
            <div>
              <div className="bg-gray-50 rounded-lg p-6 border border-gray-200 sticky top-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <FaInfoCircle />
                  Informations système
                </h3>

                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-gray-500">Identifiant</p>
                    <div className="flex items-center gap-2 mt-1">
                      <FaIdCard className="text-gray-400" />
                      <p className="font-medium text-gray-900 font-mono">
                        {vhl.id}
                      </p>
                    </div>
                  </div>

                  <div>
                    <p className="text-sm text-gray-500">Créé le</p>
                    <p className="font-medium text-gray-900">
                      {vhl.created_at
                        ? new Date(vhl.created_at).toLocaleDateString("fr-FR", {
                            day: "2-digit",
                            month: "long",
                            year: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                          })
                        : "-"}
                    </p>
                  </div>

                  <div>
                    <p className="text-sm text-gray-500">
                      Dernière modification
                    </p>
                    <p className="font-medium text-gray-900">
                      {vhl.updated_at
                        ? new Date(vhl.updated_at).toLocaleDateString("fr-FR", {
                            day: "2-digit",
                            month: "long",
                            year: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                          })
                        : "-"}
                    </p>
                  </div>

                  {vhl.deleted_at && (
                    <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                      <div className="flex items-center gap-2 text-red-800">
                        <FaHistory />
                        <span className="font-medium">Véhicule archivé</span>
                      </div>
                      <p className="text-sm text-red-600 mt-1">
                        Archivé le:{" "}
                        {new Date(vhl.deleted_at).toLocaleDateString()}
                      </p>
                    </div>
                  )}
                </div>

                {/* Quick Actions */}
                <div className="mt-8 pt-6 border-t border-gray-300">
                  <h4 className="text-sm font-medium text-gray-700 mb-3">
                    Actions rapides
                  </h4>
                  <div className="space-y-2">
                    <button className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium">
                      <FaRoad className="inline mr-2" />
                      Historique des missions
                    </button>
                    <button className="w-full px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors text-sm font-medium">
                      <FaWrench className="inline mr-2" />
                      Voir les maintenances
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="mt-8">
            <CommentSection vhlId={vhl.id} vhlMatricule={vhl.matricule} />
          </div>

          {/* Footer */}
          <div className="mt-8 pt-6 border-t border-gray-200">
            <div className="flex justify-between items-center">
              <div className="text-sm text-gray-500">
                Dernière mise à jour:{" "}
                {vhl.updated_at
                  ? new Date(vhl.updated_at).toLocaleDateString()
                  : "-"}
              </div>
              <div className="flex gap-3">
                <button
                  onClick={onBack}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Retour à la liste
                </button>
                <button
                  onClick={onEdit}
                  className="px-6 py-2 bg-linear-to-r from-blue-600 to-indigo-600 text-white font-medium rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-colors"
                >
                  Modifier le véhicule
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VhlDetails;
