import * as React from 'react';
import {
  SimpleForm,
  TextInput,
  required,
  Create,
  SelectInput,
} from 'react-admin';

export const UserCreate = () => {
  return (
    <Create>
      <SimpleForm>
        <TextInput source='name' validate={[required()]} />
        <TextInput source='email' validate={[required()]} />
        <SelectInput
          source='role'
          validate={[required()]}
          choices={[
            { id: 'Admin', name: 'Admin' },
            { id: 'Super Admin', name: 'Super Admin' },
          ]}
        />
      </SimpleForm>
    </Create>
  );
};
