import React from 'react';
import { Button } from 'react-admin';

const AddPaymentButton = ({ handleAddNewPayment }) => {
  return (
    <Button
      label='Add new payment'
      alignIcon='left'
      variant='contained'
      color='secondary'
      onClick={handleAddNewPayment}
    />
  );
};

export default AddPaymentButton;
