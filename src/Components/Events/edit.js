import * as React from 'react';
import {
  SimpleForm,
  required,
  Edit,
  DateInput,
  TextInput,
  NumberInput,
  ReferenceInput,
  SelectInput,
  usePermissions,
  useRecordContext,
  useGetList,
  BooleanInput,
} from 'react-admin';

const SelectClient = () => {
  const record = useRecordContext();
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
  if (!record) return null;
  let clientID;
  if (!record.client || !record.client.data) {
    clientID = null;
  } else {
    clientID = record.client.data.id;
  }

  return (
    // <SelectInput
    //   label='Client'
    //   validate={[required()]}
    //   optionText={(record) => `${record.fName} ${record.lName}`}
    //   optionValue='id'
    //   translateChoice={true}
    //   defaultValue={clientID}
    // />
    <SelectInput
      source='client'
      validate={[required()]}
      optionText={(record) => `${record.fName} ${record.lName}`}
      optionValue='id'
      defaultValue={clientID}
      choices={isClientsLoading ? [] : allClients}
    />
  );
};

const SelectPackage = () => {
  const record = useRecordContext();
  if (!record) return null;
  let packageID;
  if (!record.package || !record.package.data) {
    packageID = null;
  } else {
    packageID = record.package.data.id;
  }

  return (
    <SelectInput
      label='Package'
      validate={[required()]}
      defaultValue={packageID}
    />
  );
};

const SelectEventType = () => {
  const record = useRecordContext();
  if (!record) return null;
  let eventTypeID;
  if (!record.type || !record.type.data) {
    eventTypeID = null;
  } else {
    eventTypeID = record.type.data.id;
  }
  return (
    <SelectInput
      label='Event Type'
      validate={[required()]}
      defaultValue={eventTypeID}
    />
  );
};

export const EventEdit = () => {
  const { isLoading, permissions } = usePermissions();
  return isLoading ? (
    <div>Checking permissions...</div>
  ) : (
    <Edit>
      <SimpleForm>
        <DateInput source='date' validate={[required()]} />
        <ReferenceInput source='type.id' reference='types' sortable={false}>
          <SelectEventType />
        </ReferenceInput>
        <ReferenceInput
          source='package.id'
          reference='packages'
          sortable={false}
        >
          <SelectPackage />
        </ReferenceInput>
        <ReferenceInput source='client.id' reference='clients'>
          <SelectClient />
        </ReferenceInput>
        <TextInput source='location' />
        <TextInput source='notes' />
        {permissions === 'Super Admin' && (
          <>
            <NumberInput source='gross' validate={[required()]} />
            <NumberInput source='deposit' validate={[required()]} />
            <NumberInput source='amountDue' validate={[required()]} />
            <NumberInput source='profit' validate={[required()]} />
          </>
        )}
        <BooleanInput source='clientCanEdit' label='Client Editing' />
      </SimpleForm>
    </Edit>
  );
};
