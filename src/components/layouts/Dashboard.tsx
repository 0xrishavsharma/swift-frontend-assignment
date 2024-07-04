import { Navigate, Outlet } from "react-router-dom";
import Navbar from "../navbar/Navbar";
import { useAuthStore } from "@/store";

const Dashboard = () => {
  const { user } = useAuthStore();
  if (user === null) {
    return <Navigate to="/auth/login" replace={true} />;
  }
  return (
    <div className="">
      <Navbar />
      <div className="flex items-center justify-center w-screen">
        <div className="max-w-[1440px] ">
          <Outlet />
        </div>
      </div>
    </div>
  );
};
export default Dashboard;
