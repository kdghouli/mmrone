// // components/AddEquipment.jsx
// import { useState, useEffect } from "react";
// import axios, { AxiosError } from "axios";
// import { toast, ToastContainer } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";
// import API_BASE_URL from "../template/donnee";

// const CreateEquip = () => {
//   // États pour les données du formulaire
//   const [formData, setFormData] = useState({
//     matricule: "",
//     marque: "",
//     date_mc: "",
//     agence_id: "",
//     categorie_id: "",
//     intitule_id: "",
//     service_id: "",
//   });

//   // États pour les données de référence
//   const [agences, setAgences] = useState([]);
//   const [categories, setCategories] = useState([]);
//   const [intitules, setIntitules] = useState([]);
//   const [services, setServices] = useState([]);

//   // États pour le loading et les erreurs
//   const [loading, setLoading] = useState(false);
//   const [loadingRefs, setLoadingRefs] = useState(true);
//   const [errors, setErrors] = useState<Partial<Record<keyof typeof formData, string>>>({});



//   // Charger les données de référence
//   useEffect(() => {
//     const fetchReferenceData = async () => {
//       try {
//         // Exemple de récupération des agences (à adapter selon vos routes)
//         const [agencesRes, categoriesRes, intitulesRes, servicesRes] =
//           await Promise.all([
//             axios.get(`${API_BASE_URL}agences`),
//             axios.get(`${API_BASE_URL}categories`),
//             axios.get(`${API_BASE_URL}intitules`),
//             axios.get(`${API_BASE_URL}services`),
//           ]);

//         setAgences(agencesRes.data);
//         setCategories(categoriesRes.data);
//         setIntitules(intitulesRes.data);
//         setServices(servicesRes.data);
//       } catch (error) {
//         toast.error("Erreur lors du chargement des données de référence");
//         console.error(error);
//       } finally {
//         setLoadingRefs(false);
//       }
//     };

//     fetchReferenceData();
//   }, []);

//   // Gestion des changements dans les champs
//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData((prev) => ({
//       ...prev,
//       [name]: value,
//     }));

//     // Effacer l'erreur du champ lorsqu'il est modifié
//     if (errors[name]) {
//       setErrors((prev) => ({
//         ...prev,
//         [name]: "",
//       }));
//     }
//   };

//   // Soumission du formulaire
//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setLoading(true);
//     setErrors({});

//     try {

//       toast.success("Équipement ajouté avec succès !");

//       // Réinitialiser le formulaire
//       setFormData({
//         matricule: "",
//         marque: "",
//         date_mc: "",
//         agence_id: "",
//         categorie_id: "",
//         intitule_id: "",
//         service_id: "",
//       });
//     } catch (error) {
//       const axiosError = error as AxiosError;
//       if (axiosError.response && axiosError.response.status === 400) {
//         // Erreurs de validation Laravel
//         setErrors(axiosError.response.data as typeof errors);
//         toast.error("Veuillez corriger les erreurs dans le formulaire");
//       } else {
//         toast.error("Une erreur est survenue lors de l'ajout");
//         console.error(error);
//       }
//     } finally {
//       setLoading(false);
//     }
//   };

//   if (loadingRefs) {
//     return (
//       <div className="flex justify-center items-center h-64">
//         <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
//       <ToastContainer position="top-right" autoClose={3000} />

//       <div className="max-w-4xl mx-auto">
//         <div className="bg-white shadow-xl rounded-lg overflow-hidden">
//           {/* En-tête */}
//           <div className="bg-blue-600 px-6 py-4">
//             <h2 className="text-2xl font-bold text-white">
//               Ajouter un nouvel équipement
//             </h2>
//             <p className="text-blue-100 mt-1">
//               Remplissez le formulaire ci-dessous pour ajouter un équipement
//             </p>
//           </div>

//           {/* Formulaire */}
//           <form onSubmit={handleSubmit} className="p-6 space-y-6">
//             {/* Matricule - Champ obligatoire */}
//             <div>
//               <label
//                 htmlFor="matricule"
//                 className="block text-sm font-medium text-gray-700 mb-1"
//               >
//                 Matricule <span className="text-red-500">*</span>
//               </label>
//               <input
//                 type="text"
//                 id="matricule"
//                 name="matricule"
//                 value={formData.matricule}
//                 onChange={handleChange}
//                 className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
//                   errors.matricule ? "border-red-500" : "border-gray-300"
//                 }`}
//                 placeholder="Ex: MAT-001"
//                 required
//               />
//               {errors.matricule && (
//                 <p className="mt-1 text-sm text-red-600">{errors.matricule}</p>
//               )}
//             </div>

//             {/* Marque */}
//             <div>
//               <label
//                 htmlFor="marque"
//                 className="block text-sm font-medium text-gray-700 mb-1"
//               >
//                 Marque
//               </label>
//               <input
//                 type="text"
//                 id="marque"
//                 name="marque"
//                 value={formData.marque}
//                 onChange={handleChange}
//                 className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
//                 placeholder="Ex: Toyota"
//                 maxLength={40}
//               />
//             </div>

//             {/* Date MC */}
//             <div>
//               <label
//                 htmlFor="date_mc"
//                 className="block text-sm font-medium text-gray-700 mb-1"
//               >
//                 Date de mise en circulation
//               </label>
//               <input
//                 type="date"
//                 id="date_mc"
//                 name="date_mc"
//                 value={formData.date_mc}
//                 onChange={handleChange}
//                 className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
//               />
//             </div>

