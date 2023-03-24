import * as React from 'react';
import {
  SimpleForm,
  TextInput,
  required,
  Create,
  ReferenceArrayInput,
  AutocompleteArrayInput,
  DateInput,
  NumberInput,
  SelectInput,
  ReferenceInput,
  usePermissions,
} from 'react-admin';

export const EventCreate = () => {
  const { isLoading, permissions } = usePermissions();
  return isLoading ? (
    <div>Checking permissions...</div>
  ) : (
    <Create>
      <SimpleForm>
        <ReferenceInput source='client' reference='clients'>
          <SelectInput
            validate={[required()]}
            optionText={(record) => `${record.fName} ${record.lName}`}
            optionValue='id'
            // translateChoice={false}
          />
        </ReferenceInput>

        <DateInput source='date' validate={[required()]} />

        <ReferenceInput source='type' reference='types'>
          <SelectInput
            validate={[required()]}
            optionText='name'
            optionValue='id'
            // translateChoice={false}
          />
        </ReferenceInput>

        <ReferenceInput source='package' reference='packages'>
          <SelectInput
            validate={[required()]}
            optionText='name'
            optionValue='id'
            // translateChoice={false}
          />
        </ReferenceInput>

        <TextInput source='location' validate={[required()]} />
        {permissions === 'Super Admin' && (
          <>
            <NumberInput source='gross' />
            <NumberInput source='deposit' />
            <NumberInput source='amountDue' />
            <NumberInput source='profit' />
          </>
        )}

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

        <TextInput source='notes' />

        {/* <ReferenceArrayInput
          label='Musicians'
          reference='musicians'
          source='musicians'
        >
          <AutocompleteArrayInput
            optionText='fName'
            optionValue='id'
            translateChoice={false}
            parse={(value) => value && value.map((v) => ({ id: v }))}
            format={(value) => value && value.map((v) => v.id)}
          />
        </ReferenceArrayInput> */}

        <TextInput source='team' />
      </SimpleForm>
    </Create>
  );
};
