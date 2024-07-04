import { Link } from "react-router-dom";

const Navbar = () => {
  return (
    <div className=" bg-primary flex items-center justify-center w-screen h-24 text-white">
      <div className="flex justify-between items-center max-w-[1440px] w-full px-6 sm:px-12">
        {/* <img
          src="https://cdn.prod.website-files.com/6509887b9119507025235a5a/650ada40fd6cf3427547c9d8_Swift%20logo.svg"
          alt="Swift Logo"
          className="mix-blend-color-burn"
        /> */}
        <span className=" text-xl font-bold">Swift</span>
        <Link to="/profile" className=" flex items-center gap-4">
          <div className="w-12 h-12 bg-white rounded-full"></div>
          <span className="text-lg">Ervin Howell</span>
        </Link>
      </div>
    </div>
  );
};
export default Navbar;
