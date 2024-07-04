import { useAuthStore } from "@/store";
import { Navigate, Outlet } from "react-router-dom";

const NonAuthLayout = () => {
  const { user } = useAuthStore();
  if (user !== null) {
    return <Navigate to="/" replace={true} />;
  }
  return (
    <div>
      <h1>Non Auth Layout</h1>
      <Outlet />
    </div>
  );
};
export default NonAuthLayout;
