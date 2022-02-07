import React, { useEffect, useRef, useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import ReactDOMServer from 'react-dom/server';
import { connect } from 'react-redux';
import {
  Badge,
  Box,
  Button,
  Checkbox,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControlLabel,
  IconButton,
  Paper,
  Stack,
  TextField,
} from '@mui/material';
import { blue, pink, red, yellow } from '@mui/material/colors';
import {
  Add as AddIcon,
  Deck as DeckIcon,
  Delete as DeleteIcon,
  Edit as EditIcon,
  Email as EmailIcon,
  PictureAsPdf as PictureAsPdfIcon,
  WhatsApp as WhatsAppIcon,
} from '@mui/icons-material';
import MuiPhoneNumber from 'material-ui-phone-number';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import axios from 'axios';
import Swal from 'sweetalert2';
import QRCode from 'react-qr-code';

import DataGrid from 'components/Common/DataGrid';
import {
  ProductList,
  ProductListItem,
  ProductListItemText,
  ProductPriceAmount,
} from '../ProductList';

const columns = [
  {
    id: 'invoiceNum',
    label: 'Invoice',
  },
  {
    id: 'name',
    label: 'Client',
  },
  {
    id: 'clientAddress',
    label: 'Address',
  },
  {
    id: 'seller',
    label: 'Seller',
  },
  {
    id: 'orderDate',
    label: 'Order',
  },
  {
    id: 'timeLine',
    label: 'TimeLine',
  },
  {
    id: 'isPreOrder',
    label: 'PreOrder',
  },
  {
    id: 'remark',
    label: 'Remark',
  },
  {
    id: 'discount',
    label: 'Discount',
  },
  {
    id: 'surcharge',
    label: 'SurCharge',
  },
  {
    id: 'products',
    label: 'Products',
  },
  {
    id: 'paid',
    label: 'Paid',
  },
  {
    id: 'invoicePDF',
    nonSort: true,
    label: 'Invoice',
    align: 'center',
  },
  {
    id: 'emailIcon',
    nonSort: true,
    label: 'Con',
    align: 'right',
    sx: { maxWidth: 45, width: 45 },
  },
  {
    id: 'whatsappIcon',
    nonSort: true,
    label: 'tact',
    align: 'left',
    sx: { maxWidth: 45, width: 45, paddingLeft: 0 },
  },
  {
    id: 'edit',
    nonSort: true,
    sx: { maxWidth: 45, width: 45 },
  },
  {
    nonSort: true,
    id: 'delete',
    sx: { maxWidth: 45, width: 45 },
  },
];

function mapStateToProps(state) {
  const { auth } = state;
  return { auth };
}

export default connect(mapStateToProps)((props) => {
  const theme = useTheme();

  const [orders, setOrders] = useState([]);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [whatsAppOpen, setWhatsAppOpen] = useState(false);
  const [emailOpen, setEmailOpen] = useState(false);
  const [detailOpen, setDetailOpen] = useState(false);
  const whatsAppMessage = useRef(null);
  const emailContent = useRef(null);
  const [filterAnchor, setFilterAnchor] = useState(null);

  const [orderIndex, setOrderIndex] = useState(0);

  const chairDeliveries = useRef([]);
  const deskDeliveries = useRef([]);
  const accessoryDeliveries = useRef([]);

  const handleFilterClick = (e) => {
    e.preventDefault();
    if (filterAnchor === null) setFilterAnchor(e.currentTarget);
    else setFilterAnchor(null);
  };

  const handleWhatsAppSend = (event) => {
    event.preventDefault();
    axios
      .post('whatsapp/send', {
        phone: phone,
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
        email: email,
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

  const handleRemoveClick = (index) => {
    if (index < orders.length && index >= 0) {
      Swal.fire({
        title: 'Are you sure?',
        text: 'This action will remove current Order permanently.',
        icon: 'question',
        showCancelButton: true,
        confirmButtonText: 'Yes, Remove!',
        cancelButtonText: 'No, Keep It.',
        allowOutsideClick: false,
      }).then((result) => {
        if (result.isConfirmed) {
          axios
            .delete(`/salesOrder/${orders[index].id}`)
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
      text: 'This action will remove selected Orders permanently.',
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Yes, Remove!',
      cancelButtonText: 'No, Keep Them.',
      allowOutsideClick: false,
    }).then((result) => {
      if (result.isConfirmed) {
        axios
          .delete('/salesOrder', {
            data: { ids: selected },
          })
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

  const getOrders = (cancelToken) => {
    axios
      .get('/salesOrder', { cancelToken })
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

  useEffect(() => {
    const source = axios.CancelToken.source();
    getOrders(source.token);
    return () => source.cancel('Brand Component got unmounted');
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
        component={RouterLink}
        to="/admin/order/create"
        startIcon={<AddIcon />}
      >
        New Order
      </Button>
      <DataGrid
        title="Sales Orders"
        rows={orders.map(
          (
            {
              id,
              district,
              street,
              block,
              floor,
              unit,
              Seller,
              isPreOrder,
              discount,
              discountType,
              surcharge,
              surchargeType,
              createdAt,
              timeLine,
              paid,
              ChairStocks,
              DeskStocks,
              AccessoryStocks,
              ...restProps
            },
            index
          ) => ({
            id,
            index,
            seller: (Seller.firstName || '').concat(' ', Seller.lastName || ''),
            timeLine:
              timeLine % 7 !== 0
                ? `${timeLine} day${timeLine === 1 ? '' : 's'}`
                : `${timeLine / 7} week${timeLine / 7 === 1 ? '' : 's'}`,
            orderDate: (() => {
              const createdTime = new Date(createdAt);
              createdTime.setMinutes(
                createdTime.getMinutes() - createdTime.getTimezoneOffset()
              );
              return createdTime.toISOString().split('T')[0];
            })(),
            discount: `${discount}${discountType ? ' HKD' : '%'}`,
            surcharge: `${surcharge}${surchargeType ? ' HKD' : '%'}`,
            clientAddress: [district, street, block, floor, unit].join(', '),
            isPreOrder:
              (!orders[index].ChairStocks.length ||
                !orders[index].ChairStocks.reduce(
                  (acc, cur) => cur.ChairToOrder.preOrder * acc
                )) *
              (!orders[index].DeskStocks.length ||
                !orders[index].DeskStocks.reduce(
                  (acc, cur) => cur.DeskToOrder.preOrder * acc
                ))
                ? 'No'
                : 'Yes',
            products: (
              <IconButton
                sx={{ my: '5px' }}
                onClick={(event) => {
                  event.preventDefault();
                  chairDeliveries.current = [];
                  deskDeliveries.current = [];
                  accessoryDeliveries.current = [];
                  setOrderIndex(index);
                  setDetailOpen(true);
                }}
              >
                <Badge
                  badgeContent={
                    ChairStocks.length +
                    DeskStocks.length +
                    AccessoryStocks.length
                  }
                  color="error"
                >
                  <DeckIcon />
                </Badge>
              </IconButton>
            ),
            paid: (
              <Checkbox
                checked={paid}
                onClick={(event) => {
                  event.stopPropagation();
                  event.preventDefault();
                  axios
                    .put(`/salesOrder/withoutStock/${id}`, {
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
            invoicePDF: (
              <IconButton
                component={RouterLink}
                to={`/invoice/${id}`}
                target="_blank"
              >
                <PictureAsPdfIcon />
              </IconButton>
            ),
            emailIcon: (
              <IconButton
                onClick={() => {
                  setName(restProps.name);
                  setEmail(restProps.email);
                  setEmailOpen(true);
                }}
              >
                <EmailIcon />
              </IconButton>
            ),
            whatsappIcon: (
              <IconButton
                onClick={() => {
                  axios
                    .get('whatsapp/checkauth')
                    .then(() => {
                      setName(restProps.name);
                      setPhone(restProps.phone);
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
                              />
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
            ),
            edit: (
              <IconButton
                component={RouterLink}
                to={{
                  pathname: '/admin/order/edit',
                  state: { order: orders[index] },
                }}
              >
                <EditIcon />
              </IconButton>
            ),
            delete: (
              <IconButton
                onClick={(event) => {
                  event.preventDefault();
                  handleRemoveClick(index);
                }}
              >
                <DeleteIcon />
              </IconButton>
            ),
            ...restProps,
          })
        )}
        columns={columns}
        onRemoveClick={handleRemoveClick}
        onBulkRemoveClick={handleBulkRemoveClick}
        onFilterClick={handleFilterClick}
      />
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
              variant="outlined"
              label="Phone Number"
              onlyCountries={['hk']}
              defaultCountry={'hk'}
              value={phone}
              InputProps={{
                readOnly: true,
              }}
            />

            <TextField
              inputRef={whatsAppMessage}
              label="Message"
              fullWidth
              defaultValue={`Hello ${name},\nThank you for your order! Please find here (payment link URL) for your payment.\nOnce finished, your order will be processed accordingly.`}
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
              label="Email"
              type="email"
              value={email}
              InputProps={{
                readOnly: true,
              }}
            />

            <TextField
              inputRef={emailContent}
              label="Message"
              fullWidth
              defaultValue={`Hello ${name},\nThank you for your order! Please find here (payment link URL) for your payment.\nOnce finished, your order will be processed accordingly.`}
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
      <Dialog
        maxWidth="sm"
        fullWidth
        fullScreen={useMediaQuery(theme.breakpoints.down('sm'))}
        open={detailOpen}
      >
        <DialogTitle>Products Details</DialogTitle>
        <DialogContent>
          <ProductList>
            {orderIndex < orders.length &&
              orders[orderIndex].ChairStocks.map((item, index) => (
                <ProductListItem key={index}>
                  <ProductListItemText
                    primary={`Chair: ${item.brand}, ${item.model}, ${item.frameColor}, ${item.backColor}, ${item.seatColor}`}
                    secondary={`${item.withHeadrest ? 'Headrest, ' : ''}${
                      item.withAdArmrest ? 'Armrest' : ''
                    }`}
                  />
                  <ProductPriceAmount
                    unitPrice={`${item.ChairToOrder.unitPrice} HKD`}
                    amount={`Amount: ${item.ChairToOrder.qty}`}
                    deliveryOption={`${item.ChairToOrder.deliveryOption}`}
                  />
                  <Button
                    variant="contained"
                    sx={{ mt: '5px' }}
                    component={RouterLink}
                    target="_blank"
                    to={`/deliveryPDF/chair/${item.ChairToOrder.id}`}
                  >
                    Delivery Note
                  </Button>
                  {orders[orderIndex].paid && (
                    <Paper
                      ref={(ref) => chairDeliveries.current.push(ref)}
                      component="form"
                      sx={{
                        flexBasis: '100%',
                        display: 'flex',
                        flexWrap: 'wrap',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        marginTop: '10px',
                        padding: '10px',
                      }}
                    >
                      <input
                        name="id"
                        type="hidden"
                        value={item.ChairToOrder.id}
                      />
                      <TextField
                        name="proDeliveryDate"
                        type="date"
                        label="Proposed Delivery Date"
                        defaultValue={item.ChairToOrder.proDeliveryDate}
                        InputLabelProps={{ shrink: true }}
                        sx={{
                          flexBasis: '100%',
                          my: '5px',
                        }}
                      />
                      <TextField
                        name="estDeliveryDate"
                        type="date"
                        label="Est. Delivery Date"
                        defaultValue={item.ChairToOrder.estDeliveryDate}
                        InputLabelProps={{ shrink: true }}
                        sx={{
                          flexBasis: '100%',
                          my: '5px',
                        }}
                      />
                      <TextField
                        name="from"
                        type="time"
                        label="From"
                        defaultValue={item.ChairToOrder.from}
                        InputLabelProps={{ shrink: true }}
                        sx={{ flexBasis: '48%', my: '5px' }}
                      />
                      <TextField
                        name="to"
                        type="time"
                        label="To"
                        defaultValue={item.ChairToOrder.to}
                        InputLabelProps={{ shrink: true }}
                        sx={{ flexBasis: '48%', my: '5px' }}
                      />
                      <FormControlLabel
                        key={index}
                        control={
                          <Checkbox
                            name="delivered"
                            defaultChecked={item.ChairToOrder.delivered}
                          />
                        }
                        label="Delivered"
                      />
                    </Paper>
                  )}
                </ProductListItem>
              ))}
            {orderIndex < orders.length &&
              orders[orderIndex].DeskStocks.map((item, index) => (
                <ProductListItem key={index}>
                  <ProductListItemText
                    primary={`Desk: ${item.supplierCode}, ${item.model}, ${item.color}, ${item.armSize}, ${item.feetSize}, ${item.beamSize}`}
                    secondary={
                      item.DeskToOrder.hasDeskTop ? (
                        <span>
                          {`${item.DeskToOrder.topMaterial}, ${item.DeskToOrder.topColor}, ${item.DeskToOrder.topLength}x${item.DeskToOrder.topWidth}x${item.DeskToOrder.topThickness}, ${item.DeskToOrder.topRoundedCorners}-R${item.DeskToOrder.topCornerRadius}, ${item.DeskToOrder.topHoleCount}-${item.DeskToOrder.topHoleType} `}
                          <a
                            href={item.DeskToOrder.topSketchURL}
                            target="_blank"
                          >
                            Sketch
                          </a>
                        </span>
                      ) : (
                        'Without DeskTop'
                      )
                    }
                  />
                  <ProductPriceAmount
                    unitPrice={`${item.DeskToOrder.unitPrice} HKD`}
                    amount={`Amount: ${item.DeskToOrder.qty}`}
                    deliveryOption={`${item.DeskToOrder.deliveryOption}`}
                  />
                  <Button
                    variant="contained"
                    sx={{ mt: '5px' }}
                    component={RouterLink}
                    target="_blank"
                    to={`/deliveryPDF/desk/${item.DeskToOrder.id}`}
                  >
                    Delivery Note
                  </Button>
                  {orders[orderIndex].paid && (
                    <Paper
                      ref={(ref) => deskDeliveries.current.push(ref)}
                      component="form"
                      sx={{
                        flexBasis: '100%',
                        display: 'flex',
                        flexWrap: 'wrap',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        marginTop: '10px',
                        padding: '10px',
                      }}
                    >
                      <input
                        name="id"
                        type="hidden"
                        value={item.DeskToOrder.id}
                      />
                      <TextField
                        name="proDeliveryDate"
                        type="date"
                        label="Proposed Delivery Date"
                        defaultValue={item.DeskToOrder.proDeliveryDate}
                        InputLabelProps={{ shrink: true }}
                        sx={{
                          flexBasis: '100%',
                          my: '5px',
                        }}
                      />
                      <TextField
                        name="estDeliveryDate"
                        type="date"
                        label="Est. Delivery Date"
                        defaultValue={item.DeskToOrder.estDeliveryDate}
                        InputLabelProps={{ shrink: true }}
                        sx={{
                          flexBasis: '100%',
                          my: '5px',
                        }}
                      />
                      <TextField
                        name="from"
                        type="time"
                        label="From"
                        defaultValue={item.DeskToOrder.from}
                        InputLabelProps={{ shrink: true }}
                        sx={{ flexBasis: '48%', my: '5px' }}
                      />
                      <TextField
                        name="to"
                        type="time"
                        label="To"
                        defaultValue={item.DeskToOrder.to}
                        InputLabelProps={{ shrink: true }}
                        sx={{ flexBasis: '48%', my: '5px' }}
                      />
                      <FormControlLabel
                        key={index}
                        control={
                          <Checkbox
                            name="delivered"
                            defaultChecked={item.DeskToOrder.delivered}
                          />
                        }
                        label="Delivered"
                      />
                    </Paper>
                  )}
                </ProductListItem>
              ))}
            {orderIndex < orders.length &&
              orders[orderIndex].AccessoryStocks.map((item, index) => (
                <ProductListItem key={index}>
                  <ProductListItemText
                    primary={`Accessory: ${item.color}`}
                    secondary={`${item.remark}`}
                  />
                  <ProductPriceAmount
                    unitPrice={`${item.AccessoryToOrder.unitPrice} HKD`}
                    amount={`Amount: ${item.AccessoryToOrder.qty}`}
                    deliveryOption={`${item.AccessoryToOrder.deliveryOption}`}
                  />
                  <Button
                    variant="contained"
                    sx={{ mt: '5px' }}
                    component={RouterLink}
                    target="_blank"
                    to={`/deliveryPDF/accessory/${item.AccessoryToOrder.id}`}
                  >
                    Delivery Note
                  </Button>
                  {orders[orderIndex].paid && (
                    <Paper
                      ref={(ref) => accessoryDeliveries.current.push(ref)}
                      component="form"
                      sx={{
                        flexBasis: '100%',
                        display: 'flex',
                        flexWrap: 'wrap',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        marginTop: '10px',
                        padding: '10px',
                      }}
                    >
                      <input
                        name="id"
                        type="hidden"
                        value={item.AccessoryToOrder.id}
                      />
                      <TextField
                        name="proDeliveryDate"
                        type="date"
                        label="Proposed Delivery Date"
                        defaultValue={item.AccessoryToOrder.proDeliveryDate}
                        InputLabelProps={{ shrink: true }}
                        sx={{
                          flexBasis: '100%',
                          my: '5px',
                        }}
                      />
                      <TextField
                        name="estDeliveryDate"
                        type="date"
                        label="Est Delivery Date"
                        defaultValue={item.AccessoryToOrder.estDeliveryDate}
                        InputLabelProps={{ shrink: true }}
                        sx={{
                          flexBasis: '100%',
                          my: '5px',
                        }}
                      />
                      <TextField
                        name="from"
                        type="time"
                        label="From"
                        defaultValue={item.AccessoryToOrder.from}
                        InputLabelProps={{ shrink: true }}
                        sx={{ flexBasis: '48%', my: '5px' }}
                      />
                      <TextField
                        name="to"
                        type="time"
                        label="To"
                        defaultValue={item.AccessoryToOrder.to}
                        InputLabelProps={{ shrink: true }}
                        sx={{ flexBasis: '48%', my: '5px' }}
                      />
                      <FormControlLabel
                        key={index}
                        control={
                          <Checkbox
                            name="delivered"
                            defaultChecked={item.AccessoryToOrder.delivered}
                          />
                        }
                        label="Delivered"
                      />
                    </Paper>
                  )}
                </ProductListItem>
              ))}
          </ProductList>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={(event) => {
              event.preventDefault();
              setDetailOpen(false);
            }}
          >
            Cancel
          </Button>
          <Button
            onClick={(event) => {
              event.preventDefault();
              const chairToOrders = chairDeliveries.current.map((item) => ({
                id: item.id.value,
                proDeliveryDate: item.proDeliveryDate.value || null,
                estDeliveryDate: item.estDeliveryDate.value || null,
                from: item.from.value || null,
                to: item.to.value || null,
                delivered: item.delivered.checked,
              }));
              const deskToOrders = deskDeliveries.current.map((item) => ({
                id: item.id.value,
                proDeliveryDate: item.proDeliveryDate.value || null,
                estDeliveryDate: item.estDeliveryDate.value || null,
                from: item.from.value || null,
                to: item.to.value || null,
                delivered: item.delivered.checked,
              }));
              const accessoryToOrders = accessoryDeliveries.current.map(
                (item) => ({
                  id: item.id.value,
                  proDeliveryDate: item.proDeliveryDate.value || null,
                  estDeliveryDate: item.estDeliveryDate.value || null,
                  from: item.from.value || null,
                  to: item.to.value || null,
                  delivered: item.delivered.checked,
                })
              );
              axios
                .post('/salesOrder/products', {
                  chairToOrders,
                  deskToOrders,
                  accessoryToOrders,
                })
                .then(() => {
                  // handle success
                  getOrders();
                })
                .catch(function (error) {
                  // handle error
                  console.log(error);
                })
                .then(function () {
                  // always executed
                  setDetailOpen(false);
                });
            }}
          >
            OK
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
});
