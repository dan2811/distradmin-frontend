import React from 'react';
import { Datagrid, List, TextField } from 'react-admin';

const GlobalSettingsList = () => {
  return (
    <List>
      <Datagrid rowClick='edit'>
        <TextField source='rule' />
        <TextField source='description' />
        <TextField source='value' />
      </Datagrid>
    </List>
  );
};

export default GlobalSettingsList;
