import React from 'react';
import { Row, Col, Card, Typography } from 'antd';

const { Title, Paragraph } = Typography;

const features = [
    { title: "Connect", description: "Easily connect with peers and mentors." },
    { title: "Collaborate", description: "Work together seamlessly on projects." },
    { title: "Share", description: "Share resources and knowledge effortlessly." }
];

const Features = () => (
    <div className="features-section">
        <Title level={2} style={{ textAlign: 'center' }}>Features</Title>
        <Row gutter={[16, 16]} justify="center">
            {features.map((feature, index) => (
                <Col xs={24} sm={12} md={8} key={index}>
                    <Card hoverable title={feature.title} bordered={false}>
                        <Paragraph>{feature.description}</Paragraph>
                    </Card>
                </Col>
            ))}
        </Row>
    </div>
);

export default Features;
