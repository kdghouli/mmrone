import { createBrowserRouter } from "react-router-dom";
import Camions from "../pages/Camions";
import Voitures from "../pages/Voitures";
import Scooters from "../pages/Scooters";
import Chariots from "../pages/Chariots";
import Autres from "../pages/Autres";
import NotFound from "../pages/autres/NotFound";
import App from "../App";
import Home from "./Home";
//import CreateEquip from "../pages/CreateEquip";
import AgenceManager from "../components/agences/AgenceManager";
import IntituleManager from "../components/intitules/IntituleManager";
import Login from "../components/Auth/Login";
import Register from "../components/Auth/Register";
import UtilisateurManager from "../components/utilisateur/UtilisateurManager";
import VhlManager from "../components/vhls/VhlManager";
import VhlPro from "../components/proVhl/VhlManagerPro";
import CommentsManager from "../components/comments/CommentManager";
import UserProfile from "../components/Auth/UserProfile";

const router = createBrowserRouter([
  {
    path: "",
    element: <App children={undefined} />,

    children: [
      { path: "home", element: <Home /> },
      { path: "camions", element: <Camions /> },
      { path: "voitures", element: <Voitures /> },
      { path: "scooters", element: <Scooters /> },
      { path: "chariots", element: <Chariots /> },
      { path: "autres", element: <Autres /> },
      { path: "agences", element: <AgenceManager /> },
      { path: "intitules", element: <IntituleManager /> },
      { path: "utilisa", element: <UtilisateurManager /> },
      { path: "vhls", element: <VhlManager /> },
      { path: "pro", element: <VhlPro /> },
      { path: "comments", element: <CommentsManager /> },
      //{ path: "create", element: <CreateEquip /> },
      { path: "login", element: <Login /> },
      { path: "register", element: <Register /> },
      { path: "profile", element: <UserProfile /> },
      { path: "*", element: <NotFound /> },
    ],
  },
]);
export default router;
