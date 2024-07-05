import { Navigate, Outlet } from "react-router-dom";
import Navbar from "@/components/navbar";
import { useAuthStore } from "@/store";

const Dashboard = () => {
  const { user } = useAuthStore();
  if (user === null) {
    return <Navigate to="/auth/login" replace={true} />;
  }
  return (
    <div className="">
      <Navbar />
      {/* <div className="flex items-center justify-center w-screen max-w-full h-[calc(100vh_-_4rem)]"> */}
      <div className="flex items-center justify-center w-screen max-w-full">
        {/* <div className="flex items-center justify-center w-[calc(100vw_-_3rem)]"> */}
        <div className="flex flex-col justify-center h-full max-w-[1440px] w-full px-8 sm:px-12 my-10">
          <Outlet />
        </div>
      </div>
    </div>
  );
};
export default Dashboard;
