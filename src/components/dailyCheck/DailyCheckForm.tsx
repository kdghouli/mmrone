// components/DailyCheckForm.tsx
import React, { useState, useEffect } from "react";
import { useDailyCheckStore } from "./dailyCheckStore";
import type { DailyCheckFormData } from "./type";

interface DailyCheckFormProps {
  checkId?: string;
  onSuccess?: () => void;
  onCancel?: () => void;
}

export const DailyCheckForm: React.FC<DailyCheckFormProps> = ({
  checkId,
  onSuccess,
  onCancel,
}) => {
  const {
    chariots,
    getCheckById,
    createDailyCheck,
    updateDailyCheck,
    fetchChariots,
    isLoading,
  } = useDailyCheckStore();

  const [formData, setFormData] = useState<DailyCheckFormData>({
    dateControle: new Date().toISOString().split("T")[0],
    frein: true,
    pneus: true,
    eclairage: true,
    extincteur: true,
    batterie: true,
    fuite: false,
    avertisseur: true,
    ceinture: true,
    retroviseur: true,
    observation: "",
    kilometrage: 0,
    vhl_id: "",
  });

  useEffect(() => {
    fetchChariots();
    if (checkId) {
      const check = getCheckById(checkId);
      if (check) {
        setFormData({
          dateControle: new Date(check.dateControle)
            .toISOString()
            .split("T")[0],
          frein: check.frein,
          pneus: check.pneus,
          eclairage: check.eclairage,
          extincteur: check.extincteur,
          batterie: check.batterie,
          fuite: check.fuite,
          avertisseur: check.avertisseur,
          ceinture: check.ceinture,
          retroviseur: check.retroviseur,
          observation: check.observation,
          kilometrage: check.kilometrage,
          vhl_id: check.vhl_id,
        });
      }
    }
  }, [checkId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (checkId) {
      await updateDailyCheck(checkId, formData);
    } else {
      await createDailyCheck(formData);
    }

    onSuccess?.();
  };

  const handleCheckboxChange = (name: keyof DailyCheckFormData) => {
    setFormData((prev) => ({
      ...prev,
      [name]: !prev[name],
    }));
  };

  const CheckboxField: React.FC<{
    name: keyof DailyCheckFormData;
    label: string;
    required?: boolean;
  }> = ({ name, label, required = true }) => (
    <div className="flex items-center">
      <input
        type="checkbox"
        id={name}
        checked={formData[name] as boolean}
        onChange={() => handleCheckboxChange(name)}
        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
      />
      <label htmlFor={name} className="ml-2 block text-sm text-gray-900">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
    </div>
  );

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white p-6 rounded-lg shadow-lg max-w-4xl mx-auto"
    >
      <h2 className="text-2xl font-bold mb-6 text-gray-900">
        {checkId ? "Modifier le contrôle" : "Nouveau contrôle quotidien"}
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Section informations générales */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-700 mb-3">
            Informations générales
          </h3>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Chariot <span className="text-red-500">*</span>
            </label>
            <select
              value={formData.vhl_id}
              onChange={(e) =>
                setFormData({ ...formData, vhl_id: e.target.value })
              }
              required
              className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
            >
              <option value="">Sélectionner un chariot</option>
              {chariots.map((chariot) => (
                <option key={chariot.id} value={chariot.id}>
                  {chariot.nom} - {chariot.type}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Date du contrôle <span className="text-red-500">*</span>
            </label>
            <input
              type="date"
              value={formData.dateControle}
              onChange={(e) =>
                setFormData({ ...formData, dateControle: e.target.value })
              }
              required
              className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Kilométrage
            </label>
            <input
              type="number"
              value={formData.kilometrage}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  kilometrage: Number(e.target.value),
                })
              }
              min="0"
              step="1"
              className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Observations
            </label>
            <textarea
              value={formData.observation}
              onChange={(e) =>
                setFormData({ ...formData, observation: e.target.value })
              }
              rows={4}
              className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
              placeholder="Notes ou observations particulières..."
            />
          </div>
        </div>

        {/* Section vérifications */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-700 mb-3">
            Points de contrôle
          </h3>

          <div className="grid grid-cols-2 gap-4 bg-gray-50 p-4 rounded-lg">
            <CheckboxField name="frein" label="Freins" />
            <CheckboxField name="pneus" label="Pneus" />
            <CheckboxField name="eclairage" label="Éclairage" />
            <CheckboxField name="extincteur" label="Extincteur" />
            <CheckboxField name="batterie" label="Batterie" />
            <CheckboxField name="fuite" label="Absence de fuite" />
            <CheckboxField name="avertisseur" label="Avertisseur sonore" />
            <CheckboxField name="ceinture" label="Ceinture de sécurité" />
            <CheckboxField name="retroviseur" label="Rétroviseurs" />
          </div>

          {/* Résumé des anomalies */}
          <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-lg">
            <h4 className="font-semibold text-yellow-800 mb-2">
              Points d'attention :
            </h4>
            <ul className="text-sm text-yellow-700 space-y-1">
              {!formData.frein && <li>⚠️ Vérifier les freins</li>}
              {!formData.pneus && <li>⚠️ Vérifier l'état des pneus</li>}
              {!formData.eclairage && <li>⚠️ Vérifier l'éclairage</li>}
              {!formData.extincteur && <li>⚠️ Vérifier l'extincteur</li>}
              {!formData.batterie && <li>⚠️ Vérifier la batterie</li>}
              {!formData.fuite && <li>⚠️ Présence de fuite détectée</li>}
              {!formData.avertisseur && <li>⚠️ Vérifier l'avertisseur</li>}
              {!formData.ceinture && <li>⚠️ Vérifier la ceinture</li>}
              {!formData.retroviseur && <li>⚠️ Vérifier les rétroviseurs</li>}
              {Object.values(formData).every((v) =>
                typeof v === "boolean" ? v === true : true,
              ) && <li>✅ Tous les points sont conformes</li>}
            </ul>
          </div>
        </div>
      </div>

      {/* Boutons d'action */}
      <div className="mt-8 flex justify-end space-x-3">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          Annuler
        </button>
        <button
          type="submit"
          disabled={isLoading || !formData.vhl_id}
          className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading
            ? "Enregistrement..."
            : checkId
              ? "Mettre à jour"
              : "Créer le contrôle"}
        </button>
      </div>
    </form>
  );
};
