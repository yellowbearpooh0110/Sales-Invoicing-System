import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import {
  Autocomplete,
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Fade,
  IconButton,
  Paper,
  Popper,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import { Add as AddIcon, Remove as RemoveIcon } from '@mui/icons-material';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import axios from 'axios';
import Swal from 'sweetalert2';

import DataGrid from 'components/Common/DataGrid';

const columns = [
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
    label: 'AK',
  },
  {
    id: 'woodInfo_1',
    numeric: false,
    disablePadding: false,
    label: 'Wood 1',
  },
  {
    id: 'woodInfo_2',
    numeric: false,
    disablePadding: false,
    label: 'Wood 2',
  },
  {
    id: 'melamineInfo',
    numeric: false,
    disablePadding: false,
    label: 'Melamine',
  },
  {
    id: 'laminateInfo',
    numeric: false,
    disablePadding: false,
    label: 'Laminate',
  },
  {
    id: 'bambooInfo',
    numeric: false,
    disablePadding: false,
    label: 'Bamboo',
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
  const theme = useTheme();

  const [stocks, setStocks] = useState([]);
  const [editOpen, setEditOpen] = useState(false);
  const [createOpen, setCreateOpen] = useState(false);
  const [id, setID] = useState('');
  const [models, setModels] = useState([]);
  const [colors, setColors] = useState([]);
  const [deskRemarks, setDeskRemarks] = useState(['av', 'avas']);

  const [filterModel, setFilterModel] = useState('');
  const [filterColor, setFilterColor] = useState('');
  const [filterBeam, setFilterBeam] = useState('');
  const [filterAKInfo, setFilterAKInfo] = useState('');
  const [filterWoodInfo_1, setFilterWoodInfo_1] = useState('');
  const [filterWoodInfo_2, setFilterWoodInfo_2] = useState('');
  const [filterMelamineInfo, setFilterMelamineInfo] = useState('');
  const [filterLaminateInfo, setFilterLaminateInfo] = useState('');
  const [filterBambooInfo, setFilterBambooInfo] = useState('');

  const [filterAnchor, setFilterAnchor] = useState(null);

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

  const handleFilterClick = (e) => {
    e.preventDefault();
    if (filterAnchor === null) setFilterAnchor(e.currentTarget);
    else setFilterAnchor(null);
  };

  const handleEditClick = (index) => {
    if (index < stocks.length && index >= 0) {
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
          .delete('/deskStock', { data: { ids: selected } })
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
      .put(`/deskStock/${id}`, {
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
      .post(`/deskStock/create`, {
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
      .get('/deskModel', { cancelToken })
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
      .get('/productColor', { cancelToken })
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
    getModels(source.token);
    getColors(source.token);
    getDeskRemarks(source.token);
    getStocks(source.token);
    return () => source.cancel('Stock Component got unmounted');
  }, []);

  return (
    <>
      <Button
        variant="outlined"
        startIcon={<AddIcon />}
        onClick={() => {
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
        New Stock
      </Button>
      <DataGrid
        title="Desk Stocks"
        rows={stocks
          .map(({ id, deskModel, color, ...restProps }, index) => ({
            id: index,
            deskModel: deskModel ? deskModel.name : null,
            color: color ? color.name : null,
            ...restProps,
          }))
          .filter(
            (item, key) =>
              (item.deskModel || '')
                .toLowerCase()
                .includes(filterModel.toLowerCase()) &&
              (item.color || '')
                .toLowerCase()
                .includes(filterColor.toLowerCase()) &&
              (item.beam || '')
                .toLowerCase()
                .includes(filterBeam.toLowerCase()) &&
              (item.akInfo || '')
                .toLowerCase()
                .includes(filterAKInfo.toLowerCase()) &&
              (item.woodInfo_1 || '')
                .toLowerCase()
                .includes(filterWoodInfo_1.toLowerCase()) &&
              (item.woodInfo_2 || '')
                .toLowerCase()
                .includes(filterWoodInfo_2.toLowerCase()) &&
              (item.melamineInfo || '')
                .toLowerCase()
                .includes(filterMelamineInfo.toLowerCase()) &&
              (item.laminateInfo || '')
                .toLowerCase()
                .includes(filterLaminateInfo.toLowerCase()) &&
              (item.bambooInfo || '')
                .toLowerCase()
                .includes(filterBambooInfo.toLowerCase())
          )}
        columns={columns}
        onEditClick={handleEditClick}
        onRemoveClick={handleRemoveClick}
        onBulkRemoveClick={handleBulkRemoveClick}
        onFilterClick={handleFilterClick}
      />
      <Popper
        anchorEl={filterAnchor}
        open={Boolean(filterAnchor)}
        placement={'bottom-end'}
        disablePortal={false}
        transition
        onClose={() => {
          setFilterAnchor(null);
        }}
      >
        {({ TransitionProps }) => (
          <Fade {...TransitionProps} timeout={350}>
            <Paper
              sx={{
                mt: '5px',
                p: '10px',
                maxWidth: 400,
                // maxWidth: '100%',
              }}
            >
              <Box
                display="flex"
                flexWrap="wrap"
                justifyContent="space-between"
              >
                {[
                  {
                    value: filterModel,
                    setValue: setFilterModel,
                    label: 'Model',
                    width: '30%',
                  },
                  {
                    value: filterColor,
                    setValue: setFilterColor,
                    label: 'Color',
                    width: '30%',
                  },
                  {
                    value: filterBeam,
                    setValue: setFilterBeam,
                    label: 'Beam',
                    width: '30%',
                  },
                  {
                    value: filterAKInfo,
                    setValue: setFilterAKInfo,
                    label: 'AK',
                    width: '30%',
                  },
                  {
                    value: filterWoodInfo_1,
                    setValue: setFilterWoodInfo_1,
                    label: 'Wood 1',
                    width: '30%',
                  },
                  {
                    value: filterWoodInfo_2,
                    setValue: setFilterWoodInfo_2,
                    label: 'Wood 2',
                    width: '30%',
                  },
                  {
                    value: filterMelamineInfo,
                    setValue: setFilterMelamineInfo,
                    label: 'Melamine',
                    width: '30%',
                  },
                  {
                    value: filterLaminateInfo,
                    setValue: setFilterLaminateInfo,
                    label: 'Laminate',
                    width: '30%',
                  },
                  {
                    value: filterBambooInfo,
                    setValue: setFilterBambooInfo,
                    label: 'Bamboo',
                    width: '30%',
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
              </Box>
              <Box display="flex" justifyContent="space-between">
                <Button
                  onClick={() => {
                    setFilterModel('');
                    setFilterColor('');
                    setFilterBeam('');
                    setFilterAKInfo('');
                    setFilterWoodInfo_1('');
                    setFilterWoodInfo_2('');
                    setFilterMelamineInfo('');
                    setFilterLaminateInfo('');
                    setFilterBambooInfo('');
                  }}
                  variant="outlined"
                >
                  Clear
                </Button>
                <Button
                  onClick={() => {
                    setFilterAnchor(null);
                  }}
                  variant="outlined"
                >
                  OK
                </Button>
              </Box>
            </Paper>
          </Fade>
        )}
      </Popper>
      <Dialog
        fullWidth
        fullScreen={useMediaQuery(theme.breakpoints.down('sm'))}
        maxWidth="sm"
        open={editOpen}
      >
        <DialogTitle>Edit Stock</DialogTitle>
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
            <Box
              display="flex"
              justifyContent="center"
              alignItems="center"
              sx={{ flexBasis: '100%', minWidth: '100%' }}
            >
              <IconButton
                onClick={() => {
                  setQTY(QTY > 1 ? QTY - 1 : 0);
                }}
              >
                <RemoveIcon />
              </IconButton>
              <TextField
                margin="dense"
                label="QTY"
                variant="outlined"
                size="small"
                value={QTY}
                type="number"
                sx={{ width: '80px', mx: '5px' }}
                onChange={(e) => {
                  if (e.target.value > 0) setQTY(e.target.value);
                  else setQTY(0);
                }}
              />
              <IconButton
                onClick={() => {
                  setQTY(QTY + 1);
                }}
              >
                <AddIcon />
              </IconButton>
            </Box>
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
        <DialogTitle>New Stock</DialogTitle>
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
            <Box
              display="flex"
              justifyContent="center"
              alignItems="center"
              sx={{ flexBasis: '100%', minWidth: '100%' }}
            >
              <IconButton
                onClick={() => {
                  setQTY(QTY > 1 ? QTY - 1 : 0);
                }}
              >
                <RemoveIcon />
              </IconButton>
              <TextField
                margin="dense"
                label="QTY"
                variant="outlined"
                size="small"
                value={QTY}
                type="number"
                sx={{ width: '80px', mx: '5px' }}
                onChange={(e) => {
                  if (e.target.value > 0) setQTY(e.target.value);
                  else setQTY(0);
                }}
              />
              <IconButton
                onClick={() => {
                  setQTY(QTY + 1);
                }}
              >
                <AddIcon />
              </IconButton>
            </Box>
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
