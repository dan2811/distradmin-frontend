import React, { useState } from 'react';
import { PayPalScriptProvider, PayPalButtons } from '@paypal/react-paypal-js';
import { SelectInput, useRedirect } from 'react-admin';

export const Paypal = () => {
  const redirect = useRedirect();

  document.addEventListener('message', (message) => {
    alert(JSON.stringify(message.data));
  });

  return (
    <PayPalScriptProvider
      options={{
        'client-id': process.env.REACT_APP_PAYPAL_CLIENT_ID,
        currency: 'GBP',
        intent: 'capture',
      }}
    >
      <div style={{ backgroundColor: '#fff' }}>
        <PayPalButtons
          style={{ layout: 'vertical' }}
          createOrder={(data, actions) => {
            return actions.order.create({
              purchase_units: [
                {
                  amount: {
                    value: '0',
                  },
                },
              ],
              application_context: {
                shipping_preference: 'NO_SHIPPING',
              },
            });
          }}
          onApprove={(data, actions) => {
            return actions.order.capture().then((details) => {
              window.ReactNativeWebView.postMessage(JSON.stringify(details));
              redirect(`/paypalSuccess`);
            });
          }}
        />
      </div>
    </PayPalScriptProvider>
  );
};
