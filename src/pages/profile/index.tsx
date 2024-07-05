import { useAuthStore } from "@/store";
import { Link } from "react-router-dom";

// icons
import { BsArrowLeft } from "react-icons/bs";
import { getUserInitials } from "@/lib/utils";

const Profile = () => {
  const { user } = useAuthStore();
  return (
    <div className="flex flex-col w-full min-h-[calc(100vh_-_13.5rem)] gap-10">
      <div className="sm:flex items-center hidden gap-3 text-xl font-medium">
        <Link to="/" className="">
          <BsArrowLeft className="hover:-translate-x-0.5 duration-300" />
        </Link>
        <span className="">Welcome, {user?.name}</span>
      </div>
      <div className="h-full p-12 border-blue-900 rounded-lg shadow-[rgba(0,0,0,0.1)_0px_0px_5px_0px,rgba(0,0,0,0.1)_0px_0px_1px_0px]">
        <div className="text-primary flex items-center gap-4 pb-8">
          <div className="bg-muted md:w-24 md:h-24 md:text-3xl flex items-center justify-center w-12 h-12 text-lg font-medium rounded-full">
            {user && getUserInitials(user.name)}
          </div>
          <div className="flex flex-col">
            <span className="md:text-xl text-lg font-medium">{user?.name}</span>
            <span className="text-gray-400">{user?.email.toLowerCase()}</span>
          </div>
        </div>
        {/* Personal Info */}
        <div className="md:gap-14 md:grid-cols-2 grid grid-cols-1 gap-10">
          <div className="flex flex-col gap-2">
            <span className="text-secondary">User ID</span>
            <span className="bg-muted text-secondary px-4 py-3 font-medium rounded-sm">
              {user?.id}
            </span>
          </div>
          <div className="flex flex-col gap-2">
            <span className="text-secondary">Name</span>
            <span className="bg-muted text-secondary px-4 py-3 font-medium rounded-sm">
              {user?.name}
            </span>
          </div>
          <div className="flex flex-col gap-2">
            <span className="text-secondary">Email ID</span>
            <span className="bg-muted text-secondary px-4 py-3 font-medium rounded-sm">
              {user?.email}
            </span>
          </div>
          <div className="flex flex-col gap-2">
            <span className="text-secondary">Address</span>
            <span className="bg-muted text-secondary px-4 py-3 font-medium rounded-sm">
              {user?.address?.suite +
                ", " +
                user?.address?.street +
                ", " +
                user?.address?.city +
                ", " +
                user?.address?.zipcode}
            </span>
          </div>
          <div className="flex flex-col gap-2">
            <span className="text -gray-400">Phone</span>
            <span className="bg-muted text-secondary px-4 py-3 font-medium rounded-sm">
              {user?.phone}
            </span>
          </div>
        </div>
        <div></div>
      </div>
    </div>
  );
};
export default Profile;
