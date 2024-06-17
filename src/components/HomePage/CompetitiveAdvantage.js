import React from 'react';
import { Typography, Row, Col, Table } from 'antd';

const { Title, Paragraph } = Typography;

const dataSource = [
    {
        key: '1',
        feature: 'Local and Community-Based Services',
        seeknook: 'Yes',
        craigslist: 'No',
        thumbtack: 'Partial',
        sulekha: 'Partial',
    },
    {
        key: '2',
        feature: 'Trust-Building Features',
        seeknook: 'Yes',
        craigslist: 'No',
        thumbtack: 'Partial',
        sulekha: 'Partial',
    },
    {
        key: '3',
        feature: 'User-Friendly Interface',
        seeknook: 'Yes',
        craigslist: 'No',
        thumbtack: 'Yes',
        sulekha: 'Partial',
    },
    {
        key: '4',
        feature: 'Local Sponsorship Options',
        seeknook: 'Yes',
        craigslist: 'No',
        thumbtack: 'No',
        sulekha: 'No',
    },
];

const columns = [
    {
        title: 'Feature',
        dataIndex: 'feature',
        key: 'feature',
    },
    {
        title: 'SeekNook',
        dataIndex: 'seeknook',
        key: 'seeknook',
    },
    {
        title: 'Craigslist',
        dataIndex: 'craigslist',
        key: 'craigslist',
    },
    {
        title: 'Thumbtack',
        dataIndex: 'thumbtack',
        key: 'thumbtack',
    },
    {
        title: 'Sulekha',
        dataIndex: 'sulekha',
        key: 'sulekha',
    },
];

const CompetitiveAdvantage = () => (
    <div className="competitive-advantage-section">
        <Title level={2} style={{ textAlign: 'center' }}>Competitive Advantage</Title>
        <Table dataSource={dataSource} columns={columns} pagination={false} bordered />
    </div>
);

export default CompetitiveAdvantage;
