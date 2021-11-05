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
import { Add as AddIcon } from '@mui/icons-material';
import axios from 'axios';
import Swal from 'sweetalert2';

import DataGrid from 'components/Common/DataGrid';

const columns = [
  {
    id: 'id',
    numeric: false,
    disablePadding: false,
    label: 'Id',
  },
  {
    id: 'detail',
    numeric: false,
    disablePadding: false,
    label: 'Detail',
  },
];

function mapStateToProps(state) {
  const { auth } = state;
  return { auth };
}

const Remark = connect(mapStateToProps)((props) => {
  const [remarks, setRemarks] = useState([]);
  const [editOpen, setEditOpen] = useState(false);
  const [createOpen, setCreateOpen] = useState(false);
  const [id, setID] = useState('');
  const [detail, setDetail] = useState('');

  const handleEditClick = (event, index) => {
    event.preventDefault();
    if (index < remarks.length && index >= 0) {
      setID(remarks[index].id);
      setDetail(remarks[index].detail);
    }
    setEditOpen(true);
  };

  const handleRemoveClick = (event, index) => {
    event.preventDefault();
    if (index < remarks.length && index >= 0) {
      Swal.fire({
        title: 'Are you sure?',
        text: 'This action will remove current ChairRemark permanently.',
        icon: 'question',
        showCancelButton: true,
        confirmButtonText: 'Yes, Remove!',
        cancelButtonText: 'No, Keep It.',
        allowOutsideClick: false,
      }).then((result) => {
        if (result.isConfirmed) {
          axios
            .delete(`/chairremark/${remarks[index].id}`)
            .then((response) => {
              // handle success
              getRemarks();
            })
            .catch(function (error) {
              // handle error
              Swal.fire({
                icon: 'error',
                title: 'Error',
                text: error.response.data.message,
                allowOutsideClick: false,
              });
              console.log(error);
            })
            .then(function () {
              // always executed
            });
        }
      });
    }
  };

  const handleBulkRemoveClick = (selected) => {
    Swal.fire({
      title: 'Are you sure?',
      text: 'This action will remove selected ChairRemarks permanently.',
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Yes, Remove!',
      cancelButtonText: 'No, Keep Them.',
      allowOutsideClick: false,
    }).then((result) => {
      if (result.isConfirmed) {
        axios
          .delete('/chairremark', { data: { ids: selected } })
          .then((response) => {
            // handle success
            getRemarks();
          })
          .catch(function (error) {
            // handle error
            Swal.fire({
              icon: 'error',
              title: 'Error',
              text: error.response.data.message,
              allowOutsideClick: false,
            });
            console.log(error);
          })
          .then(function () {
            // always executed
          });
      }
    });
  };

  const handleSave = (event) => {
    event.preventDefault();
    axios
      .put(`/chairremark/${id}`, { detail })
      .then((response) => {
        // handle success
        setEditOpen(false);
        getRemarks();
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

  const handleCreate = (event) => {
    event.preventDefault();
    axios
      .post(`/chairremark/create`, { detail })
      .then((response) => {
        // handle success
        setCreateOpen(false);
        getRemarks();
      })
      .catch(function (error) {
        // handle error
        setCreateOpen(false);
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: error.response.data.message,
          allowOutsideClick: false,
        }).then(() => {
          setCreateOpen(true);
        });
        console.log(error);
      })
      .then(function () {
        // always executed
      });
  };

  const getRemarks = (cancelToken) => {
    axios
      .get('/chairremark', { cancelToken })
      .then((response) => {
        // handle success
        setRemarks(response.data);
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
    const source = axios.CancelToken.source();
    getRemarks(source.token);
    return () => source.cancel('Remark Component got unmounted');
  }, []);

  return (
    <>
      <DataGrid
        rows={remarks}
        columns={columns}
        onEditClick={handleEditClick}
        onRemoveClick={handleRemoveClick}
        onBulkRemoveClick={handleBulkRemoveClick}
      ></DataGrid>
      <Button
        variant="outlined"
        startIcon={<AddIcon />}
        onClick={() => {
          setDetail('');
          setCreateOpen(true);
        }}
      >
        Add New Remark
      </Button>
      <Dialog open={editOpen}>
        <DialogTitle>Edit ChairRemark</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Please Edit the ChairRemark and Click Save button.
          </DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            label="Detail"
            fullWidth
            variant="standard"
            value={detail}
            onChange={(e) => {
              setDetail(e.target.value);
            }}
          />
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => {
              setEditOpen(false);
            }}
          >
            Cancel
          </Button>
          <Button onClick={handleSave}>Save</Button>
        </DialogActions>
      </Dialog>
      <Dialog open={createOpen}>
        <DialogTitle>Edit ChairRemark</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Please Input ChairRemark Detail and Click Save button.
          </DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            label="Detail"
            fullWidth
            variant="standard"
            value={detail}
            onChange={(e) => {
              setDetail(e.target.value);
            }}
          />
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => {
              setCreateOpen(false);
            }}
          >
            Cancel
          </Button>
          <Button onClick={handleCreate}>Create</Button>
        </DialogActions>
      </Dialog>
    </>
  );
});

export default Remark;
