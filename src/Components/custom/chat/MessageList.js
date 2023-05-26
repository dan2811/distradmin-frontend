import React from 'react';
import { Stack, Paper } from '@mui/material';
import { Message } from './Message';

export const MessageList = ({ messages }) => {
  if (!messages) {
    return <div>LOADING</div>;
  }

  return (
    <Stack sx={{ maxHeight: '300px', minHeight: '200px' }} spacing={2}>
      {!messages.length && <div>No Messages</div>}
      {messages.map((message) => (
        <Message key={message.id} message={message} />
      ))}
    </Stack>
  );
};
