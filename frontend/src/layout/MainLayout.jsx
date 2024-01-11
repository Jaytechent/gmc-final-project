import React from "react";
import Navbar from "../component/Navbar";
import { Outlet } from "react-router-dom";

const MainLayout = () => {
  return (
    <>
      <Navbar />
      <div className="min-h-screen">
        {" "}
        <Outlet />
      </div>

      <div>Hello this is footer</div>
    </>
  );
};

export default MainLayout;
