import { getUserInitials } from "@/lib/utils";
import { useAuthStore } from "@/store";
import { useState } from "react";
import { Link } from "react-router-dom";

const Navbar = () => {
  const { user, logout } = useAuthStore();
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);

  return (
    <div className="bg-primary flex items-center justify-center w-screen h-24 max-w-full text-white">
      <div className="flex justify-between items-center max-w-[1440px] w-full px-6 sm:px-12">
        {/* <img
          src="https://cdn.prod.website-files.com/6509887b9119507025235a5a/650ada40fd6cf3427547c9d8_Swift%20logo.svg"
          alt="Swift Logo"
          className="mix-blend-color-burn"
        /> */}
        <Link to="/" className=" text-xl font-bold">
          Swift
        </Link>
        <button
          onClick={() => setIsSettingsModalOpen(!isSettingsModalOpen)}
          className=" flex items-center gap-4"
        >
          <div className="md:w-12 md:h-12 flex items-center justify-center w-10 h-10 text-lg font-medium text-black bg-white rounded-full">
            {user && getUserInitials(user.name)}
          </div>
          <span className="sm:block hidden text-lg">{user && user.name}</span>
        </button>
        {
          // Settings Modal
          isSettingsModalOpen && (
            <div className="top-20 right-4 md:right-20 absolute z-10 flex flex-col w-40 gap-4 p-4 text-black bg-white rounded-md shadow-lg">
              <Link
                to="/profile"
                onClick={() => {
                  setIsSettingsModalOpen(false);
                }}
                className="flex items-center gap-2"
              >
                <span>Profile</span>
              </Link>
              <button
                onClick={() => {
                  logout();
                  setIsSettingsModalOpen(false);
                }}
                className="flex items-center gap-2"
              >
                Logout
              </button>
            </div>
          )
        }
      </div>
    </div>
  );
};
export default Navbar;
