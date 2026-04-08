// components/DailyCheckDashboard.tsx
import React, { useEffect, useState } from 'react';
import { useDailyCheckStore } from './dailyCheckStore';
import { DailyCheckList } from './DailyCheckList';
import { DailyCheckForm } from './DailyCheckForm';
import { DailyCheckFilters } from './DailyCheckFilters';
import { DailyCheckStats } from './DailyCheckStats';
import { PlusIcon } from '@heroicons/react/24/outline';

export const DailyCheckDashboard: React.FC = () => {
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  
  const {
    deleteDailyCheck,
    setSelectedCheck,
    fetchDailyChecks,
    fetchChariots,
  } = useDailyCheckStore();

  useEffect(() => {
    fetchDailyChecks();
    fetchChariots();
  }, []);

  const handleEdit = (id: string) => {
    setEditingId(id);
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer ce contrôle ?')) {
      await deleteDailyCheck(id);
    }
  };

  const handleFormSuccess = () => {
    setShowForm(false);
    setEditingId(null);
    setSelectedCheck(null);
    fetchDailyChecks();
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingId(null);
    setSelectedCheck(null);
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-7xl mx-auto">
        {/* En-tête */}
        <div className="mb-8">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Contrôle Quotidien des Chariots Élévateurs
              </h1>
              <p className="mt-2 text-gray-600">
                Gestion des inspections quotidiennes pour {15} chariots
              </p>
            </div>
            
            <button
              onClick={() => {
                setEditingId(null);
                setShowForm(true);
              }}
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <PlusIcon className="w-5 h-5 mr-2" />
              Nouveau contrôle
            </button>
          </div>
        </div>

        {/* Statistiques */}
        <DailyCheckStats />

        {/* Filtres */}
        <DailyCheckFilters />

        {/* Contenu principal */}
        {showForm ? (
          <div className="bg-white rounded-lg shadow-lg p-6">
            <DailyCheckForm
              checkId={editingId || undefined}
              onSuccess={handleFormSuccess}
              onCancel={handleCancel}
            />
          </div>
        ) : (
          <DailyCheckList
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        )}
      </div>
    </div>
  );
};