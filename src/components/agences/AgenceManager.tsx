// components/AgenceManager.tsx
import { useState, useEffect } from "react";
import { useAgences } from "../../stores/useAgenceStore";
import AgenceList from "./AgenceList";
import CreateAgenceForm from "./CreateAgenceForm";
import EditAgenceForm from "./EditAgenceForm";
import AgenceDetails from "./AgenceDetails";
import { ToastContainer } from "react-toastify";

const AgenceManager = () => {
  const [view, setView] = useState<"list" | "create" | "edit" | "details">(
    "list"
  );
  const [selectedAgenceId, setSelectedAgenceId] = useState<string | null>(null);
  const { loading, error, fetchAgences } = useAgences();

  useEffect(() => {
    fetchAgences();
  }, []);

  const handleCreateSuccess = () => {
    setView("list");
    fetchAgences(); // Rafraîchir la liste
  };

  const handleEdit = (id: string) => {
    setSelectedAgenceId(id);
    setView("edit");
  };

  const handleViewDetails = (id: string) => {
    setSelectedAgenceId(id);
    setView("details");
  };

  const handleBackToList = () => {
    setView("list");
    setSelectedAgenceId(null);
  };

  if (loading && view === "list") {
    return (
      <div className="flex justify-center items-center h-[80vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error && view === "list") {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <div className="flex">
          <div className="shrink-0">
            <svg
              className="h-5 w-5 text-red-400"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                clipRule="evenodd"
              />
            </svg>
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-red-800">Erreur</h3>
            <div className="mt-2 text-sm text-red-700">
              <p>{error}</p>
            </div>
            <button
              onClick={() => fetchAgences()}
              className="mt-3 px-4 py-2 bg-red-100 text-red-800 rounded-md hover:bg-red-200"
            >
              Réessayer
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className=" bg-gray-100 py-4 px-2 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* En-tête */}
        <div className="mb-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Gestion des Agences
              </h1>
              <p className="mt-2 text-gray-600">
                Gérez vos agences, créez-en de nouvelles ou modifiez les
                existantes.
              </p>
            </div>
            {view === "list" && (
              <button
                onClick={() => setView("create")}
                className="px-5 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition duration-150 ease-in-out flex items-center"
              >
                <svg
                  className="w-5 h-5 mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                  ></path>
                </svg>
                Nouvelle Agence
              </button>
            )}
            {view !== "list" && (
              <button
                onClick={handleBackToList}
                className="px-6 py-3 bg-gray-200 text-gray-800 font-medium rounded-lg hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition duration-150 ease-in-out flex items-center"
              >
                <svg
                  className="w-5 h-5 mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
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
        <div className="bg-white shadow-xl rounded-lg overflow-hidden">
          {view === "list" && (
            <AgenceList onEdit={handleEdit} onViewDetails={handleViewDetails} />
          )}

          {view === "create" && (
            <CreateAgenceForm
              onSuccess={handleCreateSuccess}
              onCancel={handleBackToList}
            />
          )}

          {view === "edit" && selectedAgenceId && (
            <EditAgenceForm
              agenceId={selectedAgenceId}
              onSuccess={handleBackToList}
              onCancel={handleBackToList}
            />
          )}

          {view === "details" && selectedAgenceId && (
            <AgenceDetails
              agenceId={selectedAgenceId}
              onEdit={() => handleEdit(selectedAgenceId)}
              onBack={handleBackToList}
            />
          )}
        </div>
      </div>
      <ToastContainer
        position="top-right"
        autoClose={4000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
    </div>
  );
};

export default AgenceManager;
