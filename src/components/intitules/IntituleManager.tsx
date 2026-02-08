// components/intitule/IntituleManager.tsx
import { useState, useEffect } from "react";
import { useIntitules } from "../../stores/useIntituleStore";
import IntituleList from "./IntituleList";
import CreateIntituleForm from "./CreateIntituleForm";
import EditIntituleForm from "./EditIntituleForm";
import IntituleDetails from "./IntituleDetails";
import { ToastContainer } from "react-toastify";

const IntituleManager = () => {
  const [view, setView] = useState<"list" | "create" | "edit" | "details">(
    "list"
  );
  const [selectedIntituleId, setSelectedIntituleId] = useState<string | null>(
    null
  );
  const { loading, error, fetchIntitules } = useIntitules();

  useEffect(() => {
    fetchIntitules();
  }, []);

  const handleCreateSuccess = () => {
    setView("list");
    fetchIntitules();
  };

  const handleEdit = (id: string) => {
    setSelectedIntituleId(id);
    setView("edit");
  };

  const handleViewDetails = (id: string) => {
    setSelectedIntituleId(id);
    setView("details");
  };

  const handleBackToList = () => {
    setView("list");
    setSelectedIntituleId(null);
  };

  if (loading && view === "list") {
    return (
      <div className="flex justify-center items-center h-64">
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
              onClick={() => fetchIntitules()}
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
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* En-tête */}
        <div className="mb-8">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Gestion des Intitulés
              </h1>
              <p className="mt-2 text-gray-600">
                Gérez vos intitulés, créez-en de nouveaux ou modifiez les
                existants.
              </p>
            </div>
            {view === "list" && (
              <button
                onClick={() => setView("create")}
                className="px-6 py-3 bg-purple-600 text-white font-medium rounded-lg hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition duration-150 ease-in-out flex items-center"
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
                Nouvel Intitulé
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
            <IntituleList
              onEdit={handleEdit}
              onViewDetails={handleViewDetails}
            />
          )}

          {view === "create" && (
            <CreateIntituleForm
              onSuccess={handleCreateSuccess}
              onCancel={handleBackToList}
            />
          )}

          {view === "edit" && selectedIntituleId && (
            <EditIntituleForm
              intituleId={selectedIntituleId}
              onSuccess={handleBackToList}
              onCancel={handleBackToList}
            />
          )}

          {view === "details" && selectedIntituleId && (
            <IntituleDetails
              intituleId={selectedIntituleId}
              onEdit={() => handleEdit(selectedIntituleId)}
              onBack={handleBackToList}
            />
          )}
        </div>
      </div>
      <ToastContainer
        position="top-right"
        autoClose={3000}
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

export default IntituleManager;
