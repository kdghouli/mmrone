// components/vhl/VhlManager.tsx
import { useState, useEffect } from "react";
import { useVhls } from "../../stores/useVhlStore";
import VhlDashboard from "./VhlDashboard";
import VhlList from "./VhlList";
import CreateVhlForm from "./CreateVhlForm";
import EditVhlForm from "./EditVhlForm";
import VhlDetails from "./VhlDetails";
import { FaTachometerAlt, FaList, FaPlus } from "react-icons/fa";

const VhlManager = () => {
  const [view, setView] = useState<
    "dashboard" | "list" | "create" | "edit" | "details"
  >("dashboard");
  const [selectedVhlId, setSelectedVhlId] = useState<string | null>(null);
  const { loading, fetchVhls, fetchReferenceData } = useVhls();

  useEffect(() => {
    const loadData = async () => {
      await Promise.all([fetchVhls(), fetchReferenceData()]);
    };
    loadData();
  }, []);

  const handleCreateSuccess = () => {
    setView("list");
    fetchVhls();
  };

  const handleEdit = (id: string) => {
    setSelectedVhlId(id);
    setView("edit");
  };

  const handleViewDetails = (id: string) => {
    setSelectedVhlId(id);
    setView("details");
  };

  const handleBackToDashboard = () => {
    setView("dashboard");
    setSelectedVhlId(null);
  };

  const handleBackToList = () => {
    setView("list");
    setSelectedVhlId(null);
  };

  // Navigation tabs
  const tabs = [
    { id: "dashboard", label: "Dashboard", icon: <FaTachometerAlt /> },
    { id: "list", label: "Liste des Véhicules", icon: <FaList /> },
  ];

  if (loading && view === "dashboard") {
    return (
      <div className="min-h-screen bg-linear-to-br from-gray-50 to-blue-50 flex items-center justify-center">
        <div className="flex flex-col items-center">
          <div className="animate-spin rounded-full h-20 w-20 border-b-4 border-blue-600 mb-4"></div>
          <p className="text-gray-600">Chargement des données...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-gray-50 to-blue-100">
      {/* Header */}
      <div className="bg-linear-to-r from-gray-900 to-gray-800 text-white">
        <div className="container mx-auto px-4 py-4">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold mb-2">
                Gestion des Véhicules
              </h1>
              <p className="text-gray-300">Gérez votre flotte complètement</p>
            </div>
            {view === "list" && (
              <button
                onClick={() => setView("create")}
                className="px-6 py-3 bg-linear-to-r from-blue-600 to-cyan-600 text-white font-medium rounded-lg hover:from-blue-700 hover:to-cyan-700 transition-all duration-300 flex items-center gap-2 shadow-lg hover:shadow-xl"
              >
                <FaPlus />
                Nouveau Véhicule
              </button>
            )}
            {(view === "create" || view === "edit" || view === "details") && (
              <button
                onClick={
                  view === "create" ? handleBackToList : handleBackToDashboard
                }
                className="px-6 py-3 bg-gray-700 text-white font-medium rounded-lg hover:bg-gray-600 transition-all duration-300 flex items-center gap-2"
              >
                Retour au {view === "create" ? "liste" : "dashboard"}
              </button>
            )}
          </div>
        </div>
      </div>
      {/* Navigation Tabs */}
      {view !== "create" && view !== "edit" && view !== "details" && (
        <div className="bg-white border-b border-gray-200">
          <div className="container mx-auto px-4">
            <div className="flex space-x-1">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setView(tab.id as any)}
                  className={`
                    flex items-center gap-2 px-4 py-3 text-sm font-medium rounded-t-lg transition-all duration-300
                    ${
                      view === tab.id
                        ? "bg-blue-600 text-white shadow-md"
                        : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                    }
                  `}
                >
                  {tab.icon}
                  {tab.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        {view === "dashboard" && (
          <VhlDashboard onViewList={() => setView("list")} />
        )}
        {view === "list" && (
          <VhlList onEdit={handleEdit} onViewDetails={handleViewDetails} />
        )}
        {view === "create" && (
          <CreateVhlForm
            onSuccess={handleCreateSuccess}
            onCancel={handleBackToList}
          />
        )}
        {view === "edit" && selectedVhlId && (
          <EditVhlForm
            vhlId={selectedVhlId}
            onSuccess={handleBackToList}
            onCancel={handleBackToList}
          />
        )}
        {view === "details" && selectedVhlId && (
          <VhlDetails
            vhlId={selectedVhlId}
            onEdit={() => handleEdit(selectedVhlId)}
            onBack={handleBackToList}
          />
        )}
      </div>
    </div>
  );
};

export default VhlManager;
