import React, { useEffect, useState } from 'react';
import { TextField, Container } from '@mui/material';
import { MessageList } from './MessageList';
import SendIcon from '@mui/icons-material/Send';
import { getFromBackend } from '../../../DataProvider/backendHelpers';

const ChatRoom = ({ chatData }) => {
  console.log('CHATDATA: ', chatData);
  const [input, setInput] = useState('');
  const [messagesData, setMessagesData] = useState([]);
  const { id: currentUserId } = JSON.parse(localStorage.getItem('gUser'));
  const { isClientChat, event, messages, name, users_permissions_users } =
    chatData;
  let messageIds = [];

  if (messages.data.length) {
    messageIds = messages.data.map((message) => message.id);
  }

  console.log('MESSAGE IDS: ', messageIds);

  useEffect(() => {
    const getMessages = async () => {
      if (!messageIds.length) {
        return;
      }
      const messages = await getFromBackend('messages', messageIds);
      setMessagesData(messages.data);
    };
    getMessages();
  }, []);

  if (!chatData || chatData === null) {
    return null;
  }

  const sendMessage = () => {
    console.log('MESSAGE TO SEND: ', input);
  };

  return (
    <div>
      <MessageList messages={messagesData} />
      <div
        style={{
          flexDirection: 'row',
          display: 'flex',
          alignItems: 'center',
        }}
      >
        <TextField
          multiline
          variant='outlined'
          sx={{
            marginRight: '10px',
            width: '90%',
          }}
          onChange={(e) => setInput(e.target.value)}
        />
        <SendIcon sx={{ color: '#2096f3' }} onClick={sendMessage} />
      </div>
      <div>
        Your message will be sent to:
        <div style={{ color: 'blue' }}>
          {chatData.users_permissions_users.data
            .map((user) => {
              if (user.id !== currentUserId) {
                return `${user.attributes.fName} ${user.attributes.lName
                  .slice(0, 1)
                  .toUpperCase()}`;
              }
              return 'You';
            })
            .join(', ')}
        </div>
      </div>
    </div>
  );
};
export default ChatRoom;
