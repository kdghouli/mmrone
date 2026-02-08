// components/vhl/VhlList.tsx
import React, { useState } from "react";
import { useVhls } from "../../stores/useVhlStore";
import {
  FaCar,
  FaSearch,
  FaEye,
  FaEdit,
  FaTrash,
  FaCalendar,
  FaDownload,
} from "react-icons/fa";
import CategoryIcon from "../CategoryIcon";


interface VhlListProps {
  onEdit: (id: string) => void;
  onViewDetails: (id: string) => void;
}

const VhlList: React.FC<VhlListProps> = ({ onEdit, onViewDetails }) => {
  const { softDeleteVhl, searchVhls, agences, categories, statuts } = useVhls();
  const [searchTerm, setSearchTerm] = useState("");
  const [filterAgence, setFilterAgence] = useState<string>("all");
  const [filterCategorie, setFilterCategorie] = useState<string>("all");
  const [filterStatut, setFilterStatut] = useState<string>("all");
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);

  let filteredVhls = searchVhls(searchTerm);

  if (filterAgence !== "all") {
    filteredVhls = filteredVhls.filter((vhl) => vhl.agence_id === filterAgence);
  }

  if (filterCategorie !== "all") {
    filteredVhls = filteredVhls.filter(
      (vhl) => vhl.categorie_id === filterCategorie
    );
  }

  if (filterStatut !== "all") {
    filteredVhls = filteredVhls.filter((vhl) => vhl.statut_id === filterStatut);
  }

  const handleDelete = async (id: string) => {
    const success = await softDeleteVhl(id);
    if (success) {
      setConfirmDelete(null);
    }
  };

  const getStatutColor = (statut?: string) => {
    switch (statut?.toLowerCase()) {
      case "disponible":
        return "bg-emerald-100 text-emerald-800";
      case "en mission":
        return "bg-blue-100 text-blue-800";
      case "maintenance":
        return "bg-amber-100 text-amber-800";
      case "panne":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
      {/* Toolbar */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex flex-col lg:flex-row justify-between gap-4">
          <div className="lg:w-1/3">
            <div className="relative">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Rechercher par matricule, marque..."
              />
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            </div>
          </div>

          <div className="flex flex-wrap gap-3">
            <select
              value={filterAgence}
              onChange={(e) => setFilterAgence(e.target.value)}
              className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="all">Toutes les agences</option>
              {agences.map((agence) => (
                <option key={agence.id} value={agence.id}>
                  {agence.nom}
                </option>
              ))}
            </select>

            <select
              value={filterCategorie}
              onChange={(e) => setFilterCategorie(e.target.value)}
              className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="all">Toutes les catégories</option>
              {categories.map((categorie) => (
                <option key={categorie.id} value={categorie.id}>
                  {categorie.nom}
                </option>
              ))}
            </select>

            <select
              value={filterStatut}
              onChange={(e) => setFilterStatut(e.target.value)}
              className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="all">Tous les statuts</option>
              {statuts.map((statut) => (
                <option key={statut.id} value={statut.id}>
                  {statut.nom}
                </option>
              ))}
            </select>

            <button className="px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center gap-2">
              <FaDownload />
              Exporter
            </button>
          </div>
        </div>

        <div className="mt-4 text-sm text-gray-600">
          {filteredVhls.length} véhicule{filteredVhls.length !== 1 ? "s" : ""}{" "}
          trouvé{filteredVhls.length !== 1 ? "s" : ""}
          {searchTerm && ` pour "${searchTerm}"`}
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Véhicule
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Informations
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Affectation
              </th>
              <th className="px 6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Statut
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredVhls.map((vhl) => (
              <tr key={vhl.id} className="hover:bg-gray-50 transition-colors">
                {/* Véhicule */}
                <td className="px-4 py-3">
                  <div
                    className="flex items-center"
                    onClick={() => onViewDetails(vhl.id)}
                  >
                    <CategoryIcon
                      categoryName={vhl.categorie_nom}
                      size={20}
                      withBackground
                      className="h-10 w-10 rounded-lg mx-1"
                    />
                    <div className="ml-4">
                      <div className="text-lg font-bold text-gray-900">
                        {vhl.matricule}
                      </div>
                      <div className="text-sm text-gray-500">{vhl.marque}</div>
                    </div>
                  </div>
                </td>

                {/* Informations */}
                <td className="px-4 py-3">
                  <div className="space-y-1">
                    <div className="text-sm">
                      <span className="font-medium">Type:</span>
                      {"  "}
                      {vhl.type || " - "}
                    </div>
                    <div className="text-sm">
                      <span className="font-medium">Châssis:</span>
                      {"  "}
                      {vhl.chassis || " - "}
                    </div>
                    <div className="text-sm">
                      <span className="font-medium ">Intitule:</span>

                      <span className="font-bold">
                        {"  "}
                        {vhl.intitule_nom || " - "}
                      </span>
                    </div>

                    {vhl.date_mc && (
                      <div className="text-sm flex items-center gap-1">
                        <FaCalendar className="text-gray-400" />
                        MC: {new Date(vhl.date_mc).toLocaleDateString()}
                      </div>
                    )}
                  </div>
                </td>

                {/* Dans la colonne Affectation */}
                <td className="px-4 py-3">
                  <div className="space-y-2">
                    <div>
                      <span className="text-sm">
                        {vhl.agence_nom || `(ID: ${vhl.agence_id || "vide"})`}
                      </span>
                    </div>
                    <div>
                      <span className="text-sm">
                        {vhl.utilisateur_nom ||
                          `(ID: ${vhl.utilisateur_nom || "vide"})`}
                      </span>
                    </div>
                  </div>
                </td>

                {/* Statut */}
                <td className="px-4 py-3">
                  <span
                    className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${getStatutColor(
                      vhl.statut_nom
                    )}`}
                  >
                    {vhl.statut_nom || "Non défini"}
                  </span>
                </td>

                {/* Actions */}
                <td className="px-4 py-3 whitespace-nowrap">
                  <div className="flex space-x-2">
                    <button
                      onClick={() => onViewDetails(vhl.id)}
                      className="p-2 text-blue-600 hover:text-blue-900 hover:bg-blue-50 rounded-lg transition-colors"
                      title="Voir détails"
                    >
                      <FaEye />
                    </button>
                    <button
                      onClick={() => onEdit(vhl.id)}
                      className="p-2 text-green-600 hover:text-green-900 hover:bg-green-50 rounded-lg transition-colors"
                      title="Modifier"
                    >
                      <FaEdit />
                    </button>
                    <button
                      onClick={() => setConfirmDelete(vhl.id)}
                      className="p-2 text-red-600 hover:text-red-900 hover:bg-red-50 rounded-lg transition-colors"
                      title="Archiver"
                    >
                      <FaTrash />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {filteredVhls.length === 0 && (
          <div className="text-center py-16">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gray-100 mb-6">
              <FaCar className="text-3xl text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Aucun véhicule trouvé
            </h3>
            <p className="text-gray-500 max-w-md mx-auto">
              {searchTerm ||
              filterAgence !== "all" ||
              filterCategorie !== "all" ||
              filterStatut !== "all"
                ? "Aucun véhicule ne correspond à vos critères de recherche."
                : "Commencez par ajouter votre premier véhicule."}
            </p>
          </div>
        )}
      </div>

      {/* Confirmation Modal */}
      {confirmDelete && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl p-6 max-w-md w-full">
            <div className="flex items-center justify-center w-12 h-12 mx-auto bg-red-100 rounded-full mb-4">
              <FaTrash className="h-6 w-6 text-red-600" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 text-center mb-2">
              Archiver le véhicule
            </h3>
            <p className="text-sm text-gray-500 text-center mb-6">
              Le véhicule sera archivé et pourra être restauré ultérieurement.
              Êtes-vous sûr de vouloir continuer ?
            </p>
            <div className="flex justify-center space-x-4">
              <button
                onClick={() => setConfirmDelete(null)}
                className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                Annuler
              </button>
              <button
                onClick={() => handleDelete(confirmDelete)}
                className="px-4 py-2 bg-red-600 text-white font-medium rounded-lg hover:bg-red-700"
              >
                Archiver
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default VhlList;
