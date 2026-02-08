import axios from "axios";
import { useEffect, useState } from "react";
import { FaCarSide } from "react-icons/fa6";
import { API_BASE_URL } from "../utils/donnee";

function Voitures() {
  interface Voiture {
    id: number;
    matricule: string;
    marque: string;
    agence: string;
  }

  const [voitures, setVoitures] = useState<Voiture[]>([]);

  useEffect(() => {
    try {
      const fetchCamions = async () => {
        const response = await axios.get(`${API_BASE_URL}categ/vhls/2`);

        const data = await response.data;
        setVoitures(data);
      };

      fetchCamions();
    } catch (error) {
      console.error("Error fetching voitures data:", error);
    }
  }, []);

  return (
    <>
      <h1 className="text-3xl">Page des Voitures</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4 p-2">
        {voitures.map((voiture) => (
          <div
            key={voiture.id}
            className="border border-white p-2 bg-linear-to-r from-zinc-100 to-zinc-300  rounded-lg  shadow-md shadow-zinc-500"
          >
            <div className="flex  items-center">
              <FaCarSide className="text-zinc-900 text-3xl" />
              <div className="ml-4 flex-col">
                <h2 className="text-xl font-extrabold">{voiture.matricule}</h2>
                <div className="flex items-center gap-4">
                  <p className="text-gray-700 ">{voiture.marque}</p>
                  <p className="text-gray-800 font-semibold">
                    {voiture.agence}
                  </p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}

export default Voitures;
