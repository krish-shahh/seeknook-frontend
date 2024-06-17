import React from 'react';
import { Typography, Button, Row, Col } from 'antd';

const { Title, Paragraph } = Typography;

const CallToAction = () => (
    <div className="call-to-action-section">
        <Row justify="center" align="middle" style={{ minHeight: '30vh' }}>
            <Col span={24} style={{ textAlign: 'center' }}>
                <Title>Ready to get started?</Title>
                <Paragraph>Join SeekNook today and enhance your professional network.</Paragraph>
                <Button type="primary" size="large">Sign Up Now</Button>
            </Col>
        </Row>
    </div>
);

export default CallToAction;
