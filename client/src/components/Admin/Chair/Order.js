import React, { useEffect, useRef, useState } from 'react';
import ReactDOMServer from 'react-dom/server';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import {
  Autocomplete,
  Box,
  Button,
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
import {
  Add as AddIcon,
  Email as EmailIcon,
  PictureAsPdf as PictureAsPdfIcon,
  Remove as RemoveIcon,
  WhatsApp as WhatsAppIcon,
} from '@mui/icons-material';
import MuiPhoneNumber from 'material-ui-phone-number';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import axios from 'axios';
import Swal from 'sweetalert2';
import QRCode from 'react-qr-code';

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
    id: 'isPreOrder',
    numeric: false,
    disablePadding: false,
    label: 'PreOrder',
  },
  {
    id: 'QTY',
    numeric: true,
    disablePadding: false,
    label: 'QTY',
  },
  {
    id: 'paid',
    numeric: false,
    disablePadding: false,
    label: 'Paid',
  },
  {
    id: 'finished',
    numeric: false,
    disablePadding: false,
    label: 'Finished',
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
  const [whatsAppOpen, setWhatsAppOpen] = useState(false);
  const [emailOpen, setEmailOpen] = useState(false);
  const whatsAppMessage = useRef(null);
  const emailContent = useRef(null);
  const [filterAnchor, setFilterAnchor] = useState(null);

  const [id, setID] = useState('');
  const [brands, setBrands] = useState([]);
  const [models, setModels] = useState([]);
  const [colors, setColors] = useState([]);
  const [chairRemarks, setChairRemarks] = useState(['av', 'avas']);

  const [filterBrand, setFilterBrand] = useState('');
  const [filterModel, setFilterModel] = useState('');
  const [filterFrameColor, setFilterFrameColor] = useState('');
  const [filterSeatColor, setFilterSeatColor] = useState('');
  const [filterBackColor, setFilterBackColor] = useState('');

  const [clientName, setClientName] = useState('');
  const [clientEmail, setClientEmail] = useState('');
  const [clientPhone, setClientPhone] = useState('');
  const [clientDistrict, setClientDistrict] = useState('');
  const [clientStreet, setClientStreet] = useState('');
  const [clientBlock, setClientBlock] = useState('');
  const [clientFloor, setClientFloor] = useState('');
  const [clientUnit, setClientUnit] = useState('');
  const [deliveryDate, setDeliveryDate] = useState(new Date());
  const [remark, setRemark] = useState('');

  const [brand, setBrand] = useState();
  const [model, setModel] = useState();
  const [frameColor, setFrameColor] = useState();
  const [backColor, setBackColor] = useState();
  const [seatColor, setSeatColor] = useState();
  const [withHeadrest, setWithHeadrest] = useState(true);
  const [withAdArmrest, setWithAdArmrest] = useState(true);
  const [chairRemark, setChairRemark] = useState('');
  const [unitPrice, setUnitPrice] = useState(1000);
  const [QTY, setQTY] = useState(1);

  const handleFilterClick = (e) => {
    e.preventDefault();
    if (filterAnchor === null) setFilterAnchor(e.currentTarget);
    else setFilterAnchor(null);
  };

  const extraLinks = [
    (id) => {
      return (
        <IconButton
          component={Link}
          to={`/chairinvoice/${orders[id].id}`}
          target="_blank"
        >
          <PictureAsPdfIcon />
        </IconButton>
      );
    },
    (id) => {
      return (
        <IconButton
          onClick={() => {
            setClientEmail(orders[id].clientEmail);
            setEmailOpen(true);
          }}
        >
          <EmailIcon />
        </IconButton>
      );
    },
    (id) => {
      return (
        <IconButton
          onClick={() => {
            axios
              .get('whatsapp/checkauth')
              .then(() => {
                setClientPhone(orders[id].clientPhone);
                setWhatsAppOpen(true);
              })
              .catch(function (error) {
                // handle error
                axios
                  .get('whatsapp/getqr')
                  .then((response) => {
                    Swal.fire({
                      icon: 'info',
                      title:
                        'Please signin with this QRCode and Click the button again.',
                      html: ReactDOMServer.renderToStaticMarkup(
                        <QRCode
                          value={`${response.data.qrcode}`}
                          level="H"
                        ></QRCode>
                      ),
                      allowOutsideClick: false,
                    });
                  })
                  .catch(function (qrerror) {
                    // handle error
                    Swal.fire({
                      icon: 'error',
                      title: 'Error',
                      text: 'Unable to use WhatsApp Messaging.',
                      allowOutsideClick: false,
                    });
                  })
                  .then(function () {
                    // always executed
                  });
              })
              .then(function () {
                // always executed
              });
          }}
        >
          <WhatsAppIcon />
        </IconButton>
      );
    },
  ];

  const handleWhatsAppSend = (event) => {
    event.preventDefault();
    axios
      .post('whatsapp/send', {
        phone: clientPhone,
        message: whatsAppMessage.current.value,
      })
      .then(() => {
        setWhatsAppOpen(false);
      })
      .catch(function (error) {
        // handle error
        setWhatsAppOpen(false);
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: error.response.data.message,
          allowOutsideClick: false,
        }).then(() => {
          setWhatsAppOpen(true);
        });
      })
      .then(function () {
        // always executed
      });
  };

  const handleEmailSend = (event) => {
    event.preventDefault();
    axios
      .post('email/send', {
        email: clientEmail,
        message: emailContent.current.value,
      })
      .then(() => {
        setEmailOpen(false);
      })
      .catch(function (error) {
        // handle error
        setEmailOpen(false);
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: error.response.data.message,
          allowOutsideClick: false,
        }).then(() => {
          setEmailOpen(true);
        });
      })
      .then(function () {
        // always executed
      });
  };

  const handleEditClick = (event, index) => {
    event.preventDefault();
    if (index < orders.length && index >= 0) {
      setID(orders[index].id);
      setBrand(orders[index].stock.chairBrand);
      setModel(orders[index].stock.chairModel);
      setFrameColor(orders[index].stock.frameColor);
      setBackColor(orders[index].stock.backColor);
      setSeatColor(orders[index].stock.seatColor);
      setWithHeadrest(orders[index].stock.withHeadrest);
      setWithAdArmrest(orders[index].stock.withAdArmrest);
      setChairRemark(orders[index].stock.chairRemark);
      setClientName(orders[index].clientName);
      setClientEmail(orders[index].clientEmail);
      setClientPhone(orders[index].clientPhone);
      setClientDistrict(orders[index].clientDistrict);
      setClientStreet(orders[index].clientStreet);
      setClientBlock(orders[index].clientBlock);
      setClientFloor(orders[index].clientFloor);
      setClientUnit(orders[index].clientUnit);
      setRemark(orders[index].clientRemark);
      const deliveryDate = new Date(orders[index].deliveryDate);
      deliveryDate.setMinutes(
        deliveryDate.getMinutes() - deliveryDate.getTimezoneOffset()
      );
      setDeliveryDate(deliveryDate.toISOString().split('T')[0]);
      setUnitPrice(orders[index].unitPrice);
      setQTY(orders[index].QTY);
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
            .delete(`/chairOrder/${brands[index].id}`)
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
          .delete('/chairOrder', { data: { ids: selected } })
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
      .put(`/chairOrder/${id}`, {
        chairBrandId: brand ? brand.id : null,
        chairModelId: model ? model.id : null,
        frameColorId: frameColor ? frameColor.id : null,
        backColorId: backColor ? backColor.id : null,
        seatColorId: seatColor ? seatColor.id : null,
        withHeadrest,
        withAdArmrest,
        chairRemark,
        clientName,
        clientPhone,
        clientEmail,
        clientDistrict,
        clientStreet,
        clientBlock,
        clientFloor,
        clientUnit,
        deliveryDate,
        clientRemark: remark,
        unitPrice,
        QTY,
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
      .post(`/chairOrder/create`, {
        chairBrandId: brand ? brand.id : null,
        chairModelId: model ? model.id : null,
        frameColorId: frameColor ? frameColor.id : null,
        backColorId: backColor ? backColor.id : null,
        seatColorId: seatColor ? seatColor.id : null,
        withHeadrest,
        withAdArmrest,
        chairRemark,
        clientName,
        clientPhone,
        clientEmail,
        clientDistrict,
        clientStreet,
        clientBlock,
        clientFloor,
        clientUnit,
        deliveryDate,
        clientRemark: remark,
        unitPrice,
        QTY,
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

  const getOrders = (cancelToken) => {
    axios
      .get('/chairOrder', { cancelToken })
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

  useEffect(() => {
    const source = axios.CancelToken.source();
    getBrands(source.token);
    getModels(source.token);
    getColors(source.token);
    getChairRemarks(source.token);
    getOrders(source.token);
    return () => source.cancel('Brand Component got unmounted');
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
          setClientName('');
          setClientEmail('');
          setClientPhone('');
          setClientDistrict('');
          setClientStreet('');
          setClientBlock('');
          setClientFloor('');
          setClientUnit('');
          const now = new Date();
          now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
          setDeliveryDate(now.toISOString().split('T')[0]);
          setRemark('');
          setUnitPrice(1000);
          setQTY(1);
          setCreateOpen(true);
        }}
      >
        Add New Order
      </Button>
      <DataGrid
        title="Chair Orders"
        rows={orders
          .map(
            (
              {
                id,
                clientDistrict,
                clientStreet,
                clientBlock,
                clientFloor,
                clientUnit,
                salesman,
                isPreOrder,
                createdAt,
                paid,
                finished,
                ...restProps
              },
              index
            ) => ({
              id: index,
              salesmanName: (salesman.firstName || '').concat(
                ' ',
                salesman.lastName || ''
              ),
              orderDate: (() => {
                const createdTime = new Date(createdAt);
                createdTime.setMinutes(
                  createdTime.getMinutes() - createdTime.getTimezoneOffset()
                );
                return createdTime.toISOString().split('T')[0];
              })(),
              clientAddress: [
                clientDistrict,
                clientStreet,
                clientBlock,
                clientFloor,
                clientUnit,
              ].join(', '),
              isPreOrder: isPreOrder ? 'Yes' : 'No',
              paid: (
                <Checkbox
                  checked={paid}
                  onClick={(event) => {
                    event.stopPropagation();
                    event.preventDefault();
                    axios
                      .put(`/chairOrder/withoutStock/${id}`, {
                        paid: !paid,
                      })
                      .then(() => {
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
                      })
                      .then(function () {
                        // always executed
                      });
                  }}
                />
              ),
              finished: (
                <Checkbox
                  checked={finished}
                  onClick={(event) => {
                    event.stopPropagation();
                    event.preventDefault();
                    axios
                      .put(`/chairOrder/withoutStock/${id}`, {
                        finished: !finished,
                      })
                      .then(() => {
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
                      })
                      .then(function () {
                        // always executed
                      });
                  }}
                />
              ),
              ...restProps,
            })
          )
          .filter(
            (item, key) =>
              (item.stock.chairBrand || { name: '' }).name
                .toLowerCase()
                .includes(filterBrand.toLowerCase()) &&
              (item.stock.chairModel || { name: '' }).name
                .toLowerCase()
                .includes(filterModel.toLowerCase()) &&
              (item.stock.frameColor || { name: '' }).name
                .toLowerCase()
                .includes(filterFrameColor.toLowerCase()) &&
              (item.stock.backColor || { name: '' }).name
                .toLowerCase()
                .includes(filterBackColor.toLowerCase()) &&
              (item.stock.seatColor || { name: '' }).name
                .toLowerCase()
                .includes(filterSeatColor.toLowerCase())
          )}
        columns={columns}
        extraLinks={extraLinks}
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
                <TextField
                  type="datetime-local"
                  margin="dense"
                  label="from"
                  variant="outlined"
                  size="small"
                  onChange={(e) => {
                    console.log(typeof e.target.value);
                  }}
                ></TextField>
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
                sx={{ flexBasis: '45%', minWidth: '45%', marginLeft: 0 }}
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
                sx={{ flexBasis: '45%', minWidth: '45%', marginLeft: 0 }}
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
              <FormControlLabel
                sx={{ flexBasis: '40%', minWidth: '40%', marginLeft: 0 }}
                control={
                  <TextField
                    label="Unit Price"
                    variant="outlined"
                    margin="dense"
                    size="small"
                    type="number"
                    sx={{ width: '130px', m: '10px 5px 0 0' }}
                    value={unitPrice}
                    onChange={(e) => {
                      if (e.target.value >= 0) setUnitPrice(e.target.value);
                      else setUnitPrice(0);
                    }}
                  />
                }
                label="HKD"
              />
              <Box
                display="flex"
                justifyContent="center"
                alignItems="center"
                sx={{ flexBasis: '100%', minWidth: '100%' }}
              >
                <IconButton
                  onClick={() => {
                    setQTY(QTY > 2 ? QTY - 1 : 1);
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
                    if (e.target.value > 1) setQTY(e.target.value);
                    else setQTY(1);
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
                  width: '100%',
                },
                {
                  label: 'Phone',
                  value: clientPhone,
                  setValue: setClientPhone,
                  type: 'text',
                  width: '48%',
                },
                {
                  label: 'Email',
                  value: clientEmail,
                  setValue: setClientEmail,
                  type: 'email',
                  width: '48%',
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
                  type: 'text',
                  width: '30%',
                },
                {
                  label: 'Floor',
                  value: clientFloor,
                  setValue: setClientFloor,
                  type: 'text',
                  width: '30%',
                },
                {
                  label: 'Unit',
                  value: clientUnit,
                  setValue: setClientUnit,
                  type: 'text',
                  width: '30%',
                },
                {
                  label: 'Delivery Date',
                  value: deliveryDate,
                  setValue: setDeliveryDate,
                  type: 'date',
                  width: '100%',
                  InputLabelProps: { shrink: true },
                },
                {
                  label: 'Remark',
                  value: remark,
                  setValue: setRemark,
                  type: 'text',
                  width: '100%',
                },
              ].map(({ setValue, width, ...restProps }, index) =>
                restProps.label === 'Phone' ? (
                  <MuiPhoneNumber
                    key={index}
                    defaultCountry={'hk'}
                    onChange={(value) => {
                      setValue(value);
                    }}
                    sx={{ flexBasis: width, minWidth: width }}
                    variant="outlined"
                    margin="dense"
                    size="small"
                    {...restProps}
                  />
                ) : (
                  <TextField
                    key={index}
                    margin="dense"
                    variant="outlined"
                    size="small"
                    onChange={(e) => {
                      setValue(e.target.value);
                    }}
                    sx={{ flexBasis: width, minWidth: width }}
                    {...restProps}
                  />
                )
              )}
            </Paper>
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
              <FormControlLabel
                sx={{ flexBasis: '40%', minWidth: '40%', marginLeft: 0 }}
                control={
                  <TextField
                    label="Unit Price"
                    variant="outlined"
                    margin="dense"
                    size="small"
                    type="number"
                    sx={{ width: '130px', m: '10px 5px 0 0' }}
                    value={unitPrice}
                    onChange={(e) => {
                      if (e.target.value >= 0) setUnitPrice(e.target.value);
                      else setUnitPrice(0);
                    }}
                  />
                }
                label="HKD"
              />
              <Box
                display="flex"
                justifyContent="center"
                alignItems="center"
                sx={{ flexBasis: '100%', minWidth: '100%' }}
              >
                <IconButton
                  onClick={() => {
                    setQTY(QTY > 2 ? QTY - 1 : 1);
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
                    if (e.target.value > 1) setQTY(e.target.value);
                    else setQTY(1);
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
                  width: '100%',
                },
                {
                  label: 'Phone',
                  value: clientPhone,
                  setValue: setClientPhone,
                  type: 'text',
                  width: '48%',
                },
                {
                  label: 'Email',
                  value: clientEmail,
                  setValue: setClientEmail,
                  type: 'email',
                  width: '48%',
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
                  type: 'text',
                  width: '30%',
                },
                {
                  label: 'Floor',
                  value: clientFloor,
                  setValue: setClientFloor,
                  type: 'text',
                  width: '30%',
                },
                {
                  label: 'Unit',
                  value: clientUnit,
                  setValue: setClientUnit,
                  type: 'text',
                  width: '30%',
                },
                {
                  label: 'Delivery Date',
                  value: deliveryDate,
                  setValue: setDeliveryDate,
                  type: 'date',
                  width: '100%',
                  InputLabelProps: { shrink: true },
                },
                {
                  label: 'Remark',
                  value: remark,
                  setValue: setRemark,
                  type: 'text',
                  width: '100%',
                },
              ].map(({ setValue, width, ...restProps }, index) =>
                restProps.label === 'Phone' ? (
                  <MuiPhoneNumber
                    key={index}
                    defaultCountry={'hk'}
                    onChange={(value) => {
                      setValue(value);
                    }}
                    sx={{ flexBasis: width, minWidth: width }}
                    variant="outlined"
                    margin="dense"
                    size="small"
                    {...restProps}
                  />
                ) : (
                  <TextField
                    key={index}
                    margin="dense"
                    variant="outlined"
                    size="small"
                    onChange={(e) => {
                      setValue(e.target.value);
                    }}
                    sx={{ flexBasis: width, minWidth: width }}
                    {...restProps}
                  />
                )
              )}
            </Paper>
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
      <Dialog
        fullWidth
        fullScreen={useMediaQuery(theme.breakpoints.down('sm'))}
        maxWidth="sm"
        open={whatsAppOpen}
      >
        <DialogTitle>Send WhatsApp Message to the Client</DialogTitle>
        <DialogContent>
          <Stack spacing={2}>
            <MuiPhoneNumber
              margin="dense"
              variant="outlined"
              size="small"
              label="Phone Number"
              defaultCountry={'hk'}
              value={clientPhone}
              InputProps={{
                readOnly: true,
              }}
            />

            <TextField
              inputRef={whatsAppMessage}
              label="Message"
              fullWidth
              margin="dense"
              variant="outlined"
              size="small"
              defaultValue={`Hello ${clientName},\nThank you for your order! Please find here (payment link URL) for your payment. Once finished, your order will be processed.\nOnce finished, your order will be processed accordingly.`}
              multiline
              minRows={4}
              maxRows={10}
              // onChange={(e) => {
              //   setWhatsAppMessage(e.target.value);
              // }}
            />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={(event) => {
              event.preventDefault();
              setWhatsAppOpen(false);
            }}
          >
            Cancel
          </Button>
          <Button onClick={handleWhatsAppSend}>Send</Button>
        </DialogActions>
      </Dialog>
      <Dialog
        fullWidth
        fullScreen={useMediaQuery(theme.breakpoints.down('sm'))}
        maxWidth="sm"
        open={emailOpen}
      >
        <DialogTitle>Send Email to the Client</DialogTitle>
        <DialogContent>
          <Stack spacing={2}>
            <TextField
              margin="dense"
              variant="outlined"
              size="small"
              label="Email"
              type="email"
              value={clientEmail}
              InputProps={{
                readOnly: true,
              }}
            />

            <TextField
              inputRef={emailContent}
              label="Message"
              fullWidth
              margin="dense"
              variant="outlined"
              size="small"
              defaultValue={`Hello ${clientName},\nThank you for your order! Please find here (payment link URL) for your payment. Once finished, your order will be processed.\nOnce finished, your order will be processed accordingly.`}
              multiline
              minRows={4}
              maxRows={10}
            />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={(event) => {
              event.preventDefault();
              setEmailOpen(false);
            }}
          >
            Cancel
          </Button>
          <Button onClick={handleEmailSend}>Send</Button>
        </DialogActions>
      </Dialog>
    </>
  );
});
