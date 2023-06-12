import React, { useEffect, useState } from 'react';
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
import { Button, useNotify } from 'react-admin';
import { getFromBackend } from '../../../DataProvider/backendHelpers';

const Participants = ({
  users,
  removeUser,
  addUser,
  chatId,
  setUsersInChat,
}) => {
  const [userToAdd, setUserToAdd] = useState('');
  const [allUsers, setAllUsers] = useState([]);
  const notify = useNotify();

  useEffect(() => {
    const getUsers = async () => {
      const users = await getFromBackend('users');
      setAllUsers(users);
      console.log('USERS: ', users);
    };
    getUsers();
  }, []);

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
                {`${user.fName} ${user.lName}`}
              </TableCell>
              <TableCell align='right'>{user.email}</TableCell>
              <TableCell align='right'>
                <Button
                  label='remove'
                  alignIcon='left'
                  variant='contained'
                  color='error'
                  onClick={() => {
                    removeUser(user.id, chatId, notify, setUsersInChat);
                  }}
                />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <div>
        <FormControl
          sx={{
            m: 1,
            minWidth: 0,
            flexDirection: 'row',
            display: 'flex',
            justifyContent: 'space-between',
          }}
        >
          <InputLabel id='user-label'>User</InputLabel>
          <Select
            sx={{ minWidth: '300px' }}
            labelId='user-label'
            value={userToAdd}
            onChange={(e) => setUserToAdd(e.target.value)}
          >
            {allUsers
              .sort((a, b) => {
                if (a.fName < b.fName) {
                  return -1;
                }
                if (a.fName > b.fName) {
                  return 1;
                }
                return 0;
              })
              .filter((user) => !users.map((u) => u.id).includes(user.id))
              .map((user) => (
                <MenuItem value={user.id} key={user.id}>
                  {`${user.fName} ${user.lName} - ${user.email}`}
                </MenuItem>
              ))}
          </Select>
          <Button
            label='Add'
            alignIcon='left'
            variant='contained'
            color='secondary'
            sx={{ padding: '10px', margin: '10px' }}
            onClick={() => {
              addUser(userToAdd, chatId, notify, setUsersInChat);
            }}
          />
        </FormControl>
      </div>
    </TableContainer>
  );
};

export default Participants;
