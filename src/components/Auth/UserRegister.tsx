/* eslint-disable @typescript-eslint/no-explicit-any */
// pages/Register.tsx
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  FaUser,
  FaEnvelope,
  FaLock,
  FaEye,
  FaEyeSlash,
  FaCheck,
  FaArrowLeft,
  FaUserPlus,
  FaExclamationTriangle,
} from "react-icons/fa";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useAuthStore } from "../../stores/useAuthStore";

function Register() {
  const navigate = useNavigate();
  const { register, isLoading, error, clearError } = useAuthStore();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (errors[name as keyof typeof errors]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }

    // Clear auth error if exists
    if (error) {
      clearError();
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

    if (!formData.name.trim()) {
      newErrors.name = "Le nom est requis";
      isValid = false;
    } else if (formData.name.trim().length < 2) {
      newErrors.name = "Le nom doit contenir au moins 2 caractères";
      isValid = false;
    }

    if (!formData.email) {
      newErrors.email = "L'email est requis";
      isValid = false;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Format d'email invalide";
      isValid = false;
    }

    if (!formData.password) {
      newErrors.password = "Le mot de passe est requis";
      isValid = false;
    } else if (formData.password.length < 8) {
      newErrors.password = "Minimum 8 caractères";
      isValid = false;
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Les mots de passe ne correspondent pas";
      isValid = false;
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
      await register(formData.name, formData.email, formData.password);

      toast.success("🎉 Compte créé avec succès !", {
        position: "top-right",
        autoClose: 3000,
      });

      // Rediriger vers la page de connexion
      setTimeout(() => {
        navigate("/login");
      }, 1500);
    } catch (error: any) {
      // Gérer les erreurs spécifiques de l'API
      const errorMessage =
        error.message || "Erreur lors de la création du compte";
      toast.error(`❌ ${errorMessage}`, {
        position: "top-right",
        autoClose: 3000,
      });
    }
  };

  // Vérificateur de force du mot de passe
  const passwordStrength = () => {
    const password = formData.password;
    if (!password) return { strength: 0, color: "bg-gray-200", text: "Faible" };

    let strength = 0;
    if (password.length >= 8) strength += 1;
    if (/[A-Z]/.test(password)) strength += 1;
    if (/[0-9]/.test(password)) strength += 1;
    if (/[^A-Za-z0-9]/.test(password)) strength += 1;

    const colors = [
      "bg-red-500",
      "bg-orange-500",
      "bg-yellow-500",
      "bg-green-500",
    ];
    const texts = ["Très faible", "Faible", "Moyen", "Fort"];

    return {
      strength,
      color: colors[strength - 1] || "bg-gray-200",
      text: texts[strength - 1] || "Très faible",
    };
  };

  const strength = passwordStrength();

  return (
    <>
      <ToastContainer />

      <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-gray-50 to-gray-100 p-4">
        <div className="w-full max-w-lg">
          {/* Back Button */}
          <Link
            to="/login"
            className="inline-flex items-center text-gray-600 hover:text-gray-900 transition-colors mb-6 group"
          >
            <FaArrowLeft className="mr-2 group-hover:-translate-x-1 transition-transform" />
            Retour à la connexion
          </Link>

          {/* Registration Card */}
          <div className="bg-white rounded-2xl shadow-xl p-6 md:p-8 border border-gray-200">
            {/* Header */}
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-green-500 to-emerald-600 rounded-2xl mb-4 shadow-lg">
                <FaUserPlus className="text-2xl text-white" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Créer un compte
              </h2>
              <p className="text-gray-600">
                Rejoignez Fleet Manager et gérez votre flotte
              </p>
            </div>

            {/* Registration Form */}
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Name Field */}
              <div>
                <label
                  htmlFor="name"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Nom complet
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FaUser className="text-gray-400" />
                  </div>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className={`
                      w-full pl-10 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 transition-all duration-200
                      ${
                        errors.name
                          ? "border-red-500 focus:ring-red-500/30 focus:border-red-500"
                          : "border-gray-300 focus:ring-blue-500/30 focus:border-blue-500"
                      }
                    `}
                    placeholder="John Doe"
                  />
                </div>
                {errors.name && (
                  <p className="mt-2 text-sm text-red-600 flex items-center">
                    <FaExclamationTriangle className="w-3 h-3 mr-1" />
                    {errors.name}
                  </p>
                )}
              </div>

              {/* Email Field */}
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Adresse email
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FaEnvelope className="text-gray-400" />
                  </div>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className={`
                      w-full pl-10 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 transition-all duration-200
                      ${
                        errors.email
                          ? "border-red-500 focus:ring-red-500/30 focus:border-red-500"
                          : "border-gray-300 focus:ring-blue-500/30 focus:border-blue-500"
                      }
                    `}
                    placeholder="vous@exemple.com"
                  />
                </div>
                {errors.email && (
                  <p className="mt-2 text-sm text-red-600 flex items-center">
                    <FaExclamationTriangle className="w-3 h-3 mr-1" />
                    {errors.email}
                  </p>
                )}
              </div>

              {/* Password Field */}
              <div>
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Mot de passe
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FaLock className="text-gray-400" />
                  </div>
                  <input
                    type={showPassword ? "text" : "password"}
                    id="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    className={`
                      w-full pl-10 pr-12 py-3 border rounded-lg focus:outline-none focus:ring-2 transition-all duration-200
                      ${
                        errors.password
                          ? "border-red-500 focus:ring-red-500/30 focus:border-red-500"
                          : "border-gray-300 focus:ring-blue-500/30 focus:border-blue-500"
                      }
                    `}
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                  </button>
                </div>

                {/* Password Strength */}
                {formData.password && (
                  <div className="mt-2">
                    <div className="flex justify-between text-xs text-gray-500 mb-1">
                      <span>Force du mot de passe</span>
                      <span
                        className={`font-medium ${
                          strength.strength === 4
                            ? "text-green-600"
                            : strength.strength === 3
                              ? "text-yellow-600"
                              : strength.strength === 2
                                ? "text-orange-600"
                                : "text-red-600"
                        }`}
                      >
                        {strength.text}
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full transition-all duration-300 ${strength.color}`}
                        style={{ width: `${(strength.strength / 4) * 100}%` }}
                      ></div>
                    </div>
                    <div className="grid grid-cols-4 gap-2 mt-2 text-xs text-gray-600">
                      {["8+ caractères", "Majuscule", "Chiffre", "Spécial"].map(
                        (req, idx) => (
                          <div key={idx} className="flex items-center">
                            <div
                              className={`w-3 h-3 rounded-full mr-1 ${
                                strength.strength > idx
                                  ? "bg-green-500"
                                  : "bg-gray-300"
                              }`}
                            ></div>
                            {req}
                          </div>
                        ),
                      )}
                    </div>
                  </div>
                )}

                {errors.password && (
                  <p className="mt-2 text-sm text-red-600 flex items-center">
                    <FaExclamationTriangle className="w-3 h-3 mr-1" />
                    {errors.password}
                  </p>
                )}
              </div>

              {/* Confirm Password */}
              <div>
                <label
                  htmlFor="confirmPassword"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Confirmer le mot de passe
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FaLock className="text-gray-400" />
                  </div>
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    id="confirmPassword"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    className={`
                      w-full pl-10 pr-12 py-3 border rounded-lg focus:outline-none focus:ring-2 transition-all duration-200
                      ${
                        errors.confirmPassword
                          ? "border-red-500 focus:ring-red-500/30 focus:border-red-500"
                          : "border-gray-300 focus:ring-blue-500/30 focus:border-blue-500"
                      }
                    `}
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                  </button>
                </div>
                {errors.confirmPassword && (
                  <p className="mt-2 text-sm text-red-600 flex items-center">
                    <FaExclamationTriangle className="w-3 h-3 mr-1" />
                    {errors.confirmPassword}
                  </p>
                )}
              </div>

              {/* Terms and Conditions */}
              <div className="flex items-start">
                <input
                  type="checkbox"
                  id="terms"
                  required
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded mt-1"
                />
                <label
                  htmlFor="terms"
                  className="ml-2 block text-sm text-gray-700"
                >
                  J'accepte les{" "}
                  <Link
                    to="/terms"
                    className="text-blue-600 hover:text-blue-700 font-medium"
                  >
                    conditions d'utilisation
                  </Link>{" "}
                  et la{" "}
                  <Link
                    to="/privacy"
                    className="text-blue-600 hover:text-blue-700 font-medium"
                  >
                    politique de confidentialité
                  </Link>
                </label>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading}
                className={`
                  w-full py-3 px-4 border border-transparent rounded-lg font-medium text-white 
                  focus:outline-none focus:ring-2 focus:ring-offset-2 transition-all duration-300
                  ${
                    isLoading
                      ? "bg-gradient-to-r from-green-400 to-emerald-400 cursor-not-allowed"
                      : "bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 hover:shadow-lg transform hover:-translate-y-0.5"
                  }
                `}
              >
                {isLoading ? (
                  <div className="flex items-center justify-center">
                    <div className="w-5 h-5 border-t-2 border-white rounded-full animate-spin mr-2"></div>
                    Création du compte...
                  </div>
                ) : (
                  <div className="flex items-center justify-center">
                    <FaCheck className="mr-2" />
                    Créer mon compte
                  </div>
                )}
              </button>
            </form>

            {/* Login Link */}
            <div className="mt-8 text-center">
              <p className="text-gray-600">
                Déjà un compte ?{" "}
                <Link
                  to="/login"
                  className="font-medium text-blue-600 hover:text-blue-700 transition-colors hover:underline"
                >
                  Se connecter
                </Link>
              </p>
            </div>

            {/* Security Info */}
            <div className="mt-8 pt-6 border-t border-gray-200">
              <div className="flex items-center justify-center text-sm text-gray-500">
                <FaLock className="mr-2 text-green-500" />
                <span>Vos données sont sécurisées et cryptées</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Register;
