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
    id: 'id',
    numeric: false,
    disablePadding: false,
    label: 'Id',
  },
  {
    id: 'deskModel',
    numeric: false,
    disablePadding: false,
    label: 'Model',
  },
  {
    id: 'color',
    numeric: false,
    disablePadding: false,
    label: 'Color',
  },
  {
    id: 'armSize',
    numeric: true,
    disablePadding: false,
    label: 'Arm Size',
  },
  {
    id: 'feetSize',
    numeric: true,
    disablePadding: false,
    label: 'Feet Size',
  },
  {
    id: 'beam',
    numeric: false,
    disablePadding: false,
    label: 'Beam',
  },
  {
    id: 'akInfo',
    numeric: false,
    disablePadding: false,
    label: 'AK Info',
  },
  {
    id: 'woodInfo_1',
    numeric: false,
    disablePadding: false,
    label: 'Wood Info 1',
  },
  {
    id: 'woodInfo_2',
    numeric: false,
    disablePadding: false,
    label: 'Wood Info 2',
  },
  {
    id: 'melamineInfo',
    numeric: false,
    disablePadding: false,
    label: 'Melamine Info',
  },
  {
    id: 'laminateInfo',
    numeric: false,
    disablePadding: false,
    label: 'Laminate Info',
  },
  {
    id: 'bambooInfo',
    numeric: false,
    disablePadding: false,
    label: 'Bamboo Info',
  },
  {
    id: 'deskRemark',
    numeric: false,
    disablePadding: false,
    label: 'Desk Remark',
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

const Stock = connect(mapStateToProps)((props) => {
  const [stocks, setStocks] = useState([]);
  const [editOpen, setEditOpen] = useState(false);
  const [createOpen, setCreateOpen] = useState(false);
  const [id, setID] = useState('');
  const [models, setModels] = useState([]);
  const [colors, setColors] = useState([]);
  const [deskRemarks, setDeskRemarks] = useState(['av', 'avas']);

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
  const [QTY, setQTY] = useState(0);

  const handleEditClick = (event, index) => {
    event.preventDefault();
    if (index < stocks.length && index >= 0) {
      getModels();
      getColors();
      getDeskRemarks();
      setID(stocks[index].id);
      setModel(stocks[index].deskModel);
      setColor(stocks[index].color);
      setArmSize(stocks[index].armSize);
      setFeetSize(stocks[index].feetSize);
      setBeam(stocks[index].beam);
      setAkInfo(stocks[index].akInfo);
      setWoodInfo_1(stocks[index].woodInfo_1);
      setWoodInfo_2(stocks[index].woodInfo_2);
      setMelamineInfo(stocks[index].melamineInfo);
      setLaminateInfo(stocks[index].laminateInfo);
      setBambooInfo(stocks[index].bambooInfo);
      setDeskRemark(stocks[index].deskRemark);
      setQTY(stocks[index].QTY);
    }
    setEditOpen(true);
  };

  const handleRemoveClick = (event, index) => {
    event.preventDefault();
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
            .delete(`/deskstock/${stocks[index].id}`)
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
          .delete('/deskstock', { data: { ids: selected } })
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
        QTY,
      })
      .then((response) => {
        // handle success
        setEditOpen(false);
        getStocks();
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
      .post(`/deskstock/create`, {
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
        QTY,
      })
      .then((response) => {
        // handle success
        setCreateOpen(false);
        getStocks();
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

  const getStocks = (cancelToken) => {
    axios
      .get('/deskstock', { cancelToken })
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
    getStocks(source.token);
    return () => source.cancel('Stock Component got unmounted');
  }, []);

  return (
    <>
      <Button
        variant="outlined"
        startIcon={<AddIcon />}
        onClick={() => {
          getModels();
          getColors();
          getDeskRemarks();
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
          setQTY(0);
          setCreateOpen(true);
        }}
      >
        Add New Stock
      </Button>
      <DataGrid
        title="Desk Stocks"
        rows={stocks.map(({ id, deskModel, color, ...restProps }, index) => ({
          id: index,
          deskModel: deskModel ? deskModel.name : null,
          color: color ? color.name : null,
          ...restProps,
        }))}
        columns={columns}
        onEditClick={handleEditClick}
        onRemoveClick={handleRemoveClick}
        onBulkRemoveClick={handleBulkRemoveClick}
      ></DataGrid>
      <Dialog open={editOpen}>
        <DialogTitle>Edit DeskStock</DialogTitle>
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
                Desk Features
              </Typography>
              {[
                {
                  value: model,
                  values: models,
                  setValue: setModel,
                  label: 'DeskModel',
                  width: '48%',
                },
                {
                  value: color,
                  values: colors,
                  setValue: setColor,
                  label: 'DeskColor',
                  width: '48%',
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
                      {...params}
                      label={label}
                      margin="dense"
                      variant="outlined"
                      size="small"
                    />
                  )}
                />
              ))}
              {[
                {
                  label: 'Arm Size',
                  value: armSize,
                  setValue: setArmSize,
                  type: 'number',
                  width: '30%',
                },
                {
                  label: 'Feet Size',
                  value: feetSize,
                  setValue: setFeetSize,
                  type: 'number',
                  width: '30%',
                },
                {
                  label: 'Beam',
                  value: beam,
                  setValue: setBeam,
                  type: 'text',
                  width: '30%',
                },
                {
                  label: 'AK Info',
                  value: akInfo,
                  setValue: setAkInfo,
                  type: 'text',
                  width: '48%',
                },
                {
                  label: 'Wood Info 1',
                  value: woodInfo_1,
                  setValue: setWoodInfo_1,
                  type: 'text',
                  width: '48%',
                },
                {
                  label: 'Wood Info 2',
                  value: woodInfo_2,
                  setValue: setWoodInfo_2,
                  type: 'text',
                  width: '48%',
                },
                {
                  label: 'Melamine Info',
                  value: melamineInfo,
                  setValue: setMelamineInfo,
                  type: 'text',
                  width: '48%',
                },
                {
                  label: 'Laminate Info',
                  value: laminateInfo,
                  setValue: setLaminateInfo,
                  type: 'text',
                  width: '48%',
                },
                {
                  label: 'Bamboo Info',
                  value: bambooInfo,
                  setValue: setBambooInfo,
                  type: 'text',
                  width: '48%',
                },
              ].map(({ label, value, setValue, type, width }, index) => (
                <TextField
                  key={index}
                  label={label}
                  sx={{ flexBasis: width, minWidth: width }}
                  margin="dense"
                  variant="outlined"
                  size="small"
                  value={value}
                  type={type}
                  onChange={(e) => {
                    setValue(e.target.value);
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
                    margin="dense"
                    variant="outlined"
                    size="small"
                    onChange={(event) => {
                      event.preventDefault();
                      setDeskRemark(event.target.value);
                    }}
                  />
                )}
              />
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
      <Dialog open={createOpen}>
        <DialogTitle>Edit DeskStock</DialogTitle>
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
                Desk Features
              </Typography>
              {[
                {
                  value: model,
                  values: models,
                  setValue: setModel,
                  label: 'DeskModel',
                  width: '48%',
                },
                {
                  value: color,
                  values: colors,
                  setValue: setColor,
                  label: 'DeskColor',
                  width: '48%',
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
                      {...params}
                      label={label}
                      margin="dense"
                      variant="outlined"
                      size="small"
                    />
                  )}
                />
              ))}
              {[
                {
                  label: 'Arm Size',
                  value: armSize,
                  setValue: setArmSize,
                  type: 'number',
                  width: '30%',
                },
                {
                  label: 'Feet Size',
                  value: feetSize,
                  setValue: setFeetSize,
                  type: 'number',
                  width: '30%',
                },
                {
                  label: 'Beam',
                  value: beam,
                  setValue: setBeam,
                  type: 'text',
                  width: '30%',
                },
                {
                  label: 'AK Info',
                  value: akInfo,
                  setValue: setAkInfo,
                  type: 'text',
                  width: '48%',
                },
                {
                  label: 'Wood Info 1',
                  value: woodInfo_1,
                  setValue: setWoodInfo_1,
                  type: 'text',
                  width: '48%',
                },
                {
                  label: 'Wood Info 2',
                  value: woodInfo_2,
                  setValue: setWoodInfo_2,
                  type: 'text',
                  width: '48%',
                },
                {
                  label: 'Melamine Info',
                  value: melamineInfo,
                  setValue: setMelamineInfo,
                  type: 'text',
                  width: '48%',
                },
                {
                  label: 'Laminate Info',
                  value: laminateInfo,
                  setValue: setLaminateInfo,
                  type: 'text',
                  width: '48%',
                },
                {
                  label: 'Bamboo Info',
                  value: bambooInfo,
                  setValue: setBambooInfo,
                  type: 'text',
                  width: '48%',
                },
              ].map(({ label, value, setValue, type, width }, index) => (
                <TextField
                  key={index}
                  label={label}
                  sx={{ flexBasis: width, minWidth: width }}
                  margin="dense"
                  variant="outlined"
                  size="small"
                  value={value}
                  type={type}
                  onChange={(e) => {
                    setValue(e.target.value);
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
                    margin="dense"
                    variant="outlined"
                    size="small"
                    onChange={(event) => {
                      event.preventDefault();
                      setDeskRemark(event.target.value);
                    }}
                  />
                )}
              />
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

export default Stock;
