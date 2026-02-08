import { Link, useLocation } from "react-router-dom";
import {
  FaHome,
  FaBuilding,
  FaTruck,
  FaPlusCircle,
  FaSignInAlt,
  FaBars,
  FaTimes,
  FaBell,
  FaSearch,
} from "react-icons/fa";
import { useState } from "react";
import UserAvatar from "../components/Auth/UserAvatar";

function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();

  const navItems = [
    { path: "/", label: "Accueil", icon: <FaHome className="text-lg" /> },
    {
      path: "/agences",
      label: "Agences",
      icon: <FaBuilding className="text-lg" />,
    },
    {
      path: "/camions",
      label: "Camions",
      icon: <FaTruck className="text-lg" />,
    },
    {
      path: "/create",
      label: "Ajouter",
      icon: <FaPlusCircle className="text-lg" />,
    },
    {
      path: "/login",
      label: "Connexion",
      icon: <FaSignInAlt className="text-lg" />,
    },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <>
      {/* Header Principal */}
      <header className="sticky top-0 z-50 w-full bg-linear-to-r from-gray-900 via-gray-800 to-gray-900 shadow-lg border-b border-gray-700">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            {/* Logo et Brand */}
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="lg:hidden text-white p-2 hover:bg-gray-700 rounded-lg transition-colors"
              >
                {isMenuOpen ? <FaTimes /> : <FaBars />}
              </button>

              <Link to="/" className="flex items-center space-x-3 group">
                <div className="relative">
                  <div className="absolute inset-0 bg-linear-to-r from-blue-500 to-purple-600 rounded-full blur opacity-70 group-hover:opacity-100 transition-opacity"></div>
                  <img
                    src="/logo.jpg"
                    alt="Logo"
                    className="relative w-12 h-12 rounded-full object-cover border-2 border-white/20 shadow-lg"
                  />
                </div>
                <div>
                  <h1 className="text-xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                    Fleet Manager
                  </h1>
                  <p className="text-xs text-gray-400">Gestion de flotte</p>
                </div>
              </Link>
            </div>

            {/* Navigation Desktop */}
            <nav className="hidden lg:flex items-center space-x-1">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`
                    flex items-center space-x-2 px-4 py-2.5 rounded-lg transition-all duration-300
                    ${
                      isActive(item.path)
                        ? "bg-gradient-to-r from-blue-600/20 to-purple-600/20 text-white border border-blue-500/30 shadow-lg shadow-blue-500/10"
                        : "text-gray-300 hover:text-white hover:bg-gray-700/50"
                    }
                  `}
                >
                  <span
                    className={`${
                      isActive(item.path) ? "text-blue-400" : "text-gray-400"
                    }`}
                  >
                    {item.icon}
                  </span>
                  <span className="font-medium">{item.label}</span>
                  {isActive(item.path) && (
                    <span className="absolute -bottom-1 left-0 right-0 h-0.5 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"></span>
                  )}
                </Link>
              ))}
            </nav>

            {/* Actions Right */}
            <div className="flex items-center space-x-3">
              {/* Search Button */}
              <button className="p-2 text-gray-400 hover:text-white hover:bg-gray-700/50 rounded-lg transition-colors hidden md:block">
                <FaSearch />
              </button>

              {/* Notifications */}
              <button className="relative p-2 text-gray-400 hover:text-white hover:bg-gray-700/50 rounded-lg transition-colors">
                <FaBell />
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full animate-ping"></span>
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
              </button>

              {/* User Profile */}

              <UserAvatar showDropdown={false} />
            </div>
          </div>

          {/* Mobile Menu */}
          <div
            className={`
            lg:hidden fixed inset-x-0 top-16 bg-linear-to-b from-gray-900 to-gray-800 border-t border-gray-700 shadow-2xl
            transform transition-all duration-300 ease-in-out
            ${
              isMenuOpen
                ? "translate-y-0 opacity-100"
                : "-translate-y-4 opacity-0 pointer-events-none"
            }
          `}
          >
            <div className="container mx-auto px-4 py-6">
              <div className="space-y-2">
                {navItems.map((item) => (
                  <Link
                    key={item.path}
                    to={item.path}
                    onClick={() => setIsMenuOpen(false)}
                    className={`
                      flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200
                      ${
                        isActive(item.path)
                          ? "bg-linear-to-r from-blue-600/30 to-purple-600/30 text-white"
                          : "text-gray-300 hover:bg-gray-700/50 hover:text-white"
                      }
                    `}
                  >
                    <span
                      className={`${
                        isActive(item.path) ? "text-blue-400" : "text-gray-400"
                      }`}
                    >
                      {item.icon}
                    </span>
                    <span className="font-medium">{item.label}</span>
                  </Link>
                ))}

                {/* Mobile Search */}
                <div className="px-4 py-3">
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Rechercher..."
                      className="w-full px-4 py-2.5 pl-10 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500"
                    />
                    <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Progress Indicator */}
        <div className="h-1 bg-linear-to-r from-blue-600 via-purple-600 to-pink-600 animate-gradient-x"></div>
      </header>

      <style>{`
        @keyframes gradient-x {
          0%,
          100% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
        }
        .animate-gradient-x {
          background-size: 200% 200%;
          animation: gradient-x 3s ease infinite;
        }
      `}</style>
    </>
  );
}

export default Header;
