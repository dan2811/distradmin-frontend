import * as React from 'react';
import {
  SimpleForm,
  required,
  Create,
  NumberInput,
  SelectInput,
  ReferenceInput,
  BooleanInput,
  useNotify,
  useRedirect,
  usePermissions,
  useGetList,
  useRefresh,
} from 'react-admin';

export const JobCreate = () => {
  const refresh = useRefresh();
  const notify = useNotify();
  const redirect = useRedirect();
  const { isLoading, permissions } = usePermissions();
  const { data: allMusicians, isLoading: isMusiciansLoading } = useGetList(
    'musicians',
    {
      pagination: { page: 1, perPage: 99999 },
      sort: {
        field: 'fName',
        order: 'ASC',
      },
    }
  );
  const [isMusicianSelected, setIsMusicianSelected] = React.useState(false);
  const [instrumentChoices, setInstrumentChoices] = React.useState([]);

  const getInstrumentChoices = async (event) => {
    const musicianId = event.target.value;
    const [selectedMusician] = allMusicians.filter(
      (musician) => musician.id === musicianId
    );

    return selectedMusician.instruments;
  };

  const onSuccess = (data) => {
    const redirectPath =
      permissions === 'Super Admin'
        ? `events/${data.event}/show/2`
        : `/events/${data.event}/show/1`;
    redirect(redirectPath);
    notify('Musician added!', { type: 'success' });
  };

  return isLoading ? (
    <div>Checking permissions...</div>
  ) : (
    <Create mutationOptions={{ onSuccess }}>
      <SimpleForm>
        <ReferenceInput source='event' reference='events'>
          <SelectInput
            validate={[required()]}
            optionText={(record) => {
              const client = record.client.data?.attributes;
              return !!client
                ? `${record.date}, ${client?.fName} ${client?.lName}, ${record.location}`
                : `${record.date}, ${record.location}`;
            }}
            optionValue='id'
          />
        </ReferenceInput>

        <SelectInput
          source='musician'
          validate={[required()]}
          optionText={(record) => `${record.fName} ${record.lName}`}
          optionValue='id'
          choices={isMusiciansLoading ? [] : allMusicians}
          onChange={async (e) => {
            const choices = await getInstrumentChoices(e);
            setInstrumentChoices(choices);
            setIsMusicianSelected(true);
          }}
        />

        <SelectInput
          source='instrument'
          validate={[required()]}
          optionText='name'
          optionValue='id'
          choices={instrumentChoices}
          defaultValue={instrumentChoices[0]?.id}
          disabled={!isMusicianSelected}
        />

        <BooleanInput source='md' label='MD' />
        <BooleanInput source='hotelRequired' label='Hotel Required' />
        {permissions === 'Super Admin' && <NumberInput source='wage' />}
      </SimpleForm>
    </Create>
  );
};
