import React, { useEffect, useRef, useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import ReactDOMServer from 'react-dom/server';
import { Link } from 'react-router-dom';
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
  IconButton,
  Stack,
  TextField,
  Typography,
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
    id: 'quotationNum',
    label: 'Quotation',
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
    id: 'products',
    label: 'Products',
  },
  {
    id: 'paid',
    label: 'Paid',
  },
  {
    id: 'quotationPDF',
    nonSort: true,
    label: 'Quotation',
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

  const handleEditClick = (index) => {
    if (index < orders.length && index >= 0) {
    }
  };

  const handleRemoveClick = (index) => {
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
            .delete(`/quotation/${orders[index].id}`)
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
    console.log(selected);
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
          .delete('/quotation', {
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
      .get('/quotation/current', { cancelToken })
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
        to="/user/quotation/create"
        startIcon={<AddIcon />}
      >
        New Quotation
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
            discount: `${discount}%`,
            clientAddress: [district, street, block, floor, unit].join(', '),
            isPreOrder:
              (!orders[index].ChairStocks.length ||
                !orders[index].ChairStocks.reduce(
                  (acc, cur) => cur.ChairToQuotation.preOrder * acc
                )) *
              (!orders[index].DeskStocks.length ||
                !orders[index].DeskStocks.reduce(
                  (acc, cur) => cur.DeskToQuotation.preOrder * acc
                ))
                ? 'No'
                : 'Yes',
            products: (
              <IconButton
                sx={{ my: '5px' }}
                onClick={(event) => {
                  event.preventDefault();
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
                    .put(`/quotation/withoutStock/${id}`, {
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
            quotationPDF: (
              <IconButton
                component={Link}
                to={`/quotation/${id}`}
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
                  pathname: '/user/quotation/edit',
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
        onEditClick={handleEditClick}
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
        open={detailOpen}
        onClose={(event) => {
          event.preventDefault();
          setDetailOpen(false);
        }}
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
                    unitPrice={`${item.ChairToQuotation.unitPrice} HKD`}
                    amount={`Amount: ${item.ChairToQuotation.qty}`}
                  />
                </ProductListItem>
              ))}
            {orderIndex < orders.length &&
              orders[orderIndex].DeskStocks.map((item, index) => (
                <ProductListItem key={index}>
                  <ProductListItemText
                    primary={`Desk: ${item.supplierCode}, ${item.model}, ${item.color}, ${item.armSize}, ${item.feetSize}, ${item.beamSize}`}
                    secondary={`${item.topMaterial}, ${item.topColor}, ${item.topSize}`}
                  />
                  <ProductPriceAmount
                    unitPrice={`${item.DeskToQuotation.unitPrice} HKD`}
                    amount={`Amount: ${item.DeskToQuotation.qty}`}
                  />
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
                    unitPrice={`${item.AccessoryToQuotation.unitPrice} HKD`}
                    amount={`Amount: ${item.AccessoryToQuotation.qty}`}
                  />
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
            OK
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
});
