// components/vhl/CategoryIcon.tsx
import React from "react";
import { FaCar, FaTruck, FaMotorcycle } from "react-icons/fa6";
import { MdForklift } from "react-icons/md";

interface CategoryIconProps {
  categoryName?: string;
  size?: number;
  className?: string;
  showTooltip?: boolean;
  withBackground?: boolean;
}

const CategoryIcon: React.FC<CategoryIconProps> = ({
  categoryName,
  size = 22,
  className = "",
  showTooltip = false,
  withBackground = false,
}) => {
  // Fonction pour obtenir l'icône selon la catégorie
  const getCategoryIcon = (name?: string) => {
    if (!name) return <FaCar size={size} className={className} />;

    const lowerName = name.toLowerCase();

    if (lowerName.includes("camion")) {
      return <FaTruck size={size} className={className} />;
    } else if (lowerName.includes("scooter")) {
      return <FaMotorcycle size={size} className={className} />;
    } else if (
      lowerName.includes("chariot") ||
      lowerName.includes("élévateur") ||
      lowerName.includes("elevateur")
    ) {
      return <MdForklift size={size} className={className} />;
    } else if (lowerName.includes("voiture")) {
      return <FaCar size={size} className={className} />;
    } else {
      return <FaCar size={size} className={className} />;
    }
  };

  // Fonction pour obtenir la couleur selon la catégorie
  const getCategoryColor = (name?: string) => {
    if (!name) return "from-blue-500 to-cyan-500";

    const lowerName = name.toLowerCase();

    if (lowerName.includes("camion")) {
      return "from-orange-500 to-amber-500";
    } else if (lowerName.includes("scooter")) {
      return "from-green-500 to-green-500";
    } else if (
      lowerName.includes("chariot") ||
      lowerName.includes("élévateur") ||
      lowerName.includes("elevateur")
    ) {
      return "from-purple-500 to-indigo-500";
    } else if (lowerName.includes("voiture")) {
      return "from-blue-500 to-cyan-500";
    } else {
      return "from-blue-500 to-cyan-500";
    }
  };

  // Fonction pour obtenir la couleur de texte selon la catégorie
  const getCategoryTextColor = (name?: string) => {
    if (!name) return "text-blue-600";

    const lowerName = name.toLowerCase();

    if (lowerName.includes("camion")) {
      return "text-orange-700";
    } else if (lowerName.includes("scooter")) {
      return "text-green-700";
    } else if (
      lowerName.includes("chariot") ||
      lowerName.includes("élévateur") ||
      lowerName.includes("elevateur")
    ) {
      return "text-purple-700";
    } else if (lowerName.includes("voiture")) {
      return "text-blue-700";
    } else {
      return "text-blue-600";
    }
  };

  // Si avec fond, on retourne un conteneur avec le dégradé
  if (withBackground) {
    return (
      <div
        className={`shrink-0 flex items-center justify-center rounded-lg bg-linear-to-r ${getCategoryColor(
          categoryName,
        )} text-white ${className}`}
        title={showTooltip ? categoryName : undefined}
      >
        {getCategoryIcon(categoryName)}
      </div>
    );
  }

  // Sinon, on retourne juste l'icône
  return (
    <div
      className={`inline-flex items-center justify-center ${getCategoryTextColor(
        categoryName,
      )} ${className}`}
      title={showTooltip ? categoryName : undefined}
    >
      {getCategoryIcon(categoryName)}
    </div>
  );
};

// Export d'un objet avec des helpers pour une utilisation plus facile
export const CategoryIconHelpers = {
  getIcon: (categoryName?: string, size: number = 20) => {
    if (!categoryName) return <FaCar size={size} />;

    const lowerName = categoryName.toLowerCase();

    if (lowerName.includes("camion")) return <FaTruck size={size} />;
    if (lowerName.includes("scooter")) return <FaMotorcycle size={size} />;
    if (
      lowerName.includes("chariot") ||
      lowerName.includes("élévateur") ||
      lowerName.includes("elevateur")
    )
      return <MdForklift size={size} />;
    if (lowerName.includes("voiture")) return <FaCar size={size} />;

    return <FaCar size={size} />;
  },

  getColor: (categoryName?: string) => {
    if (!categoryName) return "from-blue-500 to-cyan-500";

    const lowerName = categoryName.toLowerCase();

    if (lowerName.includes("camion")) return "from-orange-500 to-amber-500";
    if (lowerName.includes("scooter")) return "from-red-500 to-pink-500";
    if (
      lowerName.includes("chariot") ||
      lowerName.includes("élévateur") ||
      lowerName.includes("elevateur")
    )
      return "from-purple-500 to-indigo-500";
    if (lowerName.includes("voiture")) return "from-blue-500 to-cyan-500";

    return "from-blue-500 to-cyan-500";
  },

  getTextColor: (categoryName?: string) => {
    if (!categoryName) return "text-blue-600";

    const lowerName = categoryName.toLowerCase();

    if (lowerName.includes("camion")) return "text-orange-600";
    if (lowerName.includes("scooter")) return "text-red-600";
    if (
      lowerName.includes("chariot") ||
      lowerName.includes("élévateur") ||
      lowerName.includes("elevateur")
    )
      return "text-purple-600";
    if (lowerName.includes("voiture")) return "text-blue-600";

    return "text-blue-600";
  },
};

export default CategoryIcon;
