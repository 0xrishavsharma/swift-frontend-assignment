import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/store";
import { Link } from "react-router-dom";

const Profile = () => {
  const { logout } = useAuthStore();
  return (
    <div className="">
      <div className="">
        <Link to="/" className="">
          <span className="">Back</span>
        </Link>
        <Button onClick={logout} className="">
          Logout
        </Button>
        <div className="shadow-sm"></div>
      </div>
    </div>
  );
};
export default Profile;
