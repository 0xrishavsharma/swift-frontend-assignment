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
    <div className="max-h-max flex items-center justify-center h-screen bg-gray-100">
      <section className="bg-gray-50 dark:bg-gray-900 rounded-xl">
        <div className="lg:py-0 rounded-xl flex flex-col items-center justify-center h-full gap-20 px-6 py-8 mx-auto border border-gray-300">
          <div className="dark:text-white flex flex-col items-center gap-4 mb-6 text-gray-900">
            <img
              src="https://cdn.prod.website-files.com/6509887b9119507025235a5a/650ada40fd6cf3427547c9d8_Swift%20logo.svg"
              alt="Swift Logo"
              // className="mix-blend-color-burn"
            />
            <div className="flex flex-col items-center">
              <span className="text-3xl font-bold">
                Swift Frontend Assignment
              </span>
              <span className="text-xl font-thin">by Rishav Sharma</span>
            </div>
          </div>
          <div className="dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700 w-full bg-white rounded-lg shadow">
            <div className="md:space-y-6 sm:p-8 flex flex-col p-6 space-y-4">
              <h1 className="md:text-2xl dark:text-white text-xl leading-tight tracking-tight text-center text-gray-900">
                Sign in to the application
              </h1>
              <form className="md:space-y-6 space-y-4" action="#">
                <button
                  onClick={() => handleLogin()}
                  className={`w-full text-white bg-primary hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800  ${
                    isLoading && "opacity-50 cursor-not-allowed"
                  }`}
                  disabled={isLoading}
                >
                  {isLoading ? "Loading..." : isError ? "Error" : "Login"}
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Login;
