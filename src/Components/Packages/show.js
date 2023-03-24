import * as React from 'react';
import {
  Show,
  TextField,
  DateField,
  TabbedShowLayout,
  Tab,
  Datagrid,
  useRecordContext,
  FunctionField,
} from 'react-admin';
import { Card } from '@mui/material';
import CustomReferenceManyField from '../custom/CustomReferenceManyField';

const Title = () => {
  const record = useRecordContext();
  if (!record) return null;
  return <span>{record.name}</span>;
};

const FilteredEventList = () => {
  const record = useRecordContext();
  console.log('YOOOO', record);
  if (!record) return null;
  return (
    <Card>
      <CustomReferenceManyField
        reference='events'
        target='package.data.id'
        resource='events'
      >
        <Datagrid rowClick={'show'} bulkActionButtons={false}>
          <DateField source='date' />
          <FunctionField
            label='client'
            render={(record) =>
              record.client.data
                ? `${record.client.data.attributes.fName} ${record.client.data.attributes.lName}`
                : 'No client assigned'
            }
          />
          <TextField source='team' />
        </Datagrid>
      </CustomReferenceManyField>
    </Card>
  );
};

export const PackageShow = () => {
  return (
    <Show title={<Title />}>
      <TabbedShowLayout>
        <Tab label='Events'>
          <FilteredEventList />
        </Tab>
      </TabbedShowLayout>
    </Show>
  );
};
