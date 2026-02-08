// components/vhl/VhlDetailsPro.tsx
import React from "react";
import { useVhlsPro } from "../../stores/useVhlProStore";
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
  FaCheckCircle,
} from "react-icons/fa";

interface VhlDetailsProProps {
  vhlId: string;
  onEdit: () => void;
  onBack: () => void;
}

const VhlDetailsPro: React.FC<VhlDetailsProProps> = ({ onEdit, onBack }) => {
  const { selectedVhl, loading } = useVhlsPro();

  if (loading || !selectedVhl) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
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
    <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
      {/* Header */}
      <div className="bg-linear-to-r from-blue-600 to-indigo-700 px-6 py-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="flex items-center gap-4">
            <button
              onClick={onBack}
              className="p-2 bg-white/20 text-white rounded-lg hover:bg-white/30 transition-colors"
              title="Retour"
            >
              <FaArrowLeft />
            </button>
            <div className="flex items-center gap-3">
              <div className="p-2 bg-white/20 rounded-lg">
                <FaCar className="text-white text-2xl" />
              </div>
              <div>
                <h1 className="text-2xl md:text-3xl font-bold text-white">
                  {selectedVhl.matricule}
                </h1>
                <p className="text-blue-100">
                  {selectedVhl.marque} •{" "}
                  {selectedVhl.type || "Type non spécifié"}
                </p>
              </div>
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
              selectedVhl.statut_nom,
            )}`}
          >
            <FaCogs className="mr-2" />
            <span className="font-semibold">
              {selectedVhl.statut_nom || "Statut non défini"}
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
                  <FaCar className="text-blue-600" />
                  Info véhicule
                </h3>
                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-gray-500">Matricule</p>
                    <p className="font-medium text-gray-900 text-lg">
                      {selectedVhl.matricule}
                    </p>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-500">Marque</p>
                      <p className="font-medium text-gray-900">
                        {selectedVhl.marque}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Type</p>
                      <p className="font-medium text-gray-900">
                        {selectedVhl.type || "-"}
                      </p>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-500">WW</p>
                      <p className="font-medium text-gray-900">
                        {selectedVhl.ww || "-"}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Châssis</p>
                      <p className="font-medium text-gray-900">
                        {selectedVhl.chassis || "-"}
                      </p>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-500">Puissance</p>
                      <p className="font-medium text-gray-900">
                        {selectedVhl.puissance || "-"}
                      </p>
                    </div>
                    {selectedVhl.date_mc && (
                      <div>
                        <p className="text-sm text-gray-500 flex items-center gap-1">
                          <FaCalendar />
                          Date MC
                        </p>
                        <p className="font-medium text-gray-900">
                          {new Date(selectedVhl.date_mc).toLocaleDateString()}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Affectation */}
              <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <FaBuilding className="text-blue-600" />
                  Affectation
                </h3>
                <div className="space-y-6">
                  {selectedVhl.agence_nom && (
                    <div>
                      <p className="text-sm text-gray-500">Agence</p>
                      <div className="flex items-center gap-2 mt-1">
                        <FaBuilding className="text-gray-400" />
                        <p className="font-medium text-gray-900">
                          {selectedVhl.agence_nom}
                        </p>
                      </div>
                    </div>
                  )}

                  {selectedVhl.categorie_nom && (
                    <div>
                      <p className="text-sm text-gray-500">Catégorie</p>
                      <div className="flex items-center gap-2 mt-1">
                        <FaTags className="text-gray-400" />
                        <p className="font-medium text-gray-900">
                          {selectedVhl.categorie_nom}
                        </p>
                      </div>
                    </div>
                  )}

                  {selectedVhl.service_nom && (
                    <div>
                      <p className="text-sm text-gray-500">Service</p>
                      <div className="flex items-center gap-2 mt-1">
                        <FaBriefcase className="text-gray-400" />
                        <p className="font-medium text-gray-900">
                          {selectedVhl.service_nom}
                        </p>
                      </div>
                    </div>
                  )}

                  {selectedVhl.utilisateur_nom && (
                    <div>
                      <p className="text-sm text-gray-500">Utilisateur</p>
                      <div className="flex items-center gap-2 mt-1">
                        <FaUser className="text-gray-400" />
                        <p className="font-medium text-gray-900">
                          {selectedVhl.utilisateur_nom}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Observation */}
              {selectedVhl.observation && (
                <div className="md:col-span-2 bg-yellow-50 rounded-lg p-6 border border-yellow-200">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <FaFileAlt className="text-yellow-600" />
                    Observation
                  </h3>
                  <p className="text-gray-700 whitespace-pre-wrap">
                    {selectedVhl.observation}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Informations système */}
          <div>
            <div className="bg-gray-50 rounded-lg p-6 border border-gray-200 sticky top-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <FaInfoCircle className="text-blue-600" />
                Info système
              </h3>

              <div className="space-y-4">
                <div>
                  <p className="text-sm text-gray-500">Identifiant</p>
                  <div className="flex items-center gap-2 mt-1">
                    <FaIdCard className="text-gray-400" />
                    <p className="font-medium text-gray-900 font-mono">
                      {selectedVhl.id}
                    </p>
                  </div>
                </div>

                <div>
                  <p className="text-sm text-gray-500">Créé le</p>
                  <p className="font-medium text-gray-900">
                    {selectedVhl.created_at
                      ? new Date(selectedVhl.created_at).toLocaleDateString(
                          "fr-FR",
                          {
                            day: "2-digit",
                            month: "long",
                            year: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                          },
                        )
                      : "-"}
                  </p>
                </div>

                <div>
                  <p className="text-sm text-gray-500">Dernière modification</p>
                  <p className="font-medium text-gray-900">
                    {selectedVhl.updated_at
                      ? new Date(selectedVhl.updated_at).toLocaleDateString(
                          "fr-FR",
                          {
                            day: "2-digit",
                            month: "long",
                            year: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                          },
                        )
                      : "-"}
                  </p>
                </div>

                {selectedVhl.deleted_at && (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                    <div className="flex items-center gap-2 text-red-800">
                      <FaHistory />
                      <span className="font-medium">Véhicule archivé</span>
                    </div>
                    <p className="text-sm text-red-600 mt-1">
                      Archivé le:{" "}
                      {new Date(selectedVhl.deleted_at).toLocaleDateString()}
                    </p>
                  </div>
                )}

                {/* Véhicule actif */}
                {!selectedVhl.deleted_at && (
                  <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-4">
                    <div className="flex items-center gap-2 text-emerald-800">
                      <FaCheckCircle />
                      <span className="font-medium">Véhicule actif</span>
                    </div>
                    <p className="text-sm text-emerald-600 mt-1">
                      Enregistré dans le système
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
                  <button className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium flex items-center justify-center gap-2">
                    <FaRoad />
                    Historique des missions
                  </button>
                  <button className="w-full px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors text-sm font-medium flex items-center justify-center gap-2">
                    <FaWrench />
                    Voir les maintenances
                  </button>
                  <button
                    onClick={onEdit}
                    className="w-full px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm font-medium flex items-center justify-center gap-2"
                  >
                    <FaEdit />
                    Modifier le véhicule
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-8 pt-6 border-t border-gray-200">
          <div className="flex justify-between items-center">
            <div className="text-sm text-gray-500">
              Dernière mise à jour:{" "}
              {selectedVhl.updated_at
                ? new Date(selectedVhl.updated_at).toLocaleDateString()
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
  );
};

export default VhlDetailsPro;
