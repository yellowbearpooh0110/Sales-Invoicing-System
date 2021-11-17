import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import {
  Button,
  Checkbox,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  TextField,
} from '@mui/material';
import axios from 'axios';
import Swal from 'sweetalert2';

import DataGrid from 'components/Common/DataGrid';

const columns = [
  {
    id: 'email',
    numeric: false,
    disablePadding: true,
    label: 'Email',
  },
  {
    id: 'firstName',
    numeric: false,
    disablePadding: true,
    label: 'First Name',
  },
  {
    id: 'lastName',
    numeric: false,
    disablePadding: true,
    label: 'Last Name',
  },
  {
    id: 'type',
    numeric: false,
    disablePadding: true,
    label: 'Type',
  },
  {
    id: 'isActive',
    numeric: false,
    disablePadding: true,
    label: 'Active',
  },
];

function mapStateToProps(state) {
  const { auth } = state;
  return { auth };
}

const Users = connect(mapStateToProps)((props) => {
  const [users, setUsers] = useState([]);
  const [editOpen, setEditOpen] = useState(false);

  const [id, setID] = useState('');
  const [email, setEmail] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [type, setType] = useState('');
  const [isActive, setIsActive] = useState('');

  const handleEditClick = (event, index) => {
    if (index < users.length && index >= 0) {
      setID(users[index].id);
      setEmail(users[index].email);
      setFirstName(users[index].firstName);
      setLastName(users[index].lastName);
      setType(users[index].type);
      setIsActive(users[index].isActive);
    }
    setEditOpen(true);
  };

  const handleClose = () => {
    setEditOpen(false);
  };

  const handleSave = () => {
    axios
      .put(`/user/${id}`, {
        email,
        firstName,
        lastName,
        type,
      })
      .then((response) => {
        // handle success
        setEditOpen(false);
        getUsers();
      })
      .catch(function (error) {
        // handle error
        setEditOpen(false);
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: error.response.data.message,
          allowOutsideClick: false,
        }).then(() => {
          setEditOpen(true);
        });
        console.log(error);
      })
      .then(function () {
        // always executed
      });
  };

  const getUsers = (cancelToken) => {
    axios
      .get('/user', { cancelToken: cancelToken })
      .then((response) => {
        // handle success
        setUsers(response.data);
      })
      .catch(function (error) {
        // handle error
        console.log(error);
      })
      .then(function () {
        // always executed
      });
  };

  useEffect(() => {
    let source = axios.CancelToken.source();
    getUsers(source.token);
    return () => source.cancel('Users Component got unmounted');
  }, []);

  return (
    <>
      <DataGrid
        title="Users"
        rows={users.map(({ id, isActive, ...restProps }, index) => ({
          id: index,
          isActive: (
            <Checkbox
              checked={isActive}
              onClick={(event) => {
                event.stopPropagation();
                event.preventDefault();
                axios
                  .put(`/user/${id}`, {
                    isActive: !isActive,
                  })
                  .then(() => {
                    getUsers();
                  })
                  .catch(function (error) {
                    // handle error
                    Swal.fire({
                      icon: 'error',
                      title: 'Error',
                      text: error.response.data.message,
                      allowOutsideClick: false,
                    });
                  })
                  .then(function () {
                    // always executed
                  });
              }}
            />
          ),
          ...restProps,
        }))}
        columns={columns}
        onEditClick={handleEditClick}
      ></DataGrid>
      <Dialog open={editOpen}>
        <DialogTitle>Edit User</DialogTitle>
        <DialogContent>
          <Stack spacing={2}>
            <DialogContentText>
              Please Edit the User information and Click Save button.
            </DialogContentText>
            {[
              {
                value: email,
                setValue: setEmail,
                label: 'Email',
                width: '100%',
              },
              {
                value: firstName,
                setValue: setFirstName,
                label: 'First Name',
                width: '100%',
              },
              {
                value: lastName,
                setValue: setLastName,
                label: 'Last Name',
                width: '100%',
              },
            ].map(({ value, values, setValue, label, width }, index) => (
              <TextField
                key={index}
                sx={{ flexBasis: width, minWidth: width }}
                value={value}
                onChange={(event) => {
                  event.preventDefault();
                  setValue(event.target.value);
                }}
                margin="dense"
                label={label}
                variant="outlined"
                size="small"
              />
            ))}
            <FormControl>
              <InputLabel id="user-type-select-label">Type</InputLabel>
              <Select
                labelId="user-type-select-label"
                id="user-type-select"
                value={type}
                label="Type"
                margin="dense"
                variant="outlined"
                size="small"
                onChange={(event) => {
                  event.preventDefault();
                  setType(event.target.value);
                }}
              >
                <MenuItem value="admin">Admin</MenuItem>
                <MenuItem value="salesman">Salesman</MenuItem>
                <MenuItem value="driver">Driver</MenuItem>
              </Select>
            </FormControl>
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleSave}>Save</Button>
        </DialogActions>
      </Dialog>
    </>
  );
});

export default Users;
