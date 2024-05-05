import React, { useState, useEffect } from "react";
import { NavLink, } from "react-router-dom";
import { Button, Avatar, Drawer, Menu } from "antd";
import { LogoutOutlined, MenuOutlined } from "@ant-design/icons";
import { useSelector, useDispatch } from "react-redux";
import { logoutUser } from "../store/userSlice";
import { useNavigate } from 'react-router-dom';



const Navbar = () => {
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const [drawerVisible, setDrawerVisible] = useState(false);
  const [isMobile, setIsMobile] = useState(false);


  
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    // Set initial mobile state
    handleResize();

    // Add event listener for window resize
    window.addEventListener("resize", handleResize);

    // Remove event listener on component unmount
    return () => {
      window.removeEventListener("resize", handleResize);
    };
 
  }, []);


  const handleLogOut = function() {
    dispatch(logoutUser());
    localStorage.clear();
    navigate("/login");
  };
  

  const isUserLoggedIn = !!user;

  const items = [
    { path: "/", label: "Home" },
    { path: "/createpost", label: "Create a Post" },
    { path: "/about", label: "About" },
    // Conditionally render "Register" and "Login" links
    { path: "/register", label: "Register", show: !isUserLoggedIn },
    { path: "/login", label: "Login", show: !isUserLoggedIn },
  ];

  const handleMenuItemClick = (path) => {
    navigate(path);
    setDrawerVisible(false);
  };

  return (
    <>
      <nav className="shadow-md p-2 md:p-4 bg-white">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
        <div className="flex items-center">
  <div className="h-14 w-32 relative overflow-hidden rounded-full  lg:ml-4">
    <NavLink to="/">  <video className="object-cover w-full h-full" autoPlay loop muted playsInline>
      <source src="/logo-animate.mp4" type="video/mp4" />
      
    </video> </NavLink>
  </div>
  <NavLink>
    <p className="font-bold text-white ml-2">Gmc Ads</p>
  </NavLink>
</div>

          <div className="md:hidden">
            <Button
              type="text"
              icon={<MenuOutlined />}
             onClick={() => setDrawerVisible(true)} 
            />
          </div>

          <div className="hidden md:flex md:items-center md:space-x-4">
    {items
      .filter((item) => item.show !== false) // Filter out items with show set to false
      .map((item, index) => (
        <NavLink
          key={index}
          to={item.path}
          className="nav-link hover:text-red-500"
          onClick={() => handleMenuItemClick(item.path)}
        >
          {item.label}
        </NavLink>
      ))}
    {user && (
      <span className="flex items-center">
        <Avatar>{user.name.charAt(0)}</Avatar>
        {!isMobile && <span className="ml-2">{user.name}</span>}
      </span>
    )}
   {user && (
  <p onClick={handleLogOut} className="p-2 text-from-purple-700 hover:text-[red] cursor-pointer">
    Logout
  </p>
)}

  </div>

        </div>
      </nav>


      <div className="flex-1 relative overflow-hidden bg-white rounded-md shadow-md">
  <video className="w-full h-20 object-cover" src="/gmcads-login-vdo.mp4" autoPlay loop muted playsInline></video>
</div>

<Drawer
    placement="right"
    closable={false}
    onClose={() => setDrawerVisible(false)}
    open={drawerVisible}
    title="Menu"
    style={{ header: { background: "#001529", color: "white" } }}
  >
    <Menu theme="dark" mode="vertical">
      {items
        .filter((item) => item.show !== false || !isMobile) // Filter out items with show set to false in mobile mode
        .map((item, index) => (
          <Menu.Item key={index} icon={item.icon} onClick={() => handleMenuItemClick(item.path)}>
            {item.label}
          </Menu.Item>
        ))}
    </Menu>
    {user && (
  <p onClick={() => {handleLogOut(); setDrawerVisible(false)}} className="p-2 bg-[#001529] text-white hover:text-[red] cursor-pointer">
    <LogoutOutlined /> Logout
  </p>
)}
 </Drawer>
    </>
  );
};

export default Navbar;
