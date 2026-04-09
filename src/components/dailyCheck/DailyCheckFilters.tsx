// components/DailyCheckFilters.tsx
import React from "react";
import { useDailyCheckStore } from "./dailyCheckStore";

export const DailyCheckFilters: React.FC = () => {
  const {
    chariots,
    filterDate,
    filterChariotId,
    setFilterDate,
    setFilterChariotId,
  } = useDailyCheckStore();

  return (
    <div className="bg-white p-4 rounded-lg shadow mb-6">
      <h3 className="text-lg font-semibold text-gray-700 mb-4">Filtres</h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Date
          </label>
          <input
            type="date"
            value={filterDate ? filterDate.toISOString().split("T")[0] : ""}
            onChange={(e) =>
              setFilterDate(e.target.value ? new Date(e.target.value) : null)
            }
            className="bg-yellow-50 mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Chariot
          </label>
          <select
            value={filterChariotId || ""}
            className="bg-yellow-50 mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
            onChange={(e) => setFilterChariotId(e.target.value || null)}
          >
            <option value="">Tous les chariots</option>
            {chariots.map((chariot) => (
              <option key={chariot.id} value={chariot.id}>
                {chariot.matricule} - {chariot.marque}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="mt-4 flex justify-end">
        <button
          onClick={() => {
            setFilterDate(new Date());
            setFilterChariotId(null);
          }}
          className="text-sm text-gray-600 hover:text-gray-900"
        >
          Réinitialiser les filtres
        </button>
      </div>
    </div>
  );
};
