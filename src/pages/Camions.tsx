import axios from "axios";
import { useEffect, useState, useMemo } from "react";
import {
  FaTruck,
  FaMapPin,
  FaCalendarAlt,
  FaBuilding,
  FaLayerGroup,
  FaList,
  FaChevronDown,
  FaChevronUp,
  FaCircle,
  FaSearch,
  FaSync,
  FaGasPump,
  FaCogs,
  FaRoad,
} from "react-icons/fa";
import { BsSpeedometer2 } from "react-icons/bs";
import { TbEngine } from "react-icons/tb";
import { API_BASE_URL } from "../utils/donnee";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function Camions() {
  interface Camion {
    id: number;
    matricule: string;
    marque: string;
    agence: string;
    type?: string;
    date_mc?: string;
    puissance?: string;
    kilometrage?: number;
    consommation?: number;
    status?: "disponible" | "en mission" | "en maintenance" | "hors service";
    last_maintenance?: string;
    chassis?: string;
  }

  const [camions, setCamions] = useState<Camion[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedStatus, setSelectedStatus] = useState<string>("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [groupByAgence, setGroupByAgence] = useState<boolean>(false);
  const [expandedAgences, setExpandedAgences] = useState<Set<string>>(
    new Set(),
  );

  // Couleurs claires et vibrantes
  const getStatusColor = (status?: string) => {
    switch (status) {
      case "disponible":
        return {
          bg: "bg-emerald-50 border-emerald-200",
          text: "text-emerald-700",
          dot: "bg-emerald-500",
          icon: "text-emerald-600",
          badge: "bg-emerald-100 text-emerald-800 border-emerald-200",
        };
      case "en mission":
        return {
          bg: "bg-blue-50 border-blue-200",
          text: "text-blue-700",
          dot: "bg-blue-500",
          icon: "text-blue-600",
          badge: "bg-blue-100 text-blue-800 border-blue-200",
        };
      case "en maintenance":
        return {
          bg: "bg-amber-50 border-amber-200",
          text: "text-amber-700",
          dot: "bg-amber-500",
          icon: "text-amber-600",
          badge: "bg-amber-100 text-amber-800 border-amber-200",
        };
      case "hors service":
        return {
          bg: "bg-rose-50 border-rose-200",
          text: "text-rose-700",
          dot: "bg-rose-500",
          icon: "text-rose-600",
          badge: "bg-rose-100 text-rose-800 border-rose-200",
        };
      default:
        return {
          bg: "bg-gray-50 border-gray-200",
          text: "text-gray-700",
          dot: "bg-gray-500",
          icon: "text-gray-600",
          badge: "bg-gray-100 text-gray-800 border-gray-200",
        };
    }
  };

  const getStatusText = (status?: string) => {
    switch (status) {
      case "disponible":
        return "Disponible";
      case "en mission":
        return "En mission";
      case "en maintenance":
        return "En maintenance";
      case "hors service":
        return "Hors service";
      default:
        return "Statut inconnu";
    }
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("fr-FR", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const fetchCamions = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${API_BASE_URL}categ/vhls/1`);
      const data = await response.data;
      setCamions(data);
      toast.success(`✅ ${data.length} camions chargés`);
    } catch (error) {
      console.error("Error fetching camions data:", error);
      toast.error("❌ Erreur de chargement");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCamions();
  }, []);

  // Filtrer les camions
  const filteredCamions = camions.filter((camion) => {
    const matchesSearch =
      searchTerm === "" ||
      camion.matricule.toLowerCase().includes(searchTerm.toLowerCase()) ||
      camion.marque.toLowerCase().includes(searchTerm.toLowerCase()) ||
      camion.agence.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (camion.type &&
        camion.type.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesStatus =
      selectedStatus === "all" || camion.status === selectedStatus;

    return matchesSearch && matchesStatus;
  });

  // Grouper par agence
  const camionsParAgence = useMemo(() => {
    if (!groupByAgence) return {};

    return filteredCamions.reduce(
      (acc, camion) => {
        const agence = camion.agence || "Non affecté";
        if (!acc[agence]) {
          acc[agence] = [];
        }
        acc[agence].push(camion);
        return acc;
      },
      {} as Record<string, Camion[]>,
    );
  }, [filteredCamions, groupByAgence]);

  // Obtenir les agences uniques
  const agencesUniques = useMemo(() => {
    const agences = [...new Set(filteredCamions.map((c) => c.agence))].filter(
      Boolean,
    );
    return agences.sort();
  }, [filteredCamions]);

  // Toggle expansion d'une agence
  const toggleAgenceExpansion = (agence: string) => {
    const newExpanded = new Set(expandedAgences);
    if (newExpanded.has(agence)) {
      newExpanded.delete(agence);
    } else {
      newExpanded.add(agence);
    }
    setExpandedAgences(newExpanded);
  };

  // Toggle expansion de toutes les agences
  const toggleAllAgences = () => {
    if (expandedAgences.size === agencesUniques.length) {
      setExpandedAgences(new Set());
    } else {
      setExpandedAgences(new Set(agencesUniques));
    }
  };

  // Statistiques
  const stats = {
    total: camions.length,
    disponible: camions.filter((c) => c.status === "disponible").length,
    enMission: camions.filter((c) => c.status === "en mission").length,
    enMaintenance: camions.filter((c) => c.status === "en maintenance").length,
    horsService: camions.filter((c) => c.status === "hors service").length,
    agencesCount: new Set(camions.map((c) => c.agence).filter(Boolean)).size,
  };

  // Animation de chargement
  if (loading) {
    return (
      <div className="min-h-screen bg-linear-to-b from-white to-gray-50 p-4 md:p-6">
        <div className="flex flex-col items-center justify-center h-64">
          <div className="relative">
            <div className="absolute inset-0 animate-ping bg-blue-400 rounded-full opacity-20"></div>
            <FaTruck className="text-5xl text-blue-600 animate-bounce" />
          </div>
          <p className="mt-6 text-lg font-medium text-gray-600 animate-pulse">
            Chargement de la flotte...
          </p>
        </div>
      </div>
    );
  }

  return (
    <>
      <ToastContainer
        position="top-right"
        autoClose={2000}
        theme="light"
        toastClassName="rounded-xl shadow-lg"
      />

      <div className="min-h-screen bg-linear-to-b from-white to-gray-50 p-3 md:p-5">
        {/* Header élégant */}
        <div className="mb-5">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-3 mb-4">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900 bg-clip-text bg-linear-to-r from-blue-600 to-indigo-600">
                Flotte de Camions
              </h1>
              <p className="text-gray-600 text-sm mt-1">
                {filteredCamions.length} camions actifs • {stats.agencesCount}{" "}
                agences
              </p>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={fetchCamions}
                className="px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-all duration-200 flex items-center gap-2 shadow-sm hover:shadow text-sm"
                title="Rafraîchir"
              >
                <FaSync className="text-gray-500" />
                Actualiser
              </button>
            </div>
          </div>

          {/* Stats Cards avec design moderne */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 mb-5">
            {[
              {
                label: "Total",
                value: stats.total,
                color: "from-blue-500 to-cyan-500",
                icon: FaTruck,
              },
              {
                label: "Disponible",
                value: stats.disponible,
                color: "from-emerald-500 to-green-500",
                icon: FaCircle,
              },
              {
                label: "En mission",
                value: stats.enMission,
                color: "from-sky-500 to-blue-500",
                icon: FaRoad,
              },
              {
                label: "Maintenance",
                value: stats.enMaintenance,
                color: "from-amber-500 to-yellow-500",
                icon: FaCogs,
              },
              {
                label: "Hors service",
                value: stats.horsService,
                color: "from-rose-500 to-red-500",
                icon: FaCircle,
              },
              {
                label: "Agences",
                value: stats.agencesCount,
                color: "from-purple-500 to-pink-500",
                icon: FaBuilding,
              },
            ].map((stat, index) => (
              <div
                key={index}
                className="bg-white rounded-xl p-4 shadow-sm border border-gray-200 hover:shadow-md transition-all duration-300 hover:-translate-y-0.5"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs font-medium text-gray-500 mb-1">
                      {stat.label}
                    </p>
                    <p className="text-xl font-bold text-gray-900">
                      {stat.value}
                    </p>
                  </div>
                  <div
                    className={`p-2 rounded-lg bg-linear-to-r ${stat.color} text-white shadow-sm`}
                  >
                    <stat.icon className="text-base" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Contrôles élégants */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 mb-5">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
            {/* Recherche */}
            <div className="md:col-span-2">
              <div className="relative">
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all duration-200 text-gray-700 placeholder-gray-400"
                  placeholder="Rechercher par matricule, marque ou agence..."
                />
                <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              </div>
            </div>

            {/* Filtre */}
            <div>
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="w-full px-4 py-2.5 bg-white border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all duration-200 text-gray-700"
              >
                <option value="all">Tous les statuts</option>
                <option value="disponible">Disponible</option>
                <option value="en mission">En mission</option>
                <option value="en maintenance">En maintenance</option>
                <option value="hors service">Hors service</option>
              </select>
            </div>

            {/* Grouper par agence */}
            <div className="flex gap-2">
              <button
                onClick={() => setGroupByAgence(!groupByAgence)}
                className={`flex-1 px-4 py-2.5 border rounded-lg transition-all duration-200 flex items-center justify-center gap-2 text-sm font-medium ${
                  groupByAgence
                    ? "border-purple-500 bg-purple-50 text-purple-700 shadow-sm"
                    : "border-gray-300 bg-white text-gray-700 hover:border-gray-400 hover:bg-gray-50"
                }`}
              >
                {groupByAgence ? (
                  <>
                    <FaList />
                    Vue normale
                  </>
                ) : (
                  <>
                    <FaLayerGroup />
                    Par agence
                  </>
                )}
              </button>

              {groupByAgence && agencesUniques.length > 0 && (
                <button
                  onClick={toggleAllAgences}
                  className="px-4 py-2.5 border border-gray-300 rounded-lg hover:border-gray-400 hover:bg-gray-50 transition-all duration-200 text-gray-700"
                  title={
                    expandedAgences.size === agencesUniques.length
                      ? "Réduire tout"
                      : "Développer tout"
                  }
                >
                  {expandedAgences.size === agencesUniques.length ? (
                    <FaChevronUp className="text-gray-500" />
                  ) : (
                    <FaChevronDown className="text-gray-500" />
                  )}
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Affichage des camions */}
        {filteredCamions.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-10 text-center">
            <div className="inline-block p-6 bg-linear-to-r from-gray-100 to-gray-200 rounded-full mb-4">
              <FaTruck className="text-5xl text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              {searchTerm || selectedStatus !== "all"
                ? "Aucun résultat"
                : "Aucun camion"}
            </h3>
            <p className="text-gray-600 max-w-md mx-auto">
              {searchTerm || selectedStatus !== "all"
                ? "Aucun camion ne correspond à vos critères de recherche."
                : "Commencez par ajouter votre premier camion à la flotte."}
            </p>
          </div>
        ) : groupByAgence ? (
          /* Vue groupée par agence - Grille moderne */
          <div className="space-y-4">
            {Object.entries(camionsParAgence).map(
              ([agence, camionsDeAgence]) => {
                const statsAgence = {
                  total: camionsDeAgence.length,
                  disponible: camionsDeAgence.filter(
                    (c) => c.status === "disponible",
                  ).length,
                  enMission: camionsDeAgence.filter(
                    (c) => c.status === "en mission",
                  ).length,
                  enMaintenance: camionsDeAgence.filter(
                    (c) => c.status === "en maintenance",
                  ).length,
                  horsService: camionsDeAgence.filter(
                    (c) => c.status === "hors service",
                  ).length,
                };

                const isExpanded = expandedAgences.has(agence);

                return (
                  <div
                    key={agence}
                    className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-all duration-300"
                  >
                    {/* Header de l'agence */}
                    <div
                      className="p-4 cursor-pointer hover:bg-gray-50 transition-colors border-b border-gray-200"
                      onClick={() => toggleAgenceExpansion(agence)}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className="p-3 bg-linear-to-r from-blue-100 to-indigo-100 rounded-lg">
                            <FaBuilding className="text-xl text-blue-600" />
                          </div>
                          <div>
                            <h3 className="font-bold text-gray-900 text-lg">
                              {agence}
                            </h3>
                            <div className="flex items-center gap-4 mt-1">
                              <span className="text-sm text-gray-600">
                                {statsAgence.total} camions
                              </span>
                              <div className="flex items-center gap-2">
                                {statsAgence.disponible > 0 && (
                                  <span className="flex items-center gap-1 text-xs">
                                    <span className="w-2 h-2 bg-emerald-500 rounded-full"></span>
                                    <span className="text-gray-500">
                                      {statsAgence.disponible} dispo
                                    </span>
                                  </span>
                                )}
                                {statsAgence.enMission > 0 && (
                                  <span className="flex items-center gap-1 text-xs">
                                    <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                                    <span className="text-gray-500">
                                      {statsAgence.enMission} mission
                                    </span>
                                  </span>
                                )}
                                {statsAgence.enMaintenance > 0 && (
                                  <span className="flex items-center gap-1 text-xs">
                                    <span className="w-2 h-2 bg-amber-500 rounded-full"></span>
                                    <span className="text-gray-500">
                                      {statsAgence.enMaintenance} maint.
                                    </span>
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-4">
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-medium ${
                              statsAgence.disponible > 0
                                ? "bg-emerald-100 text-emerald-800"
                                : "bg-rose-100 text-rose-800"
                            }`}
                          >
                            {statsAgence.disponible > 0
                              ? "Opérationnelle"
                              : "Indisponible"}
                          </span>
                          {isExpanded ? (
                            <FaChevronUp className="text-gray-400" />
                          ) : (
                            <FaChevronDown className="text-gray-400" />
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Grille de camions dans l'agence */}
                    {isExpanded && (
                      <div className="p-4 bg-gray-50">
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                          {camionsDeAgence.map((camion) => {
                            const statusColors = getStatusColor(camion.status);
                            return (
                              <div
                                key={camion.id}
                                className={`${statusColors.bg} rounded-lg p-4 border hover:shadow-sm transition-all duration-300 hover:-translate-y-0.5`}
                              >
                                <div className="flex items-center justify-between mb-3">
                                  <div className="flex items-center gap-3">
                                    <div
                                      className={`p-2 rounded-lg ${statusColors.bg}`}
                                    >
                                      <FaTruck
                                        className={`text-lg ${statusColors.icon}`}
                                      />
                                    </div>
                                    <div>
                                      <h4 className="font-bold text-gray-900">
                                        {camion.matricule}
                                      </h4>
                                      <p className="text-sm text-gray-600">
                                        {camion.marque}
                                      </p>
                                    </div>
                                  </div>
                                  <span
                                    className={`text-xs px-2 py-1 rounded-full ${statusColors.badge} border`}
                                  >
                                    {getStatusText(camion.status)}
                                  </span>
                                </div>

                                <div className="space-y-2">
                                  <div className="flex items-center gap-2 text-sm">
                                    <FaMapPin className="text-gray-400" />
                                    <span className="text-gray-700">
                                      {camion.agence}
                                    </span>
                                  </div>

                                  {camion.type && (
                                    <div className="flex items-center gap-2 text-sm">
                                      <TbEngine className="text-gray-400" />
                                      <span className="text-gray-700">
                                        {camion.type}
                                      </span>
                                    </div>
                                  )}

                                  {camion.date_mc && (
                                    <div className="flex items-center gap-2 text-sm">
                                      <FaCalendarAlt className="text-gray-400" />
                                      <span className="text-gray-700">
                                        MC: {formatDate(camion.date_mc)}
                                      </span>
                                    </div>
                                  )}

                                  {camion.kilometrage && (
                                    <div className="flex items-center gap-2 text-sm">
                                      <BsSpeedometer2 className="text-gray-400" />
                                      <span className="text-gray-700">
                                        {camion.kilometrage.toLocaleString()} km
                                      </span>
                                    </div>
                                  )}
                                </div>

                                <div className="mt-3 pt-3 border-t border-gray-200">
                                  <div className="flex justify-between text-xs text-gray-500">
                                    <span>ID: {camion.id}</span>
                                    {camion.puissance && (
                                      <span className="flex items-center gap-1">
                                        <FaGasPump className="text-gray-400" />
                                        {camion.puissance}
                                      </span>
                                    )}
                                  </div>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    )}
                  </div>
                );
              },
            )}
          </div>
        ) : (
          /* Vue normale - Grille moderne et propre */
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4">
            {filteredCamions.map((camion) => {
              const statusColors = getStatusColor(camion.status);
              return (
                <div
                  key={camion.id}
                  className={`${statusColors.bg} rounded-xl p-4 border hover:shadow-md transition-all duration-300 hover:-translate-y-1 group`}
                >
                  {/* Header élégant */}
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className={`p-2.5 rounded-lg ${statusColors.bg}`}>
                        <FaTruck className={`text-xl ${statusColors.icon}`} />
                      </div>
                      <div>
                        <h3 className="font-bold text-gray-900 text-lg">
                          {camion.matricule}
                        </h3>
                        <p className="text-sm text-gray-600">{camion.marque}</p>
                      </div>
                    </div>
                    <div
                      className={`w-3 h-3 rounded-full ${statusColors.dot} animate-pulse shadow-sm`}
                    ></div>
                  </div>

                  {/* Informations principales - Grille interne */}
                  <div className="space-y-3 mb-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <FaBuilding className="text-gray-400" />
                        <span className="text-sm font-medium text-gray-700">
                          {camion.agence}
                        </span>
                      </div>
                      <span
                        className={`text-xs px-3 py-1 rounded-full font-medium ${statusColors.badge} border`}
                      >
                        {getStatusText(camion.status)}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-3 text-sm">
                      {camion.type && (
                        <div className="flex items-center gap-2">
                          <TbEngine className="text-gray-400 shrink-0" />
                          <span
                            className="text-gray-700 truncate"
                            title={camion.type}
                          >
                            {camion.type}
                          </span>
                        </div>
                      )}

                      {camion.date_mc && (
                        <div className="flex items-center gap-2">
                          <FaCalendarAlt className="text-gray-400 shrink-0" />
                          <span className="text-gray-700">
                            {formatDate(camion.date_mc)}
                          </span>
                        </div>
                      )}

                      {camion.kilometrage && (
                        <div className="flex items-center gap-2">
                          <BsSpeedometer2 className="text-gray-400 shrink-0" />
                          <span className="text-gray-700">
                            {camion.kilometrage.toLocaleString()} km
                          </span>
                        </div>
                      )}

                      {camion.puissance && (
                        <div className="flex items-center gap-2">
                          <FaGasPump className="text-gray-400 shrink-0" />
                          <span className="text-gray-700">
                            {camion.puissance}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Footer discret */}
                  <div className="pt-3 border-t border-gray-200">
                    <div className="flex justify-between items-center text-xs">
                      <span className="text-gray-500 font-mono">
                        #{camion.id.toString().padStart(3, "0")}
                      </span>
                      {camion.consommation && (
                        <span className="text-gray-500">
                          {camion.consommation} L/100km
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Footer élégant */}
        {filteredCamions.length > 0 && (
          <div className="mt-6 pt-4 border-t border-gray-200">
            <div className="flex flex-col md:flex-row justify-between items-center gap-3">
              <div className="text-gray-600 text-sm">
                {groupByAgence ? (
                  <span>
                    <span className="font-semibold text-gray-900">
                      {agencesUniques.length}
                    </span>{" "}
                    agences •{" "}
                    <span className="font-semibold text-gray-900">
                      {filteredCamions.length}
                    </span>{" "}
                    camions
                  </span>
                ) : (
                  <span>
                    <span className="font-semibold text-gray-900">
                      {filteredCamions.length}
                    </span>{" "}
                    camion{filteredCamions.length > 1 ? "s" : ""} affiché
                    {filteredCamions.length > 1 ? "s" : ""}
                  </span>
                )}
              </div>
              <div className="flex items-center gap-3">
                {groupByAgence && (
                  <span className="text-sm text-gray-500">
                    {expandedAgences.size} agence
                    {expandedAgences.size > 1 ? "s" : ""} ouverte
                    {expandedAgences.size > 1 ? "s" : ""}
                  </span>
                )}
                <button className="text-sm text-blue-600 hover:text-blue-700 font-medium hover:underline transition-colors">
                  Exporter les données
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}

export default Camions;
