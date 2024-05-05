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

      
    </>
  );
};

export default MainLayout;
