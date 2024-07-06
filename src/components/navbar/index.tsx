import { getUserInitials } from "@/lib/utils";
import { useAuthStore } from "@/store";
import { useState } from "react";
import { Link } from "react-router-dom";

// React Icons
import { RiLogoutBoxLine, RiUser3Line } from "react-icons/ri";

const Navbar = () => {
  const { user, logout } = useAuthStore();
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);

  return (
    <div className="bg-primary flex items-center justify-center w-screen h-24 max-w-full text-white">
      <div className=" flex justify-between items-center max-w-[1440px] w-full px-6 sm:px-12">
        {/* <img
          src="https://cdn.prod.website-files.com/6509887b9119507025235a5a/650ada40fd6cf3427547c9d8_Swift%20logo.svg"
          alt="Swift Logo"
          className="mix-blend-color-burn"
        /> */}
        <Link to="/" className=" text-xl font-bold">
          Swift
        </Link>
        <div className="relative flex items-center gap-4">
          <button
            onClick={() => setIsSettingsModalOpen(!isSettingsModalOpen)}
            className="md:w-12 md:h-12 flex items-center justify-center w-10 h-10 text-lg font-medium text-black bg-white rounded-full"
          >
            {user && getUserInitials(user.name)}
          </button>
          <span className="sm:block hidden text-lg">{user && user.name}</span>
          {
            // Settings Modal
            isSettingsModalOpen && (
              <div className="top-14 md:left-0 max-w-max absolute right-0 z-10 flex flex-col items-center text-black bg-white rounded-md shadow-lg">
                <Link
                  to="/profile"
                  onClick={() => {
                    setIsSettingsModalOpen(false);
                  }}
                  className="hover:bg-primary hover:text-white rounded-t-md hover:border-white flex items-center w-full gap-2 px-8 py-3 duration-300 border border-transparent"
                >
                  <span>Profile</span>
                  <RiUser3Line />
                </Link>
                <button
                  onClick={() => {
                    logout();
                    setIsSettingsModalOpen(false);
                  }}
                  className="hover:bg-primary hover:text-white rounded-b-md hover:border-white flex items-center w-full gap-2 px-8 py-3 duration-300 border border-transparent"
                >
                  <span>Logout</span>
                  <RiLogoutBoxLine />
                </button>
              </div>
            )
          }
        </div>
      </div>
    </div>
  );
};
export default Navbar;
