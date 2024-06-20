import React, { forwardRef, useImperativeHandle, useRef } from 'react';
import { PaymentForm, CreditCard } from 'react-square-web-payments-sdk';

const SquarePaymentFormComponent = forwardRef(({ onPaymentSuccess, onPaymentError }, ref) => {
  const paymentForm = useRef(null);

  useImperativeHandle(ref, () => ({
    requestCardNonce: () => {
      paymentForm.current.requestCardNonce();
    },
  }));

  return (
    <PaymentForm
      ref={paymentForm}
      applicationId="sandbox-sq0idb-jCiO_hPEdCJQsCIwmMhCkQ"
      locationId="LP259M1DD9A0Q"
      cardTokenizeResponseReceived={(token, buyer) => onPaymentSuccess(token)}
      createPaymentRequest={() => ({
        countryCode: 'US',
        currencyCode: 'USD',
        total: {
          label: 'Business Listing',
          amount: '1.00',
          pending: false,
        },
      })}
    >
      <CreditCard />
    </PaymentForm>
  );
});

export default SquarePaymentFormComponent;
