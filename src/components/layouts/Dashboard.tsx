import { Outlet } from "react-router-dom";
import Navbar from "../navbar/Navbar";
import { useEffect } from "react";

const Dashboard = () => {
  useEffect(() => {});
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
