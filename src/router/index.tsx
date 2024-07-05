import { createBrowserRouter } from "react-router-dom";
import Profile from "@/pages/profile";
import Dashboard from "@/layouts/Dashboard";
import Comments from "@/pages/comments";
import Login from "@/pages/login";
import NonAuthLayout from "@/layouts/NonAuthLayout";
export const router = createBrowserRouter([
  {
    path: "/",
    element: <Dashboard />,
    children: [
      {
        path: "",
        element: <Comments />,
      },
      {
        path: "profile",
        element: <Profile />,
      },
    ],
  },

  {
    path: "/auth",
    element: <NonAuthLayout />,
    children: [
      {
        path: "login",
        element: <Login />,
      },
    ],
  },
]);
