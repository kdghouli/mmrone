/* eslint-disable @typescript-eslint/no-explicit-any */
// components/vhl/VhlManagerPro.tsx
import { useState, useEffect } from "react";
import { useVhlsPro } from "../../stores/useVhlProStore";
import CreateVhlProForm from "./CreateVhlProForm";
import EditVhlProForm from "./EditVhlProForm";
import VhlListPro from "./VhlListPro";
import VhlDetailsPro from "./VhlDetailsPro";
import { FaPlus, FaCar, FaCogs, FaChartBar } from "react-icons/fa";
import VhlCommentsPro from "./VhlCommentsPro";
import UserAvatar from "../Auth/UserAvatar";

const VhlManagerPro = () => {
  const [view, setView] = useState<
    "list" | "create" | "edit" | "details" | "comments"
  >("list");
  const {
    selectedVhl,
    setSelectedVhl,
    fetchAllVhls,
    fetchReferenceData,
    allVhls,
    loading,
  } = useVhlsPro();

  useEffect(() => {
    const loadData = async () => {
      // Charger les données de référence
      await fetchReferenceData();
      // Charger les véhicules
      await fetchAllVhls();
    };
    loadData();
  }, []);

  const handleCreateSuccess = (newVhl: any) => {
    setView("details");
    setSelectedVhl(newVhl);
  };

  const handleEdit = () => {
    if (selectedVhl) {
      setView("edit");
    }
  };

  const handleBackToList = () => {
    setView("list");
  };

  const handleViewDetails = (id: string) => {
    const vhl = allVhls.find((v) => v.id === id);
    if (vhl) {
      setSelectedVhl(vhl);
      setView("details");
    }
  };

  const handleSelectVhl = (vhl: any) => {
    setSelectedVhl(vhl);
    setView("details");
  };

  const handleSelectVhlComments = (id: any) => {
    const vhl = allVhls.find((v) => v.id === id);
    if (vhl) {
      setSelectedVhl(vhl);
      setView("comments");
    }
  };

  const handleCreateNew = () => {
    setSelectedVhl(null);
    setView("create");
  };

  const handleUpdateSuccess = (updatedVhl: any) => {
    setView("details");
    setSelectedVhl(updatedVhl);
  };

  return (
    <div className=" bg-linear-to-br from-gray-50 to-blue-200 max-w-full min-h-screen">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 shadow-sm">
        <div className="container mx-auto px-6 py-2">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-linear-to-r from-blue-500 to-indigo-600 rounded-lg">
                <FaCar className="text-2xl text-white" />
              </div>
              <div>
                <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
                  Gestion Professionnelle des Véhicules
                </h1>
                <p className="text-gray-600">
                  Interface complète avec vue détaillée et formulaire côte à
                  côte
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="bg-gray-100 px-4 py-2 rounded-lg">
                <span className="text-sm text-gray-600">Total:</span>
                <span className="ml-2 font-bold text-blue-600">
                  {allVhls.length} véhicules
                </span>
              </div>

              <UserAvatar showDropdown={false} />

              <button
                onClick={handleCreateNew}
                className="px-5 py-2.5 bg-linear-to-r from-blue-600 to-indigo-600 text-white font-medium rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 flex items-center gap-2 shadow-md hover:shadow-lg"
              >
                <FaPlus />
                Nouveau Véhicule
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content - Layout côte à côte */}
      <div className="px-4 py-2 container ">
        <div className=" flex flex-col lg:flex-row  gap-3">
          {/* Colonne gauche - Liste des véhicules */}
          <div className="lg:w-3/7">
            <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden h-full">
              <div className="p-4 border-b border-gray-200 bg-linear-to-r from-gray-100 to-white">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                    <FaCar className="text-gray-700" />
                    Liste des Véhicules
                  </h2>
                  <div className="flex items-center gap-2">
                    {loading && (
                      <div className="flex items-center gap-2 text-sm text-gray-500">
                        <FaCogs className="animate-spin" />
                        Chargement...
                      </div>
                    )}
                    <span className="text-sm font-medium text-gray-600 bg-blue-50 px-3 py-1 rounded-full">
                      {allVhls.length} véhicules
                    </span>
                  </div>
                </div>
              </div>

              {/* Liste */}
              <VhlListPro
                onEdit={(id) => {
                  const vhl = allVhls.find((v) => v.id === id);
                  if (vhl) {
                    setSelectedVhl(vhl);
                    setView("edit");
                  }
                }}
                onViewDetails={handleViewDetails}
                onSelectVhl={handleSelectVhl}
                onSetComments={handleSelectVhlComments}
              />
            </div>
          </div>

          {/* Colonne droite - Détails/Formulaire */}
          <div className="lg:basis-4/7 max-w-5/6 ">
            <div className="">
              <div className="sticky top-6">
                {view === "create" && (
                  <CreateVhlProForm
                    onSuccess={handleCreateSuccess}
                    onCancel={handleBackToList}
                  />
                )}

                {view === "edit" && selectedVhl && (
                  <EditVhlProForm
                    vhlId={selectedVhl.id}
                    onSuccess={handleUpdateSuccess}
                    onCancel={() => setView("details")}
                  />
                )}

                {view === "details" && selectedVhl && (
                  <VhlDetailsPro
                    vhlId={selectedVhl.id}
                    onEdit={handleEdit}
                    onBack={handleBackToList}
                  />
                )}
                {view === "comments" && selectedVhl && (
                  <VhlCommentsPro
                    vhlId={selectedVhl.id}
                    onEdit={handleEdit}
                    onBack={handleBackToList}
                  />
                )}

                {view === "list" && !selectedVhl && (
                  <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden h-full">
                    <div className="p-8 text-center">
                      <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-blue-100 mb-6">
                        <FaChartBar className="text-3xl text-blue-600" />
                      </div>
                      <h3 className="text-xl font-bold text-gray-900 mb-3">
                        Bienvenue dans la Gestion des Véhicules
                      </h3>
                      <p className="text-gray-600 mb-6 max-w-md mx-auto">
                        Sélectionnez un véhicule dans la liste pour voir ses
                        détails, ou créez un nouveau véhicule pour commencer.
                      </p>
                      <button
                        onClick={handleCreateNew}
                        className="px-6 py-3 bg-linear-to-r from-blue-600 to-indigo-600 text-white font-medium rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 flex items-center gap-2 mx-auto"
                      >
                        <FaPlus />
                        Créer votre premier véhicule
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VhlManagerPro;
