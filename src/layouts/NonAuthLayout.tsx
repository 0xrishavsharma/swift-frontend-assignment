import { useAuthStore } from "@/store";
import { Navigate, Outlet } from "react-router-dom";

const NonAuthLayout = () => {
  const { user } = useAuthStore();
  if (user !== null) {
    return <Navigate to="/" replace={true} />;
  }
  return (
    <div>
      <Outlet />
    </div>
  );
};
export default NonAuthLayout;
