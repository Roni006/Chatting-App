import { Outlet } from "react-router-dom";
import NavBar from "../navbar";

const RootLayout = () => {
  return (
    <>
      <div className="relative w-full h-screen">
        <div className="w-full bg-white grid grid-cols-[166px_auto] h-full">
          <NavBar />
          <Outlet />
        </div>
      </div>
    </>
  );
};

export default RootLayout;
