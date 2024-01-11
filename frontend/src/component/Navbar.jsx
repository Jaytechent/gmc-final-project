// Navbar.js

import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { Button, Avatar } from "antd";
import { useSelector, useDispatch } from "react-redux";
import { logoutUser } from "../store/userSlice"; // Adjust the path

const Navbar = () => {
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.user);
  const dispatch = useDispatch();

  const handleLogOut = () => {
    localStorage.clear("user");
    dispatch(logoutUser()); // Dispatch the logOutUser action
    navigate("/login");
  };

  return (
    <nav className="shadow py-1">
      <div className="max-w-4xl mx-auto flex items-center justify-between">
        <div className="flex items-center">
          <img
            src="https://th.bing.com/th/id/OIP.TPa_HpG2EtaDfZbSPI9A9AHaHa?rs=1&pid=ImgDetMain"
            alt="barnd logo"
            className="w-16"
          />
          <p className="font-bold text-orange-600">Gmc Ads</p>
        </div>

        <div className="flex gap-4">
          <NavLink to="/">home</NavLink>{" "}
          <NavLink to="/createpost">Create a Post</NavLink>{" "}
          <NavLink to="/register">Register</NavLink>{" "}
          <NavLink to="/login">login</NavLink>{" "}
          <Button type="primary" onClick={handleLogOut}>
            Logout
          </Button>
          {user && (
            <span>
              <Avatar>{user.name.charAt(0)}</Avatar>
              <span>{user.name}</span>
            </span>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
