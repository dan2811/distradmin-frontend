import * as React from 'react';
import {
  SimpleForm,
  TextInput,
  required,
  Create,
  useNotify,
  useRedirect,
  minLength,
  email,
  number,
} from 'react-admin';
import { createClient } from './createHelper';

export const ClientCreate = () => {
  const notify = useNotify();
  const redirect = useRedirect();
  const handleSubmit = async (data) => {
    const res = await createClient(data);
    console.log(res);
    if (res.ok) {
      notify('Client created', { type: 'success' });
      redirect('/clients');
    } else {
      notify('Could not create client', { type: 'error' });
    }
  };
  return (
    <Create>
      <SimpleForm onSubmit={handleSubmit}>
        <TextInput source='fName' validate={[required()]} label='First Name' />
        <TextInput source='lName' validate={[required()]} label='Last Name' />
        <TextInput
          source='email'
          validate={[required(), email('Must be a valid email')]}
        />
        <TextInput
          source='phone'
          validate={[required(), number('Must be a valid number')]}
        />
        <TextInput
          source='password'
          validate={[
            required(),
            minLength(6, 'Passwords must be at least 6 characters'),
          ]}
          label='Acount Password'
        />
      </SimpleForm>
    </Create>
  );
};
