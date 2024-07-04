import { useQuery } from "react-query";
import { Outlet } from "react-router-dom";
import { useEffect } from "react";
import { useAuthStore } from "@/store";
import { login } from "@/http/api";
const Root = () => {
  const { setUser } = useAuthStore();
  const { data, isLoading, isError } = useQuery({
    queryKey: "auth",
    queryFn: login,
  });

  useEffect(() => {
    if (data) {
      const userData = data.data;
      setUser(userData);
    }
  }, [setUser, data, isError]);

  if (isLoading) return <div>Loading...</div>;

  return <Outlet />;
};
export default Root;
