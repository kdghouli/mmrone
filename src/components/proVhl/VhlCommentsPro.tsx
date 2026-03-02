// components/vhl/VhlDetailsPro.tsx
import React from "react";
import { useVhlsPro } from "../../stores/useVhlProStore";
import { FaCar, FaEdit, FaArrowLeft } from "react-icons/fa";
import CommentSection from "../comments/CommentSection";
import { useComments } from "../../stores/useCommentsStore";

interface VhlCommentsProProps {
  vhlId: string;
  onEdit: () => void;
  onBack: () => void;
}

const VhlCommentsPro: React.FC<VhlCommentsProProps> = ({ onEdit,onBack }) => {
  const { selectedVhl, loading } = useVhlsPro();
  const { handAddToggle, sethandAddToggle } = useComments();

  if (loading || !selectedVhl) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
      {/* Header */}
      <div className="bg-linear-to-r from-orange-500 to-orange-600 px-4 py-4">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-2">
          <div className="flex items-center gap-4">
            <button
              onClick={onBack}
              className="p-2 bg-white/20 text-white rounded-lg hover:bg-white/30 transition-colors"
              title="Retour"
            >
              <FaArrowLeft />
            </button>
            <div className="flex items-center gap-3">
              <div className="p-2 bg-white/20 rounded-lg">
                <FaCar className="text-white text-2xl" />
              </div>
              <div>
                <h1 className="text-2xl md:text-3xl font-bold text-white">
                  {selectedVhl.matricule}
                </h1>
                <p className="text-blue-100">
                  {selectedVhl.marque} • {selectedVhl.type || " "}
                </p>
              </div>
            </div>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => sethandAddToggle(!handAddToggle)}
              className="px-6 py-2 bg-white text-orange-700 font-medium rounded-lg hover:bg-orange-50 transition-colors flex items-center gap-2"
            >
              <FaEdit />
              Commentaire {handAddToggle ? "Manuel" : "Rapide"}
            </button>
          </div>
        </div>
      </div>
      {/* Content */}
      <div className="p-2">
        <div className="grid">
          <CommentSection vhlId={selectedVhl.id} />
        </div>

        {/* Footer */}
        <div className="mt-6 pt-6 border-t border-gray-200">
          <div className="flex justify-between items-center">
            <div className="text-sm text-gray-500">
              Dernière mise à jour:{" "}
              {selectedVhl.updated_at
                ? new Date(selectedVhl.updated_at).toLocaleDateString()
                : "-"}
            </div>
            <div className="flex gap-3">
              <button
                onClick={onBack}
                className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
              >
                {`Retour à la liste`}
              </button>
              <button
                onClick={onEdit}
                className="px-6 py-2 bg-linear-to-r from-blue-600 to-indigo-600 text-white font-medium rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-colors"
              >
                Modifier le véhicule
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VhlCommentsPro;
