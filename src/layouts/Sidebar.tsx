// components/layout/Sidebar.tsx
import { type JSX } from "react";
import {
  FaCar,
  FaBuilding,
  FaTags,
  FaUsers,
  FaWrench,
  FaFileAlt,
  FaCog,
  FaChevronLeft,
  FaChevronRight,
} from "react-icons/fa";
import { FaBellConcierge } from "react-icons/fa6";
import { Link, NavLink, useLocation } from "react-router-dom";

import UserAvatar from "../components/Auth/UserAvatar";

interface SidebarProps {
  collapsed: boolean;
  onToggle: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ collapsed, onToggle }) => {
  const location = useLocation();

  interface MenuItem {
    id: string;
    label: string;
    icon: JSX.Element;
    path: string;
  }

  const menuItems: MenuItem[] = [
    {
      id: "vehicules",
      label: "Véhicules",
      icon: <FaCar />,
      path: "/vhls",
    },
    { id: "agences", label: "Agences", icon: <FaBuilding />, path: "/agences" },
    {
      id: "categories",
      label: "Intitules",
      icon: <FaTags />,
      path: "/intitules",
    },
    {
      id: "utilisateurs",
      label: "Utilisateurs",
      icon: <FaUsers />,
      path: "/utilisa",
    },
    {
      id: "maintenance",
      label: "Maintenance",
      icon: <FaWrench />,
      path: "/maintenance",
    },
    {
      id: "rapports",
      label: "Rapports",
      icon: <FaFileAlt />,
      path: "/comments",
    },
    {
      id: "parametres",
      label: "Paramètres",
      icon: <FaCog />,
      path: "/parametres",
    },
    {
      id: "pro",
      label: "Pro",
      icon: <FaBellConcierge />,
      path: "/pro",
    },
  ];

  const isActive = (path: string) => location.pathname.startsWith(path);

  return (
    <div
      className={`${
        collapsed ? "w-22" : "w-50"
      } bg-linear-to-b from-gray-900 to-gray-800 text-white transition-all duration-300 flex flex-col h-screen sticky top-0`}
    >
      {/* Logo */}
      <div className="p-3 border-b border-gray-700">
        <div className="flex items-center justify-between">
          {!collapsed && (
            <Link to={"/"}>
              <div className="flex items-center gap-3">
                <div className="w-10 h-11 bg-linear-to-r from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center">
                  <FaCar className="text-xl" />
                </div>
                <div>
                  <h1 className="text-xl font-bold">FleetPro</h1>
                  <p className="text-xs text-gray-400">Gestion de flotte</p>
                </div>
              </div>
            </Link>
          )}
          {collapsed && (
            <div className="w-11 h-11 bg-linear-to-r from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center mx-auto">
              <FaCar className="text-xl" />
            </div>
          )}
          <button
            onClick={onToggle}
            className="p-2 hover:bg-gray-700 rounded-lg transition-colors"
            title={collapsed ? "Élargir" : "Réduire"}
          >
            {collapsed ? <FaChevronRight /> : <FaChevronLeft />}
          </button>
        </div>
      </div>
      <div className="h-1 bg-linear-to-r from-blue-600 via-purple-600 to-pink-600 animate-gradient-x"></div>
      {/* Menu Items */}
      {/* Menu Items */}
      <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
        {menuItems.map((item) => (
          <NavLink
            key={item.id}
            to={item.path}
            className={`
              flex items-center gap-3 px-3 py-3 rounded-lg transition-all duration-300
              ${
                isActive(item.path)
                  ? "bg-linear-to-r from-blue-600 to-cyan-600 text-white shadow-lg"
                  : "hover:bg-gray-700 hover:text-white"
              }
            `}
          >
            <div className="text-lg">{item.icon}</div>
            {!collapsed && <span className="font-medium">{item.label}</span>}
          </NavLink>
        ))}
      </nav>
      {/* User Profile & Logout */}
      <div className="p-4 border-t border-gray-700">
        {!collapsed ? (
          <div className="flex items-center">
            <UserAvatar showDropdown={true} />
          </div>
        ) : (
          <div className="flex flex-col items-center space-y-4">
            <div className="w-10 h-10 bg-linear-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
              <button
                onClick={onToggle}
                className="p-2 hover:bg-pink-800 rounded-lg transition-colors"
                title={collapsed ? "Élargir" : "Réduire"}
              >
                {collapsed ? <FaChevronRight /> : <FaChevronLeft />}
              </button>
            </div>
          </div>
        )}
      </div>
      <style>
        {`
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
      `}
      </style>
      ;
    </div>
  );
};

export default Sidebar;
