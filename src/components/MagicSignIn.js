// src/components/MagicSignIn.js

import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { signInWithEmailLink, getAuth } from 'firebase/auth';
import { message } from 'antd';

const MagicSignIn = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [email, setEmail] = useState('');

  useEffect(() => {
    const auth = getAuth();
    const urlParams = new URLSearchParams(location.search);
    const emailParam = urlParams.get('email');

    if (emailParam && signInWithEmailLink(auth, window.location.href)) {
      signInWithEmailLink(auth, emailParam, window.location.href)
        .then(() => {
          window.localStorage.removeItem('emailForSignIn');
          message.success('Sign in successful!');
          navigate('/dashboard');
        })
        .catch((error) => {
          console.error('Error signing in with email link:', error);
          message.error(`Error signing in: ${error.message}`);
        });
    } else {
      message.error('Invalid sign-in link');
    }
  }, [location, navigate]);

  return (
    <div className="magic-signin-container">
      <h2>Signing you in...</h2>
      <p>Please wait while we sign you in.</p>
    </div>
  );
};

export default MagicSignIn;
