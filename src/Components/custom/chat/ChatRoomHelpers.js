import {
  getFromBackend,
  putBackend,
} from '../../../DataProvider/backendHelpers';

export const addUser = async (userID, chatID, notify, setUsersInChat) => {
  const chat = await getFromBackend('chats', [chatID]);
  const users = chat.data[0].attributes.users_permissions_users.data.map(
    (user) => user.id
  );
  users.push(userID);
  const res = await putBackend(`/chats/${chatID}?populate=*`, {
    users_permissions_users: users,
  });
  if (res.ok) {
    let updatedUsers = await res.json();
    updatedUsers =
      updatedUsers.data.attributes.users_permissions_users.data.map((u) => ({
        ...u.attributes,
        id: u.id,
      }));
    console.log('updated chat: ', updatedUsers);
    setUsersInChat(updatedUsers);
    notify('User added to chat');
    return;
  }
  notify('Could not add user to chat', { type: 'error' });
};

export const removeUser = async (userID, chatID, notify, setUsersInChat) => {
  const chat = await getFromBackend('chats', [chatID]);
  console.log('remove user called: ', chat.data[0].attributes);
  const users = chat.data[0].attributes.users_permissions_users.data;
  const updatedUsers = users.filter((user) => user.id !== userID);
  const updatedChat = await putBackend(`/chats/${chatID}`, {
    users_permissions_users: updatedUsers,
  });
  if (updatedChat.ok) {
    setUsersInChat(updatedUsers.map((u) => ({ ...u.attributes, id: u.id })));
    console.log('updated users: ', updatedUsers);
    notify('User removed from chat');
    return;
  }
  notify('Could not remove user from chat', { type: 'error' });
};
