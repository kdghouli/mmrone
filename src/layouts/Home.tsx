import { Link } from "react-router-dom";
import Header from "./Header";

const Home = () => {
  return (
    <>
      <Header />
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 p-14 ">
        <Link to="/vhls">
          <section className="relative flex flex-col items-center justify-center min-h-75 w-full bg-[url('./../images/dashboardIcon.png')] bg-cover bg-center rounded-2xl shadow-lg hover:shadow-2xl shadow-gray-600 hover:scale-102 duration-300 transition-all overflow-hidden group">
            {/* Overlay semi-transparent pour améliorer la lisibilité du texte */}
            <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-colors duration-300 rounded-2xl"></div>

            {/* Contenu principal */}
            <div className="relative z-10 text-center p-6">
              <h1 className="text-6xl lg:text-7xl xl:text-[90px] font-extrabold text-amber-500 drop-shadow-lg border p-4">
                Dashboard
              </h1>
              {/* Vous pouvez ajouter un sous-titre ici si nécessaire */}
              {/* <p className="text-amber-100 mt-4 text-lg md:text-xl">Votre slogan ici</p> */}
            </div>
          </section>
        </Link>

        <Link to="/camions">
          <section className="relative flex flex-col items-center justify-center min-h-75 w-full bg-[url('./../images/camionIcon.jpg')] bg-cover bg-center rounded-2xl shadow-lg hover:shadow-2xl shadow-gray-600 hover:scale-102 duration-300 transition-all overflow-hidden group">
            {/* Overlay semi-transparent pour améliorer la lisibilité du texte */}
            <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-colors duration-300 rounded-2xl"></div>

            {/* Contenu principal */}
            <div className="relative z-10 text-center p-6">
              <h1 className="text-6xl lg:text-7xl xl:text-[90px] font-extrabold text-amber-500 drop-shadow-lg border p-4">
                Camions
              </h1>
              {/* Vous pouvez ajouter un sous-titre ici si nécessaire */}
              {/* <p className="text-amber-100 mt-4 text-lg md:text-xl">Votre slogan ici</p> */}
            </div>
          </section>
        </Link>

        <Link to="/voitures">
          <section className="relative flex flex-col items-center justify-center min-h-75 w-full bg-[url('./../images/voitureIcon.jpg')] bg-cover bg-center rounded-2xl shadow-lg hover:shadow-2xl shadow-gray-600 hover:scale-102 duration-300 transition-all overflow-hidden group">
            {/* Overlay semi-transparent pour améliorer la lisibilité du texte */}
            <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-colors duration-300 rounded-2xl"></div>

            {/* Contenu principal */}
            <div className="relative z-10 text-center p-6">
              <h1 className="text-6xl lg:text-7xl xl:text-[90px] font-extrabold text-amber-500 drop-shadow-lg border p-4">
                Voitures
              </h1>
              {/* Vous pouvez ajouter un sous-titre ici si nécessaire */}
              {/* <p className="text-amber-100 mt-4 text-lg md:text-xl">Votre slogan ici</p> */}
            </div>
          </section>
        </Link>

        <Link to="/chariots">
          <section className="relative flex flex-col items-center justify-center min-h-75 w-full bg-[url('./../images/chariotIcon.jpg')] bg-cover bg-center rounded-2xl shadow-lg hover:shadow-2xl shadow-gray-600 hover:scale-102 duration-300 transition-all overflow-hidden group">
            {/* Overlay semi-transparent pour améliorer la lisibilité du texte */}
            <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-colors duration-300 rounded-2xl"></div>

            {/* Contenu principal */}
            <div className="relative z-10 text-center p-6">
              <h1 className="text-6xl lg:text-7xl xl:text-[90px] font-extrabold text-amber-500 drop-shadow-lg border p-4">
                Chariots
              </h1>
              {/* Vous pouvez ajouter un sous-titre ici si nécessaire */}
              {/* <p className="text-amber-100 mt-4 text-lg md:text-xl">Votre slogan ici</p> */}
            </div>
          </section>
        </Link>

        <Link to="/scooters">
          <section className="relative flex flex-col items-center justify-center min-h-75 w-full bg-[url('./../images/motoIcon.jpg')] bg-cover bg-center rounded-2xl shadow-lg hover:shadow-2xl shadow-gray-600 hover:scale-102 duration-300 transition-all overflow-hidden group">
            {/* Overlay semi-transparent pour améliorer la lisibilité du texte */}
            <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-colors duration-300 rounded-2xl"></div>

            {/* Contenu principal */}
            <div className="relative z-10 text-center p-6">
              <h1 className="text-6xl lg:text-7xl xl:text-[90px] font-extrabold text-amber-500 drop-shadow-lg border p-4">
                Scooters
              </h1>
              {/* Vous pouvez ajouter un sous-titre ici si nécessaire */}
              {/* <p className="text-amber-100 mt-4 text-lg md:text-xl">Votre slogan ici</p> */}
            </div>
          </section>
        </Link>

        <Link to="/agences">
          <section className="relative flex flex-col items-center justify-center min-h-75 w-full bg-[url('./../images/cartes2.jpg')] bg-contain  rounded-2xl shadow-lg hover:shadow-2xl shadow-gray-600 hover:scale-102 duration-300 transition-all overflow-hidden group">
            {/* Overlay semi-transparent pour améliorer la lisibilité du texte */}
            <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-colors duration-300 rounded-2xl"></div>

            {/* Contenu principal */}
            <div className="relative z-10 text-center p-6">
              <h1 className="text-6xl lg:text-7xl xl:text-[90px] font-extrabold text-amber-500 drop-shadow-lg border p-4">
                Agences
              </h1>
              {/* Vous pouvez ajouter un sous-titre ici si nécessaire */}
              {/* <p className="text-amber-100 mt-4 text-lg md:text-xl">Votre slogan ici</p> */}
            </div>
          </section>
        </Link>

        <Link to="/intitules">
          <section className="relative flex flex-col items-center justify-center min-h-75 w-full bg-[url('./../images/parameter.jpg')] bg-cover  rounded-2xl shadow-lg hover:shadow-2xl shadow-gray-600 hover:scale-102 duration-300 transition-all overflow-hidden group">
            {/* Overlay semi-transparent pour améliorer la lisibilité du texte */}
            <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-colors duration-300 rounded-2xl"></div>

            {/* Contenu principal */}
            <div className="relative z-10 text-center p-6">
              <h1 className="text-4xl  lg:text-6xl xl:text-[80px] font-extrabold text-amber-500 drop-shadow-lg border p-4">
                Parametres
              </h1>
              {/* Vous pouvez ajouter un sous-titre ici si nécessaire */}
              {/* <p className="text-amber-100 mt-4 text-lg md:text-xl">Votre slogan ici</p> */}
            </div>
          </section>
        </Link>
      </div>
    </>
  );
};

export default Home;
