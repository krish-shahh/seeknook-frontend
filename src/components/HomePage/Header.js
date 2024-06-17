import React from 'react';
import { Layout, Menu } from 'antd';

const { Header } = Layout;

const AppHeader = () => (
    <Header className="header">
        <div className="logo">SeekNook</div>
        <Menu theme="dark" mode="horizontal" defaultSelectedKeys={['1']}>
            <Menu.Item key="1">Home</Menu.Item>
            <Menu.Item key="2">Features</Menu.Item>
            <Menu.Item key="3">Market Analysis</Menu.Item>
            <Menu.Item key="4">Competitive Advantage</Menu.Item>
            <Menu.Item key="5">Testimonials</Menu.Item>
            <Menu.Item key="6">Contact</Menu.Item>
        </Menu>
    </Header>
);

export default AppHeader;
