import React from 'react';
import { List, Datagrid, TextField, EditButton, DateField } from 'react-admin';

const UsersList = () => {
  return (
    <List>
      <Datagrid rowClick='show'>
        <TextField source='fName' />
        <TextField source='lName' />
        <TextField source='email' />
        <DateField source='createdAt' />
        <EditButton />
      </Datagrid>
    </List>
  );
};

export default UsersList;
