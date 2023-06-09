import React, { useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
} from '@mui/material';
import { Button } from 'react-admin';

const handleRemoveUser = () => {};
const handleUserToAdd = () => {};

const Participants = ({ users, chatId }) => {
  const [userToAdd, setUserToAdd] = useState(null);
  return (
    <TableContainer component={Paper}>
      <Table aria-label='simple table'>
        <TableHead>
          <TableRow>
            <TableCell>Name</TableCell>
            <TableCell>Email</TableCell>
            <TableCell></TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {users.map((user) => (
            <TableRow
              key={user.id}
              sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
            >
              <TableCell component='th' scope='row'>
                {`${user.attributes.fName} ${user.attributes.lName}`}
              </TableCell>
              <TableCell align='right'>{user.attributes.email}</TableCell>
              <TableCell align='right'>
                <Button
                  label='remove'
                  alignIcon='left'
                  variant='contained'
                  color='error'
                  // onClick={() => setShowParticipantsModal(true)}
                />
              </TableCell>
            </TableRow>
          ))}
          <TableRow
            key='add user row'
            sx={{
              alignItems: 'center',
              justifyContent: 'center',
              display: 'flex',
            }}
          >
            <FormControl sx={{ m: 1, minWidth: 200 }}>
              <InputLabel id='user-label'>User</InputLabel>
              <Select
                sx={{ minWidth: '100px' }}
                labelId='user-label'
                value={userToAdd}
                onChange={handleUserToAdd}
              >
                <MenuItem value={10}>User 1</MenuItem>
              </Select>
            </FormControl>
            <Button
              label='Add'
              alignIcon='left'
              variant='contained'
              color='secondary'
              sx={{ padding: '10px', margin: '10px' }}
              // onClick={() => setShowParticipantsModal(true)}
            />
          </TableRow>
        </TableBody>
      </Table>
      <Button
        label='Save'
        alignIcon='left'
        variant='contained'
        color='secondary'
        sx={{ padding: '10px', margin: '10px' }}
        // onClick={() => setShowParticipantsModal(true)}
      />
    </TableContainer>
  );
};

export default Participants;
