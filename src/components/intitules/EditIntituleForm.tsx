// components/intitule/EditIntituleForm.tsx
import React, { useState, useEffect } from 'react';
import { useIntitule, useIntitules } from '../../stores/useIntituleStore';

interface EditIntituleFormProps {
  intituleId: string;
  onSuccess: () => void;
  onCancel: () => void;
}

const EditIntituleForm: React.FC<EditIntituleFormProps> = ({ intituleId, onSuccess, onCancel }) => {
  const { intitule, loading: loadingIntitule } = useIntitule(intituleId);
  const { updateIntitule, loading } = useIntitules();
  const [formData, setFormData] = useState({
    nom: '',
    ville: '',
    location: false,
    tel: ''
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (intitule) {
      setFormData({
        nom: intitule.nom,
        ville: intitule.ville,
        location: intitule.location,
        tel: intitule.tel
      });
    }
  }, [intitule]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
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
    
    if (!formData.nom.trim()) {
      newErrors.nom = 'Le nom est requis';
    }
    
    if (!formData.ville.trim()) {
      newErrors.ville = 'La ville est requise';
    }
    
    if (formData.tel && !/^[\d\s+()-]{8,20}$/.test(formData.tel)) {
      newErrors.tel = 'Numéro de téléphone invalide';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    const result = await updateIntitule(intituleId, formData);
    
    if (result) {
      onSuccess();
    }
  };

  if (loadingIntitule) {
    return (
      <div className="p-6">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500"></div>
        </div>
      </div>
    );
  }

  if (!intitule) {
    return (
      <div className="p-6">
        <div className="text-center py-12">
          <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
          </svg>
          <h3 className="mt-2 text-sm font-medium text-gray-900">Intitulé non trouvé</h3>
          <button
            onClick={onCancel}
            className="mt-4 px-4 py-2 bg-gray-100 text-gray-800 rounded-md hover:bg-gray-200"
          >
            Retour à la liste
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900">
          Modifier l'intitulé: <span className="text-purple-600">{intitule.nom}</span>
        </h2>
        <p className="mt-1 text-gray-600">
          Modifiez les informations de l'intitulé ci-dessous.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          {/* Nom */}
          <div className="sm:col-span-2">
            <label htmlFor="nom" className="block text-sm font-medium text-gray-700 mb-1">
              Nom <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="nom"
              name="nom"
              value={formData.nom}
              onChange={handleChange}
              className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition duration-200 ${
                errors.nom ? 'border-red-500 ring-1 ring-red-500' : 'border-gray-300'
              }`}
            />
            {errors.nom && (
              <p className="mt-1 text-sm text-red-600">{errors.nom}</p>
            )}
          </div>

          {/* Ville */}
          <div>
            <label htmlFor="ville" className="block text-sm font-medium text-gray-700 mb-1">
              Ville <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="ville"
              name="ville"
              value={formData.ville}
              onChange={handleChange}
              className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition duration-200 ${
                errors.ville ? 'border-red-500 ring-1 ring-red-500' : 'border-gray-300'
              }`}
            />
            {errors.ville && (
              <p className="mt-1 text-sm text-red-600">{errors.ville}</p>
            )}
          </div>

          {/* Téléphone */}
          <div>
            <label htmlFor="tel" className="block text-sm font-medium text-gray-700 mb-1">
              Téléphone
            </label>
            <input
              type="tel"
              id="tel"
              name="tel"
              value={formData.tel}
              onChange={handleChange}
              className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition duration-200 ${
                errors.tel ? 'border-red-500 ring-1 ring-red-500' : 'border-gray-300'
              }`}
              placeholder="Ex: +212 6XX-XXXXXX"
            />
            {errors.tel && (
              <p className="mt-1 text-sm text-red-600">{errors.tel}</p>
            )}
          </div>

          {/* Location */}
          <div className="sm:col-span-2">
            <div className="flex items-center">
              <input
                type="checkbox"
                id="location"
                name="location"
                checked={formData.location}
                onChange={handleChange}
                className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
              />
              <label htmlFor="location" className="ml-2 block text-sm text-gray-900">
                Avec service de location
              </label>
            </div>
            <p className="mt-1 text-sm text-gray-500">
              Cocher cette case si cet intitulé propose des services de location.
            </p>
          </div>
        </div>

        {/* Informations système */}
        <div className="bg-gray-50 p-4 rounded-lg">
          <h3 className="text-sm font-medium text-gray-700 mb-2">Informations système</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <span className="font-medium text-gray-600">ID:</span>
              <span className="ml-2 text-gray-800 font-mono">{intitule.id}</span>
            </div>
            {intitule.created_at && (
              <div>
                <span className="font-medium text-gray-600">Créé le:</span>
                <span className="ml-2 text-gray-800">
                  {new Date(intitule.created_at).toLocaleDateString()}
                </span>
              </div>
            )}
            <div>
              <span className="font-medium text-gray-600">Statut:</span>
              <span className="ml-2">
                {intitule.location ? (
                  <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800">
                    Avec location
                  </span>
                ) : (
                  <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-red-100 text-red-800">
                    Sans location
                  </span>
                )}
              </span>
            </div>
          </div>
        </div>

        {/* Boutons d'action */}
        <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
          <button
            type="button"
            onClick={onCancel}
            className="px-6 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition duration-150 ease-in-out"
            disabled={loading}
          >
            Annuler
          </button>
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition duration-150 ease-in-out disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
          >
            {loading ? (
              <>
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Mise à jour en cours...
              </>
            ) : (
              'Enregistrer les modifications'
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditIntituleForm;