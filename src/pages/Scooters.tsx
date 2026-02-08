import axios from "axios";
import { useEffect, useState } from "react";
import { GiScooter } from "react-icons/gi";
import { API_BASE_URL } from "../utils/donnee";

function Scooters() {
  interface Scooter {
    id: number;
    matricule: string;
    marque: string;
    agence: string;
  }

  const [scooters, setScooters] = useState<Scooter[]>([]);

  useEffect(() => {
    try {
      const fetchScooters = async () => {
        const response = await axios.get(`${API_BASE_URL}categ/vhls/3`);

        const data = await response.data;
        setScooters(data);
      };

      fetchScooters();
    } catch (error) {
      console.error("Error fetching scooters data:", error);
    }
  }, []);

  return (
    <>
      <h1 className="text-3xl">Page des scooters</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4 p-2">
        {scooters.map((scooter) => (
          <div
            key={scooter.id}
            className="border border-white p-2 bg-linear-to-r from-zinc-100 to-zinc-300  rounded-lg  shadow-md shadow-zinc-500"
          >
            <div className="flex  items-center">
              <GiScooter className="text-zinc-900 text-4xl font-bold" />
              <div className="ml-4 flex-col">
                <h2 className="text-xl font-extrabold">{scooter.matricule}</h2>
                <div className="flex items-center gap-4">
                  <p className="text-gray-700 ">{scooter.marque}</p>
                  <p className="text-gray-800 font-semibold">
                    {scooter.agence}
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

export default Scooters;
