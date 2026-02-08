/* eslint-disable @typescript-eslint/no-explicit-any */
// components/vhl/EditVhlProForm.tsx
import React, { useState, useEffect } from "react";
import { useVhlsPro, useVhlPro } from "../../stores/useVhlProStore";
import { FaCar, FaCalendar, FaWrench, FaUndo, FaSave } from "react-icons/fa";

interface EditVhlProFormProps {
  vhlId: string;
  onSuccess: (vhl: any) => void;
  onCancel: () => void;
}

const EditVhlProForm: React.FC<EditVhlProFormProps> = ({
  vhlId,
  onSuccess,
  onCancel,
}) => {
  const {
    selectedVhl,
    updateVhl,
    agences,
    categories,
    intitules,
    services,
    utilisateurs,
    statuts,
    loading,
  } = useVhlsPro();
  const { loading: loadingVhl } = useVhlPro(vhlId);

  const [formData, setFormData] = useState({
    matricule: "",
    marque: "",
    type: "",
    ww: "",
    chassis: "",
    puissance: "",
    date_mc: "",
    observation: "",
    agence_id: "",
    categorie_id: "",
    intitule_id: "",
    service_id: "",
    utilisateur_id: "",
    statut_id: "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (selectedVhl) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setFormData({
        matricule: selectedVhl.matricule || "",
        marque: selectedVhl.marque || "",
        type: selectedVhl.type || "",
        ww: selectedVhl.ww || "",
        chassis: selectedVhl.chassis || "",
        puissance: selectedVhl.puissance || "",
        date_mc: selectedVhl.date_mc ? selectedVhl.date_mc.split("T")[0] : "",
        observation: selectedVhl.observation || "",
        agence_id: selectedVhl.agence_id || "",
        categorie_id: selectedVhl.categorie_id || "",
        intitule_id: selectedVhl.intitule_id || "",
        service_id: selectedVhl.service_id || "",
        utilisateur_id: selectedVhl.utilisateur_id || "",
        statut_id: selectedVhl.statut_id || "",
      });
    }
  }, [selectedVhl]);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.matricule.trim()) {
      newErrors.matricule = "Le matricule est requis";
    }

    if (!formData.marque.trim()) {
      newErrors.marque = "La marque est requise";
    }

    if (formData.date_mc && !/^\d{4}-\d{2}-\d{2}$/.test(formData.date_mc)) {
      newErrors.date_mc = "Format de date invalide (YYYY-MM-DD)";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    const result = await updateVhl(vhlId, formData);

    if (result) {
      onSuccess(result);
    }
  };

  const handleReset = () => {
    if (selectedVhl) {
      setFormData({
        matricule: selectedVhl.matricule || "",
        marque: selectedVhl.marque || "",
        type: selectedVhl.type || "",
        ww: selectedVhl.ww || "",
        chassis: selectedVhl.chassis || "",
        puissance: selectedVhl.puissance || "",
        date_mc: selectedVhl.date_mc ? selectedVhl.date_mc.split("T")[0] : "",
        observation: selectedVhl.observation || "",
        agence_id: selectedVhl.agence_id || "",
        categorie_id: selectedVhl.categorie_id || "",
        intitule_id: selectedVhl.intitule_id || "",
        service_id: selectedVhl.service_id || "",
        utilisateur_id: selectedVhl.utilisateur_id || "",
        statut_id: selectedVhl.statut_id || "",
      });
      setErrors({});
    }
  };

  if (loadingVhl || !selectedVhl) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
      {/* Header */}
      <div className="bg-linear-to-r from-green-600 to-emerald-600 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-white/20 rounded-lg">
              <FaWrench className="text-white text-xl" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">
                Modifier:{" "}
                <span className="font-mono">{selectedVhl.matricule}</span>
              </h2>
              <p className="text-emerald-100 text-sm">
                {selectedVhl.marque}{" "}
                {selectedVhl.type && `• ${selectedVhl.type}`}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 bg-white/20 px-3 py-1 rounded-full">
            <FaCar className="text-white text-sm" />
            <span className="text-white text-sm font-medium">
              ID: {selectedVhl.id}
            </span>
          </div>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Matricule */}
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <span className="text-red-500">*</span> Matricule
            </label>
            <div className="relative">
              <input
                type="text"
                name="matricule"
                value={formData.matricule}
                onChange={handleChange}
                className={`w-full pl-10 pr-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                  errors.matricule ? "border-red-500" : "border-gray-300"
                }`}
              />
              <FaCar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            </div>
            {errors.matricule && (
              <p className="mt-1 text-sm text-red-600">{errors.matricule}</p>
            )}
          </div>

          {/* Marque */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <span className="text-red-500">*</span> Marque
            </label>
            <input
              type="text"
              name="marque"
              value={formData.marque}
              onChange={handleChange}
              className={`w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                errors.marque ? "border-red-500" : "border-gray-300"
              }`}
            />
            {errors.marque && (
              <p className="mt-1 text-sm text-red-600">{errors.marque}</p>
            )}
          </div>

          {/* Type */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Type
            </label>
            <input
              type="text"
              name="type"
              value={formData.type}
              onChange={handleChange}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          {/* WW et Châssis */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              WW
            </label>
            <input
              type="text"
              name="ww"
              value={formData.ww}
              onChange={handleChange}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Châssis
            </label>
            <input
              type="text"
              name="chassis"
              value={formData.chassis}
              onChange={handleChange}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          {/* Puissance et Date MC */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Puissance
            </label>
            <input
              type="text"
              name="puissance"
              value={formData.puissance}
              onChange={handleChange}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Date mise en circulation
            </label>
            <div className="relative">
              <input
                type="date"
                name="date_mc"
                value={formData.date_mc}
                onChange={handleChange}
                className={`w-full pl-10 pr-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                  errors.date_mc ? "border-red-500" : "border-gray-300"
                }`}
              />
              <FaCalendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            </div>
            {errors.date_mc && (
              <p className="mt-1 text-sm text-red-600">{errors.date_mc}</p>
            )}
          </div>

          {/* Agence et Catégorie */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Agence
            </label>
            <select
              name="agence_id"
              value={formData.agence_id}
              onChange={handleChange}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Sélectionnez une agence</option>
              {agences.map((agence) => (
                <option key={agence.id} value={agence.id}>
                  {agence.nom}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Catégorie
            </label>
            <select
              name="categorie_id"
              value={formData.categorie_id}
              onChange={handleChange}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Sélectionnez une catégorie</option>
              {categories.map((categorie) => (
                <option key={categorie.id} value={categorie.id}>
                  {categorie.nom}
                </option>
              ))}
            </select>
          </div>

          {/* Intitulé et Service */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Intitulé
            </label>
            <select
              name="intitule_id"
              value={formData.intitule_id}
              onChange={handleChange}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Sélectionnez un intitulé</option>
              {intitules.map((intitule) => (
                <option key={intitule.id} value={intitule.id}>
                  {intitule.nom}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Service
            </label>
            <select
              name="service_id"
              value={formData.service_id}
              onChange={handleChange}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Sélectionnez un service</option>
              {services.map((service) => (
                <option key={service.id} value={service.id}>
                  {service.nom}
                </option>
              ))}
            </select>
          </div>

          {/* Utilisateur et Statut */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Utilisateur
            </label>
            <select
              name="utilisateur_id"
              value={formData.utilisateur_id}
              onChange={handleChange}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Sélectionnez un utilisateur</option>
              {utilisateurs.map((utilisateur) => (
                <option key={utilisateur.id} value={utilisateur.id}>
                  {utilisateur.nom}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Statut
            </label>
            <select
              name="statut_id"
              value={formData.statut_id}
              onChange={handleChange}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Sélectionnez un statut</option>
              {statuts.map((statut) => (
                <option key={statut.id} value={statut.id}>
                  {statut.nom}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Observation */}
        <div className="mt-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Observation
          </label>
          <textarea
            name="observation"
            value={formData.observation}
            onChange={handleChange}
            rows={2}
            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Notes supplémentaires..."
          />
        </div>

        {/* Informations système */}
        <div className="mt-6 bg-gray-50 p-4 rounded-lg border border-gray-200">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div>
              <span className="font-medium text-gray-600">Créé le:</span>
              <span className="ml-2 text-gray-800">
                {selectedVhl.created_at
                  ? new Date(selectedVhl.created_at).toLocaleDateString()
                  : "-"}
              </span>
            </div>
            <div>
              <span className="font-medium text-gray-600">
                Dernière modification:
              </span>
              <span className="ml-2 text-gray-800">
                {selectedVhl.updated_at
                  ? new Date(selectedVhl.updated_at).toLocaleDateString()
                  : "-"}
              </span>
            </div>
            <div>
              <span className="font-medium text-gray-600">Statut actuel:</span>
              <span className="ml-2 px-2 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded">
                {selectedVhl.statut_nom || "Non défini"}
              </span>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="mt-8 pt-6 border-t border-gray-200 flex justify-between">
          <button
            type="button"
            onClick={onCancel}
            className="px-5 py-2.5 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
            disabled={loading}
          >
            Annuler
          </button>
          <div className="flex gap-3">
            <button
              type="button"
              onClick={handleReset}
              className="px-5 py-2.5 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors flex items-center gap-2"
              disabled={loading}
            >
              <FaUndo />
              Réinitialiser
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2.5 bg-linear-to-r from-green-600 to-emerald-600 text-white font-medium rounded-lg hover:from-green-700 hover:to-emerald-700 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  Mise à jour...
                </>
              ) : (
                <>
                  <FaSave />
                  Enregistrer
                </>
              )}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default EditVhlProForm;
