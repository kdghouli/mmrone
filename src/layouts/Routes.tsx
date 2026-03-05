import { createBrowserRouter } from "react-router-dom";
import Camions from "../pages/Camions";
import Voitures from "../pages/Voitures";
import Scooters from "../pages/Scooters";
import Chariots from "../pages/Chariots";
import App from "../App";
import Home from "./Home";
import AgenceManager from "../components/agences/AgenceManager";
import IntituleManager from "../components/intitules/IntituleManager";
import Login from "../components/Auth/UserLogin";
import Register from "../components/Auth/UserRegister";
import UtilisateurManager from "../components/utilisateur/UtilisateurManager";
import VhlManager from "../components/vhls/VhlManager";
import VhlPro from "../components/proVhl/VhlManagerPro";
import CommentsManager from "../components/comments/CommentManager";
import UserProfile from "../components/Auth/UserProfile";
import ErrorBoundary from "../components/ErrorBoundary";
import { TaskList } from "../components/tasks/TaskList";

const router = createBrowserRouter([
  {
    element: <App children={undefined} />,

    children: [
      { index: true, element: <Home />, errorElement: <ErrorBoundary /> },
      {
        path: "/camions",
        element: <Camions />,
        errorElement: <ErrorBoundary />,
      },
      {
        path: "/voitures",
        element: <Voitures />,
        errorElement: <ErrorBoundary />,
      },
      {
        path: "/scooters",
        element: <Scooters />,
        errorElement: <ErrorBoundary />,
      },
      {
        path: "/chariots",
        element: <Chariots />,
        errorElement: <ErrorBoundary />,
      },
      {
        path: "/agences",
        element: <AgenceManager />,
        errorElement: <ErrorBoundary />,
      },
      {
        path: "/intitules",
        element: <IntituleManager />,
        errorElement: <ErrorBoundary />,
      },
      {
        path: "/utilisa",
        element: <UtilisateurManager />,
        errorElement: <ErrorBoundary />,
      },
      {
        path: "/vhls",
        element: <VhlManager />,
        errorElement: <ErrorBoundary />,
      },
      { path: "/pro", element: <VhlPro /> },
      {
        path: "/comments",
        element: <CommentsManager />,
        errorElement: <ErrorBoundary />,
      },
      { path: "/login", element: <Login />, errorElement: <ErrorBoundary /> },
      {
        path: "/register",
        element: <Register />,
        errorElement: <ErrorBoundary />,
      },
      {
        path: "/profile",
        element: <UserProfile />,
        errorElement: <ErrorBoundary />,
      },
      {
        path: "/tasks",
        element: <TaskList />,
        errorElement: <ErrorBoundary />,
      },
      { path: "*", element: <ErrorBoundary /> },
    ],
  },
]);
export default router;
