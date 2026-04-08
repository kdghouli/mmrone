// components/DailyCheckList.tsx
import React, { useEffect } from "react";
import { useDailyCheckStore } from "./dailyCheckStore";
import {
  CheckCircleIcon,
  XCircleIcon,
  PencilIcon,
  TrashIcon,
} from "@heroicons/react/24/outline";

interface DailyCheckListProps {
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
}

export const DailyCheckList: React.FC<DailyCheckListProps> = ({
  onEdit,
  onDelete,
}) => {
  const {
    getFilteredChecks,
    fetchDailyChecks,
    fetchChariots,
    isLoading,
    error,
    chariots,
  } = useDailyCheckStore();

  useEffect(() => {
    fetchDailyChecks();
    fetchChariots();
  }, []);

  const filteredChecks = getFilteredChecks();

  const getChariotName = (chariotId: string) => {
    const chariot = chariots.find((c) => c.id === chariotId);
    return chariot ? chariot.nom : "Inconnu";
  };

  const StatutIcon = ({ value }: { value: boolean }) => {
    return value ? (
      <CheckCircleIcon className="w-5 h-5 text-green-500" />
    ) : (
      <XCircleIcon className="w-5 h-5 text-red-500" />
    );
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
        {error}
      </div>
    );
  }

  return (
    <div className="overflow-x-auto bg-white rounded-lg shadow">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Date
            </th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Chariot
            </th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Frein
            </th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Pneus
            </th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Éclairage
            </th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Batterie
            </th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Kilométrage
            </th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {filteredChecks.map((check) => (
            <tr key={check.id} className="hover:bg-gray-50">
              <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                {new Date(check.dateControle).toLocaleDateString("fr-FR")}
              </td>
              <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                {getChariotName(check.vhl_id)}
              </td>
              <td className="px-4 py-3 whitespace-nowrap">
                <StatutIcon value={check.frein} />
              </td>
              <td className="px-4 py-3 whitespace-nowrap">
                <StatutIcon value={check.pneus} />
              </td>
              <td className="px-4 py-3 whitespace-nowrap">
                <StatutIcon value={check.eclairage} />
              </td>
              <td className="px-4 py-3 whitespace-nowrap">
                <StatutIcon value={check.batterie} />
              </td>
              <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                {check.kilometrage} km
              </td>
              <td className="px-4 py-3 whitespace-nowrap text-sm font-medium">
                <button
                  onClick={() => onEdit?.(check.id)}
                  className="text-blue-600 hover:text-blue-900 mr-3"
                >
                  <PencilIcon className="w-5 h-5" />
                </button>
                <button
                  onClick={() => onDelete?.(check.id)}
                  className="text-red-600 hover:text-red-900"
                >
                  <TrashIcon className="w-5 h-5" />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
