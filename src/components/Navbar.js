import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { UserOutlined, LogoutOutlined, HomeOutlined, DashboardOutlined, HeartOutlined, LoginOutlined, SettingOutlined } from '@ant-design/icons';
import { Menu } from 'antd';
import { auth } from '../firebase-config';

const Navbar = () => {
  const [current, setCurrent] = useState('home');
  const navigate = useNavigate();
  const location = useLocation();
  const [user, setUser] = useState(null);
  const allowedEmails = ['nimitspc@gmail.com', '2003kshah@gmail.com'];

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(currentUser => {
      if (currentUser) {
        setUser(currentUser);
        // Set the current menu item based on the current path
        setCurrent(location.pathname === '/' ? 'seeknook' : location.pathname.slice(1));
      } else {
        setUser(null);
        setCurrent('home');
      }
    });

    // Set the current menu item based on the current path on initial load
    setCurrent(location.pathname === '/' ? 'seeknook' : location.pathname.slice(1));

    return () => unsubscribe();
  }, [location]);

  const onClick = (e) => {
    console.log('click ', e);
    setCurrent(e.key);
  };

  const handleLogout = async () => {
    try {
      await auth.signOut();
      navigate("/");
    } catch (error) {
      console.error('Error signing out: ', error);
    }
  };

  const items = [
    {
      label: <Link to="/">SeekNook</Link>,
      key: 'seeknook',
      icon: <HomeOutlined />
    },
    {
      label: <Link to="/business-list">Businesses</Link>,
      key: 'business-list'
    },
    {
      label: <Link to="/franchises-list">Franchises</Link>,
      key: 'franchises-list'
    },
    user ? {
      label: 'Profile',
      key: 'profile',
      icon: <UserOutlined />,
      children: [
        allowedEmails.includes(user.email) && {
          label: <Link to="/admin">Admin Panel</Link>,
          key: 'admin',
          icon: <SettingOutlined />
        },
        {
          label: <Link to="/dashboard">Dashboard</Link>,
          key: 'dashboard',
          icon: <DashboardOutlined />
        },
        {
          label: 'Log Out',
          key: 'logout',
          onClick: handleLogout,
          style: { color: 'red' },
          icon: <LogoutOutlined />
        },
      ].filter(Boolean), // Filter out false values
    } : {
      label: <Link to="/login">Login</Link>,
      key: 'login',
      icon: <LoginOutlined />
    }
  ];

  // Style to center menu items
  const menuStyle = {
    display: 'flex',
    justifyContent: 'center',
    width: '100%'
  };

  return (
    <Menu
      onClick={onClick}
      selectedKeys={[current]}
      mode="horizontal"
      items={items}
      style={menuStyle}  // Apply the style for center alignment
    />
  );
};

export default Navbar;
