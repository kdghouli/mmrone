import React, { useState } from "react";
import type { TaskFilters as FiltersType } from "./task.types";
import { Button } from "./Button";

interface TaskFiltersProps {
  onFilterChange: (filters: FiltersType) => void;
  onClearFilters: () => void;
}

export const TaskFilters: React.FC<TaskFiltersProps> = ({
  onFilterChange,
  onClearFilters,
}) => {
  const [filters, setFilters] = useState<FiltersType>({});

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    const newFilters = { ...filters, [name]: value || undefined };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const handleClear = () => {
    setFilters({});
    onClearFilters();
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow-md mb-6">
      <h3 className="text-lg font-semibold mb-4">Filtres</h3>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Recherche
          </label>
          <input
            type="text"
            name="search"
            value={filters.search || ""}
            onChange={handleChange}
            placeholder="Titre ou description..."
            className="w-full border rounded-md px-3 py-2"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Priorité
          </label>
          <select
            name="priority"
            value={filters.priority || ""}
            onChange={handleChange}
            className="w-full border rounded-md px-3 py-2"
          >
            <option value="">Toutes</option>
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
            <option value="critical">Critical</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Statut
          </label>
          <select
            name="status"
            value={filters.status || ""}
            onChange={handleChange}
            className="w-full border rounded-md px-3 py-2"
          >
            <option value="">Tous</option>
            <option value="open">Open</option>
            <option value="in_progress">In Progress</option>
            <option value="closed">Closed</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Urgence
          </label>
          <select
            name="urgence"
            value={filters.urgence || ""}
            onChange={handleChange}
            className="w-full border rounded-md px-3 py-2"
          >
            <option value="">Toutes</option>
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="urgent">Urgent</option>
          </select>
        </div>
      </div>

      <div className="mt-4 flex justify-end">
        <Button variant="secondary" size="sm" onClick={handleClear}>
          Effacer les filtres
        </Button>
      </div>
    </div>
  );
};
