// components/vhl/EditVhlForm.tsx
import React, { useState, useEffect } from 'react';
import { useVhl, useVhls } from '../../stores/useVhlStore';
import { FaCar, FaCalendar, FaWrench, FaInfoCircle, FaExclamationTriangle } from 'react-icons/fa';

interface EditVhlFormProps {
  vhlId: string;
  onSuccess: () => void;
  onCancel: () => void;
}

const EditVhlForm: React.FC<EditVhlFormProps> = ({ vhlId, onSuccess, onCancel }) => {
  const { vhl, loading: loadingVhl } = useVhl(vhlId);
  const { updateVhl, agences, categories, intitules, services, utilisateurs, statuts, loading } = useVhls();
  
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

  useEffect(() => {
    if (vhl) {
      setFormData({
        matricule: vhl.matricule || '',
        marque: vhl.marque || '',
        type: vhl.type || '',
        ww: vhl.ww || '',
        chassis: vhl.chassis || '',
        puissance: vhl.puissance || '',
        date_mc: vhl.date_mc ? vhl.date_mc.split('T')[0] : '',
        observation: vhl.observation || '',
        agence_id: vhl.agence_id || '',
        categorie_id: vhl.categorie_id || '',
        intitule_id: vhl.intitule_id || '',
        service_id: vhl.service_id || '',
        utilisateur_id: vhl.utilisateur_id || '',
        statut_id: vhl.statut_id || ''
      });
    }
  }, [vhl]);

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
    
    const result = await updateVhl(vhlId, formData);
    
    if (result) {
      onSuccess();
    }
  };

  if (loadingVhl) {
    return (
      <div className="flex justify-center items-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!vhl) {
    return (
      <div className="text-center py-12">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-red-100 mb-4">
          <FaExclamationTriangle className="text-2xl text-red-600" />
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">Véhicule non trouvé</h3>
        <button
          onClick={onCancel}
          className="px-4 py-2 bg-gray-100 text-gray-800 rounded-lg hover:bg-gray-200"
        >
          Retour à la liste
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto">
      <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-green-600 to-emerald-600 px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-white">
                Modifier le véhicule: <span className="font-mono">{vhl.matricule}</span>
              </h2>
              <p className="text-emerald-100">Modifiez les informations du véhicule</p>
            </div>
            <div className="flex items-center gap-2 bg-white/20 px-3 py-1 rounded-full">
              <FaCar className="text-white" />
              <span className="text-white font-medium">ID: {vhl.id}</span>
            </div>
          </div>
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
              />
            </div>

            {/* Date MC */}
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
                  className={`w-full px-4 py-3 pl-10 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                    errors.date_mc ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                <FaCalendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              </div>
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

          {/* Informations système */}
          <div className="mt-6 bg-gray-50 p-4 rounded-lg border border-gray-200">
            <h3 className="text-sm font-medium text-gray-700 mb-3 flex items-center gap-2">
              <FaInfoCircle />
              Informations système
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div>
                <span className="font-medium text-gray-600">Créé le:</span>
                <span className="ml-2 text-gray-800">
                  {vhl.created_at ? new Date(vhl.created_at).toLocaleDateString() : '-'}
                </span>
              </div>
              <div>
                <span className="font-medium text-gray-600">Dernière modification:</span>
                <span className="ml-2 text-gray-800">
                  {vhl.updated_at ? new Date(vhl.updated_at).toLocaleDateString() : '-'}
                </span>
              </div>
              <div>
                <span className="font-medium text-gray-600">Statut actuel:</span>
                <span className="ml-2 px-2 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded">
                  {vhl.statut_nom || 'Non défini'}
                </span>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="mt-8 pt-6 border-t border-gray-200 flex justify-between">
            <button
              type="button"
              onClick={onCancel}
              className="px-6 py-3 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
              disabled={loading}
            >
              Annuler
            </button>
            <div className="flex space-x-4">
              <button
                type="button"
                onClick={() => {
                  if (vhl) {
                    setFormData({
                      matricule: vhl.matricule || '',
                      marque: vhl.marque || '',
                      type: vhl.type || '',
                      ww: vhl.ww || '',
                      chassis: vhl.chassis || '',
                      puissance: vhl.puissance || '',
                      date_mc: vhl.date_mc ? vhl.date_mc.split('T')[0] : '',
                      observation: vhl.observation || '',
                      agence_id: vhl.agence_id || '',
                      categorie_id: vhl.categorie_id || '',
                      intitule_id: vhl.intitule_id || '',
                      service_id: vhl.service_id || '',
                      utilisateur_id: vhl.utilisateur_id || '',
                      statut_id: vhl.statut_id || ''
                    });
                    setErrors({});
                  }
                }}
                className="px-6 py-3 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                disabled={loading}
              >
                Réinitialiser
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white font-medium rounded-lg hover:from-green-700 hover:to-emerald-700 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                    Mise à jour...
                  </>
                ) : (
                  <>
                    <FaWrench className="mr-2" />
                    Enregistrer les modifications
                  </>
                )}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditVhlForm;