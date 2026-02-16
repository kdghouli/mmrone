/* eslint-disable @typescript-eslint/no-explicit-any */
// components/vhl/CreateVhlProForm.tsx
import React, { useState } from "react";
import { useVhlsPro } from "../../stores/useVhlProStore";
import { FaCar, FaCalendar, FaPlus, FaTimes } from "react-icons/fa";

interface CreateVhlProFormProps {
  onSuccess: (vhl: any) => void;
  onCancel: () => void;
}

const CreateVhlProForm: React.FC<CreateVhlProFormProps> = ({
  onSuccess,
  onCancel,
}) => {
  const {
    createVhl,
    agences,
    categories,
    intitules,
    services,
    utilisateurs,
    statuts,
    loading,
  } = useVhlsPro();
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

    const result = await createVhl(formData as any);

    console.log(`formDataCreateVhlResult :  ${result}`);
    console.log(`formDataCreateVhl :  ${formData}`);
    if (result) {
      onSuccess(result);
    }
  };

  const handleReset = () => {
    setFormData({
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
    setErrors({});
  };

  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
      {/* Header */}
      <div className="bg-linear-to-r from-blue-600 to-indigo-600 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-white/20 rounded-lg">
              <FaPlus className="text-white text-xl" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">Nouveau Véhicule</h2>
              <p className="text-blue-100 text-sm">
                Remplissez les informations du nouveau véhicule
              </p>
            </div>
          </div>
          <button
            onClick={onCancel}
            className="p-2 text-white hover:bg-white/20 rounded-lg transition-colors"
            title="Fermer"
          >
            <FaTimes />
          </button>
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
                placeholder="Ex: 1234-A-56"
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
              placeholder="Ex: Toyota"
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
              placeholder="Ex: Camion, Voiture..."
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
              placeholder="Ex: WW123456"
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
              placeholder="Ex: JTEHT05J242"
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
              placeholder="Ex: 150CV"
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

        {/* Actions */}
        <div className="mt-8 pt-6 border-t border-gray-200 flex justify-between">
          <div className="flex gap-3">
            <button
              type="button"
              onClick={onCancel}
              className="px-5 py-2.5 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
              disabled={loading}
            >
              Annuler
            </button>
            <button
              type="button"
              onClick={handleReset}
              className="px-5 py-2.5 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
              disabled={loading}
            >
              Réinitialiser
            </button>
          </div>
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-2.5 bg-linear-to-r from-blue-600 to-indigo-600 text-white font-medium rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {loading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                Création en cours...
              </>
            ) : (
              <>
                <FaPlus className="text-sm" />
                Créer le véhicule
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateVhlProForm;
