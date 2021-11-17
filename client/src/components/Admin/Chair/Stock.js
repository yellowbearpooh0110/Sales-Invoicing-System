import React, { useEffect, useState } from 'react';
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
  Fade,
  FormControlLabel,
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
    id: 'chairBrand',
    numeric: false,
    disablePadding: false,
    label: 'Brand',
  },
  {
    id: 'chairModel',
    numeric: false,
    disablePadding: false,
    label: 'Model',
  },
  {
    id: 'frameColor',
    numeric: false,
    disablePadding: false,
    label: 'Frame Color',
  },
  {
    id: 'backColor',
    numeric: false,
    disablePadding: false,
    label: 'Back Color',
  },
  {
    id: 'seatColor',
    numeric: false,
    disablePadding: false,
    label: 'Seat Color',
  },
  {
    id: 'withHeadrest',
    numeric: false,
    disablePadding: false,
    label: 'With Headrest',
  },
  {
    id: 'withAdArmrest',
    numeric: false,
    disablePadding: false,
    label: 'With Adjustable Armrests',
  },
  {
    id: 'chairRemark',
    numeric: false,
    disablePadding: false,
    label: 'Special Remarks',
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
  const [filterAnchor, setFilterAnchor] = useState(null);

  const [brands, setBrands] = useState([]);
  const [models, setModels] = useState([]);
  const [colors, setColors] = useState([]);
  const [chairRemarks, setChairRemarks] = useState(['av', 'avas']);

  const [filterBrand, setFilterBrand] = useState('');
  const [filterModel, setFilterModel] = useState('');
  const [filterFrameColor, setFilterFrameColor] = useState('');
  const [filterSeatColor, setFilterSeatColor] = useState('');
  const [filterBackColor, setFilterBackColor] = useState('');

  const [brand, setBrand] = useState();
  const [model, setModel] = useState();
  const [frameColor, setFrameColor] = useState();
  const [backColor, setBackColor] = useState();
  const [seatColor, setSeatColor] = useState();
  const [withHeadrest, setWithHeadrest] = useState(true);
  const [withAdArmrest, setWithAdArmrest] = useState(true);
  const [chairRemark, setChairRemark] = useState('');
  const [QTY, setQTY] = useState(0);

  const handleFilterClick = (e) => {
    e.preventDefault();
    if (filterAnchor === null) setFilterAnchor(e.currentTarget);
    else setFilterAnchor(null);
  };

  const handleEditClick = (event, index) => {
    event.preventDefault();
    if (index < stocks.length && index >= 0) {
      setID(stocks[index].id);
      setBrand(stocks[index].chairBrand);
      setModel(stocks[index].chairModel);
      setFrameColor(stocks[index].frameColor);
      setBackColor(stocks[index].backColor);
      setSeatColor(stocks[index].seatColor);
      setWithHeadrest(stocks[index].withHeadrest);
      setWithAdArmrest(stocks[index].withAdArmrest);
      setChairRemark(stocks[index].chairRemark);
      setQTY(stocks[index].QTY);
    }
    setEditOpen(true);
  };

  const handleRemoveClick = (event, index) => {
    event.preventDefault();
    if (index < stocks.length && index >= 0) {
      Swal.fire({
        title: 'Are you sure?',
        text: 'This action will remove current ChairStock permanently.',
        icon: 'question',
        showCancelButton: true,
        confirmButtonText: 'Yes, Remove!',
        cancelButtonText: 'No, Keep It.',
        allowOutsideClick: false,
      }).then((result) => {
        if (result.isConfirmed) {
          axios
            .delete(`/chairStock/${stocks[index].id}`)
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
      text: 'This action will remove selected ChairStocks permanently.',
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Yes, Remove!',
      cancelButtonText: 'No, Keep Them.',
      allowOutsideClick: false,
    }).then((result) => {
      if (result.isConfirmed) {
        axios
          .delete('/chairStock', { data: { ids: selected } })
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
      .put(`/chairStock/${id}`, {
        chairBrandId: brand ? brand.id : null,
        chairModelId: model ? model.id : null,
        frameColorId: frameColor ? frameColor.id : null,
        backColorId: backColor ? backColor.id : null,
        seatColorId: seatColor ? seatColor.id : null,
        withHeadrest,
        withAdArmrest,
        chairRemark,
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
      .post(`/chairStock/create`, {
        chairBrandId: brand ? brand.id : null,
        chairModelId: model ? model.id : null,
        frameColorId: frameColor ? frameColor.id : null,
        backColorId: backColor ? backColor.id : null,
        seatColorId: seatColor ? seatColor.id : null,
        withHeadrest,
        withAdArmrest,
        chairRemark,
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

  const getBrands = (cancelToken) => {
    axios
      .get('/chairBrand', { cancelToken })
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
      .get('/chairModel', { cancelToken })
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

  const getStocks = (cancelToken) => {
    axios
      .get('/chairStock', { cancelToken })
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
    getBrands(source.token);
    getModels(source.token);
    getColors(source.token);
    getStocks(source.token);
    getChairRemarks(source.token);
    return () => source.cancel('Stock Component got unmounted');
  }, []);

  return (
    <>
      <Button
        variant="outlined"
        startIcon={<AddIcon />}
        onClick={() => {
          setBrand(null);
          setModel(null);
          setFrameColor(null);
          setBackColor(null);
          setSeatColor(null);
          setWithHeadrest(false);
          setWithAdArmrest(false);
          setChairRemark('');
          setQTY(0);
          setCreateOpen(true);
        }}
      >
        Add New Stock
      </Button>
      <DataGrid
        title="Chair Stocks"
        rows={stocks
          .map(
            (
              {
                id,
                chairBrand,
                chairModel,
                frameColor,
                backColor,
                seatColor,
                withHeadrest,
                withAdArmrest,
                ...restProps
              },
              index
            ) => ({
              id: index,
              chairBrand: chairBrand ? chairBrand.name : null,
              chairModel: chairModel ? chairModel.name : null,
              frameColor: frameColor ? frameColor.name : null,
              backColor: backColor ? backColor.name : null,
              seatColor: seatColor ? seatColor.name : null,
              withHeadrest: withHeadrest ? 'Yes' : 'No',
              withAdArmrest: withAdArmrest ? 'Yes' : 'No',
              ...restProps,
            })
          )
          .filter(
            (item, key) =>
              (item.chairBrand || '')
                .toLowerCase()
                .includes(filterBrand.toLowerCase()) &&
              (item.chairModel || '')
                .toLowerCase()
                .includes(filterModel.toLowerCase()) &&
              (item.frameColor || '')
                .toLowerCase()
                .includes(filterFrameColor.toLowerCase()) &&
              (item.backColor || '')
                .toLowerCase()
                .includes(filterBackColor.toLowerCase()) &&
              (item.seatColor || '')
                .toLowerCase()
                .includes(filterSeatColor.toLowerCase())
          )}
        columns={columns}
        onEditClick={handleEditClick}
        onRemoveClick={handleRemoveClick}
        onBulkRemoveClick={handleBulkRemoveClick}
        onFilterClick={handleFilterClick}
      ></DataGrid>
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
                    value: filterBrand,
                    values: brands,
                    setValue: setFilterBrand,
                    label: 'Brand',
                    width: '48%',
                  },
                  {
                    value: filterModel,
                    values: models,
                    setValue: setFilterModel,
                    label: 'Model',
                    width: '48%',
                  },
                  {
                    value: filterFrameColor,
                    values: colors,
                    setValue: setFilterFrameColor,
                    label: 'FrameColor',
                    width: '30%',
                  },
                  {
                    value: filterBackColor,
                    values: colors,
                    setValue: setFilterBackColor,
                    label: 'BackColor',
                    width: '30%',
                  },
                  {
                    value: filterSeatColor,
                    values: colors,
                    setValue: setFilterSeatColor,
                    label: 'SeatColor',
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
                    setFilterBrand('');
                    setFilterModel('');
                    setFilterFrameColor('');
                    setFilterBackColor('');
                    setFilterSeatColor('');
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
        <DialogTitle>Edit ChairStock</DialogTitle>
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
              <Typography sx={{ flexBasis: '100%', minWidth: '100%' }}>
                Chair Features
              </Typography>
              {[
                {
                  value: brand,
                  values: brands,
                  setValue: setBrand,
                  label: 'Brand',
                  width: '48%',
                },
                {
                  value: model,
                  values: models,
                  setValue: setModel,
                  label: 'Model',
                  width: '48%',
                },
                {
                  value: frameColor,
                  values: colors,
                  setValue: setFrameColor,
                  label: 'FrameColor',
                  width: '30%',
                },
                {
                  value: backColor,
                  values: colors,
                  setValue: setBackColor,
                  label: 'BackColor',
                  width: '30%',
                },
                {
                  value: seatColor,
                  values: colors,
                  setValue: setSeatColor,
                  label: 'SeatColor',
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
                  freeSolo
                  options={values}
                  getOptionLabel={(option) => option.name}
                  sx={{ flexBasis: width, minWidth: width }}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      margin="dense"
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
                    margin="dense"
                    variant="outlined"
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
        <DialogTitle>Create ChairStock</DialogTitle>
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
              <Typography sx={{ flexBasis: '100%', minWidth: '100%' }}>
                Chair Features
              </Typography>
              {[
                {
                  value: brand,
                  values: brands,
                  setValue: setBrand,
                  label: 'Brand',
                  width: '48%',
                },
                {
                  value: model,
                  values: models,
                  setValue: setModel,
                  label: 'Model',
                  width: '48%',
                },
                {
                  value: frameColor,
                  values: colors,
                  setValue: setFrameColor,
                  label: 'FrameColor',
                  width: '30%',
                },
                {
                  value: backColor,
                  values: colors,
                  setValue: setBackColor,
                  label: 'BackColor',
                  width: '30%',
                },
                {
                  value: seatColor,
                  values: colors,
                  setValue: setSeatColor,
                  label: 'SeatColor',
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
                      {...params}
                      margin="dense"
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
                    margin="dense"
                    variant="outlined"
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
