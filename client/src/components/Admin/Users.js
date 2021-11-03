import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  TextField,
} from '@mui/material';
import axios from 'axios';
import Swal from 'sweetalert2';

import DataGrid from 'components/Common/DataGrid';

const columns = [
  {
    id: 'id',
    numeric: true,
    disablePadding: false,
    label: 'Id',
  },
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
    id: 'passportNo',
    numeric: false,
    disablePadding: true,
    label: 'Passport',
  },
  {
    id: 'selfieUrl',
    numeric: false,
    disablePadding: true,
    label: 'Selfie',
  },
];

function mapStateToProps(state) {
  const { auth } = state;
  return { auth };
}

const Users = connect(mapStateToProps)((props) => {
  const [users, setUsers] = useState([]);
  const [open, setOpen] = useState(false);
  const [email, setEmail] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [passport, setPassport] = useState('');
  const [selfie, setSelfie] = useState('');

  const handleEditClick = (event, index) => {
    if (index < users.length && index >= 0) {
      setEmail(users[index].email);
      setFirstName(users[index].firstName);
      setLastName(users[index].lastName);
      setPassport(users[index].passportNo);
      setSelfie(users[index].selfieUrl);
    }
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleSave = () => {
    Swal.fire({
      icon: 'success',
      title: 'Success',
      text: 'User information updated successfully.',
      allowOutsideClick: false,
    });
    setOpen(false);
  };

  const getUsers = (cancelToken) => {
    axios
      .get('/users', { cancelToken: cancelToken })
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
        rows={users}
        columns={columns}
        onEditClick={handleEditClick}
      ></DataGrid>
      <Dialog open={open}>
        <DialogTitle>Edit User</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Please Edit the User information and Click Save button.
          </DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            label="Email Address"
            type="email"
            fullWidth
            variant="standard"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
            }}
          />
          <TextField
            margin="dense"
            label="First Name"
            type=""
            fullWidth
            variant="standard"
            value={firstName}
            onChange={(e) => {
              setFirstName(e.target.value);
            }}
          />
          <TextField
            margin="dense"
            label="Last Name"
            type=""
            fullWidth
            variant="standard"
            value={lastName}
            onChange={(e) => {
              setLastName(e.target.value);
            }}
          />
          <TextField
            margin="dense"
            label="Passport"
            type=""
            fullWidth
            variant="standard"
            value={passport}
            onChange={(e) => {
              setPassport(e.target.value);
            }}
          />
          <TextField
            margin="dense"
            label="Selfie"
            type=""
            fullWidth
            variant="standard"
            value={selfie}
            onChange={(e) => {
              setSelfie(e.target.value);
            }}
          />
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
