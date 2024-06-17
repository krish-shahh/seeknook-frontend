import React from 'react';
import { Typography, Row, Col } from 'antd';

const { Title, Paragraph } = Typography;

const MarketAnalysis = () => (
    <div className="market-analysis-section">
        <Title level={2} style={{ textAlign: 'center' }}>Market Analysis</Title>
        <Row justify="center">
            <Col xs={24} sm={12} md={8}>
                <Title level={4}>Target Customers</Title>
                <Paragraph>
                    <ul>
                        <li>Households and individuals in need of daily services.</li>
                        <li>Local businesses and service providers.</li>
                    </ul>
                </Paragraph>
            </Col>
            <Col xs={24} sm={12} md={8}>
                <Title level={4}>Market Needs</Title>
                <Paragraph>
                    <ul>
                        <li>Reliable and accessible platform for local services.</li>
                        <li>Opportunities for local service providers to reach clients.</li>
                        <li>Support local businesses and keep money within the community.</li>
                    </ul>
                </Paragraph>
            </Col>
        </Row>
    </div>
);

export default MarketAnalysis;
