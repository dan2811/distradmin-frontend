import * as React from 'react';
import {
  List,
  Datagrid,
  TextField,
  EditButton,
  NumberField,
  FunctionField,
  ReferenceField,
  usePermissions,
  SelectInput,
  TextInput,
  DateInput,
} from 'react-admin';
import { CircularProgressWithLabel } from '../custom/circularProgress';
import ColouredDateField from './customEventComponents/colouredDateField';
import { getFromBackend } from '../../DataProvider/backendHelpers';

export const EventList = () => {
  const [packages, setPackages] = React.useState([]);
  React.useEffect(() => {
    const fetchData = async () => {
      const res = await getFromBackend('packages');
      setPackages(res.data);
    };
    fetchData();
  }, []);
  const eventFilters = [
    <DateInput label='Date from' source='date_gte' />,
    <DateInput label='Date up to' source='date_lte' />,
    <SelectInput
      label='Package'
      source='package'
      choices={packages}
      optionText={(item) => item.attributes.name}
      optionValue='id'
      emptyText='All'
    />,
    <TextInput label='Location' source='location_containsi' />,
    <TextInput label='Team' source='team_containsi' />,
  ];
  const { isLoading, permissions } = usePermissions();
  return isLoading ? (
    <div>Checking permissions...</div>
  ) : (
    <List filters={eventFilters} sort={{ field: 'date', order: 'DESC' }}>
      <Datagrid rowClick='show'>
        <ColouredDateField source='date' />
        {/* <TextField source='type' /> */}
        <ReferenceField
          source='package.data.id'
          reference='packages'
          sortable={false}
          label='Package'
          link='show'
        >
          <TextField source='name' />
        </ReferenceField>
        <FunctionField
          sortable={false}
          source='client'
          label='Client'
          render={(record) => {
            const client = record.client.data?.attributes;
            if (client) {
              return `${client?.fName} ${client?.lName}`;
            } else {
              return 'No client assigned';
            }
          }}
        />
        <TextField source='location' label='Location' />
        <TextField source='team' label='Team' />

        {permissions === 'Super Admin' && (
          <NumberField
            source='profit'
            options={{ style: 'currency', currency: 'GBP' }}
          />
        )}
        {permissions === 'Super Admin' && (
          <FunctionField
            label='Paid'
            render={(record) => {
              const progress = 100 - (record.amountDue / record.gross) * 100;
              return <CircularProgressWithLabel value={progress} />;
            }}
          />
        )}
        <EditButton />
      </Datagrid>
    </List>
  );
};
