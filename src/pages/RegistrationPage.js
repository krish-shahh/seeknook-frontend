import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Form, Input, Button, message } from 'antd';
import { account } from '../appwrite-config'; // Import Appwrite configuration

const RegistrationPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleRegistration = async () => {
    setLoading(true);
    try {
      const response = await account.create('unique()', email, password);

      if (response) {
        message.success('Registration successful! Please check your email to confirm your account.');
        navigate('/login');
      }
    } catch (error) {
      console.error('Registration failed:', error.message);
      message.error('Registration failed: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mt-5">
      <h1 className="mb-3">Register</h1>
      <Form onFinish={handleRegistration}>
        <Form.Item>
          <Input
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            type="email"
            required
          />
        </Form.Item>
        <Form.Item>
          <Input
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            type="password"
            required
          />
        </Form.Item>
        <Button type="primary" htmlType="submit" loading={loading}>
          Register
        </Button>
      </Form>
    </div>
  );
};

export default RegistrationPage;
