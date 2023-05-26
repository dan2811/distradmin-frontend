import React, { useContext, useEffect, useState } from 'react';
import { TextField } from '@mui/material';
import { MessageList } from './MessageList';
import SendIcon from '@mui/icons-material/Send';
import { getFromBackend } from '../../../DataProvider/backendHelpers';
import { SocketContext } from '../../..';

const ChatRoom = ({ chatData, roomId }) => {
  console.log('CHATDATA: ', chatData);
  const [input, setInput] = useState('');
  const [messagesData, setMessagesData] = useState([]);
  const { id: currentUserId } = JSON.parse(localStorage.getItem('gUser'));
  const { messages } = chatData;
  let messageIds = [];

  const socket = useContext(SocketContext);

  const getMessages = async () => {
    if (!messageIds.length) {
      return;
    }
    console.log('GETTING MESSAGES!');
    const messages = await getFromBackend('messages', messageIds);
    setMessagesData(messages.data);
    console.log('MESSAGESDATA: ', messagesData);
  };

  useEffect(() => {
    if (chatData === undefined) {
      window.alert('Could not get chat data');
      return;
    } else {
      getMessages();
      console.log('JOINING ROOM - ', roomId);
      socket.emit('join', {
        user: 'djordandrums@gmail.com',
        roomId,
      });
      socket.on('newMessage', (data) => {
        messageIds.push(data.id);
        getMessages();
      });

      return () => {
        // before the component is destroyed
        // unbind all event handlers used in this component
        socket.off(`room-${roomId}`);
      };
    }
  }, [chatData, socket]);

  if (messages.data.length) {
    messageIds = messages.data.map((message) => message.id);
  }

  console.log('MESSAGE IDS: ', messageIds);

  if (!chatData || chatData === null) {
    return null;
  }

  const sendMessage = () => {
    socket.emit('clientMessage', {
      user: {
        data: {
          jwt: localStorage.getItem('token'),
          user: JSON.parse(localStorage.getItem('gUser')),
        },
      },
      message: input,
      roomId,
    });
    setInput('');
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
          value={input}
        />
        <SendIcon sx={{ color: '#2096f3' }} onClick={sendMessage} />
      </div>
      <div>
        Your message will be sent to:
        <div style={{ color: 'blue' }}>
          {chatData.users_permissions_users.data
            .map((user) => {
              if (user.id !== currentUserId) {
                if (user.attributes.fName === null) {
                  return 'unknown user';
                }
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
