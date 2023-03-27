import React from 'react';
import {
  Edit,
  email,
  number,
  required,
  SimpleForm,
  TextInput,
} from 'react-admin';

export const ClientEdit = () => {
  return (
    <Edit>
      <SimpleForm>
        <TextInput source='fName' label='First Name' validate={required()} />
        <TextInput source='lName' label='Last Name' validate={required()} />
        <TextInput source='phone' validate={number()} />
        <TextInput source='email' validate={email()} />
        <TextInput source='newAccountPassword' />
      </SimpleForm>
    </Edit>
  );
};
