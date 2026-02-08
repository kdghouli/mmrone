// components/utilisateur/UtilisateurList.tsx
import React, { useState } from "react";
import { useUtilisateurs } from "../../stores/useUtilisateurStore";
import {
  FaUser,
  FaBuilding,
  FaBriefcase,
  FaPhone,
  FaEnvelope,
  FaFilter,
  FaEye,
  FaEdit,
  FaTrash,
} from "react-icons/fa";

interface UtilisateurListProps {
  onEdit: (id: string) => void;
  onViewDetails: (id: string) => void;
}

const UtilisateurList: React.FC<UtilisateurListProps> = ({
  onEdit,
  onViewDetails,
}) => {
  const {
    utilisateurs,
    deleteUtilisateur,
    searchUtilisateurs,
    services,
    agences,
  } = useUtilisateurs();
  const [searchTerm, setSearchTerm] = useState("");
  const [filterService, setFilterService] = useState<string>("all");
  const [filterAgence, setFilterAgence] = useState<string>("all");
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);

  let filteredUtilisateurs = searchUtilisateurs(searchTerm);

  if (filterService !== "all") {
    filteredUtilisateurs = filteredUtilisateurs.filter(
      (utilisateur) => utilisateur.service_id === filterService,
    );
  }

  if (filterAgence !== "all") {
    filteredUtilisateurs = filteredUtilisateurs.filter(
      (utilisateur) => utilisateur.agence_id === filterAgence,
    );
  }

  const handleDelete = async (id: string) => {
    const success = await deleteUtilisateur(id);
    if (success) {
      setConfirmDelete(null);
    }
  };

  const stats = {
    total: utilisateurs.length,
    withService: utilisateurs.filter((u) => u.service_id).length,
    withAgence: utilisateurs.filter((u) => u.agence_id).length,
  };

  return (
    <div className="p-6">
      {/* Barre de recherche et filtres */}
      <div className="mb-6 space-y-4">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
          <div className="lg:col-span-2">
            <div className="relative">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Rechercher par nom, poste, email..."
              />
              <FaFilter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            </div>
          </div>

          <div>
            <select
              value={filterService}
              onChange={(e) => setFilterService(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="all">Tous les services</option>
              {services.map((service) => (
                <option key={service.id} value={service.id}>
                  {service.nom}
                </option>
              ))}
            </select>
          </div>

          <div>
            <select
              value={filterAgence}
              onChange={(e) => setFilterAgence(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="all">Toutes les agences</option>
              {agences.map((agence) => (
                <option key={agence.id} value={agence.id}>
                  {agence.nom}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg mr-3">
              <FaUser className="text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-blue-600">Total utilisateurs</p>
              <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
            </div>
          </div>
        </div>

        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-lg mr-3">
              <FaBriefcase className="text-green-600" />
            </div>
            <div>
              <p className="text-sm text-green-600">Avec service</p>
              <p className="text-2xl font-bold text-gray-900">
                {stats.withService}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
          <div className="flex items-center">
            <div className="p-2 bg-purple-100 rounded-lg mr-3">
              <FaBuilding className="text-purple-600" />
            </div>
            <div>
              <p className="text-sm text-purple-600">Avec agence</p>
              <p className="text-2xl font-bold text-gray-900">
                {stats.withAgence}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Tableau */}
      <div className="overflow-x-auto rounded-lg border border-gray-200">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Utilisateur
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Poste
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Service / Agence
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Contact
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredUtilisateurs.map((utilisateur) => (
              <tr
                key={utilisateur.id}
                className="hover:bg-gray-50 transition-colors"
              >
                <td className="px-6 py-4">
                  <div className="flex items-center">
                    <div className="shrink-0 h-10 w-10 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full flex items-center justify-center text-white font-bold">
                      {utilisateur.nom.charAt(0)}
                    </div>
                    <div className="ml-4">
                      <div className="text-sm font-medium text-gray-900">
                        {utilisateur.nom}
                      </div>
                      <div className="text-sm text-gray-500">
                        ID: {utilisateur.id}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="text-sm text-gray-900 font-medium">
                    {utilisateur.poste}
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="space-y-1">
                    {utilisateur.service_nom && (
                      <div className="flex items-center text-sm">
                        <FaBriefcase className="text-gray-400 mr-2" />
                        <span className="text-gray-700">
                          {utilisateur.service_nom}
                        </span>
                      </div>
                    )}
                    {utilisateur.agence_nom && (
                      <div className="flex items-center text-sm">
                        <FaBuilding className="text-gray-400 mr-2" />
                        <span className="text-gray-700">
                          {utilisateur.agence_nom}
                        </span>
                      </div>
                    )}
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="space-y-1">
                    <div className="flex items-center text-sm">
                      <FaEnvelope className="text-gray-400 mr-2" />
                      <a
                        href={`mailto:${utilisateur.mail}`}
                        className="text-blue-600 hover:text-blue-800"
                      >
                        {utilisateur.mail}
                      </a>
                    </div>
                    {utilisateur.tel && (
                      <div className="flex items-center text-sm">
                        <FaPhone className="text-gray-400 mr-2" />
                        <a
                          href={`tel:${utilisateur.tel}`}
                          className="text-gray-700"
                        >
                          {utilisateur.tel}
                        </a>
                      </div>
                    )}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <div className="flex space-x-3">
                    <button
                      onClick={() => onViewDetails(utilisateur.id)}
                      className="text-blue-600 hover:text-blue-900 p-1 hover:bg-blue-50 rounded"
                      title="Voir détails"
                    >
                      <FaEye />
                    </button>
                    <button
                      onClick={() => onEdit(utilisateur.id)}
                      className="text-green-600 hover:text-green-900 p-1 hover:bg-green-50 rounded"
                      title="Modifier"
                    >
                      <FaEdit />
                    </button>
                    <button
                      onClick={() => setConfirmDelete(utilisateur.id)}
                      className="text-red-600 hover:text-red-900 p-1 hover:bg-red-50 rounded"
                      title="Supprimer"
                    >
                      <FaTrash />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {filteredUtilisateurs.length === 0 && (
          <div className="text-center py-12">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 mb-4">
              <FaUser className="text-2xl text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Aucun utilisateur trouvé
            </h3>
            <p className="text-gray-500">
              {searchTerm || filterService !== "all" || filterAgence !== "all"
                ? "Aucun utilisateur ne correspond à vos critères."
                : "Commencez par créer un nouvel utilisateur."}
            </p>
          </div>
        )}
      </div>

      {/* Modal de confirmation de suppression */}
      {confirmDelete && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 max-w-sm w-full">
            <div className="flex items-center justify-center w-12 h-12 mx-auto bg-red-100 rounded-full mb-4">
              <FaTrash className="h-6 w-6 text-red-600" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 text-center mb-2">
              Confirmer la suppression
            </h3>
            <p className="text-sm text-gray-500 text-center mb-6">
              Êtes-vous sûr de vouloir supprimer cet utilisateur ? Cette action
              est irréversible.
            </p>
            <div className="flex justify-center space-x-4">
              <button
                onClick={() => setConfirmDelete(null)}
                className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                Annuler
              </button>
              <button
                onClick={() => handleDelete(confirmDelete)}
                className="px-4 py-2 bg-red-600 text-white font-medium rounded-md hover:bg-red-700"
              >
                Supprimer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UtilisateurList;
