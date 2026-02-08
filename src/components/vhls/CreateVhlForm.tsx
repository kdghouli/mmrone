/* eslint-disable @typescript-eslint/no-explicit-any */
// components/vhl/CreateVhlForm.tsx
import React, { useState } from 'react';
import { useVhls } from '../../stores/useVhlStore';

interface CreateVhlFormProps {
  onSuccess: () => void;
  onCancel: () => void;
}

const CreateVhlForm: React.FC<CreateVhlFormProps> = ({ onSuccess, onCancel }) => {
  const { createVhl, agences, categories, intitules, services, utilisateurs, statuts, loading } = useVhls();
  const [formData, setFormData] = useState({
    matricule: '',
    marque: '',
    type: '',
    ww: '',
    chassis: '',
    puissance: '',
    date_mc: '',
    observation: '',
    agence_id: '',
    categorie_id: '',
    intitule_id: '',
    service_id: '',
    utilisateur_id: '',
    statut_id: ''
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.matricule.trim()) {
      newErrors.matricule = 'Le matricule est requis';
    }
    
    if (!formData.marque.trim()) {
      newErrors.marque = 'La marque est requise';
    }
    
    if (formData.date_mc && !/^\d{4}-\d{2}-\d{2}$/.test(formData.date_mc)) {
      newErrors.date_mc = 'Format de date invalide (YYYY-MM-DD)';
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
    
    if (result) {
      onSuccess();
    }
  };

  return (
    <div className="max-w-7xl mx-auto">
      <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-4">
          <h2 className="text-2xl font-bold text-white">Nouveau Véhicule</h2>
          <p className="text-blue-100">Remplissez les informations du véhicule</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Matricule */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Matricule <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="matricule"
                value={formData.matricule}
                onChange={handleChange}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                  errors.matricule ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Ex: 1234-A-56"
              />
              {errors.matricule && (
                <p className="mt-2 text-sm text-red-600">{errors.matricule}</p>
              )}
            </div>

            {/* Marque */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Marque <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="marque"
                value={formData.marque}
                onChange={handleChange}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                  errors.marque ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Ex: Toyota"
              />
              {errors.marque && (
                <p className="mt-2 text-sm text-red-600">{errors.marque}</p>
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
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Ex: Camion"
              />
            </div>

            {/* WW */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                WW
              </label>
              <input
                type="text"
                name="ww"
                value={formData.ww}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Ex: WW123456"
              />
            </div>

            {/* Châssis */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Châssis
              </label>
              <input
                type="text"
                name="chassis"
                value={formData.chassis}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Ex: JTEHT05J242"
              />
            </div>

            {/* Puissance */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Puissance
              </label>
              <input
                type="text"
                name="puissance"
                value={formData.puissance}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Ex: 150CV"
              />
            </div>

            {/* Date MC */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Date mise en circulation
              </label>
              <input
                type="date"
                name="date_mc"
                value={formData.date_mc}
                onChange={handleChange}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                  errors.date_mc ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {errors.date_mc && (
                <p className="mt-2 text-sm text-red-600">{errors.date_mc}</p>
              )}
            </div>

            {/* Agence */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Agence
              </label>
              <select
                name="agence_id"
                value={formData.agence_id}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Sélectionnez une agence</option>
                {agences.map(agence => (
                  <option key={agence.id} value={agence.id}>{agence.nom}</option>
                ))}
              </select>
            </div>

            {/* Catégorie */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Catégorie
              </label>
              <select
                name="categorie_id"
                value={formData.categorie_id}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Sélectionnez une catégorie</option>
                {categories.map(categorie => (
                  <option key={categorie.id} value={categorie.id}>{categorie.nom}</option>
                ))}
              </select>
            </div>

            {/* Intitulé */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Intitulé
              </label>
              <select
                name="intitule_id"
                value={formData.intitule_id}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Sélectionnez un intitulé</option>
                {intitules.map(intitule => (
                  <option key={intitule.id} value={intitule.id}>{intitule.nom}</option>
                ))}
              </select>
            </div>

            {/* Service */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Service
              </label>
              <select
                name="service_id"
                value={formData.service_id}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Sélectionnez un service</option>
                {services.map(service => (
                  <option key={service.id} value={service.id}>{service.nom}</option>
                ))}
              </select>
            </div>

            {/* Utilisateur */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Utilisateur
              </label>
              <select
                name="utilisateur_id"
                value={formData.utilisateur_id}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Sélectionnez un utilisateur</option>
                {utilisateurs.map(utilisateur => (
                  <option key={utilisateur.id} value={utilisateur.id}>{utilisateur.nom}</option>
                ))}
              </select>
            </div>

            {/* Statut */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Statut
              </label>
              <select
                name="statut_id"
                value={formData.statut_id}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Sélectionnez un statut</option>
                {statuts.map(statut => (
                  <option key={statut.id} value={statut.id}>{statut.nom}</option>
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
              rows={3}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Notes supplémentaires..."
            />
          </div>

          {/* Actions */}
          <div className="mt-8 pt-6 border-t border-gray-200 flex justify-end space-x-4">
            <button
              type="button"
              onClick={onCancel}
              className="px-6 py-3 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
              disabled={loading}
            >
              Annuler
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-medium rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  Création en cours...
                </>
              ) : (
                'Créer le véhicule'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateVhlForm;