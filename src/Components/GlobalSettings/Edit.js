import * as React from 'react';
import { SimpleForm, TextInput, required, Edit, TextField } from 'react-admin';

export const GlobalSettingsEdit = () => {
  return (
    <Edit>
      <SimpleForm>
        <TextField source='rule' />
        <TextInput source='value' validate={[required()]} />
      </SimpleForm>
    </Edit>
  );
};
