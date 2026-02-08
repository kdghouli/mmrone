// components/utilisateur/CreateUtilisateurForm.tsx
import React, { useState } from "react";
import { useUtilisateurs } from "../../stores/useUtilisateurStore";

interface CreateUtilisateurFormProps {
  onSuccess: () => void;
  onCancel: () => void;
}

const CreateUtilisateurForm: React.FC<CreateUtilisateurFormProps> = ({
  onSuccess,
  onCancel,
}) => {
  const { createUtilisateur, services, agences, loading } = useUtilisateurs();
  const [formData, setFormData] = useState({
    nom: "",
    poste: "",
    service_id: "",
    agence_id: "",
    tel: "",
    mail: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
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

    if (!formData.nom.trim()) {
      newErrors.nom = "Le nom est requis";
    }

    if (!formData.poste.trim()) {
      newErrors.poste = "Le poste est requis";
    }

    if (!formData.mail.trim()) {
      newErrors.mail = "L'email est requis";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.mail)) {
      newErrors.mail = "Format d'email invalide";
    }

    if (formData.tel && !/^[\d\s+()-]{8,20}$/.test(formData.tel)) {
      newErrors.tel = "Numéro de téléphone invalide";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    const result = await createUtilisateur(formData);

    if (result) {
      onSuccess();
    }
  };

  return (
    <div className="p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Nouvel Utilisateur</h2>
        <p className="mt-1 text-gray-600">
          Remplissez les informations pour créer un nouvel utilisateur.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Nom */}
          <div>
            <label
              htmlFor="nom"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Nom complet <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="nom"
              name="nom"
              value={formData.nom}
              onChange={handleChange}
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                errors.nom ? "border-red-500" : "border-gray-300"
              }`}
              placeholder="Ex: Jean Dupont"
            />
            {errors.nom && (
              <p className="mt-1 text-sm text-red-600">{errors.nom}</p>
            )}
          </div>

          {/* Poste */}
          <div>
            <label
              htmlFor="poste"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Poste <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="poste"
              name="poste"
              value={formData.poste}
              onChange={handleChange}
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                errors.poste ? "border-red-500" : "border-gray-300"
              }`}
              placeholder="Ex: Chauffeur"
            />
            {errors.poste && (
              <p className="mt-1 text-sm text-red-600">{errors.poste}</p>
            )}
          </div>

          {/* Service */}
          <div>
            <label
              htmlFor="service_id"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Service
            </label>
            <select
              id="service_id"
              name="service_id"
              value={formData.service_id}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Sélectionnez un service</option>
              {services.map((service) => (
                <option key={service.id} value={service.id}>
                  {service.nom}
                </option>
              ))}
            </select>
          </div>

          {/* Agence */}
          <div>
            <label
              htmlFor="agence_id"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Agence
            </label>
            <select
              id="agence_id"
              name="agence_id"
              value={formData.agence_id}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Sélectionnez une agence</option>
              {agences.map((agence) => (
                <option key={agence.id} value={agence.id}>
                  {agence.nom}
                </option>
              ))}
            </select>
          </div>

          {/* Email */}
          <div>
            <label
              htmlFor="mail"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Email <span className="text-red-500">*</span>
            </label>
            <input
              type="email"
              id="mail"
              name="mail"
              value={formData.mail}
              onChange={handleChange}
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                errors.mail ? "border-red-500" : "border-gray-300"
              }`}
              placeholder="exemple@entreprise.com"
            />
            {errors.mail && (
              <p className="mt-1 text-sm text-red-600">{errors.mail}</p>
            )}
          </div>

          {/* Téléphone */}
          <div>
            <label
              htmlFor="tel"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Téléphone
            </label>
            <input
              type="tel"
              id="tel"
              name="tel"
              value={formData.tel}
              onChange={handleChange}
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                errors.tel ? "border-red-500" : "border-gray-300"
              }`}
              placeholder="+212 6XX XX XX XX"
            />
            {errors.tel && (
              <p className="mt-1 text-sm text-red-600">{errors.tel}</p>
            )}
          </div>
        </div>

        {/* Boutons */}
        <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
          <button
            type="button"
            onClick={onCancel}
            className="px-6 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
            disabled={loading}
          >
            Annuler
          </button>
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-medium rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
          >
            {loading ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                Création...
              </>
            ) : (
              "Créer l'utilisateur"
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateUtilisateurForm;
