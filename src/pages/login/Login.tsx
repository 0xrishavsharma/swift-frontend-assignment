import { login } from "@/http/api";
import { router } from "@/router";
import { useQuery } from "react-query";

const Login = () => {
  const handleLogin = async () => {
    const user = await login();
    console.log(user);
    if (user && user.status === 200) {
      return user.data;
    }
  };

  const { isLoading, isError } = useQuery({
    queryKey: "login",
    queryFn: handleLogin,
    onSuccess: () => {
      console.log("Login successful");
      router.navigate("/");
    },
  });
  return (
    <div>
      <button onClick={handleLogin}>
        {isLoading ? "Loading..." : isError ? "Error" : "Login"}
      </button>
      {isError && (
        <div>
          <p>Error logging in, please try again</p>
        </div>
      )}
    </div>
  );
};
export default Login;
