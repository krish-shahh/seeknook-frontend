import React from 'react';
import { useNavigate } from 'react-router-dom';
import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { auth } from '../firebase-config';
import { Button } from 'antd';
import { GoogleOutlined } from '@ant-design/icons';

function LoginPage() {
  const navigate = useNavigate();

  const signInWithGoogle = async () => {
    const provider = new GoogleAuthProvider(); // Create a new instance of the GoogleAuthProvider
    try {
      const result = await signInWithPopup(auth, provider); // Attempt to sign in with the popup
      // After successful sign-in:
      navigate("/"); // Navigate to the success page
    } catch (error) {
      console.error('Error signing in with Google:', error); // Handle errors here
      alert("Failed to sign in with Google: " + error.message);
    }
  };

  return (
    <div className="container mt-5">
      <h1 className="mb-3">Login</h1>
      <Button type="primary" icon={<GoogleOutlined />} onClick={signInWithGoogle}>
        Sign In With Google
      </Button>
    </div>
  );
}

export default LoginPage;
