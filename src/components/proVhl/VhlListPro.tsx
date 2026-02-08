/* eslint-disable @typescript-eslint/no-explicit-any */
// components/vhl/VhlListPro.tsx
import React, { useState, useEffect, useMemo } from "react";
import { useVhlsPro } from "../../stores/useVhlProStore";
import {
  FaCar,
  FaTrash,
  FaChevronLeft,
  FaChevronRight,
  FaFilter,
  FaCheck,
} from "react-icons/fa6";
import { FaSearch, FaEdit, FaTimes, FaSync } from "react-icons/fa";
import CategoryIcon from "../CategoryIcon";
import { CiViewList } from "react-icons/ci";

interface VhlListProProps {
  onEdit: (id: string) => void;
  onViewDetails: (id: string) => void;
  onSelectVhl?: (vhl: any) => void;
  onSetComments: (id: string) => void;
}

const VhlListPro: React.FC<VhlListProProps> = ({
  onEdit,
  onViewDetails,
  onSelectVhl,
  onSetComments,
}) => {
  const {
    allVhls,
    selectedVhl,
    loading,
    softDeleteVhl,
    agences,
    categories,
    statuts,
    searchVhls,
    fetchAllVhls,
  } = useVhlsPro();

  // États pour les filtres
  const [searchTerm, setSearchTerm] = useState("");
  const [filterAgence, setFilterAgence] = useState<string>("all");
  const [filterCategorie, setFilterCategorie] = useState<string>("all");
  const [filterStatut, setFilterStatut] = useState<string>("all");

  // États pour la pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  // États pour la confirmation de suppression
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);

  // Appliquer les filtres
  const filteredVhls = useMemo(() => {
    const filters = {
      agence_id: filterAgence !== "all" ? filterAgence : undefined,
      categorie_id: filterCategorie !== "all" ? filterCategorie : undefined,
      statut_id: filterStatut !== "all" ? filterStatut : undefined,
    };

    return searchVhls(searchTerm, filters);
  }, [
    allVhls,
    searchTerm,
    filterAgence,
    filterCategorie,
    filterStatut,
    searchVhls,
  ]);

  // Calculer la pagination - CORRECTION ICI
  const totalItems = filteredVhls.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / itemsPerPage));

  // Calculer les éléments à afficher sur la page courante
  const paginatedVhls = useMemo(() => {
    if (filteredVhls.length === 0) return [];

    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return filteredVhls.slice(startIndex, endIndex);
  }, [filteredVhls, currentPage, itemsPerPage]);

  // Réinitialiser à la première page quand les filtres changent
  useEffect(() => {
    console.log(`Statuts: ${statuts.map((s) => s.nom).join(", ")}`);
    setCurrentPage(1);
  }, [searchTerm, filterAgence, filterCategorie, filterStatut]);

  // S'assurer que currentPage est valide quand totalPages change
  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [totalPages, currentPage]);

  // Calculer le nombre de filtres actifs
  const activeFiltersCount = useMemo(() => {
    let count = 0;
    if (searchTerm) count++;
    if (filterAgence !== "all") count++;
    if (filterCategorie !== "all") count++;
    if (filterStatut !== "all") count++;
    return count;
  }, [searchTerm, filterAgence, filterCategorie, filterStatut]);

  // Réinitialiser tous les filtres
  const resetFilters = () => {
    setSearchTerm("");
    setFilterAgence("all");
    setFilterCategorie("all");
    setFilterStatut("all");
  };

  const handleDelete = async (id: string) => {
    const success = await softDeleteVhl(id);
    if (success) {
      setConfirmDelete(null);
    }
  };

  const handleRefresh = () => {
    fetchAllVhls();
  };

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
      // Scroll to top
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handleItemsPerPageChange = (value: number) => {
    setItemsPerPage(value);
    setCurrentPage(1); // Reset to first page when changing items per page
  };

  const getStatutColor = (statut?: string) => {
    switch (statut?.toLowerCase()) {
      case "2":
        return "bg-red-400 border border-red-300 ";
      case "3":
        return "bg-red-300 border border-red-200";
      case "4":
        return "bg-orange-300  border border-orange-200";
      case "7":
        return "bg-gray-500 border border-gray-200";
      default:
        return;
    }
  };

  const handleRowClick = (vhl: any) => {
    if (onSelectVhl) {
      onSelectVhl(vhl);
    }
    onViewDetails(vhl.id);
  };

  // Fonction pour générer les numéros de page - CORRECTION ICI
  const getPageNumbers = () => {
    const pages = [];
    const maxVisible = 5;

    if (totalPages <= maxVisible) {
      // Si moins de 5 pages, afficher toutes
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Sinon, afficher autour de la page courante
      let start = Math.max(1, currentPage - 2);
      let end = Math.min(totalPages, start + maxVisible - 1);

      // Ajuster si on est près de la fin
      if (end - start + 1 < maxVisible) {
        start = Math.max(1, end - maxVisible + 1);
      }

      for (let i = start; i <= end; i++) {
        pages.push(i);
      }
    }

    return pages;
  };

  // Calculer le range d'affichage - NOUVEAU
  const getDisplayRange = () => {
    const start = (currentPage - 1) * itemsPerPage + 1;
    const end = Math.min(currentPage * itemsPerPage, totalItems);
    return { start, end };
  };

  const { start, end } = getDisplayRange();

  return (
    <div className="h-full flex flex-col">
      {/* Toolbar */}
      <div className="p-3 border-b border-gray-200 bg-white">
        <div className="flex flex-col gap-3">
          {/* Barre de recherche */}
          <div className="relative">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-10 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-300"
              placeholder="Rechercher un véhicule..."
            />
            <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm("")}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                <FaTimes />
              </button>
            )}
          </div>

          {/* Filtres */}
          <div className="flex flex-wrap items-center gap-2">
            <div className="flex items-center gap-2">
              <FaFilter className="text-gray-500 text-sm" />
              <span className="text-sm text-gray-600">Filtres :</span>
            </div>

            <select
              value={filterAgence}
              onChange={(e) => setFilterAgence(e.target.value)}
              className="px-2 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm min-w-35"
            >
              <option value="all">Agences</option>
              {agences.map((agence) => (
                <option key={agence.id} value={agence.id}>
                  {agence.nom}
                </option>
              ))}
            </select>

            <select
              value={filterCategorie}
              onChange={(e) => setFilterCategorie(e.target.value)}
              className="px-2 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm min-w-35"
            >
              <option value="all">Catégories</option>
              {categories.map((categorie) => (
                <option key={categorie.id} value={categorie.id}>
                  {categorie.nom}
                </option>
              ))}
            </select>

            <select
              value={filterStatut}
              onChange={(e) => setFilterStatut(e.target.value)}
              className="px-2 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm min-w-35"
            >
              <option value="all">Statuts</option>
              {statuts.map((statut) => (
                <option key={statut.id} value={statut.id}>
                  {statut.nom}
                </option>
              ))}
            </select>

            <button
              onClick={handleRefresh}
              disabled={loading}
              className="px-3 py-2 text-sm text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-lg border border-blue-200 flex items-center gap-1 disabled:opacity-50 disabled:cursor-not-allowed"
              title="Actualiser"
            >
              <FaSync className={loading ? "animate-spin" : ""} />
            </button>

            {activeFiltersCount > 0 && (
              <button
                onClick={resetFilters}
                className="px-3 py-2 text-sm text-red-600 hover:text-red-800 hover:bg-red-50 rounded-lg border border-red-200 flex items-center gap-1"
              >
                <FaTimes />
                Réinitialiser ({activeFiltersCount})
              </button>
            )}
          </div>

          {/* Info et pagination controls - AJOUTÉ */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mt-2">
            <div className="text-sm text-gray-600">
              {loading ? (
                <span className="flex items-center gap-2">
                  <FaSync className="animate-spin" />
                  Chargement...
                </span>
              ) : (
                <>
                  {totalItems} véhicule{totalItems !== 1 ? "s" : ""} au total
                  {activeFiltersCount > 0 &&
                    ` • ${filteredVhls.length} résultat${filteredVhls.length !== 1 ? "s" : ""} filtré${filteredVhls.length !== 1 ? "s" : ""}`}
                </>
              )}
            </div>

            {/* Contrôles de pagination en haut */}
            {totalPages > 1 && (
              <div className="flex items-center gap-3">
                {/* Sélection du nombre d'éléments par page */}
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-600">Nb:</span>
                  <select
                    value={itemsPerPage}
                    onChange={(e) =>
                      handleItemsPerPageChange(Number(e.target.value))
                    }
                    className="px-2 py-1 border border-gray-300 rounded text-sm bg-white"
                  >
                    <option value={5}>5</option>
                    <option value={10}>10</option>
                    <option value={20}>20</option>
                    <option value={50}>50</option>
                    <option value={100}>100</option>
                  </select>
                </div>

                {/* Navigation des pages */}
                <div className="flex items-center space-x-1">
                  <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1 || loading}
                    className={`p-2 rounded-lg ${
                      currentPage === 1 || loading
                        ? "text-gray-400 cursor-not-allowed"
                        : "text-gray-700 hover:bg-gray-100"
                    }`}
                  >
                    <FaChevronLeft />
                  </button>

                  <div className="flex items-center space-x-1">
                    {getPageNumbers().map((page) => (
                      <button
                        key={page}
                        onClick={() => handlePageChange(page)}
                        disabled={loading}
                        className={`px-3 py-1 rounded-lg text-sm ${
                          currentPage === page
                            ? "bg-blue-600 text-white"
                            : "text-gray-700 hover:bg-gray-100"
                        } ${loading ? "opacity-50 cursor-not-allowed" : ""}`}
                      >
                        {page}
                      </button>
                    ))}
                  </div>

                  <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages || loading}
                    className={`p-2 rounded-lg ${
                      currentPage === totalPages || loading
                        ? "text-gray-400 cursor-not-allowed"
                        : "text-gray-700 hover:bg-gray-100"
                    }`}
                  >
                    <FaChevronRight />
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Liste des véhicules */}

      <div className="grow overflow-y-auto">
        {loading && paginatedVhls.length === 0 ? (
          <div className="flex justify-center items-center h-52">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
          </div>
        ) : paginatedVhls.length > 0 ? (
          <div className="divide-y-2 divide-gray-200">
            {paginatedVhls.map((vhl) => (
              <div
                key={vhl.id}
                className={`p-2 hover:bg-blue-50 transition-colors cursor-pointer border-l-4 ${getStatutColor(vhl.statut_id)} ${
                  selectedVhl?.id === vhl.id
                    ? "bg-blue-50 border-l-4 border-blue-500"
                    : "border-l-transparent"
                }`}
                onClick={() => handleRowClick(vhl)}
              >
                <div className="flex justify-between items-center">
                  <div className="flex">
                    <div className="flex items-center gap-4">
                      <div className="p-1 bg-gray-100 rounded-r-full flex items-center justify-center shadow-md shadow-cyan-500">
                        <CategoryIcon
                          categoryName={vhl.categorie_nom}
                          showTooltip={true}
                          size={25}
                        />
                      </div>
                      <div>
                        <h3 className="font-bold text-gray-900 text-lg">
                          {vhl.matricule}
                        </h3>
                        <p className="text-sm text-gray-600">
                          {vhl.marque} {vhl.type && `• ${vhl.type}`}
                        </p>
                      </div>
                      {selectedVhl?.id === vhl.id && (
                        <FaCheck className="text-blue-600" />
                      )}
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-3 text-sm">
                    <span className="text-gray-600">
                      <span className="font-mono font-bold">
                        {vhl.agence_nom || "-"}{" "}
                      </span>
                    </span>
                  </div>

                  <div className="flex gap-1">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onEdit(vhl.id);
                      }}
                      className="p-2 text-green-600 hover:text-green-900 hover:bg-green-100 rounded-lg transition-colors"
                      title="Modifier"
                    >
                      <FaEdit />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setConfirmDelete(vhl.id);
                      }}
                      className="p-2 text-red-600 hover:text-red-900 hover:bg-red-100 rounded-lg transition-colors"
                      title="Archiver"
                    >
                      <FaTrash />
                    </button>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onSetComments(vhl.id);
                      }}
                      className="p-2 text-cyan-600 hover:text-cyan-800 hover:bg-cyan-100 rounded-lg transition-colors"
                      title="Commentaires"
                    >
                      <CiViewList size={24} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-10">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 mb-4">
              <FaCar className="text-2xl text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Aucun véhicule trouvé
            </h3>
            <p className="text-gray-500">
              {activeFiltersCount > 0
                ? "Aucun véhicule ne correspond à vos critères de filtrage."
                : "Commencez par ajouter votre premier véhicule."}
            </p>
            {activeFiltersCount > 0 && (
              <button
                onClick={resetFilters}
                className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Réinitialiser les filtres
              </button>
            )}
          </div>
        )}
      </div>

      {/* Pagination en bas - AMÉLIORÉ */}
      {totalPages > 1 && paginatedVhls.length > 0 && (
        <div className="p-2 border-t border-gray-200 bg-white ">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-3">
            <div className="text-sm text-gray-700">
              De {start} à {end} sur {totalItems} véhicules • Page {currentPage}{" "}
              sur {totalPages}
            </div>

            <div className="flex items-center gap-4">
              {/* Sélection du nombre d'éléments par page */}
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600">Afficher :</span>
                <select
                  value={itemsPerPage}
                  onChange={(e) =>
                    handleItemsPerPageChange(Number(e.target.value))
                  }
                  className="px-2 py-1 border border-gray-300 rounded text-sm bg-white"
                >
                  <option value={5}>5</option>
                  <option value={10}>10</option>
                  <option value={20}>20</option>
                  <option value={50}>50</option>
                  <option value={100}>100</option>
                </select>
                <span className="text-sm text-gray-600">par page</span>
              </div>

              {/* Navigation des pages */}
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => handlePageChange(1)}
                  disabled={currentPage === 1 || loading}
                  className={`px-2 py-1.5 rounded-lg text-sm ${
                    currentPage === 1 || loading
                      ? "text-gray-400 cursor-not-allowed"
                      : "text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  Première
                </button>

                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1 || loading}
                  className={`px-2 py-1.5 rounded-lg text-sm flex items-center gap-1 ${
                    currentPage === 1 || loading
                      ? "text-gray-400 cursor-not-allowed"
                      : "text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  <FaChevronLeft className="text-xs" />
                  Précédent
                </button>

                <div className="flex items-center gap-1">
                  {getPageNumbers().map((page) => (
                    <button
                      key={page}
                      onClick={() => handlePageChange(page)}
                      disabled={loading}
                      className={`px-2 py-1.5 rounded-lg text-sm ${
                        currentPage === page
                          ? "bg-blue-600 text-white"
                          : "text-gray-700 hover:bg-gray-100"
                      } ${loading ? "opacity-50 cursor-not-allowed" : ""}`}
                    >
                      {page}
                    </button>
                  ))}
                </div>

                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages || loading}
                  className={`px-2 py-1.5 rounded-lg text-sm flex items-center gap-1 ${
                    currentPage === totalPages || loading
                      ? "text-gray-400 cursor-not-allowed"
                      : "text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  Suivant
                  <FaChevronRight className="text-xs" />
                </button>

                <button
                  onClick={() => handlePageChange(totalPages)}
                  disabled={currentPage === totalPages || loading}
                  className={`px-2 py-1.5 rounded-lg text-sm ${
                    currentPage === totalPages || loading
                      ? "text-gray-400 cursor-not-allowed"
                      : "text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  Dernière
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

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
              Êtes-vous sûr de vouloir archiver ce véhicule ? Il pourra être
              restauré ultérieurement.
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

export default VhlListPro;
