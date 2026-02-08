import { useState } from "react";

const AnimatedToggle = () => {
  const [isActive, setIsActive] = useState(false);

  return (
    <label className="flex items-center cursor-pointer">
      <div className="relative">
        <input
          type="checkbox"
          className="sr-only"
          checked={isActive}
          onChange={() => setIsActive(!isActive)}
        />
        {/* Piste avec animation de couleur */}
        <div
          className={`
          block w-16 h-8 rounded-full 
          transition-all duration-300 
          ${isActive ? "bg-green-500" : "bg-gray-300"}
          ${isActive ? "shadow-lg shadow-green-500/30" : ""}
        `}
        ></div>

        {/* Bouton avec animation de glow */}
        <div
          className={`
          absolute left-1 top-1 
          bg-white w-6 h-6 rounded-full 
          transition-all duration-300 
          ${isActive ? "transform translate-x-8" : ""}
          ${isActive ? "shadow-lg" : "shadow"}
        `}
        ></div>
      </div>
      <div className="ml-4">
        <span
          className={`font-semibold transition-colors duration-300 ${isActive ? "text-green-600" : "text-gray-600"}`}
        >
          {isActive ? "ACTIVÉ" : "DÉSACTIVÉ"}
        </span>
      </div>
    </label>
  );
};

export default AnimatedToggle;
