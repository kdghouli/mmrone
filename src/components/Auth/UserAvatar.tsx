import { useState } from "react";
import {
  FaChevronDown,
  FaSignOutAlt,
  FaUser,
  FaCog,
  FaSignInAlt,
} from "react-icons/fa";
import { useAuth } from "../../stores/useAuthStore";
import { Link, useNavigate } from "react-router-dom";
import { STORAGE_BASE_URL } from "../../utils/donnee";

interface UserAvatarProps {
  showDropdown?: boolean;
}

function UserAvatar({ showDropdown = true }: UserAvatarProps) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);

  if (!user) {
    return (
      <Link
        to={"/login"}
        className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-300 bg-linear-to-r from-blue-600/20 to-purple-600/20 text-white border border-blue-500/30 `}
      >
        <span className={"text-blue-400"}>
          <FaSignInAlt className="text-lg" />
        </span>
        <span className="font-medium">Connection</span>
      </Link>
    );
  }

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/login");
    } catch (error) {
      console.error("Erreur lors de la déconnexion:", error);
    }
  };

  const getInitial = () => {
    return user.name.charAt(0).toUpperCase();
  };

  return (
    <div className="relative">
      <button
        onClick={() => showDropdown && setIsOpen(!isOpen)}
        className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-300 transition-colors group"
      >
        {/* Avatar */}
        <div className="relative">
          {user.image ? (
            <img
              src={`${STORAGE_BASE_URL}${user.image}`}
              alt={user.name}
              className="w-10 h-10 rounded-full object-cover border-2 border-white shadow-sm group-hover:border-gray-200 transition-colors"
            />
          ) : (
            <div className="w-10 h-10 rounded-full bg-linear-to-r from-blue-500 to-purple-600 flex items-center justify-center text-white font-semibold shadow-sm group-hover:from-blue-600 group-hover:to-purple-700 transition-all duration-300">
              {getInitial()}
            </div>
          )}
          <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
        </div>

        {/* Informations (seulement si espace disponible) */}
        <div className="hidden md:block text-left">
          <p className="font-medium text-gray-400 text-sm truncate max-w-37">
            {user.name}
          </p>
          <p className="text-xs text-gray-500 truncate max-w-37">
            {user.email}
          </p>
        </div>

        {/* Flèche dropdown */}
        {showDropdown && (
          <FaChevronDown
            className={`text-gray-400 transition-transform duration-200 ${
              isOpen ? "rotate-180" : ""
            }`}
          />
        )}
      </button>

      {/* Dropdown Menu */}
      {showDropdown && isOpen && (
        <>
          {/* Overlay pour fermer en cliquant à l'extérieur */}
          <div
            className="fixed inset-0 z-10"
            onClick={() => setIsOpen(false)}
          />

          {/* Menu dropdown */}
          <div className="absolute bottom-15 mt-2 w-64 bg-white rounded-xl shadow-xl border border-gray-200 py-2 z-20 animate-in fade-in slide-in-from-top-5 duration-200">
            {/* En-tête du dropdown */}
            <div className="px-4 py-3 border-b border-gray-100">
              <p className="font-medium text-gray-900 truncate">{user.name}</p>
              <p className="text-sm text-gray-500 truncate">{user.email}</p>
            </div>

            {/* Options du menu */}
            <div className="py-2">
              <button
                onClick={() => {
                  navigate("/profile");
                  setIsOpen(false);
                }}
                className="w-full flex items-center px-4 py-2 text-gray-700 hover:bg-gray-50 transition-colors"
              >
                <FaUser className="mr-3 text-gray-400" />
                <span>Mon profil</span>
              </button>

              <button
                onClick={() => {
                  navigate("/settings");
                  setIsOpen(false);
                }}
                className="w-full flex items-center px-4 py-2 text-gray-700 hover:bg-gray-50 transition-colors"
              >
                <FaCog className="mr-3 text-gray-400" />
                <span>Paramètres</span>
              </button>
            </div>

            {/* Séparateur */}
            <div className="border-t border-gray-100 my-2"></div>

            {/* Déconnexion */}
            <button
              onClick={handleLogout}
              className="w-full flex items-center px-4 py-2 text-red-600 hover:bg-red-50 transition-colors"
            >
              <FaSignOutAlt className="mr-3" />
              <span>Déconnexion</span>
            </button>
          </div>
        </>
      )}
    </div>
  );
}

export default UserAvatar;
