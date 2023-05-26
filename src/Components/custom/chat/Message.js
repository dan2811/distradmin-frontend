import React, { useRef, useState } from 'react';

const MessageDetail = ({ text }) => {
  return (
    <div
      style={{ fontSize: '10px', alignContent: 'flex-start' }}
    >{`${text}:`}</div>
  );
};

export const Message = ({ message }) => {
  const [showDetails, setShowDetails] = useState(false);
  const { id: currentUserId } = JSON.parse(localStorage.getItem('gUser'));

  const { content, sender, createdAt } = message.attributes;
  const senderAttributes = sender.data.attributes;

  const isUsersOwnMessage = currentUserId === sender.data.id;
  if (isUsersOwnMessage) {
    return (
      <div
        onClick={() => setShowDetails(!showDetails)}
        style={{
          padding: '7px',
          backgroundColor: '#2096f3',
          color: 'white',
          borderRadius: '0.5rem',
          width: '70%',
          alignSelf: 'flex-end',
        }}
      >
        <div>{content}</div>
        {showDetails && (
          <MessageDetail
            text={`sent on ${new Date(createdAt).toLocaleString()}`}
          />
        )}
      </div>
    );
  }
  return (
    <div
      style={{
        padding: '7px',
        backgroundColor: '#e0dee8 ',
        borderRadius: '0.5rem',
        width: '70%',
        alignSelf: 'flex-start',
      }}
      onClick={() => setShowDetails(!showDetails)}
    >
      <MessageDetail
        text={`${senderAttributes.fName} ${senderAttributes.lName}`}
      />
      <div>{content}</div>
      {showDetails && (
        <MessageDetail
          text={`sent on ${new Date(createdAt).toLocaleString()}`}
        />
      )}
    </div>
  );
};
