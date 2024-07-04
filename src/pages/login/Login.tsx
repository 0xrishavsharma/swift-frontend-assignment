import { login } from "@/http/api";
import { router } from "@/router";

const Login = () => {
  const handleLogin = async () => {
    const user = await login();
    console.log(user);
    if (user && user.status === 200) {
      console.log("Login successful");
      router.navigate("/");
    }
  };
  return (
    <div>
      <button onClick={handleLogin}>Login</button>
    </div>
  );
};
export default Login;
