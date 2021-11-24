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
    sx: { width: 50 },
    nonSort: true,
  },
  {
    id: 'supplierCode',
    label: 'Supplier',
  },
  {
    id: 'model',
    label: 'Model',
  },
  {
    id: 'color',
    label: 'Color',
  },
  {
    id: 'armSize',
    label: 'Arm Size',
  },
  {
    id: 'feetSize',
    label: 'Feet Size',
  },
  {
    id: 'beamSize',
    label: 'Beam Size',
  },
  {
    id: 'topMaterial',
    label: 'topMaterial',
  },
  {
    id: 'topColor',
    label: 'topColor',
  },
  {
    id: 'topSize',
    label: 'topSize',
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
  {
    id: 'edit',
    nonSort: true,
  },
];

function mapStateToProps(state) {
  const { auth } = state;
  return { auth };
}

const Stock = connect(mapStateToProps)((props) => {
  const theme = useTheme();
  const [stocks, setStocks] = useState([]);
  const [formMode, setFormMode] = useState('create');
  const [formOpen, setFormOpen] = useState(false);
  const [formProps, setFormProps] = useState([]);
  const inputForm = useRef(null);

  const [id, setID] = useState('');

  const [balance, setBalance] = useState(0);
  const [shipmentQty, setShipmentQty] = useState(0);

  const [features, setFeatures] = useState([]);

  const [filterModel, setFilterModel] = useState(null);
  const [filterColor, setFilterColor] = useState(null);

  const handleEditClick = (index) => {
    if (index < stocks.length && index >= 0) {
      setID(stocks[index].id);
      setFormProps([
        {
          name: 'supplierCode',
          label: 'Suppier',
          type: 'autocomplete',
          defaultValue: stocks[index].supplierCode,
          options: ['AK', 'JC', 'AW', 'LK'],
          width: '30%',
        },
        {
          name: 'model',
          label: 'Model',
          type: 'text',
          defaultValue: stocks[index].model,
          width: '30%',
        },
        {
          name: 'color',
          label: 'Color',
          type: 'text',
          defaultValue: stocks[index].color,
          width: '30%',
        },
        {
          name: 'armSize',
          label: 'Arm Size',
          type: 'autocomplete',
          defaultValue: stocks[index].armSize,
          options: ['400', '500', '600'],
          width: '30%',
        },
        {
          name: 'feetSize',
          label: 'FeetSize',
          type: 'autocomplete',
          defaultValue: stocks[index].feetSize,
          options: ['400', '500', '600', '700'],
          width: '30%',
        },
        {
          name: 'beamSize',
          label: 'BeamSize',
          type: 'autocomplete',
          defaultValue: stocks[index].beamSize,
          options: ['740-1100', 'Regular'],
          width: '30%',
        },
        {
          name: 'topMaterial',
          label: 'Top Material',
          type: 'autocomplete',
          defaultValue: stocks[index].topMaterial,
          options: [
            'Melamine',
            'Laminate',
            'North American Walnut',
            'South American Walnut',
            'Red Oak',
            'Maple, Bamboo',
            'Melamine with glass top',
          ],
          width: '65%',
        },
        {
          name: 'topColor',
          label: 'Top Color',
          type: 'text',
          defaultValue: stocks[index].topColor,
          width: '30%',
        },
        {
          name: 'topSize',
          label: 'Top Size',
          type: 'text',
          defaultValue: stocks[index].topSize,
          width: '100%',
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
          width: '48%',
        },
        {
          name: 'arrivalDate',
          label: 'Arrival Date',
          type: 'date',
          width: '48%',
        },
      ]);
      setBalance(stocks[index].balance);
      setShipmentQty(stocks[index].qty);
    }
    setFormMode('edit');
    setFormOpen(true);
  };

  const handleRemoveClick = (index) => {
    if (index < stocks.length && index >= 0) {
      Swal.fire({
        title: 'Are you sure?',
        text: 'This action will remove current DeskStock permanently.',
        icon: 'question',
        showCancelButton: true,
        confirmButtonText: 'Yes, Remove!',
        cancelButtonText: 'No, Keep It.',
        allowOutsideClick: false,
      }).then((result) => {
        if (result.isConfirmed) {
          axios
            .delete(`/deskStock/${stocks[index].id}`)
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
      text: 'This action will remove selected DeskStocks permanently.',
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Yes, Remove!',
      cancelButtonText: 'No, Keep Them.',
      allowOutsideClick: false,
    }).then((result) => {
      if (result.isConfirmed) {
        axios
          .delete('/deskStock', {
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
        const response = await axios.post(`/chairStock/upload`, uploadData, {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
        });
        thumbnailUrl = response.data.url;
      } catch (err) {}
    }
    axios
      .put(`/deskStock/${id}`, {
        supplierCode: data.get('supplierCode'),
        model: data.get('model'),
        color: data.get('color'),
        armSize: data.get('armSize'),
        feetSize: data.get('feetSize'),
        beamSize: data.get('beamSize'),
        topMaterial: data.get('topMaterial'),
        topColor: data.get('topColor'),
        topSize: data.get('topSize'),
        remark: data.get('remark'),
        thumbnailUrl,
        shipmentDate: data.get('shipmentDate') || null,
        arrivalDate: data.get('arrivalDate') || null,
        balance: balance,
        qty: balance + shipmentQty,
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
        const response = await axios.post(`/chairStock/upload`, uploadData, {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
        });
        thumbnailUrl = response.data.url;
      } catch (err) {}
    }
    axios
      .post(`/deskStock/create`, {
        supplierCode: data.get('supplierCode'),
        model: data.get('model'),
        color: data.get('color'),
        armSize: data.get('armSize'),
        feetSize: data.get('feetSize'),
        beamSize: data.get('beamSize'),
        topMaterial: data.get('topMaterial'),
        topColor: data.get('topColor'),
        topSize: data.get('topSize'),
        remark: data.get('remark'),
        thumbnailUrl,
        shipmentDate: data.get('shipmentDate') || null,
        arrivalDate: data.get('arrivalDate') || null,
        balance: balance,
        qty: balance + shipmentQty,
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
      .get('/deskStock/features', { cancelToken })
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
      .get('/deskStock', { cancelToken })
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
        variant="outlined"
        startIcon={<AddIcon />}
        onClick={() => {
          setFormProps([
            {
              name: 'supplierCode',
              label: 'Suppier',
              type: 'autocomplete',
              options: ['AK', 'JC', 'AW', 'LK'],
              width: '30%',
            },
            {
              name: 'model',
              label: 'Model',
              type: 'text',
              width: '30%',
            },
            {
              name: 'color',
              label: 'Color',
              type: 'text',
              width: '30%',
            },
            {
              name: 'armSize',
              label: 'Arm Size',
              type: 'autocomplete',
              options: ['400', '500', '600'],
              width: '30%',
            },
            {
              name: 'feetSize',
              label: 'FeetSize',
              type: 'autocomplete',
              options: ['400', '500', '600', '700'],
              width: '30%',
            },
            {
              name: 'beamSize',
              label: 'BeamSize',
              type: 'autocomplete',
              options: ['740-1100', 'Regular'],
              width: '30%',
            },
            {
              name: 'topMaterial',
              label: 'Top Material',
              type: 'autocomplete',
              options: [
                'Melamine',
                'Laminate',
                'North American Walnut',
                'South American Walnut',
                'Red Oak',
                'Maple, Bamboo',
                'Melamine with glass top',
              ],
              width: '65%',
            },
            {
              name: 'topColor',
              label: 'Top Color',
              type: 'text',
              width: '30%',
            },
            {
              name: 'topSize',
              label: 'Top Size',
              type: 'text',
              width: '100%',
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
            label: 'Model',
            value: filterModel,
            onChange: (event, value) => {
              event.preventDefault();
              setFilterModel(value);
              setFilterColor(null);
            },
            options: features
              .map((item) => item.model)
              .filter((c, index, chars) => chars.indexOf(c) === index),
          },
          {
            label: 'Color',
            value: filterColor,
            onChange: (event, value) => {
              event.preventDefault();
              setFilterColor(value);
            },
            options: features
              .filter((item) => !filterModel || item.model === filterModel)
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
                variant="outlined"
                size="small"
              />
            )}
            {...props}
          />
        ))}
      </Paper>
      <DataGrid
        nonSelect={true}
        title="Desk Stocks"
        rows={stocks
          .filter(
            (item) =>
              (!filterModel || item.model === filterModel) &&
              (!filterColor || item.color === filterColor)
          )
          .map(
            (
              {
                withHeadrest,
                withAdArmrest,
                thumbnailUrl,
                shipmentDate,
                arrivalDate,
                ...restProps
              },
              index
            ) => ({
              thumbnail: (
                <img
                  alt=""
                  width="40px"
                  src={thumbnailUrl}
                  style={{ marginTop: '5px' }}
                />
              ),
              withHeadrest: withHeadrest ? 'Yes' : 'No',
              withAdArmrest: withAdArmrest ? 'Yes' : 'No',
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
      ></DataGrid>
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
                    variant="outlined"
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
                    variant="outlined"
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
                    sx={{ flexBasis: width, minWidth: width }}
                  />
                );
              } else if (type === 'autocomplete') {
                const { name, label, ...autocomParams } = restParams;
                return (
                  <Autocomplete
                    key={index}
                    options={['aa', 'ss']}
                    sx={{ flexBasis: width, minWidth: width }}
                    renderInput={(params) => (
                      <TextField
                        margin="dense"
                        {...params}
                        name={name}
                        label={label}
                        variant="outlined"
                        size="small"
                      />
                    )}
                    {...autocomParams}
                  />
                );
              } else return null;
            })}
            <TextField
              margin="dense"
              variant="outlined"
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
                variant="outlined"
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
                variant="outlined"
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
