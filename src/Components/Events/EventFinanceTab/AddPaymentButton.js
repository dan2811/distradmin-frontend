import React from 'react';
import { Button } from 'react-admin';
import CircularProgress from '@mui/material/CircularProgress';

const AddPaymentButton = ({ handleAddNewPayment, loading, record }) => {
  const addNewPayment = () => {
    handleAddNewPayment(record);
  };
  if (loading) return <CircularProgress />;
  return (
    <Button
      label='Add new payment'
      alignIcon='left'
      variant='contained'
      color='secondary'
      onClick={addNewPayment}
    />
  );
};

export default AddPaymentButton;
