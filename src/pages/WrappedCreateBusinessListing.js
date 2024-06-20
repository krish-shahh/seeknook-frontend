import React, { useState, useEffect } from 'react';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import axios from 'axios';
import CreateBusinessListing from './CreateBusinessListing';

const stripePromise = loadStripe('pk_test_51PTTy7GY6YE5a0ZffD6GfgYjubqvUOxqSEZakqwQNDQth5mAtPxhA3IiJtG4wWuG0lMKvIvUlBjZlbjcEjLvdsPW00y4Pzk1PF'); // Replace with your Stripe public key

const WrappedCreateBusinessListing = (props) => {
    const [clientSecret, setClientSecret] = useState('');
  
    useEffect(() => {
      if (!props.initialValues) {
        // Create a payment intent when the component mounts and the listing is not being edited
        const createPaymentIntent = async () => {
          try {
            const { data } = await axios.post('https://seeknook-backend-2564a672bd98.herokuapp.com/api/payment/create-payment-intent', {
              plan: 'basic', // Default plan for initial creation
              email: props.email,
            });
            setClientSecret(data.clientSecret);
          } catch (error) {
            console.error('Error creating payment intent:', error);
          }
        };
        createPaymentIntent();
      }
    }, [props.initialValues, props.email]);
  
    return (
      <Elements stripe={stripePromise} options={{ clientSecret }}>
        <CreateBusinessListing {...props} clientSecret={clientSecret} setClientSecret={setClientSecret} />
      </Elements>
    );
  };
  
  export default WrappedCreateBusinessListing;
  