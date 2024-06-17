import React from 'react';
import { Typography, Button, Row, Col } from 'antd';

const { Title, Paragraph } = Typography;

const HeroSection = () => (
    <div className="hero-section">
        <Row justify="center" align="middle" style={{ minHeight: '60vh' }}>
            <Col span={24} style={{ textAlign: 'center' }}>
                <Title>Welcome to SeekNook</Title>
                <Paragraph>Connecting communities with local services.</Paragraph>
                <Button type="primary" size="large">Get Started</Button>
            </Col>
        </Row>
    </div>
);

export default HeroSection;
