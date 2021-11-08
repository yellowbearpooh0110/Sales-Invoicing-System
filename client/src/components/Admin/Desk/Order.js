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
  const [models, setModels] = useState([]);
  const [colors, setColors] = useState([]);
  const [deskRemarks, setDeskRemarks] = useState(['av', 'avas']);

  const [clientName, setClientName] = useState('');
  const [clientDistrict, setClientDistrict] = useState('');
  const [clientStreet, setClientStreet] = useState('');
  const [clientBlock, setClientBlock] = useState('');
  const [clientFloor, setClientFloor] = useState('');
  const [clientUnit, setClientUnit] = useState('');
  const [remark, setRemark] = useState('');

  const [model, setModel] = useState(null);
  const [color, setColor] = useState(null);
  const [armSize, setArmSize] = useState('');
  const [feetSize, setFeetSize] = useState('');
  const [beam, setBeam] = useState('');
  const [akInfo, setAkInfo] = useState('');
  const [woodInfo_1, setWoodInfo_1] = useState('');
  const [woodInfo_2, setWoodInfo_2] = useState('');
  const [melamineInfo, setMelamineInfo] = useState('');
  const [laminateInfo, setLaminateInfo] = useState('');
  const [bambooInfo, setBambooInfo] = useState('');
  const [deskRemark, setDeskRemark] = useState('');

  const handleEditClick = (event, index) => {
    event.preventDefault();
    if (index < orders.length && index >= 0) {
      getModels();
      getColors();
      getDeskRemarks();
      setID(orders[index].id);
      setModel(orders[index].stock.deskModel);
      setColor(orders[index].stock.color);
      setArmSize(orders[index].stock.armSize);
      setFeetSize(orders[index].stock.feetSize);
      setBeam(orders[index].stock.beam);
      setAkInfo(orders[index].stock.akInfo);
      setWoodInfo_1(orders[index].stock.woodInfo_1);
      setWoodInfo_2(orders[index].stock.woodInfo_2);
      setMelamineInfo(orders[index].stock.melamineInfo);
      setLaminateInfo(orders[index].stock.laminateInfo);
      setBambooInfo(orders[index].stock.bambooInfo);
      setDeskRemark(orders[index].stock.deskRemark);
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
        text: 'This action will remove current DeskStock permanently.',
        icon: 'question',
        showCancelButton: true,
        confirmButtonText: 'Yes, Remove!',
        cancelButtonText: 'No, Keep It.',
        allowOutsideClick: false,
      }).then((result) => {
        if (result.isConfirmed) {
          axios
            .delete(`/deskorder/${orders[index].id}`)
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
      .put(`/deskstock/${id}`, {
        deskModelId: model ? model.id : null,
        colorId: color ? color.id : null,
        armSize,
        feetSize,
        beam,
        akInfo,
        woodInfo_1,
        woodInfo_2,
        melamineInfo,
        laminateInfo,
        bambooInfo,
        deskRemark,
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
      .post(`/deskorder/create`, {
        deskModelId: model ? model.id : null,
        colorId: color ? color.id : null,
        armSize,
        feetSize,
        beam,
        akInfo,
        woodInfo_1,
        woodInfo_2,
        melamineInfo,
        laminateInfo,
        bambooInfo,
        deskRemark,
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
        setModel(null);
        setColor(null);
        setArmSize('');
        setFeetSize('');
        setBeam('');
        setAkInfo('');
        setWoodInfo_1('');
        setWoodInfo_2('');
        setMelamineInfo('');
        setLaminateInfo('');
        setBambooInfo('');
        setDeskRemark('');
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

  const getModels = (cancelToken) => {
    axios
      .get('/deskmodel', { cancelToken })
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
      .get('/deskorder', { cancelToken })
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

  const getDeskRemarks = (cancelToken) => {
    // axios
    //   .get('/deskremark', { cancelToken })
    //   .then((response) => {
    //     // handle success
    //     setDeskRemarks(response.data.map((item) => item.detail));
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
          getModels();
          getColors();
          getDeskRemarks();
          setCreateOpen(true);
        }}
      >
        Add New Order
      </Button>
      <Dialog fullWidth maxWidth="sm" open={editOpen}>
        <DialogTitle>Edit DeskOrder</DialogTitle>
        <DialogContent>
          <Stack spacing={1}>
            <DialogContentText>
              Please Input Order Name and Click Save button.
            </DialogContentText>
            {[
              {
                value: model,
                values: models,
                setValue: setModel,
                label: 'DeskModel',
              },
              {
                value: color,
                values: colors,
                setValue: setColor,
                label: 'DeskColor',
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
            {[
              {
                label: 'Arm Size',
                value: armSize,
                setValue: setArmSize,
                type: 'number',
              },
              {
                label: 'Feet Size',
                value: feetSize,
                setValue: setFeetSize,
                type: 'number',
              },
              {
                label: 'Beam',
                value: beam,
                setValue: setBeam,
                type: 'text',
              },
              {
                label: 'AK Info',
                value: akInfo,
                setValue: setAkInfo,
                type: 'text',
              },
              {
                label: 'Wood Info 1',
                value: woodInfo_1,
                setValue: setWoodInfo_1,
                type: 'text',
              },
              {
                label: 'Wood Info 2',
                value: woodInfo_2,
                setValue: setWoodInfo_2,
                type: 'text',
              },
              {
                label: 'Melamine Info',
                value: melamineInfo,
                setValue: setMelamineInfo,
                type: 'text',
              },
              {
                label: 'Laminate Info',
                value: laminateInfo,
                setValue: setLaminateInfo,
                type: 'text',
              },
              {
                label: 'Bamboo Info',
                value: bambooInfo,
                setValue: setBambooInfo,
                type: 'text',
              },
            ].map((item, index) => (
              <TextField
                key={index}
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
            <Autocomplete
              disablePortal
              freeSolo
              value={deskRemark}
              onChange={(event, newValue) => {
                event.preventDefault();
                setDeskRemark(newValue);
              }}
              options={deskRemarks}
              fullWidth
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Desk Remark"
                  variant="standard"
                  onChange={(event) => {
                    event.preventDefault();
                    setDeskRemark(event.target.value);
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
        <DialogTitle>Create DeskOrder</DialogTitle>
        <DialogContent>
          <Stack spacing={1}>
            <DialogContentText>
              Please Input Order Name and Click Save button.
            </DialogContentText>
            {[
              {
                value: model,
                values: models,
                setValue: setModel,
                label: 'DeskModel',
              },
              {
                value: color,
                values: colors,
                setValue: setColor,
                label: 'DeskColor',
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
            {[
              {
                label: 'Arm Size',
                value: armSize,
                setValue: setArmSize,
                type: 'number',
              },
              {
                label: 'Feet Size',
                value: feetSize,
                setValue: setFeetSize,
                type: 'number',
              },
              {
                label: 'Beam',
                value: beam,
                setValue: setBeam,
                type: 'text',
              },
              {
                label: 'AK Info',
                value: akInfo,
                setValue: setAkInfo,
                type: 'text',
              },
              {
                label: 'Wood Info 1',
                value: woodInfo_1,
                setValue: setWoodInfo_1,
                type: 'text',
              },
              {
                label: 'Wood Info 2',
                value: woodInfo_2,
                setValue: setWoodInfo_2,
                type: 'text',
              },
              {
                label: 'Melamine Info',
                value: melamineInfo,
                setValue: setMelamineInfo,
                type: 'text',
              },
              {
                label: 'Laminate Info',
                value: laminateInfo,
                setValue: setLaminateInfo,
                type: 'text',
              },
              {
                label: 'Bamboo Info',
                value: bambooInfo,
                setValue: setBambooInfo,
                type: 'text',
              },
            ].map((item, index) => (
              <TextField
                key={index}
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
            <Autocomplete
              disablePortal
              freeSolo
              value={deskRemark}
              onChange={(event, newValue) => {
                event.preventDefault();
                setDeskRemark(newValue);
              }}
              options={deskRemarks}
              fullWidth
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Desk Remark"
                  variant="standard"
                  onChange={(event) => {
                    event.preventDefault();
                    setDeskRemark(event.target.value);
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
