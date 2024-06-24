import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { GoogleAuthProvider, signInWithPopup, signInWithCustomToken } from 'firebase/auth';
import { auth } from '../firebase-config';
import { Button, Input, message, Form, Divider, Typography } from 'antd';
import GoogleButton from 'react-google-button';
import OTPInput from 'react-otp-input';

const { Title, Text } = Typography;

function LoginPage() {
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [isOtpSent, setIsOtpSent] = useState(false);
  const navigate = useNavigate();

  const signInWithGoogle = async () => {
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
      navigate("/dashboard");
    } catch (error) {
      console.error('Error signing in with Google:', error);
      alert("Failed to sign in with Google: " + error.message);
    }
  };

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };

  const handleOtpChange = (otp) => {
    setOtp(otp);
  };

  const sendOtp = async () => {
    try {
      await axios.post('https://seeknook-backend-2564a672bd98.herokuapp.com/api/otp/send-otp', { email });
      setIsOtpSent(true);
      message.success('OTP sent to your email.');
    } catch (error) {
      console.error('Error sending OTP:', error);
      alert('Failed to send OTP: ' + error.message);
    }
  };

  const verifyOtp = async () => {
    try {
      const response = await axios.post('https://seeknook-backend-2564a672bd98.herokuapp.com/api/otp/verify-otp', { email, otp });
      const { token } = response.data;
      //console.log('Received custom token:', token); // Debugging line

      // Sign in the user with the custom token
      await signInWithCustomToken(auth, token);
      navigate("/dashboard");
    } catch (error) {
      console.error('Error verifying OTP:', error);
      alert('Failed to verify OTP: ' + error.message);
    }
  };

  return (
    <div className="login-container" style={{ maxWidth: '400px', margin: 'auto', padding: '20px', textAlign: 'center' }}>
      <Title level={2} className="mb-3">Login</Title>
      <GoogleButton
        onClick={signInWithGoogle}
        style={{ width: '100%', marginBottom: '20px', borderRadius: '3px' }}
      />
      <Divider>OR</Divider>
      <Form layout="vertical" style={{ textAlign: 'left' }}>
        <Form.Item>
          <Input
            type="email"
            value={email}
            onChange={handleEmailChange}
            placeholder="Enter your email"
          />
        </Form.Item>
        {isOtpSent && (
          <Form.Item>
            <OTPInput
              value={otp}
              onChange={handleOtpChange}
              numInputs={6}
              renderInput={(props) => <input {...props} />}
              separator={<span>-</span>}
              isInputNum
              shouldAutoFocus
              containerStyle={{
                display: 'flex',
                justifyContent: 'space-between',
              }}
              inputStyle={{
                width: '40px',
                height: '40px',
                margin: '0 5px',
                fontSize: '20px',
                borderRadius: '4px',
                border: '1px solid rgba(0,0,0,0.3)',
                textAlign: 'center'
              }}
            />
          </Form.Item>
        )}
        <Form.Item>
          <Button
            type="primary"
            onClick={isOtpSent ? verifyOtp : sendOtp}
            style={{ width: '100%' }}
          >
            {isOtpSent ? 'Verify OTP' : 'Send OTP'}
          </Button>
        </Form.Item>
      </Form>
      <Text type="secondary">We'll send a sign-in OTP to your email</Text>
    </div>
  );
}

export default LoginPage;
