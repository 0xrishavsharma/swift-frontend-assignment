import { Outlet } from "react-router-dom";

const NonAuthLayout = () => {
  return (
    <div>
      <h1>Non Auth Layout</h1>
      <Outlet />
    </div>
  );
};
export default NonAuthLayout;
