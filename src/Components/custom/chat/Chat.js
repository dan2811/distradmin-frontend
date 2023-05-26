import React, { useEffect, useState } from 'react';
import { Typography, Card, Tabs, Tab } from '@mui/material';
import { useRecordContext } from 'react-admin';
import { getFromBackend } from '../../../DataProvider/backendHelpers';
import ChatRoom from './ChatRoom';
import { TabPanel } from '../TabPanel';

const Chat = () => {
  const [chats, setChats] = useState([]);
  const [value, setValue] = React.useState(0);
  const handleChange = (event, newValue) => {
    setValue(newValue);
  };
  const record = useRecordContext();
  console.log('RECORD:', record);
  let chatIds = record.chats;

  useEffect(() => {
    const getChats = async () => {
      const chats = await getFromBackend('chats', chatIds);
      console.log('CHATS RETURNED: ', chats);
      setChats(chats.data);
    };
    getChats();
  }, [chatIds]);

  if (!record) {
    return null;
  }

  if (!chatIds || !chatIds?.length || !chats?.length) {
    return (
      <Card style={{ width: '40%', marginLeft: '1em', padding: '1em' }}>
        <Typography variant='h6'>No Chats Available</Typography>
      </Card>
    );
  }

  return (
    <Card style={{ width: '40%', marginLeft: '1em', padding: '1em' }}>
      <Tabs value={value} onChange={handleChange}>
        {chats.map((chat, idx) => (
          <Tab label={chat.attributes.name} id={idx} />
        ))}
      </Tabs>

      {chats.map((chat, idx) => (
        <TabPanel value={value} index={idx}>
          <ChatRoom chatData={chat.attributes} />
        </TabPanel>
      ))}
    </Card>
  );
};
export default Chat;
