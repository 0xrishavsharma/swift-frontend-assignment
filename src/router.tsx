import { createBrowserRouter } from "react-router-dom";
import Profile from "@/pages/profile/Profile";
import Dashboard from "@/components/layouts/Dashboard";
import Comments from "./pages/comments/Comments";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Dashboard />,
    children: [
      {
        path: "/",
        element: <Comments />,
      },
      {
        path: "/profile",
        element: <Profile />,
      },
    ],
  },
]);
