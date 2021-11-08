import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import {
  Autocomplete,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Stack,
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
    id: 'invoiceNum',
    numeric: false,
    disablePadding: false,
    label: 'Invoice',
  },
  {
    id: 'clientName',
    numeric: false,
    disablePadding: false,
    label: 'Client Name',
  },
  {
    id: 'clientAddress',
    numeric: false,
    disablePadding: false,
    label: 'Client Address',
  },
  {
    id: 'salesmanEmail',
    numeric: false,
    disablePadding: false,
    label: 'Salesman Email',
  },
];

function mapStateToProps(state) {
  const { auth } = state;
  return { auth };
}

export default connect(mapStateToProps)((props) => {
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
  const [chairRemark, setChairRemark] = useState('');

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
    console.log(brand);
    event.preventDefault();
    axios
      .post(`/chairorder/create`, {
        chairBrandId: brand ? brand.id : null,
        chairModelId: model ? model.id : null,
        frameColorId: frameColor ? frameColor.id : null,
        backColorId: backColor ? backColor.id : null,
        seatColorId: seatColor ? seatColor.id : null,
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
        setBrand(null);
        setModel(null);
        setFrameColor(null);
        setBackColor(null);
        setSeatColor(null);
        setChairRemark('');
        setClientName('');
        setClientDistrict('');
        setClientStreet('');
        setClientBlock('');
        setClientFloor('');
        setClientUnit('');
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
      .get('/chairorder', { cancelToken })
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
      <DataGrid
        rows={orders.map(
          (
            {
              id,
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
            salesmanEmail: salesman.email,
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
      <Button
        variant="outlined"
        startIcon={<AddIcon />}
        onClick={() => {
          getBrands();
          getModels();
          getColors();
          getChairRemarks();
          setCreateOpen(true);
        }}
      >
        Add New Order
      </Button>
      <Dialog fullWidth maxWidth="sm" open={editOpen}>
        <DialogTitle>Edit ChairOrder</DialogTitle>
        <DialogContent>
          <Stack spacing={1}>
            <DialogContentText>
              Please Input Order Name and Click Save button.
            </DialogContentText>
            {[
              {
                value: brand,
                values: brands,
                setValue: setBrand,
                label: 'ChairBrand',
              },
              {
                value: model,
                values: models,
                setValue: setModel,
                label: 'ChairModel',
              },
              {
                value: frameColor,
                values: colors,
                setValue: setFrameColor,
                label: 'ChairFrameColor',
              },
              {
                value: backColor,
                values: colors,
                setValue: setBackColor,
                label: 'ChairBackColor',
              },
              {
                value: seatColor,
                values: colors,
                setValue: setSeatColor,
                label: 'ChairSeatColor',
              },
            ].map(({ value, values, setValue, label }, index) => (
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
                fullWidth
                renderInput={(params) => (
                  <TextField {...params} label={label} variant="standard" />
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
                  variant="standard"
                  onChange={(event) => {
                    event.preventDefault();
                    setChairRemark(event.target.value);
                  }}
                />
              )}
            />

            {[
              {
                label: 'Client Name',
                value: clientName,
                setValue: setClientName,
                type: 'text',
              },
              {
                label: 'ClientDistrict',
                value: clientDistrict,
                setValue: setClientDistrict,
                type: 'text',
              },
              {
                label: 'ClientStreet',
                value: clientStreet,
                setValue: setClientStreet,
                type: 'text',
              },
              {
                label: 'ClientBlock',
                value: clientBlock,
                setValue: setClientBlock,
                type: 'number',
              },
              {
                label: 'ClientFloor',
                value: clientFloor,
                setValue: setClientFloor,
                type: 'number',
              },
              {
                label: 'ClientUnit',
                value: clientUnit,
                setValue: setClientUnit,
                type: 'number',
              },
              {
                label: 'Remark',
                value: remark,
                setValue: setRemark,
                type: 'text',
              },
            ].map((item, index) => (
              <TextField
                key={index}
                autoFocus
                margin="dense"
                label={item.label}
                fullWidth
                variant="standard"
                value={item.value}
                type={item.type}
                onChange={(e) => {
                  item.setValue(e.target.value);
                }}
              />
            ))}
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
      <Dialog fullWidth maxWidth="sm" open={createOpen}>
        <DialogTitle>Edit ChairOrder</DialogTitle>
        <DialogContent>
          <Stack spacing={1}>
            <DialogContentText>
              Please Input Order Name and Click Save button.
            </DialogContentText>
            {[
              {
                value: brand,
                values: brands,
                setValue: setBrand,
                label: 'ChairBrand',
              },
              {
                value: model,
                values: models,
                setValue: setModel,
                label: 'ChairModel',
              },
              {
                value: frameColor,
                values: colors,
                setValue: setFrameColor,
                label: 'ChairFrameColor',
              },
              {
                value: backColor,
                values: colors,
                setValue: setBackColor,
                label: 'ChairBackColor',
              },
              {
                value: seatColor,
                values: colors,
                setValue: setSeatColor,
                label: 'ChairSeatColor',
              },
            ].map(({ value, values, setValue, label }, index) => (
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
                fullWidth
                renderInput={(params) => (
                  <TextField {...params} label={label} variant="standard" />
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
                  variant="standard"
                  onChange={(event) => {
                    event.preventDefault();
                    setChairRemark(event.target.value);
                  }}
                />
              )}
            />

            {[
              {
                label: 'Client Name',
                value: clientName,
                setValue: setClientName,
                type: 'text',
              },
              {
                label: 'ClientDistrict',
                value: clientDistrict,
                setValue: setClientDistrict,
                type: 'text',
              },
              {
                label: 'ClientStreet',
                value: clientStreet,
                setValue: setClientStreet,
                type: 'text',
              },
              {
                label: 'ClientBlock',
                value: clientBlock,
                setValue: setClientBlock,
                type: 'number',
              },
              {
                label: 'ClientFloor',
                value: clientFloor,
                setValue: setClientFloor,
                type: 'number',
              },
              {
                label: 'ClientUnit',
                value: clientUnit,
                setValue: setClientUnit,
                type: 'number',
              },
              {
                label: 'Remark',
                value: remark,
                setValue: setRemark,
                type: 'text',
              },
            ].map((item, index) => (
              <TextField
                key={index}
                autoFocus
                margin="dense"
                label={item.label}
                fullWidth
                variant="standard"
                value={item.value}
                type={item.type}
                onChange={(e) => {
                  item.setValue(e.target.value);
                }}
              />
            ))}
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
