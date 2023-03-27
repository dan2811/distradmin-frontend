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
  useGetList,
} from 'react-admin';

export const EventCreate = () => {
  const { isLoading, permissions } = usePermissions();
  const { data: allClients, isLoading: isClientsLoading } = useGetList(
    'clients',
    {
      pagination: { page: 1, perPage: 99999 },
      sort: {
        field: 'fName',
        order: 'ASC',
      },
    }
  );

  return isLoading ? (
    <div>Checking permissions...</div>
  ) : (
    <Create>
      <SimpleForm>
        <SelectInput
          source='client'
          validate={[required()]}
          optionText={(record) => `${record.fName} ${record.lName}`}
          optionValue='id'
          choices={isClientsLoading ? [] : allClients}
        />

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
