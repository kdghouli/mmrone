/* eslint-disable @typescript-eslint/no-explicit-any */
// pages/Login.tsx
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  FaLock,
  FaEye,
  FaEyeSlash,
  FaEnvelope,
  FaSignInAlt,
  FaGoogle,
  FaGithub,
  FaFacebook,
  FaArrowLeft,
  FaShieldAlt,
  FaKey,
} from "react-icons/fa";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useAuth } from "../../stores/useAuthStore";

function Login() {
  const navigate = useNavigate();
  const { login, isLoading, error, clearError } = useAuth();

  const [credentials, setCredentials] = useState({
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState({
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [rememberU, setRememberU] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCredentials((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Clear validation error when user starts typing
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
      email: "",
      password: "",
    };
    let isValid = true;

    if (!credentials.email) {
      newErrors.email = "L'email est requis";
      isValid = false;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(credentials.email)) {
      newErrors.email = "Format d'email invalide";
      isValid = false;
    }

    if (!credentials.password) {
      newErrors.password = "Le mot de passe est requis";
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
      await login(credentials.email, credentials.password);

      toast.success("🎉 Connexion réussie !", {
        position: "top-right",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });

      // Sauvegarder les préférences
      if (rememberU) {
        localStorage.setItem("rememberMe", "true");
      }

      // Rediriger vers le tableau de bord
      setTimeout(() => {
        navigate("/");
      }, 3000);
    } catch (error: any) {
      // Gérer les erreurs spécifiques de l'API
      const errorMessage = error.message || "Erreur de connexion";
      toast.error(`❌ ${errorMessage}`, {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    }
  };

  const handleSocialLogin = (provider: string) => {
    toast.info(`Connexion avec ${provider} en cours...`, {
      position: "top-right",
      autoClose: 3000,
    });
  };

  const handleForgotPassword = () => {
    toast.info("Fonctionnalité de réinitialisation bientôt disponible !", {
      position: "top-right",
      autoClose: 3000,
    });
  };

  return (
    <>
      <ToastContainer />

      <div className="min-h-screen flex flex-col md:flex-row bg-linear-to-br from-gray-50 to-gray-100">
        {/* Left Side - Branding & Info */}
        <div className="hidden lg:flex lg:w-1/2 bg-linear-to-br from-gray-900 to-gray-800 text-white p-12 flex-col justify-between relative overflow-hidden">
          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-5">
            <div
              className="absolute inset-0"
              style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
                backgroundSize: "30px 30px",
              }}
            ></div>
          </div>

          {/* Content */}
          <div className="relative z-10">
            <Link
              to="/"
              className="inline-flex items-center text-gray-300 hover:text-white transition-colors mb-12 group"
            >
              <FaArrowLeft className="mr-2 group-hover:-translate-x-1 transition-transform" />
              Retour à l'accueil
            </Link>

            <div className="space-y-6">
              <div className="flex items-center space-x-4">
                <div className="p-3 bg-linear-to-r from-blue-500 to-purple-600 rounded-xl">
                  <FaShieldAlt className="text-2xl" />
                </div>
                <h1 className="text-4xl font-bold bg-linear-to-r from-white to-gray-300 bg-clip-text text-transparent">
                  Fleet Manager
                </h1>
              </div>

              <p className="text-xl text-gray-300 leading-relaxed">
                Accédez à votre espace de gestion de flotte
              </p>
            </div>
          </div>

          {/* Features List */}
          <div className="relative z-10 space-y-3">
            {[
              {
                icon: "🚚",
                title: "Gestion complète",
                description:
                  "Suivez et gérez tous vos véhicules en un seul endroit",
              },
              {
                icon: "📊",
                title: "Analytics avancés",
                description:
                  "Visualisez vos performances avec des rapports détaillés",
              },
              {
                icon: "🔒",
                title: "Sécurité maximale",
                description: "Données protégées avec chiffrement de pointe",
              },
            ].map((feature, index) => (
              <div key={index} className="flex items-start space-x-4 group">
                <div className="text-2xl group-hover:scale-110 transition-transform">
                  {feature.icon}
                </div>
                <div>
                  <h3 className="font-semibold text-white">{feature.title}</h3>
                  <p className="text-gray-400 text-sm">{feature.description}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Decorative Elements */}
          <div className="absolute bottom-0 right-0 w-64 h-64 bg-linear-to-tr from-blue-500/20 to-purple-600/20 rounded-full blur-3xl"></div>
          <div className="absolute top-0 left-0 w-48 h-48 bg-linear-to-br from-blue-400/10 to-purple-500/10 rounded-full blur-2xl"></div>
        </div>

        {/* Right Side - Login Form */}
        <div className="w-full lg:w-1/2 flex items-center justify-center p-4 md:p-6">
          <div className="w-full max-w-md">
            {/* Mobile Header */}
            <div className="lg:hidden mb-8">
              <Link
                to="/"
                className="inline-flex items-center text-gray-600 hover:text-gray-900 transition-colors mb-6 group"
              >
                <FaArrowLeft className="mr-2 group-hover:-translate-x-1 transition-transform" />
                Retour
              </Link>
              <div className="flex items-center space-x-3 mb-4">
                <div className="p-2 bg-linear-to-r from-blue-500 to-purple-600 rounded-lg">
                  <FaKey className="text-xl text-white" />
                </div>
                <h1 className="text-2xl font-bold text-gray-900">Connexion</h1>
              </div>
              <p className="text-gray-600">
                Accédez à votre compte Fleet Manager
              </p>
            </div>

            {/* Login Card */}
            <div className="bg-white rounded-2xl shadow-xl p-6 md:p-8 border border-gray-200">
              <div className="text-center mb-8">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-linear-to-r from-blue-500 to-purple-600 rounded-2xl mb-4 shadow-lg">
                  <FaSignInAlt className="text-2xl text-white" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  Bienvenue à nouveau
                </h2>
                <p className="text-gray-600">
                  Connectez-vous pour accéder à votre tableau de bord
                </p>
              </div>

              {/* Social Login Options */}
              <div className="mb-8">
                <p className="text-center text-gray-500 text-sm mb-4">
                  Ou connectez-vous avec
                </p>
                <div className="grid grid-cols-3 gap-3">
                  {[
                    {
                      provider: "Google",
                      icon: <FaGoogle />,
                      color:
                        "hover:bg-red-50 hover:border-red-200 hover:text-red-600",
                    },
                    {
                      provider: "GitHub",
                      icon: <FaGithub />,
                      color:
                        "hover:bg-gray-50 hover:border-gray-200 hover:text-gray-900",
                    },
                    {
                      provider: "Facebook",
                      icon: <FaFacebook />,
                      color:
                        "hover:bg-blue-50 hover:border-blue-200 hover:text-blue-600",
                    },
                  ].map((social) => (
                    <button
                      key={social.provider}
                      onClick={() => handleSocialLogin(social.provider)}
                      className={`flex items-center justify-center p-3 border border-gray-300 rounded-lg transition-all duration-300 ${social.color} group`}
                    >
                      <span className="text-lg group-hover:scale-110 transition-transform">
                        {social.icon}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Divider */}
              <div className="flex items-center mb-8">
                <div className="flex-1 border-t border-gray-300"></div>
                <span className="px-4 text-gray-500 text-sm">
                  Ou continuez avec
                </span>
                <div className="flex-1 border-t border-gray-300"></div>
              </div>

              {/* Login Form */}
              <form onSubmit={handleSubmit} className="space-y-6">
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
                      value={credentials.email}
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
                      <svg
                        className="w-4 h-4 mr-1"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                          clipRule="evenodd"
                        />
                      </svg>
                      {errors.email}
                    </p>
                  )}
                </div>

                {/* Password Field */}
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <label
                      htmlFor="password"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Mot de passe
                    </label>
                    <button
                      type="button"
                      onClick={handleForgotPassword}
                      className="text-sm text-blue-600 hover:text-blue-700 font-medium transition-colors"
                    >
                      Mot de passe oublié ?
                    </button>
                  </div>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FaLock className="text-gray-400" />
                    </div>
                    <input
                      type={showPassword ? "text" : "password"}
                      id="password"
                      name="password"
                      value={credentials.password}
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
                  {errors.password && (
                    <p className="mt-2 text-sm text-red-600 flex items-center">
                      <svg
                        className="w-4 h-4 mr-1"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                          clipRule="evenodd"
                        />
                      </svg>
                      {errors.password}
                    </p>
                  )}
                </div>

                {/* Remember Me & Submit */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="remember"
                      checked={rememberU}
                      onChange={(e) => setRememberU(e.target.checked)}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <label
                      htmlFor="remember"
                      className="ml-2 block text-sm text-gray-700"
                    >
                      Se souvenir de moi
                    </label>
                  </div>
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
                        ? "bg-linear-to-r from-blue-400 to-purple-400 cursor-not-allowed"
                        : "bg-linear-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 hover:shadow-lg transform hover:-translate-y-0.5"
                    }
                  `}
                >
                  {isLoading ? (
                    <div className="flex items-center justify-center">
                      <div className="w-5 h-5 border-t-2 border-white rounded-full animate-spin mr-2"></div>
                      Connexion en cours...
                    </div>
                  ) : (
                    <div className="flex items-center justify-center">
                      <FaSignInAlt className="mr-2" />
                      Se connecter
                    </div>
                  )}
                </button>
              </form>

              {/* Sign Up Link */}
              <div className="mt-8 text-center">
                <p className="text-gray-500">
                  Pas encore de compte ?{"  "}
                  <Link
                    to="/register"
                    className="font-medium text-blue-600 hover:text-blue-700 transition-colors hover:underline"
                  >
                    S'inscrire
                  </Link>
                </p>
              </div>

              {/* Security Info */}
              <div className="mt-6 pt-6 border-t border-gray-200">
                <div className="flex items-center justify-center text-sm text-gray-500">
                  <FaShieldAlt className="mr-2 text-green-500" />
                  <span>Connexion sécurisée • SSL encrypté</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Login;
