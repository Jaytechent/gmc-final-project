import React, { useState } from 'react';
import { MenuOutlined } from '@ant-design/icons';
import { Menu } from 'antd';
import { NavLink, useNavigate } from 'react-router-dom';

function getItem(label, key, icon, children, type) {
  return {
    key,
    icon,
    children,
    label,
    type,
  };
}

const items = [
  getItem('Menu', 'sub1', <MenuOutlined />, [
    getItem('Home', '1'),
    getItem('CreatePost', '2'),
    getItem('Register', '3'),
    getItem('Login', '4'),
    getItem('LogOut', '5'),
  ]),
];

// submenu keys of the first level
const rootSubmenuKeys = ['sub1'];

const Navkey = () => {
  const [openKeys, setOpenKeys] = useState(['sub1']);
  const navigate = useNavigate();

  const onOpenChange = (keys) => {
    const latestOpenKey = keys.find((key) => openKeys.indexOf(key) === -1);
    if (latestOpenKey && rootSubmenuKeys.indexOf(latestOpenKey) === -1) {
      setOpenKeys(keys);
    } else {
      setOpenKeys(latestOpenKey ? [latestOpenKey] : []);
    }
  };

  const handleMenuItemClick = (path) => {
    // Use navigate to change the route when a menu item is clicked
    navigate(path);
  };

  return (
    <Menu
      mode="inline"
      openKeys={openKeys}
      onOpenChange={onOpenChange}
      style={{
        width: 256,
      }}
    >
      {items.map((item) => (
        <Menu.SubMenu key={item.key} icon={item.icon} title={item.label}>
          {item.children.map((childItem) => (
            <Menu.Item key={childItem.key} onClick={() => handleMenuItemClick(`/${childItem.label.toLowerCase()}`)}>
              {childItem.label}
            </Menu.Item>
          ))}
        </Menu.SubMenu>
      ))}
    </Menu>
  );
};

export default Navkey;
