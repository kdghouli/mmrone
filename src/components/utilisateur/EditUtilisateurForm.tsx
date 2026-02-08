// components/utilisateur/EditUtilisateurForm.tsx
import React, { useState, useEffect } from "react";
import {
  useUtilisateur,
  useUtilisateurs,
} from "../../stores/useUtilisateurStore";

interface EditUtilisateurFormProps {
  utilisateurId: string;
  onSuccess: () => void;
  onCancel: () => void;
}

const EditUtilisateurForm: React.FC<EditUtilisateurFormProps> = ({
  utilisateurId,
  onSuccess,
  onCancel,
}) => {
  const { utilisateur, loading: loadingUtilisateur } =
    useUtilisateur(utilisateurId);
  const { updateUtilisateur, services, agences, loading } = useUtilisateurs();
  const [formData, setFormData] = useState({
    nom: "",
    poste: "",
    service_id: "",
    agence_id: "",
    tel: "",
    mail: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (utilisateur) {
      setFormData({
        nom: utilisateur.nom,
        poste: utilisateur.poste,
        service_id: utilisateur.service_id,
        agence_id: utilisateur.agence_id,
        tel: utilisateur.tel,
        mail: utilisateur.mail,
      });
    }
  }, [utilisateur]);

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

    const result = await updateUtilisateur(utilisateurId, formData);

    if (result) {
      onSuccess();
    }
  };

  if (loadingUtilisateur) {
    return (
      <div className="p-6">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
        </div>
      </div>
    );
  }

  if (!utilisateur) {
    return (
      <div className="p-6">
        <div className="text-center py-12">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-red-100 mb-4">
            <svg
              className="w-8 h-8 text-red-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.77-.833-2.502 0L4.272 16.5c-.77.833.192 2.5 1.732 2.5z"
              />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Utilisateur non trouvé
          </h3>
          <button
            onClick={onCancel}
            className="px-4 py-2 bg-gray-100 text-gray-800 rounded-lg hover:bg-gray-200"
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
          Modifier l'utilisateur:{" "}
          <span className="text-blue-600">{utilisateur.nom}</span>
        </h2>
        <p className="mt-1 text-gray-600">
          Modifiez les informations de l'utilisateur.
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
            />
            {errors.tel && (
              <p className="mt-1 text-sm text-red-600">{errors.tel}</p>
            )}
          </div>
        </div>

        {/* Informations système */}
        <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
          <h3 className="text-sm font-medium text-gray-700 mb-3">
            Informations système
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <span className="font-medium text-gray-600">ID:</span>
              <span className="ml-2 text-gray-800 font-mono">
                {utilisateur.id}
              </span>
            </div>
            {utilisateur.created_at && (
              <div>
                <span className="font-medium text-gray-600">Créé le:</span>
                <span className="ml-2 text-gray-800">
                  {new Date(utilisateur.created_at).toLocaleDateString()}
                </span>
              </div>
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
            className="px-6 py-2 bg-gradient-to-r from-green-600 to-emerald-600 text-white font-medium rounded-lg hover:from-green-700 hover:to-emerald-700 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
          >
            {loading ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                Mise à jour...
              </>
            ) : (
              "Enregistrer les modifications"
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditUtilisateurForm;
