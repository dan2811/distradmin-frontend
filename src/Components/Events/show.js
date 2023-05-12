import * as React from 'react';
import {
  Show,
  TextField,
  DateField,
  FunctionField,
  NumberField,
  TabbedShowLayout,
  Tab,
  Datagrid,
  BooleanField,
  useNotify,
  useRefresh,
  DeleteButton,
  usePermissions,
  useRedirect,
  useRecordContext,
  Link,
} from 'react-admin';
import { Card } from '@mui/material';
import { CustomReferenceManyField } from '../custom/CustomReferenceManyField.js';
import MilitaryTechIcon from '@mui/icons-material/MilitaryTech';
import {
  copyGoogleDocTemplate,
  populateDocContent,
  saveDocumentIdToDB,
} from '../../Google/docBuilder.js';
import { CreateRelationButton } from '../custom/createRelationButton.js';
import GoogleDocButton from './customEventComponents/googleDocButton.js';

// const FilteredSetsList = () => {
//   const record = useRecordContext();
//   if (!record) return null;
//   return record.sets.length === 0 ? (
//     <Card>No linked sets!</Card>
//   ) : (
//     <Card>
//       <CustomReferenceManyField
//         reference='sets'
//         target='event.data.id'
//         resource='sets'
//       >
//         <Container>
//           <Typography variant='h6'>Sets</Typography>
//         </Container>
//         <Datagrid rowClick='show'>
//           <TextField source='name' />
//           <TextField source='start' />
//           <TextField source='end' />
//         </Datagrid>
//       </CustomReferenceManyField>
//     </Card>
//   );
// };

const getClientFullName = (record) => {
  if (!record.client?.data || record.client?.data === null) {
    return 'No client assigned!';
  }
  const client = record.client.data.attributes;
  return `${client.fName} ${client.lName}`;
};

export const EventShow = () => {
  const notify = useNotify();
  const refresh = useRefresh();
  const [isClicked, setIsClicked] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const { isLoading, permissions } = usePermissions();
  const redirect = useRedirect();
  const record = useRecordContext();

  const createNewGoogleDoc = async (record) => {
    setLoading(true);
    setIsClicked(true);
    const formattedEventDate = new Date(record.date).toLocaleDateString();

    try {
      const { id: googleDocId } = await copyGoogleDocTemplate(
        record,
        formattedEventDate
      );
      await saveDocumentIdToDB(record, googleDocId);
      await populateDocContent(record, googleDocId, formattedEventDate);
      setLoading(false);
      refresh();
      notify('Document created', { type: 'success' });
    } catch (error) {
      setLoading(false);
      console.error(error);
      notify('There was an error creating the Google Doc.', {
        type: 'error',
        undoable: false,
        autoHideDuration: 3000,
      });
    }
  };

  const openGoogleDoc = (googleDocId) => {
    setLoading(true);
    const url = `https://docs.google.com/document/d/${googleDocId}`;
    window.open(url, '_blank', 'noopener,noreferrer');
    setLoading(false);
  };

  return isLoading ? (
    <div>Checking permissions...</div>
  ) : (
    <Show
      title={<FunctionField render={(record) => getClientFullName(record)} />}
    >
      <TabbedShowLayout>
        <Tab label='Details'>
          <FunctionField
            render={(record) => {
              return (
                <GoogleDocButton
                  isLoading={loading}
                  googleDocId={record.googleDocId}
                  open={openGoogleDoc}
                  create={createNewGoogleDoc}
                  record={record}
                />
              );
            }}
          />
          <TextField
            source='package.data.attributes.name'
            label='Package'
            emptyText='No package assigned'
          />
          <TextField
            source='type.data.attributes.name'
            emptyText='No event type assigned'
            label='Event Type'
          />
          <FunctionField
            label='Client'
            render={(record) => {
              if (record.client?.data) {
                return (
                  <Link to={`/clients/${record.client.data.id}/show`}>
                    {getClientFullName(record)}
                  </Link>
                );
              } else {
                return <div>No Client Assigned!</div>;
              }
            }}
          />
          <DateField source='date' emptyText='No date assigned' />
          <TextField source='location' emptyText='No location' />
          <TextField source='notes' emptyText='None' />
          {/* <FilteredSetsList /> */}
          <BooleanField source='clientCanEdit' label='Client Editing' />
        </Tab>
        {permissions === 'Super Admin' && (
          <Tab label='Finance'>
            <NumberField
              label='Price'
              source='gross'
              options={{ style: 'currency', currency: 'GBP' }}
            />
            <NumberField
              source='deposit'
              options={{ style: 'currency', currency: 'GBP' }}
            />
            <NumberField
              source='amountDue'
              options={{ style: 'currency', currency: 'GBP' }}
            />
            <NumberField
              source='profit'
              options={{ style: 'currency', currency: 'GBP' }}
            />
          </Tab>
        )}
        <Tab label='Musicians'>
          <FunctionField
            render={(record) => {
              return record?.jobs?.length === 0 ? (
                <CreateRelationButton
                  resourceName='event'
                  path='/jobs/create'
                  buttonText='Add Musician'
                />
              ) : (
                <Card>
                  <CustomReferenceManyField
                    reference='jobs'
                    target='event.data.id'
                    resource='jobs'
                  >
                    <Datagrid
                      bulkActionButtons={false}
                      rowClick={(id, resource, record) =>
                        `/musicians/${record.musician.data.id}/show`
                      }
                    >
                      <BooleanField source='md' TrueIcon={MilitaryTechIcon} />
                      <FunctionField
                        label='Musician'
                        render={(record) =>
                          `${record.musician.data.attributes.fName} ${record.musician.data.attributes.lName}`
                        }
                      />
                      <TextField
                        source='instrument.data.attributes.name'
                        label='Instrument'
                      />
                      <BooleanField source='hotelRequired' />
                      {permissions === 'Super Admin' && (
                        <NumberField
                          label='Wage'
                          source='wage'
                          options={{ style: 'currency', currency: 'GBP' }}
                          emptyText={'Not agreed'}
                        />
                      )}
                      <DeleteButton redirect={false} />
                    </Datagrid>
                    <CreateRelationButton
                      resourceName='event'
                      path='/jobs/create'
                      buttonText='Add Musician'
                    />
                  </CustomReferenceManyField>
                </Card>
              );
            }}
          />
        </Tab>
      </TabbedShowLayout>
    </Show>
  );
};
