// components/utilisateur/UtilisateurDetails.tsx
import React from "react";
import { useUtilisateur } from "../../stores/useUtilisateurStore";
import {
  FaUser,
  FaBriefcase,
  FaBuilding,
  FaPhone,
  FaEnvelope,
  FaCalendar,
  FaEdit,
  FaPrint,
} from "react-icons/fa";

interface UtilisateurDetailsProps {
  utilisateurId: string;
  onEdit: () => void;
  onBack: () => void;
}

const UtilisateurDetails: React.FC<UtilisateurDetailsProps> = ({
  utilisateurId,
  onEdit,
  onBack,
}) => {
  const { utilisateur, loading } = useUtilisateur(utilisateurId);

  if (loading) {
    return (
      <div className="p-6">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
        </div>
      </div>
    );
  }

  if (!utilisateur) {
    return (
      <div className="p-6">
        <div className="text-center py-12">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-red-100 mb-4">
            <FaUser className="text-2xl text-red-600" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Utilisateur non trouvé
          </h3>
          <button
            onClick={onBack}
            className="px-4 py-2 bg-gray-100 text-gray-800 rounded-lg hover:bg-gray-200"
          >
            Retour à la liste
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-start mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">
            Détails de l'utilisateur
          </h2>
          <p className="mt-1 text-gray-600">
            Informations complètes sur {utilisateur.nom}
          </p>
        </div>
        <div className="flex space-x-3">
          <button
            onClick={onBack}
            className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            Retour
          </button>
          <button
            onClick={onEdit}
            className="px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-medium rounded-lg hover:from-blue-700 hover:to-indigo-700"
          >
            Modifier
          </button>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 px-6 py-6 border-b border-gray-200">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="h-16 w-16 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full flex items-center justify-center text-white text-2xl font-bold">
                {utilisateur.nom.charAt(0)}
              </div>
            </div>
            <div className="ml-6">
              <h3 className="text-2xl font-bold text-gray-900">
                {utilisateur.nom}
              </h3>
              <p className="text-gray-600">ID: {utilisateur.id}</p>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Informations principales */}
            <div>
              <h4 className="text-lg font-semibold text-gray-900 mb-4 pb-2 border-b border-gray-200">
                Informations personnelles
              </h4>
              <div className="space-y-4">
                <div>
                  <div className="flex items-center mb-1">
                    <FaBriefcase className="text-gray-400 mr-2" />
                    <span className="text-sm font-medium text-gray-500">
                      Poste
                    </span>
                  </div>
                  <p className="text-lg font-medium text-gray-900">
                    {utilisateur.poste}
                  </p>
                </div>

                <div>
                  <div className="flex items-center mb-1">
                    <FaEnvelope className="text-gray-400 mr-2" />
                    <span className="text-sm font-medium text-gray-500">
                      Email
                    </span>
                  </div>
                  <a
                    href={`mailto:${utilisateur.mail}`}
                    className="text-lg font-medium text-blue-600 hover:text-blue-800"
                  >
                    {utilisateur.mail}
                  </a>
                </div>

                {utilisateur.tel && (
                  <div>
                    <div className="flex items-center mb-1">
                      <FaPhone className="text-gray-400 mr-2" />
                      <span className="text-sm font-medium text-gray-500">
                        Téléphone
                      </span>
                    </div>
                    <a
                      href={`tel:${utilisateur.tel}`}
                      className="text-lg font-medium text-gray-900"
                    >
                      {utilisateur.tel}
                    </a>
                  </div>
                )}
              </div>
            </div>

            {/* Informations professionnelles */}
            <div>
              <h4 className="text-lg font-semibold text-gray-900 mb-4 pb-2 border-b border-gray-200">
                Informations professionnelles
              </h4>
              <div className="space-y-4">
                {utilisateur.service_nom && (
                  <div>
                    <div className="flex items-center mb-1">
                      <FaBriefcase className="text-gray-400 mr-2" />
                      <span className="text-sm font-medium text-gray-500">
                        Service
                      </span>
                    </div>
                    <div className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                      {utilisateur.service_nom}
                    </div>
                  </div>
                )}

                {utilisateur.agence_nom && (
                  <div>
                    <div className="flex items-center mb-1">
                      <FaBuilding className="text-gray-400 mr-2" />
                      <span className="text-sm font-medium text-gray-500">
                        Agence
                      </span>
                    </div>
                    <div className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                      {utilisateur.agence_nom}
                    </div>
                  </div>
                )}

                {utilisateur.created_at && (
                  <div>
                    <div className="flex items-center mb-1">
                      <FaCalendar className="text-gray-400 mr-2" />
                      <span className="text-sm font-medium text-gray-500">
                        Date de création
                      </span>
                    </div>
                    <p className="text-gray-900">
                      {new Date(utilisateur.created_at).toLocaleDateString(
                        "fr-FR",
                        {
                          weekday: "long",
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        },
                      )}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="mt-8 pt-6 border-t border-gray-200">
            <div className="flex justify-between">
              <button
                onClick={onBack}
                className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                Retour à la liste
              </button>
              <div className="flex space-x-3">
                <button
                  onClick={() => window.print()}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 flex items-center"
                >
                  <FaPrint className="mr-2" />
                  Imprimer
                </button>
                <button
                  onClick={onEdit}
                  className="px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-medium rounded-lg hover:from-blue-700 hover:to-indigo-700 flex items-center"
                >
                  <FaEdit className="mr-2" />
                  Modifier
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UtilisateurDetails;
