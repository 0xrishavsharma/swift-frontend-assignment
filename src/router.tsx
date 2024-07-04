import { createBrowserRouter } from "react-router-dom";
import Profile from "./pages/profile/Profile";
import Dashboard from "./pages/dashboard/Dashboard";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Dashboard />,
  },
  {
    path: "/profile",
    element: <Profile />,
  },
]);
