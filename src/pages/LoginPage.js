import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { GoogleAuthProvider, signInWithPopup, sendSignInLinkToEmail, isSignInWithEmailLink, signInWithEmailLink } from 'firebase/auth';
import { auth } from '../firebase-config';
import { Button, Input, message, Form, Divider, Typography, Space } from 'antd';
import { GoogleOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;

function LoginPage() {
  const [email, setEmail] = useState('');
  const navigate = useNavigate();

  const signInWithGoogle = async () => {
    const provider = new GoogleAuthProvider(); // Create a new instance of the GoogleAuthProvider
    try {
      const result = await signInWithPopup(auth, provider); // Attempt to sign in with the popup
      // After successful sign-in:
      navigate("/dashboard"); // Navigate to the success page
    } catch (error) {
      console.error('Error signing in with Google:', error); // Handle errors here
      alert("Failed to sign in with Google: " + error.message);
    }
  };

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };

  const sendSignInLink = async () => {
    const actionCodeSettings = {
      url: window.location.href,
      handleCodeInApp: true,
    };

    try {
      await sendSignInLinkToEmail(auth, email, actionCodeSettings);
      window.localStorage.setItem('emailForSignIn', email);
      message.success('Sign-in link sent to your email.');
    } catch (error) {
      console.error('Error sending email sign-in link:', error);
      alert('Failed to send email sign-in link: ' + error.message);
    }
  };

  const checkEmailSignIn = async () => {
    if (isSignInWithEmailLink(auth, window.location.href)) {
      let email = window.localStorage.getItem('emailForSignIn');
      if (!email) {
        email = window.prompt('Please provide your email for confirmation');
      }
      try {
        await signInWithEmailLink(auth, email, window.location.href);
        window.localStorage.removeItem('emailForSignIn');
        navigate("/dashboard");
      } catch (error) {
        console.error('Error signing in with email link:', error);
        alert('Failed to sign in with email link: ' + error.message);
      }
    }
  };

  React.useEffect(() => {
    checkEmailSignIn();
  }, []);

  return (
    <div className="login-container" style={{ maxWidth: '400px', margin: 'auto', padding: '20px', textAlign: 'center' }}>
      <Title level={2} className="mb-3">Login</Title>
      <Button type="primary" icon={<GoogleOutlined />} onClick={signInWithGoogle} style={{ width: '100%', marginBottom: '20px' }}>
        Sign In With Google
      </Button>
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
        <Form.Item>
          <Button type="primary" onClick={sendSignInLink} style={{ width: '100%' }}>
            Send Sign-In Link
          </Button>
        </Form.Item>
      </Form>
      <Text type="secondary">We'll send a sign-in link to your email</Text>
    </div>
  );
}

export default LoginPage;
