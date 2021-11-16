import React, { useEffect, useRef, useState } from 'react';
import ReactDOMServer from 'react-dom/server';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import {
  Autocomplete,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Paper,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import {
  Add as AddIcon,
  Email as EmailIcon,
  PictureAsPdf as PictureAsPdfIcon,
  WhatsApp as WhatsAppIcon,
} from '@mui/icons-material';
import { useTheme } from '@mui/material/styles';
import MuiPhoneNumber from 'material-ui-phone-number';
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
    label: 'Client Name',
  },
  {
    id: 'clientAddress',
    numeric: false,
    disablePadding: false,
    label: 'Client Address',
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
  const [whatsAppOpen, setWhatsAppOpen] = useState(false);
  const [emailOpen, setEmailOpen] = useState(false);
  const whatsAppMessage = useRef(null);
  const emailContent = useRef(null);
  const [id, setID] = useState('');
  const [models, setModels] = useState([]);
  const [colors, setColors] = useState([]);
  const [deskRemarks, setDeskRemarks] = useState(['av', 'avas']);

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
  const [QTY, setQTY] = useState(1);

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
      setQTY(orders[index].QTY);
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
            .delete(`/deskOrder/${orders[index].id}`)
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
      .put(`/deskOrder/${id}`, {
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
        clientEmail,
        clientPhone,
        clientDistrict,
        clientStreet,
        clientBlock,
        clientFloor,
        clientUnit,
        deliveryDate,
        remark,
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
      .post(`/deskOrder/create`, {
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
        clientEmail,
        clientPhone,
        clientDistrict,
        clientStreet,
        clientBlock,
        clientFloor,
        clientUnit,
        deliveryDate,
        remark,
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

  const getOrders = (cancelToken) => {
    axios
      .get('/deskOrder/current', { cancelToken })
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
          setQTY(1);
          setCreateOpen(true);
        }}
      >
        Add New Order
      </Button>
      <DataGrid
        title="Desk Orders"
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
              createdAt,
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
            ...restProps,
          })
        )}
        columns={columns}
        extraLinks={extraLinks}
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
        <DialogTitle>Edit DeskOrder</DialogTitle>
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
                  label: 'Email',
                  value: clientEmail,
                  setValue: setClientEmail,
                  type: 'text',
                  width: '48%',
                },
                {
                  label: 'Phone',
                  value: clientPhone,
                  setValue: setClientPhone,
                  type: 'text',
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
              ].map((item, index) =>
                item.label === 'Phone' ? (
                  <MuiPhoneNumber
                    key={index}
                    defaultCountry={'hk'}
                    value={item.value}
                    onChange={(value) => {
                      item.setValue(value);
                    }}
                    label={item.label}
                    sx={{ flexBasis: item.width, minWidth: item.width }}
                    variant="outlined"
                    margin="dense"
                    size="small"
                  />
                ) : (
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
                )
              )}
            </Paper>
            <TextField
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
        <DialogTitle>Create DeskOrder</DialogTitle>
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
                  label: 'Email',
                  value: clientEmail,
                  setValue: setClientEmail,
                  type: 'text',
                  width: '48%',
                },
                {
                  label: 'Phone',
                  value: clientPhone,
                  setValue: setClientPhone,
                  type: 'text',
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
              ].map((item, index) =>
                item.label === 'Phone' ? (
                  <MuiPhoneNumber
                    key={index}
                    defaultCountry={'hk'}
                    value={item.value}
                    onChange={(value) => {
                      item.setValue(value);
                    }}
                    label={item.label}
                    sx={{ flexBasis: item.width, minWidth: item.width }}
                    variant="outlined"
                    margin="dense"
                    size="small"
                  />
                ) : (
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
                )
              )}
            </Paper>
            <TextField
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
