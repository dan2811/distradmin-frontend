import * as React from 'react';
import {
  List,
  Datagrid,
  TextField,
  EditButton,
  FunctionField,
  BooleanField,
  TextInput,
  BooleanInput,
  SelectArrayInput,
} from 'react-admin';
import MilitaryTechIcon from '@mui/icons-material/MilitaryTech';
import { getFromBackend } from '../../DataProvider/backendHelpers';

export const MusicianList = () => {
  const [instruments, setInstruments] = React.useState([]);
  React.useEffect(() => {
    const fetchData = async () => {
      const res = await getFromBackend('instruments');
      setInstruments(res.data);
    };
    fetchData();
  }, []);
  const musicianFilters = [
    <TextInput label='First Name' source='fName_containsi' />,
    <TextInput label='Last Name' source='lName_containsi' />,
    <TextInput label='Location' source='location_containsi' />,
    <BooleanInput label='MD' source='canMD' />,
  ];
  return (
    <List filters={musicianFilters}>
      <Datagrid rowClick='show'>
        <FunctionField
          render={(record) => `${record.fName} ${record.lName}`}
          label='Name'
        />
        <TextField source='location' />

        {/* THE BELOW COMPONENT CURRENTLY BREAKS THE PAGE, NEED FIX IN THE DATAPROVIDER */}
        {/* <ReferenceArrayField
          source='instruments'
          reference='musicians'
          sortable={false}
        >
          <ArrayField label='Instruments' source='instruments'>
            <SingleFieldList linkType='show'>
              <ChipField source='name' />
            </SingleFieldList>
          </ArrayField>
        </ReferenceArrayField> */}

        <BooleanField source='canMD' label='MD?' TrueIcon={MilitaryTechIcon} />

        <EditButton />
      </Datagrid>
    </List>
  );
};
