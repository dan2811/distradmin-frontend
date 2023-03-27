import React, { useEffect, useState } from 'react';
import {
  FunctionField,
  ReferenceField,
  Show,
  SimpleShowLayout,
  TextField,
  useGetOne,
  useRecordContext,
} from 'react-admin';
import { getFromBackend } from '../../DataProvider/backendHelpers';

export const ClientShow = () => {
  const [userAccount, setUserAccount] = useState(null);

  const Title = () => {
    const record = useRecordContext();
    if (!record) return null;
    return (
      <span>
        Client - {record.fName} {record.lName}
      </span>
    );
  };

  return (
    <Show title={<Title />}>
      <SimpleShowLayout>
        <FunctionField
          render={(record) => `${record.fName} ${record.lName}`}
          label='Name'
        />
        <TextField
          label='Email'
          source='users_permissions_user.data.attributes.email'
          emptyText='unknown'
        />
        <TextField source='phone' emptyText='unknown' />
        <ReferenceField
          label='Event'
          source='event.data.id'
          reference='events'
          emptyText='No event assigned!'
          link='show'
          
        />
      </SimpleShowLayout>
    </Show>
  );
};
