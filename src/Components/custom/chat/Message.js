import React from 'react';
import { Container } from '@mui/material';

const MessageFooter = ({ text }) => {
  return (
    <div
      style={{ fontSize: '10px', alignContent: 'flex-start' }}
    >{`${text}:`}</div>
  );
};

export const Message = ({ message }) => {
  const { id: currentUserId } = JSON.parse(localStorage.getItem('gUser'));

  const { content, sender, createdAt } = message.attributes;
  const senderAttributes = sender.data.attributes;

  console.log('sender attributes: ', senderAttributes);

  const isUsersOwnMessage = currentUserId === sender.data.id;
  if (isUsersOwnMessage) {
    return (
      <Container
        sx={{
          padding: '2px',
          backgroundColor: '#2096f3',
          color: 'white',
          borderRadius: '0.5rem',
          width: '70%',
          alignSelf: 'flex-end',
        }}
      >
        <div>{content}</div>
      </Container>
    );
  }
  return (
    <Container
      sx={{
        padding: '2px',
        backgroundColor: '#e0dee8 ',
        borderRadius: '0.5rem',
        width: '70%',
        alignSelf: 'flex-start',
      }}
    >
      <MessageFooter
        text={`${senderAttributes.fName} ${senderAttributes.lName}`}
      />
      <div>{content}</div>
    </Container>
  );
};
