import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import {
  Autocomplete,
  Button,
  Checkbox,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControlLabel,
  Paper,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import { Add as AddIcon } from '@mui/icons-material';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import axios from 'axios';
import Swal from 'sweetalert2';

import DataGrid from 'components/Common/DataGrid';

const columns = [
  {
    id: 'invoiceNum',
    numeric: false,
    disablePadding: false,
    label: 'Invoice',
  },
  {
    id: 'clientName',
    numeric: false,
    disablePadding: false,
    label: ' Name',
  },
  {
    id: 'clientAddress',
    numeric: false,
    disablePadding: false,
    label: ' Address',
  },
  {
    id: 'salesmanName',
    numeric: false,
    disablePadding: false,
    label: 'Salesman Name',
  },
  {
    id: 'orderDate',
    numeric: false,
    disablePadding: false,
    label: 'Order Date',
  },
  {
    id: 'QTY',
    numeric: true,
    disablePadding: false,
    label: 'QTY',
  },
];

function mapStateToProps(state) {
  const { auth } = state;
  return { auth };
}

export default connect(mapStateToProps)((props) => {
  const theme = useTheme();

  const [orders, setOrders] = useState([]);
  const [editOpen, setEditOpen] = useState(false);
  const [createOpen, setCreateOpen] = useState(false);
  const [id, setID] = useState('');
  const [brands, setBrands] = useState([]);
  const [models, setModels] = useState([]);
  const [colors, setColors] = useState([]);
  const [chairRemarks, setChairRemarks] = useState(['av', 'avas']);

  const [clientName, setClientName] = useState('');
  const [clientDistrict, setClientDistrict] = useState('');
  const [clientStreet, setClientStreet] = useState('');
  const [clientBlock, setClientBlock] = useState('');
  const [clientFloor, setClientFloor] = useState('');
  const [clientUnit, setClientUnit] = useState('');
  const [remark, setRemark] = useState('');

  const [brand, setBrand] = useState();
  const [model, setModel] = useState();
  const [frameColor, setFrameColor] = useState();
  const [backColor, setBackColor] = useState();
  const [seatColor, setSeatColor] = useState();
  const [withHeadrest, setWithHeadrest] = useState(true);
  const [withAdArmrest, setWithAdArmrest] = useState(true);
  const [chairRemark, setChairRemark] = useState('');
  const [QTY, setQTY] = useState(0);

  const handleEditClick = (event, index) => {
    event.preventDefault();
    if (index < orders.length && index >= 0) {
      getBrands();
      getModels();
      getColors();
      getChairRemarks();
      setID(orders[index].id);
      setBrand(orders[index].stock.chairBrand);
      setModel(orders[index].stock.chairModel);
      setFrameColor(orders[index].stock.frameColor);
      setBackColor(orders[index].stock.backColor);
      setSeatColor(orders[index].stock.seatColor);
      setWithHeadrest(orders[index].stock.withHeadrest);
      setWithAdArmrest(orders[index].stock.withAdArmrest);
      setChairRemark(orders[index].stock.chairRemark);
      setClientDistrict(orders[index].clientDistrict);
      setClientStreet(orders[index].clientStreet);
      setClientName(orders[index].clientName);
      setClientBlock(orders[index].clientBlock);
      setClientFloor(orders[index].clientFloor);
      setClientUnit(orders[index].clientUnit);
      setRemark(orders[index].clientRemark);
      setEditOpen(true);
    }
  };

  const handleRemoveClick = (event, index) => {
    event.preventDefault();
    if (index < orders.length && index >= 0) {
      Swal.fire({
        title: 'Are you sure?',
        text: 'This action will remove current ChairOrder permanently.',
        icon: 'question',
        showCancelButton: true,
        confirmButtonText: 'Yes, Remove!',
        cancelButtonText: 'No, Keep It.',
        allowOutsideClick: false,
      }).then((result) => {
        if (result.isConfirmed) {
          axios
            .delete(`/chairorder/${brands[index].id}`)
            .then((response) => {
              // handle success
              getOrders();
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
      text: 'This action will remove selected Brands permanently.',
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Yes, Remove!',
      cancelButtonText: 'No, Keep Them.',
      allowOutsideClick: false,
    }).then((result) => {
      if (result.isConfirmed) {
        axios
          .delete('/chiarstock', { data: { ids: selected } })
          .then((response) => {
            // handle success
            getOrders();
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
      .put(`/chairorder/${id}`, {
        chairBrandId: brand ? brand.id : null,
        chairModelId: model ? model.id : null,
        frameColorId: frameColor ? frameColor.id : null,
        backColorId: backColor ? backColor.id : null,
        seatColorId: seatColor ? seatColor.id : null,
        withHeadrest,
        withAdArmrest,
        chairRemark,
        clientName,
        clientDistrict,
        clientStreet,
        clientBlock,
        clientFloor,
        clientUnit,
      })
      .then((response) => {
        // handle success
        setEditOpen(false);
        getOrders();
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
      .post(`/chairorder/create`, {
        chairBrandId: brand ? brand.id : null,
        chairModelId: model ? model.id : null,
        frameColorId: frameColor ? frameColor.id : null,
        backColorId: backColor ? backColor.id : null,
        seatColorId: seatColor ? seatColor.id : null,
        withHeadrest,
        withAdArmrest,
        chairRemark,
        clientName,
        clientDistrict,
        clientStreet,
        clientBlock,
        clientFloor,
        clientUnit,
      })
      .then((response) => {
        // handle success
        setCreateOpen(false);
        getOrders();
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

  const getBrands = (cancelToken) => {
    axios
      .get('/chairbrand', { cancelToken })
      .then((response) => {
        // handle success
        setBrands(response.data);
      })
      .catch(function (error) {
        // handle error
        console.log(error);
      })
      .then(function () {
        // always executed
      });
  };

  const getModels = (cancelToken) => {
    axios
      .get('/chairmodel', { cancelToken })
      .then((response) => {
        // handle success
        setModels(response.data);
      })
      .catch(function (error) {
        // handle error
        console.log(error);
      })
      .then(function () {
        // always executed
      });
  };

  const getOrders = (cancelToken) => {
    axios
      .get('/chairorder', { cancelToken })
      .then((response) => {
        // handle success
        setOrders(response.data);
      })
      .catch(function (error) {
        // handle error
        console.log(error);
      })
      .then(function () {
        // always executed
      });
  };

  const getColors = (cancelToken) => {
    axios
      .get('/productcolor', { cancelToken })
      .then((response) => {
        // handle success
        setColors(response.data);
      })
      .catch(function (error) {
        // handle error
        console.log(error);
      })
      .then(function () {
        // always executed
      });
  };

  const getChairRemarks = (cancelToken) => {
    // axios
    //   .get('/chairremark', { cancelToken })
    //   .then((response) => {
    //     // handle success
    //     setChairRemarks(response.data.map((item) => item.detail));
    //   })
    //   .catch(function (error) {
    //     // handle error
    //     console.log(error);
    //   })
    //   .then(function () {
    //     // always executed
    //   });
  };

  useEffect(() => {
    const source = axios.CancelToken.source();
    getOrders(source.token);
    return () => source.cancel('Brand Component got unmounted');
  }, []);

  return (
    <>
      <Button
        variant="outlined"
        startIcon={<AddIcon />}
        onClick={() => {
          getBrands();
          getModels();
          getColors();
          getChairRemarks();
          setBrand(null);
          setModel(null);
          setFrameColor(null);
          setBackColor(null);
          setSeatColor(null);
          setWithHeadrest(false);
          setWithAdArmrest(false);
          setChairRemark('');
          setClientName('');
          setClientDistrict('');
          setClientStreet('');
          setClientBlock('');
          setClientFloor('');
          setClientUnit('');
          setCreateOpen(true);
        }}
      >
        Add New Order
      </Button>
      <DataGrid
        title="Chair Orders"
        rows={orders.map(
          (
            {
              id,
              invoiceNum,
              clientDistrict,
              clientStreet,
              clientBlock,
              clientFloor,
              clientUnit,
              salesman,
              ...restProps
            },
            index
          ) => ({
            id: index,
            invoiceNum: 'C_' + invoiceNum,
            salesmanEmail: salesman.name,
            clientAddress: [
              clientDistrict,
              clientStreet,
              clientBlock,
              clientFloor,
              clientUnit,
            ].join(', '),
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
        open={editOpen}
      >
        <DialogTitle>Edit ChairOrder</DialogTitle>
        <DialogContent>
          <Stack spacing={2}>
            <Paper
              sx={{
                mt: '5px',
                p: '10px',
                display: 'flex',
                flexWrap: 'wrap',
                justifyContent: 'space-between',
              }}
            >
              <Typography
                variant="h6"
                sx={{ flexBasis: '100%', minWidth: '100%' }}
              >
                Chair Features
              </Typography>
              {[
                {
                  value: brand,
                  values: brands,
                  setValue: setBrand,
                  label: 'ChairBrand',
                  width: '48%',
                },
                {
                  value: model,
                  values: models,
                  setValue: setModel,
                  label: 'ChairModel',
                  width: '48%',
                },
                {
                  value: frameColor,
                  values: colors,
                  setValue: setFrameColor,
                  label: 'ChairFrameColor',
                  width: '30%',
                },
                {
                  value: backColor,
                  values: colors,
                  setValue: setBackColor,
                  label: 'ChairBackColor',
                  width: '30%',
                },
                {
                  value: seatColor,
                  values: colors,
                  setValue: setSeatColor,
                  label: 'ChairSeatColor',
                  width: '30%',
                },
              ].map(({ value, values, setValue, label, width }, index) => (
                <Autocomplete
                  key={index}
                  disablePortal
                  value={value ? value : null}
                  onChange={(event, newValue) => {
                    event.preventDefault();
                    setValue(newValue);
                  }}
                  options={values}
                  getOptionLabel={(option) => option.name}
                  sx={{ flexBasis: width, minWidth: width }}
                  renderInput={(params) => (
                    <TextField
                      margin="dense"
                      {...params}
                      label={label}
                      variant="outlined"
                      size="small"
                    />
                  )}
                />
              ))}
              <Autocomplete
                disablePortal
                freeSolo
                value={chairRemark}
                onChange={(event, newValue) => {
                  event.preventDefault();
                  setChairRemark(newValue);
                }}
                options={chairRemarks}
                fullWidth
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Chair Remark"
                    variant="outlined"
                    margin="dense"
                    size="small"
                    onChange={(event) => {
                      event.preventDefault();
                      setChairRemark(event.target.value);
                    }}
                  />
                )}
              />
              <FormControlLabel
                sx={{ flexBasis: '45%', minWidth: '45%' }}
                control={
                  <Checkbox
                    checked={withHeadrest}
                    onChange={() => {
                      setWithHeadrest(!withHeadrest);
                    }}
                  />
                }
                label="With Headrest"
              />
              <FormControlLabel
                sx={{ flexBasis: '45%', minWidth: '45%' }}
                control={
                  <Checkbox
                    checked={withAdArmrest}
                    onChange={() => {
                      setWithAdArmrest(!withAdArmrest);
                    }}
                  />
                }
                label="With Adjustable Armrests"
              />
            </Paper>
            <Paper
              sx={{
                p: '10px',
                display: 'flex',
                flexWrap: 'wrap',
                justifyContent: 'space-between',
              }}
            >
              <Typography
                variant="h6"
                sx={{ flexBasis: '100%', minWidth: '100%' }}
              >
                Client Info
              </Typography>
              {[
                {
                  label: 'Name',
                  value: clientName,
                  setValue: setClientName,
                  type: 'text',
                  width: '55%',
                },
                {
                  label: 'District',
                  value: clientDistrict,
                  setValue: setClientDistrict,
                  type: 'text',
                  width: '55%',
                },
                {
                  label: 'Street',
                  value: clientStreet,
                  setValue: setClientStreet,
                  type: 'text',
                  width: '40%',
                },
                {
                  label: 'Block',
                  value: clientBlock,
                  setValue: setClientBlock,
                  type: 'number',
                  width: '30%',
                },
                {
                  label: 'Floor',
                  value: clientFloor,
                  setValue: setClientFloor,
                  type: 'number',
                  width: '30%',
                },
                {
                  label: 'Unit',
                  value: clientUnit,
                  setValue: setClientUnit,
                  type: 'number',
                  width: '30%',
                },
                {
                  label: 'Remark',
                  value: remark,
                  setValue: setRemark,
                  type: 'text',
                  width: '100%',
                },
              ].map((item, index) => (
                <TextField
                  key={index}
                  margin="dense"
                  label={item.label}
                  variant="outlined"
                  size="small"
                  value={item.value}
                  type={item.type}
                  onChange={(e) => {
                    item.setValue(e.target.value);
                  }}
                  sx={{ flexBasis: item.width, minWidth: item.width }}
                />
              ))}
            </Paper>
            <TextField
              margin="dense"
              label="QTY"
              fullWidth
              margin="dense"
              variant="outlined"
              size="small"
              value={QTY}
              type="number"
              onChange={(e) => {
                setQTY(e.target.value);
              }}
            />
          </Stack>
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
      <Dialog
        fullWidth
        fullScreen={useMediaQuery(theme.breakpoints.down('sm'))}
        maxWidth="sm"
        open={createOpen}
      >
        <DialogTitle>Create ChairOrder</DialogTitle>
        <DialogContent>
          <Stack spacing={2}>
            <Paper
              sx={{
                mt: '5px',
                p: '10px',
                display: 'flex',
                flexWrap: 'wrap',
                justifyContent: 'space-between',
              }}
            >
              <Typography
                variant="h6"
                sx={{ flexBasis: '100%', minWidth: '100%' }}
              >
                Chair Features
              </Typography>
              {[
                {
                  value: brand,
                  values: brands,
                  setValue: setBrand,
                  label: 'ChairBrand',
                  width: '48%',
                },
                {
                  value: model,
                  values: models,
                  setValue: setModel,
                  label: 'ChairModel',
                  width: '48%',
                },
                {
                  value: frameColor,
                  values: colors,
                  setValue: setFrameColor,
                  label: 'ChairFrameColor',
                  width: '30%',
                },
                {
                  value: backColor,
                  values: colors,
                  setValue: setBackColor,
                  label: 'ChairBackColor',
                  width: '30%',
                },
                {
                  value: seatColor,
                  values: colors,
                  setValue: setSeatColor,
                  label: 'ChairSeatColor',
                  width: '30%',
                },
              ].map(({ value, values, setValue, label, width }, index) => (
                <Autocomplete
                  key={index}
                  disablePortal
                  value={value ? value : null}
                  onChange={(event, newValue) => {
                    event.preventDefault();
                    setValue(newValue);
                  }}
                  options={values}
                  getOptionLabel={(option) => option.name}
                  sx={{ flexBasis: width, minWidth: width }}
                  renderInput={(params) => (
                    <TextField
                      margin="dense"
                      {...params}
                      label={label}
                      variant="outlined"
                      size="small"
                    />
                  )}
                />
              ))}
              <Autocomplete
                disablePortal
                freeSolo
                value={chairRemark}
                onChange={(event, newValue) => {
                  event.preventDefault();
                  setChairRemark(newValue);
                }}
                options={chairRemarks}
                fullWidth
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Chair Remark"
                    variant="outlined"
                    margin="dense"
                    size="small"
                    onChange={(event) => {
                      event.preventDefault();
                      setChairRemark(event.target.value);
                    }}
                  />
                )}
              />
              <FormControlLabel
                sx={{ flexBasis: '45%', minWidth: '45%' }}
                control={
                  <Checkbox
                    checked={withHeadrest}
                    onChange={() => {
                      setWithHeadrest(!withHeadrest);
                    }}
                  />
                }
                label="With Headrest"
              />
              <FormControlLabel
                sx={{ flexBasis: '45%', minWidth: '45%' }}
                control={
                  <Checkbox
                    checked={withAdArmrest}
                    onChange={() => {
                      setWithAdArmrest(!withAdArmrest);
                    }}
                  />
                }
                label="With Adjustable Armrests"
              />
            </Paper>
            <Paper
              sx={{
                p: '10px',
                display: 'flex',
                flexWrap: 'wrap',
                justifyContent: 'space-between',
              }}
            >
              <Typography
                variant="h6"
                sx={{ flexBasis: '100%', minWidth: '100%' }}
              >
                Client Info
              </Typography>
              {[
                {
                  label: 'Name',
                  value: clientName,
                  setValue: setClientName,
                  type: 'text',
                  width: '55%',
                },
                {
                  label: 'District',
                  value: clientDistrict,
                  setValue: setClientDistrict,
                  type: 'text',
                  width: '55%',
                },
                {
                  label: 'Street',
                  value: clientStreet,
                  setValue: setClientStreet,
                  type: 'text',
                  width: '40%',
                },
                {
                  label: 'Block',
                  value: clientBlock,
                  setValue: setClientBlock,
                  type: 'number',
                  width: '30%',
                },
                {
                  label: 'Floor',
                  value: clientFloor,
                  setValue: setClientFloor,
                  type: 'number',
                  width: '30%',
                },
                {
                  label: 'Unit',
                  value: clientUnit,
                  setValue: setClientUnit,
                  type: 'number',
                  width: '30%',
                },
                {
                  label: 'Remark',
                  value: remark,
                  setValue: setRemark,
                  type: 'text',
                  width: '100%',
                },
              ].map((item, index) => (
                <TextField
                  key={index}
                  margin="dense"
                  label={item.label}
                  variant="outlined"
                  size="small"
                  value={item.value}
                  type={item.type}
                  onChange={(e) => {
                    item.setValue(e.target.value);
                  }}
                  sx={{ flexBasis: item.width, minWidth: item.width }}
                />
              ))}
            </Paper>
            <TextField
              margin="dense"
              label="QTY"
              fullWidth
              margin="dense"
              variant="outlined"
              size="small"
              value={QTY}
              type="number"
              onChange={(e) => {
                setQTY(e.target.value);
              }}
            />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={(event) => {
              event.preventDefault();
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