//             {/* Grid pour les sélecteurs */}
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//               {/* Agence - Champ obligatoire */}
//               <div>
//                 <label
//                   htmlFor="agence_id"
//                   className="block text-sm font-medium text-gray-700 mb-1"
//                 >
//                   Agence <span className="text-red-500">*</span>
//                 </label>
//                 <select
//                   id="agence_id"
//                   name="agence_id"
//                   value={formData.agence_id}
//                   onChange={handleChange}
//                   className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
//                     errors.agence_id ? "border-red-500" : "border-gray-300"
//                   }`}
//                   required
//                 >
//                   <option value="">Sélectionnez une agence</option>
//                   {agences.map((agence) => (
//                     <option key={agence.id} value={agence.id}>
//                       {agence.nom} {/* À adapter selon votre modèle */}
//                     </option>
//                   ))}
//                 </select>
//                 {errors.agence_id && (
//                   <p className="mt-1 text-sm text-red-600">
//                     {errors.agence_id}
//                   </p>
//                 )}
//               </div>

//               {/* Catégorie */}
//               <div>
//                 <label
//                   htmlFor="categorie_id"
//                   className="block text-sm font-medium text-gray-700 mb-1"
//                 >
//                   Catégorie
//                 </label>
//                 <select
//                   id="categorie_id"
//                   name="categorie_id"
//                   value={formData.categorie_id}
//                   onChange={handleChange}
//                   className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
//                 >
//                   <option value="">Sélectionnez une catégorie</option>
//                   {categories.map((categorie) => (
//                     <option key={categorie.id} value={categorie.id}>
//                       {categorie.nom} {/* À adapter selon votre modèle */}
//                     </option>
//                   ))}
//                 </select>
//               </div>

//               {/* Intitulé */}
//               <div>
//                 <label
//                   htmlFor="intitule_id"
//                   className="block text-sm font-medium text-gray-700 mb-1"
//                 >
//                   Intitulé
//                 </label>
//                 <select
//                   id="intitule_id"
//                   name="intitule_id"
//                   value={formData.intitule_id}
//                   onChange={handleChange}
//                   className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
//                 >
//                   <option value="">Sélectionnez un intitulé</option>
//                   {intitules.map((intitule) => (
//                     <option key={intitule.id} value={intitule.id}>
//                       {intitule.nom} {/* À adapter selon votre modèle */}
//                     </option>
//                   ))}
//                 </select>
//               </div>

//               {/* Service */}
//               <div>
//                 <label
//                   htmlFor="service_id"
//                   className="block text-sm font-medium text-gray-700 mb-1"
//                 >
//                   Service
//                 </label>
//                 <select
//                   id="service_id"
//                   name="service_id"
//                   value={formData.service_id}
//                   onChange={handleChange}
//                   className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
//                 >
//                   <option value="">Sélectionnez un service</option>
//                   {services.map((service) => (
//                     <option key={service.id} value={service.id}>
//                       {service.nom} {/* À adapter selon votre modèle */}
//                     </option>
//                   ))}
//                 </select>
//               </div>
//             </div>

//             {/* Boutons d'action */}
//             <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
//               <button
//                 type="button"
//                 onClick={() => {
//                   setFormData({
//                     matricule: "",
//                     marque: "",
//                     date_mc: "",
//                     agence_id: "",
//                     categorie_id: "",
//                     intitule_id: "",
//                     service_id: "",
//                   });
//                   setErrors({});
//                 }}
//                 className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
//                 disabled={loading}
//               >
//                 Réinitialiser
//               </button>
//               <button
//                 type="submit"
//                 disabled={loading}
//                 className="px-6 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
//               >
//                 {loading ? (
//                   <>
//                     <svg
//                       className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
//                       xmlns="http://www.w3.org/2000/svg"
//                       fill="none"
//                       viewBox="0 0 24 24"
//                     >
//                       <circle
//                         className="opacity-25"
//                         cx="12"
//                         cy="12"
//                         r="10"
//                         stroke="currentColor"
//                         strokeWidth="4"
//                       ></circle>
//                       <path
//                         className="opacity-75"
//                         fill="currentColor"
//                         d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
//                       ></path>
//                     </svg>
//                     Ajout en cours...
//                   </>
//                 ) : (
//                   "Ajouter l'équipement"
//                 )}
//               </button>
//             </div>
//           </form>
//         </div>

//         {/* Notes */}
//         <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
//           <div className="flex">
//             <div className="flex-shrink-0">
//               <svg
//                 className="h-5 w-5 text-blue-400"
//                 xmlns="http://www.w3.org/2000/svg"
//                 viewBox="0 0 20 20"
//                 fill="currentColor"
//               >
//                 <path
//                   fillRule="evenodd"
//                   d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
//                   clipRule="evenodd"
//                 />
//               </svg>
//             </div>
//             <div className="ml-3">
//               <h3 className="text-sm font-medium text-blue-800">
//                 Informations
//               </h3>
//               <div className="mt-2 text-sm text-blue-700">
//                 <ul className="list-disc pl-5 space-y-1">
//                   <li>
//                     Les champs marqués d'un{" "}
//                     <span className="text-red-500">*</span> sont obligatoires
//                   </li>
//                   <li>Le matricule doit être unique</li>
//                   <li>La date de mise en circulation est optionnelle</li>
//                 </ul>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default CreateEquip;
