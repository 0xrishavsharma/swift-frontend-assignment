import { login } from "@/http/api";
import { router } from "@/router";
import { useAuthStore, User } from "@/store";
import { useMutation } from "react-query";

const Login = () => {
  const { setUser } = useAuthStore();
  const {
    mutate: handleLogin,
    isLoading,
    isError,
  } = useMutation(login, {
    onSuccess: (response) => {
      const user: User = response.data;
      setUser(user);
      router.navigate("/");
    },
    onError: (error) => {
      console.error("Error logging in", error);
    },
  });
  return (
    <div>
      <button onClick={() => handleLogin()}>
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
