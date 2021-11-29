import React, { useEffect, useRef, useState } from 'react';
import { connect } from 'react-redux';
import {
  Autocomplete,
  Button,
  Box,
  Checkbox,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControlLabel,
  IconButton,
  Paper,
  TextField,
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Remove as RemoveIcon,
} from '@mui/icons-material';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import axios from 'axios';
import Swal from 'sweetalert2';

import DataGrid from 'components/Common/DataGrid';

const columns = [
  {
    id: 'thumbnail',
    sx: { width: 100 },
    nonSort: true,
  },
  {
    id: 'color',
    label: 'Color',
  },
  {
    id: 'remark',
    label: 'Special Remark',
  },
  {
    id: 'balance',
    label: 'Balance',
  },
  {
    id: 'qty',
    label: 'QTY',
  },
  {
    id: 'shipmentDate',
    label: 'Shipment',
  },
  {
    id: 'arrivalDate',
    label: 'Arrival',
  },
];

function mapStateToProps(state) {
  const { auth } = state;
  return { auth };
}

const Stock = connect(mapStateToProps)((props) => {
  const theme = useTheme();

  const [formMode, setFormMode] = useState('create');

  const [stocks, setStocks] = useState([]);
  const [formOpen, setFormOpen] = useState(false);
  const [formProps, setFormProps] = useState([]);
  const inputForm = useRef(null);

  const [id, setID] = useState('');

  const [balance, setBalance] = useState(0);
  const [shipmentQty, setShipmentQty] = useState(0);

  const [features, setFeatures] = useState([]);

  const [filterColor, setFilterColor] = useState(null);

  const handleEditClick = (index) => {
    if (index < stocks.length && index >= 0) {
      setID(stocks[index].id);
      setFormProps([
        {
          name: 'color',
          label: 'Color',
          type: 'text',
          defaultValue: stocks[index].color,
          width: '48%',
        },
        {
          name: 'remark',
          label: 'Remark',
          multiline: true,
          type: 'text',
          defaultValue: stocks[index].remark,
          width: '100%',
        },
        {
          name: 'shipmentDate',
          label: 'Shipment Date',
          type: 'date',
          defaultValue: stocks[index].shipmentDate,
          width: '48%',
        },
        {
          name: 'arrivalDate',
          label: 'Arrival Date',
          type: 'date',
          defaultValue: stocks[index].arrivalDate,
          width: '48%',
        },
      ]);
      setBalance(stocks[index].balance);
      setShipmentQty(stocks[index].qty - stocks[index].balance);
    }
    setFormMode('edit');
    setFormOpen(true);
  };

  const handleRemoveClick = (index) => {
    if (index < stocks.length && index >= 0) {
      Swal.fire({
        title: 'Are you sure?',
        text: 'This action will remove current AccessoryStock permanently.',
        icon: 'question',
        showCancelButton: true,
        confirmButtonText: 'Yes, Remove!',
        cancelButtonText: 'No, Keep It.',
        allowOutsideClick: false,
      }).then((result) => {
        if (result.isConfirmed) {
          axios
            .delete(`/accessoryStock/${stocks[index].id}`)
            .then((response) => {
              // handle success
              getStocks();
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
      text: 'This action will remove selected AccessoryStocks permanently.',
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Yes, Remove!',
      cancelButtonText: 'No, Keep Them.',
      allowOutsideClick: false,
    }).then((result) => {
      if (result.isConfirmed) {
        axios
          .delete('/accessoryStock', {
            data: { ids: selected },
          })
          .then((response) => {
            // handle success
            getStocks();
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

  const handleSave = async (event) => {
    event.preventDefault();
    const data = new FormData(inputForm.current);
    let thumbnailUrl = '';
    if (data.get('thumbnail')) {
      const uploadData = new FormData();
      uploadData.append('file', data.get('thumbnail'));
      try {
        const response = await axios.post(
          `/accessoryStock/upload`,
          uploadData,
          {
            headers: {
              'Content-Type': 'application/x-www-form-urlencoded',
            },
          }
        );
        thumbnailUrl = response.data.url;
      } catch (err) {}
    }
    axios
      .put(`/accessoryStock/${id}`, {
        color: data.get('color'),
        remark: data.get('remark'),
        thumbnailUrl,
        shipmentDate: data.get('shipmentDate') || null,
        arrivalDate: data.get('arrivalDate') || null,
        balance: balance,
        qty: Number(balance) + Number(shipmentQty),
      })
      .then((response) => {
        // handle success
        setFormOpen(false);
        getStocks();
      })
      .catch(function (error) {
        // handle error
        setFormOpen(false);
        Swal.fire({
          icon: 'error',
          title: 'Error',
          html: error.response.data.message.replace('\n', '<br />'),
          allowOutsideClick: false,
        }).then(() => {
          setFormOpen(true);
        });
        console.log(error);
      })
      .then(function () {
        // always executed
      });
  };

  const handleCreate = async (event) => {
    event.preventDefault();
    const data = new FormData(inputForm.current);
    let thumbnailUrl = '';
    if (data.get('thumbnail')) {
      const uploadData = new FormData();
      uploadData.append('file', data.get('thumbnail'));
      try {
        const response = await axios.post(
          `/accessoryStock/upload`,
          uploadData,
          {
            headers: {
              'Content-Type': 'application/x-www-form-urlencoded',
            },
          }
        );
        thumbnailUrl = response.data.url;
      } catch (err) {}
    }
    axios
      .post(`/accessoryStock/create`, {
        color: data.get('color'),
        remark: data.get('remark'),
        thumbnailUrl,
        shipmentDate: data.get('shipmentDate') || null,
        arrivalDate: data.get('arrivalDate') || null,
        balance: balance,
        qty: Number(balance) + Number(shipmentQty),
      })
      .then((response) => {
        // handle success
        setFormOpen(false);
        getStocks();
      })
      .catch(function (error) {
        // handle error
        setFormOpen(false);
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: error.response.data.message,
          allowOutsideClick: false,
        }).then(() => {
          setFormOpen(true);
        });
        console.log(error);
      })
      .then(function () {
        // always executed
      });
  };

  const getFeatures = (cancelToken) => {
    axios
      .get('/accessoryStock/features', { cancelToken })
      .then((response) => {
        // handle success
        setFeatures(response.data);
      })
      .catch(function (error) {
        // handle error
        console.log(error);
      })
      .then(function () {
        // always executed
      });
  };

  const getStocks = (cancelToken) => {
    axios
      .get('/accessoryStock', { cancelToken })
      .then((response) => {
        // handle success
        setStocks(response.data);
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
    getFeatures(source.token);
    getStocks(source.token);
    return () => source.cancel('Stock Component got unmounted');
  }, []);

  return (
    <Box
      sx={{
        height: '100%',
        overflow: 'auto',
        padding: '10px 20px',
      }}
    >
      <Button
        startIcon={<AddIcon />}
        onClick={() => {
          setFormProps([
            {
              name: 'color',
              label: 'Color',
              type: 'text',
              width: '48%',
            },
            {
              name: 'remark',
              label: 'Remark',
              type: 'text',
              width: '100%',
            },
            {
              name: 'shipmentDate',
              label: 'Shipment Date',
              type: 'date',
              width: '48%',
            },
            {
              name: 'arrivalDate',
              label: 'Arrival Date',
              type: 'date',
              width: '48%',
            },
          ]);
          setBalance(0);
          setShipmentQty(0);
          setFormMode('create');
          setFormOpen(true);
        }}
      >
        New Stock
      </Button>
      <Paper
        sx={{
          marginTop: '10px',
          padding: '5px 10px',
          display: 'flex',
          flexWrap: 'wrap',
          justifyContent: 'space-around',
        }}
      >
        {[
          {
            label: 'Color',
            value: filterColor,
            onChange: (event, value) => {
              event.preventDefault();
              setFilterColor(value);
            },
            options: features
              .map((item) => item.color)
              .filter((c, index, chars) => chars.indexOf(c) === index),
          },
        ].map(({ label, ...props }, index) => (
          <Autocomplete
            key={index}
            sx={{ flexBasis: '200px', maxWidth: '200px' }}
            renderInput={(params) => (
              <TextField
                margin="dense"
                {...params}
                label={label}
                size="small"
              />
            )}
            {...props}
          />
        ))}
      </Paper>
      <DataGrid
        nonSelect={true}
        title="Accessory Stocks"
        rows={stocks
          .filter((item) => !filterColor || item.color === filterColor)
          .map(
            (
              { thumbnailUrl, shipmentDate, arrivalDate, ...restProps },
              index
            ) => ({
              thumbnail: (
                <img
                  alt=""
                  width="80px"
                  src={thumbnailUrl}
                  style={{ marginTop: '5px' }}
                />
              ),
              shipmentDate: (() => {
                if (shipmentDate === null) return 'No';
                const createdTime = new Date(shipmentDate);
                createdTime.setMinutes(
                  createdTime.getMinutes() - createdTime.getTimezoneOffset()
                );
                return createdTime.toISOString().split('T')[0];
              })(),
              arrivalDate: (() => {
                if (arrivalDate === null) return 'No';
                const createdTime = new Date(arrivalDate);
                createdTime.setMinutes(
                  createdTime.getMinutes() - createdTime.getTimezoneOffset()
                );
                return createdTime.toISOString().split('T')[0];
              })(),
              ...restProps,
            })
          )}
        columns={columns}
        onEditClick={handleEditClick}
        onRemoveClick={handleRemoveClick}
        onBulkRemoveClick={handleBulkRemoveClick}
      />
      <Dialog
        fullWidth
        fullScreen={useMediaQuery(theme.breakpoints.down('sm'))}
        maxWidth="sm"
        open={formOpen}
        PaperProps={{
          ref: inputForm,
          component: 'form',
          onSubmit: formMode === 'create' ? handleCreate : handleSave,
        }}
      >
        <DialogTitle>
          {formMode === 'create' ? 'New Stock' : 'Edit Stock'}
        </DialogTitle>
        <DialogContent>
          <Paper
            sx={{
              mt: '5px',
              p: '10px',
              display: 'flex',
              flexWrap: 'wrap',
              justifyContent: 'space-between',
            }}
          >
            {formProps.map(({ type, width, ...restParams }, index) => {
              if (type === 'text') {
                return (
                  <TextField
                    key={index}
                    margin="dense"
                    size="small"
                    sx={{ flexBasis: width, minWidth: width }}
                    {...restParams}
                  />
                );
              } else if (type === 'date') {
                return (
                  <TextField
                    key={index}
                    margin="dense"
                    size="small"
                    type="date"
                    InputLabelProps={{ shrink: true }}
                    sx={{ flexBasis: width, minWidth: width }}
                    {...restParams}
                  />
                );
              } else if (type === 'checkbox') {
                const { defaultValue, label, name } = restParams;
                return (
                  <FormControlLabel
                    key={index}
                    control={
                      <Checkbox name={name} defaultChecked={defaultValue} />
                    }
                    label={label}
                  />
                );
              } else return null;
            })}
            <TextField
              margin="dense"
              size="small"
              label="Thumbnail"
              name="thumbnail"
              type="file"
              sx={{ flexBasis: '100%', minWidth: '100%' }}
              inputProps={{
                accept: 'image/png, image/gif, image/jpeg',
              }}
              InputLabelProps={{ shrink: true }}
            />
            <Box
              display="flex"
              justifyContent="center"
              alignItems="center"
              sx={{ flexBasis: '48%', minWidth: '48%' }}
            >
              <IconButton
                onClick={() => {
                  setBalance(balance > 1 ? balance - 1 : 0);
                }}
              >
                <RemoveIcon />
              </IconButton>
              <TextField
                margin="dense"
                label="Balance"
                size="small"
                value={balance}
                type="number"
                sx={{ width: '80px', mx: '5px' }}
                onChange={(e) => {
                  if (e.target.value > 0) setBalance(e.target.value);
                  else setBalance(0);
                }}
              />
              <IconButton
                onClick={() => {
                  setBalance(balance + 1);
                }}
              >
                <AddIcon />
              </IconButton>
            </Box>
            <Box
              display="flex"
              justifyContent="center"
              alignItems="center"
              sx={{ flexBasis: '48%', minWidth: '48%' }}
            >
              <IconButton
                onClick={() => {
                  setShipmentQty(Math.max(shipmentQty - 1, 0));
                }}
              >
                <RemoveIcon />
              </IconButton>
              <TextField
                margin="dense"
                label="Shipment"
                size="small"
                value={shipmentQty}
                type="number"
                sx={{ width: '80px', mx: '5px' }}
                onChange={(e) => {
                  setShipmentQty(Math.max(e.target.value, 0));
                }}
              />
              <IconButton
                onClick={() => {
                  setShipmentQty(shipmentQty + 1);
                }}
              >
                <AddIcon />
              </IconButton>
            </Box>
          </Paper>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => {
              setFormOpen(false);
            }}
          >
            Cancel
          </Button>
          <Button type="submit">
            {formMode === 'create' ? 'Create' : 'Save'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
});

export default Stock;
