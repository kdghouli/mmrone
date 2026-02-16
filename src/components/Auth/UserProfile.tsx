/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import {
  FaUser,
  FaEnvelope,
  FaCalendar,
  FaEdit,
  FaCamera,
  FaSave,
  FaTimes,
  FaShieldAlt,
  FaKey,
  FaUserCircle,
} from "react-icons/fa";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useAuth } from "../../stores/useAuthStore";
import { STORAGE_BASE_URL } from "../../utils/donnee";

interface UserProfileProps {
  compact?: boolean;
  editable?: boolean;
}

function UserProfile({ compact = false, editable = true }: UserProfileProps) {
  const { user, updateProfile, isLoading } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({
    name: user?.name || "",
    email: user?.email || "",
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>(user?.image || "");

  if (!user) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-center">
          <FaUserCircle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600">Non connecté</p>
        </div>
      </div>
    );
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Vérifier la taille (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast.error("L'image ne doit pas dépasser 5MB");
        return;
      }

      // Vérifier le type
      if (!file.type.startsWith("image/")) {
        toast.error("Veuillez sélectionner une image valide");
        return;
      }

      setSelectedImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleEditChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setEditData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Clear error for this field
    if (errors[name as keyof typeof errors]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    };
    let isValid = true;

    if (!editData.name.trim()) {
      newErrors.name = "Le nom est requis";
      isValid = false;
    }

    if (!editData.email) {
      newErrors.email = "L'email est requis";
      isValid = false;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(editData.email)) {
      newErrors.email = "Format d'email invalide";
      isValid = false;
    }

    // Vérifier le mot de passe uniquement s'il est renseigné
    if (editData.password) {
      if (editData.password.length < 8) {
        newErrors.password = "Minimum 8 caractères";
        isValid = false;
      }

      if (editData.password !== editData.confirmPassword) {
        newErrors.confirmPassword = "Les mots de passe ne correspondent pas";
        isValid = false;
      }
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      const userData: any = {
        name: editData.name,
        email: editData.email,
      };

      if (editData.password) {
        userData.password = editData.password;
      }

      if (selectedImage) {
        userData.image = selectedImage;
      }

      await updateProfile(userData);

      toast.success("Profil mis à jour avec succès !", {
        position: "top-right",
        autoClose: 3000,
      });

      setIsEditing(false);
      setEditData({
        name: user.name,
        email: user.email,
        password: "",
        confirmPassword: "",
      });
      setSelectedImage(null);
    } catch (error: any) {
      toast.error(`❌ ${error.message || "Erreur lors de la mise à jour"}`, {
        position: "top-right",
        autoClose: 3000,
      });
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditData({
      name: user.name,
      email: user.email,
      password: "",
      confirmPassword: "",
    });
    setSelectedImage(null);
    setImagePreview(user.image || "");
    setErrors({ name: "", email: "", password: "", confirmPassword: "" });
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("fr-FR", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  // Version compacte (pour header/sidebar)
  if (compact) {
    return (
      <div className="flex items-center space-x-3 p-2 hover:bg-gray-50 rounded-lg transition-colors">
        <div className="relative">
          {user.image ? (
            <img
              src={user.image}
              alt={user.name}
              className="w-10 h-10 rounded-full object-cover border-2 border-white shadow-sm"
            />
          ) : (
            <div className="w-10 h-10 rounded-full bg-linear-to-r from-blue-500 to-purple-600 flex items-center justify-center text-white font-semibold">
              {user.name.charAt(0).toUpperCase()}
            </div>
          )}
          <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-medium text-gray-900 truncate">{user.name}</p>
          <p className="text-xs text-gray-500 truncate">{user.email}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8 border border-gray-200">
      {/* En-tête */}
      <div className="flex justify-between items-start mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">
            Profil Utilisateur
          </h2>
          <p className="text-gray-600">Gérez vos informations personnelles</p>
        </div>

        {editable && !isEditing && (
          <button
            onClick={() => setIsEditing(true)}
            className="flex items-center space-x-2 px-4 py-2 bg-linear-to-r from-blue-500 to-purple-600 text-white rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all duration-300 shadow-md hover:shadow-lg"
          >
            <FaEdit />
            <span>Modifier</span>
          </button>
        )}
      </div>

      {isEditing ? (
        /* Mode édition */
        <form onSubmit={handleSubmit}>
          <div className="space-y-6">
            {/* Photo de profil */}
            <div className="flex flex-col items-center mb-8">
              <div className="relative mb-4">
                <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-white shadow-lg">
                  {imagePreview ? (
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="w-full h-full object-cover"
                    />
                  ) : user.image ? (
                    <img
                      src={user.image}
                      alt={user.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-linear-to-r from-blue-500 to-purple-600 flex items-center justify-center text-white text-4xl font-bold">
                      {user.name.charAt(0).toUpperCase()}
                    </div>
                  )}
                </div>
                <label
                  htmlFor="image-upload"
                  className="absolute bottom-2 right-2 p-2 bg-white rounded-full shadow-lg cursor-pointer hover:bg-gray-50 transition-colors"
                >
                  <FaCamera className="text-gray-700" />
                  <input
                    id="image-upload"
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                  />
                </label>
              </div>
              <p className="text-sm text-gray-500">
                Cliquez sur l'icône pour changer de photo
              </p>
            </div>

            {/* Nom */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <div className="flex items-center">
                  <FaUser className="mr-2 text-gray-400" />
                  Nom complet
                </div>
              </label>
              <input
                type="text"
                name="name"
                value={editData.name}
                onChange={handleEditChange}
                className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 transition-all duration-200 ${
                  errors.name
                    ? "border-red-500 focus:ring-red-500/30"
                    : "border-gray-300 focus:ring-blue-500/30"
                }`}
              />
              {errors.name && (
                <p className="mt-2 text-sm text-red-600">{errors.name}</p>
              )}
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <div className="flex items-center">
                  <FaEnvelope className="mr-2 text-gray-400" />
                  Adresse email
                </div>
              </label>
              <input
                type="email"
                name="email"
                value={editData.email}
                onChange={handleEditChange}
                className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 transition-all duration-200 ${
                  errors.email
                    ? "border-red-500 focus:ring-red-500/30"
                    : "border-gray-300 focus:ring-blue-500/30"
                }`}
              />
              {errors.email && (
                <p className="mt-2 text-sm text-red-600">{errors.email}</p>
              )}
            </div>

            {/* Mot de passe */}
            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
              <div className="flex items-center mb-3">
                <FaKey className="text-gray-500 mr-2" />
                <h3 className="font-medium text-gray-900">
                  Changer le mot de passe
                </h3>
                <span className="ml-2 text-xs text-gray-500">(Optionnel)</span>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm text-gray-600 mb-1">
                    Nouveau mot de passe
                  </label>
                  <input
                    type="password"
                    name="password"
                    value={editData.password}
                    onChange={handleEditChange}
                    placeholder="Laissez vide pour ne pas changer"
                    className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 transition-all duration-200 ${
                      errors.password
                        ? "border-red-500 focus:ring-red-500/30"
                        : "border-gray-300 focus:ring-blue-500/30"
                    }`}
                  />
                  {errors.password && (
                    <p className="mt-2 text-sm text-red-600">
                      {errors.password}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm text-gray-600 mb-1">
                    Confirmer le mot de passe
                  </label>
                  <input
                    type="password"
                    name="confirmPassword"
                    value={editData.confirmPassword}
                    onChange={handleEditChange}
                    className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 transition-all duration-200 ${
                      errors.confirmPassword
                        ? "border-red-500 focus:ring-red-500/30"
                        : "border-gray-300 focus:ring-blue-500/30"
                    }`}
                  />
                  {errors.confirmPassword && (
                    <p className="mt-2 text-sm text-red-600">
                      {errors.confirmPassword}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Boutons d'action */}
            <div className="flex justify-end space-x-3 pt-4">
              <button
                type="button"
                onClick={handleCancel}
                className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium flex items-center"
              >
                <FaTimes className="mr-2" />
                Annuler
              </button>
              <button
                type="submit"
                disabled={isLoading}
                className={`px-6 py-3 bg-linear-to-r from-blue-500 to-purple-600 text-white rounded-lg font-medium flex items-center transition-all duration-300 ${
                  isLoading
                    ? "opacity-70 cursor-not-allowed"
                    : "hover:from-blue-600 hover:to-purple-700 hover:shadow-lg"
                }`}
              >
                {isLoading ? (
                  <>
                    <div className="w-4 h-4 border-t-2 border-white rounded-full animate-spin mr-2"></div>
                    Enregistrement...
                  </>
                ) : (
                  <>
                    <FaSave className="mr-2" />
                    Enregistrer
                  </>
                )}
              </button>
            </div>
          </div>
        </form>
      ) : (
        /* Mode visualisation */
        <div className="space-y-6">
          {/* Photo et informations principales */}
          <div className="flex flex-col md:flex-row items-center md:items-start space-y-6 md:space-y-0 md:space-x-8">
            {/* Photo */}
            <div className="shrink-0">
              <div className="relative">
                {user.image ? (
                  <div className="w-40 h-40 rounded-full overflow-hidden border-4 border-white shadow-lg">
                    <img
                      src={`${STORAGE_BASE_URL}${user.image}`}
                      alt={user.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                ) : (
                  <div className="w-40 h-40 rounded-full bg-linear-to-r from-blue-500 to-purple-600 flex items-center justify-center text-white text-5xl font-bold shadow-lg">
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                )}
                <div className="absolute bottom-4 right-4 w-4 h-4 bg-green-500 rounded-full border-2 border-white"></div>
              </div>
            </div>

            {/* Informations */}
            <div className="flex-1 space-y-6">
              <div>
                <h3 className="text-3xl font-bold text-gray-900">
                  {user.name}
                </h3>
                <div className="flex items-center mt-2 text-gray-600">
                  <FaEnvelope className="mr-2" />
                  <span>{user.email}</span>
                </div>
              </div>

              {/* Statut et dates */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="flex items-center text-gray-600 mb-1">
                    <FaShieldAlt className="mr-2" />
                    <span className="font-medium">Statut</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                    <span className="text-gray-900 font-medium">Connecté</span>
                  </div>
                </div>

                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="flex items-center text-gray-600 mb-1">
                    <FaCalendar className="mr-2" />
                    <span className="font-medium">Membre depuis</span>
                  </div>
                  <div className="text-gray-900 font-medium">
                    {formatDate(user.created_at)}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Détails supplémentaires */}
          <div className="border-t border-gray-200 pt-6">
            <h4 className="text-lg font-medium text-gray-900 mb-4">
              Détails du compte
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <p className="text-sm text-gray-600">ID Utilisateur</p>
                <p className="font-mono text-gray-900 bg-gray-50 p-2 rounded">
                  {user.id}
                </p>
              </div>
              {user.updated_at && (
                <div className="space-y-2">
                  <p className="text-sm text-gray-600">Dernière mise à jour</p>
                  <p className="text-gray-900">{formatDate(user.updated_at)}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default UserProfile;
