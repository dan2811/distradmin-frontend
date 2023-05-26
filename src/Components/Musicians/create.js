import * as React from 'react';
import {
  SimpleForm,
  TextInput,
  required,
  Create,
  ReferenceArrayInput,
  AutocompleteArrayInput,
  BooleanInput,
} from 'react-admin';

export const MusicianCreate = () => {
  return (
    <Create>
      <SimpleForm>
        <TextInput source='fName' label='First Name' validate={[required()]} />
        <TextInput source='lName' label='Last Name' validate={[required()]} />
        <TextInput source='email' validate={[required()]} />
        <TextInput source='phone' validate={[required()]} />
        <TextInput source='location' validate={[required()]} />
        <TextInput source='notes' />
        <BooleanInput source='canMD' label='Can MD?' />
        <TextInput source='password' label='Account Password' />

        <ReferenceArrayInput
          label='Instruments Required'
          reference='instruments'
          source='instruments'
        >
          <AutocompleteArrayInput
            optionText='name'
            optionValue='id'
            translateChoice={false}
            parse={(value) => value && value.map((v) => ({ id: v }))}
            format={(value) => value && value.map((v) => v.id)}
          />
        </ReferenceArrayInput>
      </SimpleForm>
    </Create>
  );
};
