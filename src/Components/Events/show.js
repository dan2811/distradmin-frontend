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
  Link,
} from 'react-admin';
import {
  Card,
  TableContainer,
  Table,
  TableCell,
  TableHead,
  TableRow,
  TableBody,
  Paper,
  Typography,
  FormControl,
  Input,
  InputLabel,
  InputAdornment,
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { CustomReferenceManyField } from '../custom/CustomReferenceManyField.js';
import MilitaryTechIcon from '@mui/icons-material/MilitaryTech';
import {
  copyGoogleDocTemplate,
  createNewGoogleFolder,
  generateGoogleFolderName,
  getGoogleFolderByName,
  populateDocContent,
  saveDocumentIdToDB,
} from '../../Google/docBuilder.js';
import { CreateRelationButton } from '../custom/createRelationButton.js';
import GoogleDocButton from './customEventComponents/googleDocButton.js';
import Chat from '../custom/chat/Chat.js';
import AddPaymentButton from './EventFinanceTab/AddPaymentButton.js';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import { v4 as uuidv4 } from 'uuid';
import {
  getFromBackend,
  putBackend,
} from '../../DataProvider/backendHelpers.js';

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
  const [paymentDate, setPaymentDate] = React.useState(new Date());
  const [paymentAmount, setPaymentAmount] = React.useState(0);
  const [paymentAmountInputError, setPaymentAmountInputError] =
    React.useState(false);
  const { isLoading, permissions } = usePermissions();

  const handleAddNewPayment = async (record) => {
    setLoading(true);
    let eventRes;
    try {
      eventRes = await getFromBackend('events', [record.id]);
      console.log('GOT EVENT: ', eventRes);
      const previousPayments = eventRes.data[0].attributes.payments || [];
      const res = await putBackend(`/events/${record.id}`, {
        payments: [
          ...previousPayments,
          {
            id: `MANUAL-${uuidv4()}`,
            amount: parseInt(paymentAmount),
            date: paymentDate,
          },
        ],
      });
      if (!res.ok) {
        throw new Error(res);
      }
      refresh();
      notify('Payment created successfully', { type: 'success' });
    } catch (e) {
      console.error(e);
      notify(`Could not create payment ${JSON.stringify(e)}`, {
        type: 'error',
      });
    }
    setLoading(false);
  };

  const createNewGoogleDoc = async (record) => {
    setLoading(true);
    setIsClicked(true);
    const formattedEventDate = new Date(record.date).toLocaleDateString();

    try {
      const folderName = generateGoogleFolderName(new Date());
      let folder = await getGoogleFolderByName(folderName);

      if (!folder) {
        console.log('No folder found!');
        folder = await createNewGoogleFolder(folderName);
      }
      const { id: googleDocId } = await copyGoogleDocTemplate(
        record,
        formattedEventDate,
        folder.id
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

  console.log('PAYMENT DATE: ', paymentDate);
  return isLoading ? (
    <div>Checking permissions...</div>
  ) : (
    <Show
      title={<FunctionField render={(record) => getClientFullName(record)} />}
      aside={<Chat />}
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

            <FunctionField
              render={(record) => {
                return (
                  <TableContainer
                    component={Paper}
                    sx={{ padding: '1rem' }}
                    elevation={3}
                  >
                    <Typography variant='subtitle1' sx={{ margin: '0.5rem' }}>
                      Customer Payments
                    </Typography>
                    <Table sx={{ minWidth: 650 }}>
                      <TableHead>
                        <TableRow>
                          <TableCell>Date</TableCell>
                          <TableCell>Amount</TableCell>
                          <TableCell>Payment ID</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {record.payments ? (
                          record.payments.map((payment) => (
                            <TableRow key={payment.id}>
                              <TableCell component='th' scope='row'>
                                {new Date(payment.date).toLocaleDateString()}
                              </TableCell>
                              <TableCell>£{payment.amount}</TableCell>
                              <TableCell>{payment.id}</TableCell>
                            </TableRow>
                          ))
                        ) : (
                          <TableRow>
                            <TableCell>No Payments</TableCell>
                          </TableRow>
                        )}
                        <TableRow sx={{ backgroundColor: '#f8f8f8' }}>
                          <TableCell component='th' scope='row'>
                            <LocalizationProvider dateAdapter={AdapterDayjs}>
                              <DatePicker
                                views={['day', 'month', 'year']}
                                label='Date'
                                onChange={(val) => setPaymentDate(val)}
                                defaultValue={dayjs()}
                                format='DD/MM/YYYY'
                              />
                            </LocalizationProvider>
                          </TableCell>
                          <TableCell>
                            <FormControl variant='standard'>
                              <InputLabel htmlFor='paymentAmount'>
                                Amount
                              </InputLabel>
                              <Input
                                value={paymentAmount}
                                onChange={(e) => {
                                  const amount = e.target.value;
                                  if (isNaN(amount)) {
                                    setPaymentAmountInputError(true);
                                  } else {
                                    setPaymentAmount(amount);
                                    setPaymentAmountInputError(false);
                                  }
                                }}
                                error={paymentAmountInputError}
                                id='paymentAmount'
                                startAdornment={
                                  <InputAdornment position='start'>
                                    £
                                  </InputAdornment>
                                }
                              />
                            </FormControl>
                          </TableCell>
                          <TableCell>
                            <AddPaymentButton
                              loading={loading}
                              handleAddNewPayment={handleAddNewPayment}
                              record={record}
                            />
                          </TableCell>
                        </TableRow>
                      </TableBody>
                    </Table>
                    <Typography variant='subtitle2' sx={{ marginTop: '1rem' }}>
                      Total Paid: £
                      {record.payments
                        ? record.payments.reduce(
                            (accumulator, payment) =>
                              parseInt(accumulator) + parseInt(payment.amount),
                            0
                          )
                        : 0}
                    </Typography>
                  </TableContainer>
                );
              }}
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
