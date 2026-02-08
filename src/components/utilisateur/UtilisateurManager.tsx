// components/utilisateur/UtilisateurManager.tsx
import { useState, useEffect } from "react";
import { useUtilisateurs } from "../../stores/useUtilisateurStore";
import UtilisateurList from "./UtilisateurList";
import CreateUtilisateurForm from "./CreateUtilisateurForm";
import EditUtilisateurForm from "./EditUtilisateurForm";
import UtilisateurDetails from "./UtilisateurDetails";

const UtilisateurManager = () => {
  const [view, setView] = useState<"list" | "create" | "edit" | "details">(
    "list",
  );
  const [selectedUtilisateurId, setSelectedUtilisateurId] = useState<
    string | null
  >(null);
  const { loading, fetchUtilisateurs, fetchServices, fetchAgences } =
    useUtilisateurs();

  useEffect(() => {
    const loadData = async () => {
      await Promise.all([fetchUtilisateurs(), fetchServices(), fetchAgences()]);
    };
    loadData();
  }, []);

  const handleCreateSuccess = () => {
    setView("list");
    fetchUtilisateurs();
  };

  const handleEdit = (id: string) => {
    setSelectedUtilisateurId(id);
    setView("edit");
  };

  const handleViewDetails = (id: string) => {
    setSelectedUtilisateurId(id);
    setView("details");
  };

  const handleBackToList = () => {
    setView("list");
    setSelectedUtilisateurId(null);
  };

  if (loading && view === "list") {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* En-tête */}
        <div className="mb-8">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Gestion des Utilisateurs
              </h1>
              <p className="mt-2 text-gray-600">
                Gérez les utilisateurs, créez de nouveaux comptes ou modifiez
                les existants.
              </p>
            </div>
            {view === "list" && (
              <button
                onClick={() => setView("create")}
                className="px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-medium rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 flex items-center shadow-lg hover:shadow-xl"
              >
                <svg
                  className="w-5 h-5 mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                  ></path>
                </svg>
                Nouvel Utilisateur
              </button>
            )}
            {view !== "list" && (
              <button
                onClick={handleBackToList}
                className="px-6 py-3 bg-gray-200 text-gray-800 font-medium rounded-lg hover:bg-gray-300 transition-all duration-300 flex items-center"
              >
                <svg
                  className="w-5 h-5 mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M10 19l-7-7m0 0l7-7m-7 7h18"
                  ></path>
                </svg>
                Retour à la liste
              </button>
            )}
          </div>
        </div>

        {/* Contenu */}
        <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
          {view === "list" && (
            <UtilisateurList
              onEdit={handleEdit}
              onViewDetails={handleViewDetails}
            />
          )}

          {view === "create" && (
            <CreateUtilisateurForm
              onSuccess={handleCreateSuccess}
              onCancel={handleBackToList}
            />
          )}

          {view === "edit" && selectedUtilisateurId && (
            <EditUtilisateurForm
              utilisateurId={selectedUtilisateurId}
              onSuccess={handleBackToList}
              onCancel={handleBackToList}
            />
          )}

          {view === "details" && selectedUtilisateurId && (
            <UtilisateurDetails
              utilisateurId={selectedUtilisateurId}
              onEdit={() => handleEdit(selectedUtilisateurId)}
              onBack={handleBackToList}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default UtilisateurManager;
