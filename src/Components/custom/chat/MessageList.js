import React, { useEffect, useRef } from 'react';
import { Stack, Paper } from '@mui/material';
import { Message } from './Message';

export const MessageList = ({ messages }) => {
  const lastMessageRef = useRef(null);

  useEffect(() => {
    if (lastMessageRef.current) {
      lastMessageRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  if (!messages) {
    return <div>LOADING</div>;
  }

  return (
    <Stack
      sx={{
        maxHeight: '500px',
        overflowY: 'auto',
        overflowX: 'none',
      }}
      spacing={2}
    >
      {!messages.length && <div>No Messages</div>}
      {messages.map((message, idx) => {
        if (idx === messages.length - 1) {
          return (
            <div key={message.id} ref={lastMessageRef}>
              <Message message={message} />
            </div>
          );
        }
        return <Message key={message.id} message={message} />;
      })}
    </Stack>
  );
};
