import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import {
  Autocomplete,
  Button,
  Checkbox,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
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
    id: 'id',
    numeric: false,
    disablePadding: false,
    label: 'Id',
  },
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

  const [brands, setBrands] = useState([]);
  const [models, setModels] = useState([]);
  const [colors, setColors] = useState([]);
  const [chairRemarks, setChairRemarks] = useState(['av', 'avas']);

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
            .delete(`/chairstock/${stocks[index].id}`)
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
          .delete('/chairstock', { data: { ids: selected } })
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
      .put(`/chairstock/${id}`, {
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
      .post(`/chairstock/create`, {
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

  const getStocks = (cancelToken) => {
    axios
      .get('/chairstock', { cancelToken })
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
          setQTY(0);
          setCreateOpen(true);
        }}
      >
        Add New Stock
      </Button>
      <DataGrid
        title="Chair Stocks"
        rows={stocks.map(
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
