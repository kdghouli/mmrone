import axios from "axios";
import { useEffect, useState } from "react";
import { GiForklift } from "react-icons/gi";
import { API_BASE_URL } from "../utils/donnee";

function Chariots() {
  interface Chariot {
    id: number;
    matricule: string;
    marque: string;
    agence: string;
  }

  const [chariots, setChariots] = useState<Chariot[]>([]);

  useEffect(() => {
    try {
      const fetchChariots = async () => {
        const response = await axios.get(`${API_BASE_URL}categ/vhls/4`);

        const data = await response.data;
        setChariots(data);
      };

      fetchChariots();
    } catch (error) {
      console.error("Error fetching chariots data:", error);
    }
  }, []);

  return (
    <>
      <h1 className="text-3xl">Page des chariots élèvateurs</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4 p-2">
        {chariots.map((chariot) => (
          <div
            key={chariot.id}
            className="border border-white p-2 bg-linear-to-r from-zinc-100 to-zinc-300  rounded-lg  shadow-md shadow-zinc-500"
          >
            <div className="flex  items-center">
              <GiForklift className="text-zinc-900 text-5xl font-bold" />
              <div className="ml-4 flex-col">
                <h2 className="text-xl font-extrabold">{chariot.matricule}</h2>
                <div className="flex items-center gap-4">
                  <p className="text-gray-700 ">{chariot.marque}</p>
                  <p className="text-gray-800 font-semibold">
                    {chariot.agence}
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

export default Chariots;
