/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import { useComments } from "../../stores/useCommentsStore";

const CommandeAddForm = ({
  statuts,
  vhlId,
}: {
  statuts?: { id: string; nom: string }[];
  vhlId: string;
}) => {
  const { loading, addComment,sethandAddToggle } = useComments();

  const [newComment, setNewComment] = useState("");
  const [kilometrage, setKilometrage] = useState("");
  const [isActive, setIsActive] = useState(true);

  const [formData, setFormData] = useState<{ statut_id: string }>({
    statut_id: "",
  });
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    await addComment(
      vhlId,
      newComment,
      formData.statut_id,
      isActive,
      kilometrage,
    );
    setNewComment("");
    setFormData({ statut_id: "" });
    setKilometrage("");
    sethandAddToggle(false);
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >,
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

  return (
    <div className="p-4 border-b border-gray-200">
      <form onSubmit={handleSubmit}>
        <div className="mb-1">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Nouveau commentaire
          </label>

          <textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Partagez vos observations, questions ou suggestions..."
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            rows={3}
          />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
            <div>
              <select
                name="statut_id"
                value={formData.statut_id}
                onChange={handleChange}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Sélectionnez un statut</option>
                {statuts?.map((statut) => (
                  <option key={statut.id} value={statut.id}>
                    {statut.nom}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <input
                type="text"
                name="kilometrage"
                value={kilometrage}
                onChange={(e) => setKilometrage(e.target.value)}
                id="kilometrage"
                placeholder="Kilométrage"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div className="flex items-center space-x-3">
              <label
                htmlFor="active-toggle"
                className={`relative inline-flex items-center h-8 rounded-full w-16 cursor-pointer transition-all duration-300 ${isActive ? "bg-blue-600" : "bg-gray-300"}`}
              >
                <input
                  type="checkbox"
                  id="active-toggle"
                  className="sr-only"
                  //checked={isActive}
                  onChange={() => setIsActive((prev) => !prev)}
                />
                <span
                  className={`inline-block w-6 h-6 transform bg-white rounded-full transition-transform duration-300 ${isActive ? "translate-x-9" : "translate-x-1"}`}
                />
              </label>
              <span
                className={`text-sm font-medium transition-colors duration-300 ${isActive ? "text-blue-600" : "text-gray-600"}`}
              >
                {isActive ? "Activé" : "Désactivé"}
              </span>
            </div>
          </div>
        </div>
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={!newComment.trim() || loading}
            className="px-6 py-2 bg-linear-to-r from-blue-600 to-indigo-600 text-white font-medium rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Publication..." : "Publier le commentaire"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CommandeAddForm;
