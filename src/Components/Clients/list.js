import * as React from 'react';
import {
  List,
  Datagrid,
  EditButton,
  FunctionField,
  TextInput,
} from 'react-admin';

export const ClientList = () => {
  const clientFilters = [
    <TextInput label='First Name' source='fName_containsi' />,
    <TextInput label='Last Name' source='lName_containsi' />,
  ];
  return (
    <List filters={clientFilters}>
      <Datagrid rowClick='show'>
        <FunctionField
          render={(record) => `${record.fName} ${record.lName}`}
          label='Name'
        />
        {/* <TextField source='email' /> */}

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
        {/* <BooleanField source='canMD' label='MD?' TrueIcon={MilitaryTechIcon} /> */}

        <EditButton />
      </Datagrid>
    </List>
  );
};
