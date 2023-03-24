import * as React from 'react';
import {
  SimpleForm,
  TextInput,
  required,
  ReferenceArrayInput,
  Edit,
  BooleanInput,
} from 'react-admin';

export const MusicianEdit = () => {
  return (
    <Edit>
      <SimpleForm>
        <TextInput source='fName' label='First Name' validate={[required()]} />
        <TextInput source='lName' label='Last Name' validate={[required()]} />
        <TextInput source='location' validate={[required()]} />
        <TextInput source='notes' />
        <BooleanInput source='canMD' label='Can MD?' />
        <ReferenceArrayInput reference='instruments' source='instruments' />
      </SimpleForm>
    </Edit>
  );
};
