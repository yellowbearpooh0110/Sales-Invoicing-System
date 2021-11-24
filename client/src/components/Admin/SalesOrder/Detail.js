import React, { useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  List,
  ListItem,
  ListItemText,
  Paper,
  Step,
  Stepper,
  StepLabel,
  Tab,
  Tabs,
  TextField,
  Typography,
} from '@mui/material';
import { blue, red, yellow } from '@mui/material/colors';
import {
  Add as AddIcon,
  Delete as DeleteIcon,
  Remove as RemoveIcon,
} from '@mui/icons-material';
import MuiPhoneNumber from 'material-ui-phone-number';
import axios from 'axios';
import Swal from 'sweetalert2';

import DataGrid from 'components/Common/DataGrid';

const TabPanel = (props) => {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: '0 10px 10px 10px' }}>{children}</Box>}
    </div>
  );
};

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
};

function mapStateToProps(state) {
  const { auth } = state;
  return { auth };
}

const columns = [
  {
    id: 'id',
    label: '#',
  },
  {
    id: 'brand',
    label: 'Brand',
  },
  {
    id: 'model',
    label: 'Model',
  },
  {
    id: 'frameColor',
    label: 'Frame Color',
  },
  {
    id: 'backColor',
    label: 'Back Color',
  },
  {
    id: 'seatColor',
    label: 'Seat Color',
  },
  {
    id: 'withHeadrest',
    label: 'Headrest',
  },
  {
    id: 'withAdArmrest',
    label: 'Adjustable Armrests',
  },
  {
    id: 'remark',
    label: 'Special Remark',
  },
  {
    id: 'balance',
    label: 'Balance',
  },
  {
    id: 'qty',
    label: 'QTY',
  },
  {
    id: 'shipmentDate',
    label: 'Shipment',
  },
  {
    id: 'arrivalDate',
    label: 'Arrival',
  },
  {
    id: 'add',
    nonSort: true,
  },
];

export default connect(mapStateToProps)((props) => {
  const { componentType, initialClient, initialCart } = props;

  const steps = ['Input Client Info', 'Select Products'];
  const clientForm = useRef(null);
  const [currentStep, setCurrentStep] = useState(0);
  const [addOpen, setAddOpen] = useState(false);
  const [productType, setProductType] = useState('chair');
  const [productDetail, setProductDetail] = useState('');
  const [productAmount, setProductAmount] = useState(0);
  const [cart, setCart] = useState(initialCart);

  const [chairStocks, setChairStocks] = useState([]);
  const [deskStocks, setDeskStocks] = useState([]);
  const [stocksIndex, setStocksIndex] = useState(0);

  const getChairStocks = (cancelToken) => {
    axios
      .get('/chairStock', { cancelToken })
      .then((response) => {
        // handle success
        setChairStocks(response.data);
      })
      .catch(function (error) {
        // handle error
        console.log(error);
      })
      .then(function () {
        // always executed
      });
  };

  const getDeskStocks = (cancelToken) => {
    axios
      .get('/deskStock', { cancelToken })
      .then((response) => {
        // handle success
        setDeskStocks(response.data);
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
    getChairStocks(source.token);
    getDeskStocks(source.token);
    return () => source.cancel('Stock Component got unmounted');
  }, []);

  const isStepFailed = (step) => {
    if (clientForm.current !== null && currentStep > 0 && step === 0)
      return !clientForm.current.checkValidity();
    else if (cart.length === 0 && currentStep > 1 && step === 1) return true;
    else return false;
  };

  return (
    <Box
      sx={{
        height: '100%',
        overflow: 'auto',
        padding: '20px 20px 10px 20px',
      }}
    >
      <Stepper activeStep={currentStep} sx={{ mb: '20px' }}>
        {steps.map((label, index) => {
          const labelProps = {};
          if (isStepFailed(index)) {
            labelProps.optional = (
              <Typography variant="caption" color="error">
                {['Invalid Input', 'Products cannot be empty'][index]}
              </Typography>
            );

            labelProps.error = true;
          }

          return (
            <Step key={label}>
              <StepLabel {...labelProps}>{label}</StepLabel>
            </Step>
          );
        })}
      </Stepper>
      <Box
        sx={{ mx: 'auto', mt: '50px' }}
        ref={clientForm}
        hidden={currentStep !== 0}
        component="form"
        maxWidth="sm"
        fullWidth
        onSubmit={(e) => {
          e.preventDefault();
          setCurrentStep(1);
        }}
      >
        <Paper
          sx={{
            p: '10px',
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'space-between',
          }}
        >
          <Typography variant="h6" sx={{ flexBasis: '100%', minWidth: '100%' }}>
            Client Info
          </Typography>
          {[
            {
              name: 'name',
              label: 'Name',
              type: 'text',
              defaultValue: initialClient.name,
              width: '100%',
              required: true,
            },
            {
              name: 'phone',
              label: 'Phone',
              type: 'text',
              value: initialClient.phone,
              onChange: initialClient.setPhone,
              width: '48%',
            },
            {
              name: 'email',
              label: 'Email',
              type: 'email',
              defaultValue: initialClient.email,
              width: '48%',
              required: true,
            },
            {
              name: 'district',
              label: 'District',
              type: 'text',
              defaultValue: initialClient.district,
              width: '55%',
            },
            {
              name: 'street',
              label: 'Street',
              type: 'text',
              defaultValue: initialClient.street,
              width: '40%',
            },
            {
              name: 'block',
              label: 'Block',
              type: 'text',
              defaultValue: initialClient.block,
              width: '30%',
            },
            {
              name: 'floor',
              label: 'Floor',
              type: 'text',
              defaultValue: initialClient.floor,
              width: '30%',
            },
            {
              name: 'unit',
              label: 'Unit',
              type: 'text',
              defaultValue: initialClient.unit,
              width: '30%',
            },
            {
              name: 'deliveryDate',
              label: 'Delivery Date',
              type: 'date',
              defaultValue: initialClient.deliveryDate,
              width: '100%',
              required: true,
              InputLabelProps: { shrink: true },
            },
            {
              name: 'remark',
              label: 'Remark',
              muliline: 'true',
              type: 'text',
              defaultValue: initialClient.remark,
              width: '100%',
            },
          ].map(({ setValue, width, ...restProps }, index) =>
            restProps.label === 'Phone' ? (
              <MuiPhoneNumber
                key={index}
                defaultCountry={'hk'}
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
                sx={{ flexBasis: width, minWidth: width }}
                {...restProps}
              />
            )
          )}
        </Paper>
        <Button
          variant="outlined"
          type="submit"
          sx={{ marginTop: '10px', float: 'right' }}
        >
          Next
        </Button>
      </Box>
      {currentStep === 1 && (
        <>
          {cart.length > 0 && (
            <Paper>
              <List>
                {cart.map((item, index) => (
                  <ListItem
                    key={index}
                    sx={{
                      bgcolor: yellow[400],
                      boxShadow: `0px 2px 1px -1px rgb(0 0 0 / 20%)`,
                      color: blue[700],
                      my: '10px',
                    }}
                    secondaryAction={
                      <IconButton
                        onClick={(event) => {
                          event.preventDefault();
                          setCart(
                            cart.filter(
                              (product, productIndex) => productIndex !== index
                            )
                          );
                        }}
                      >
                        <DeleteIcon />
                      </IconButton>
                    }
                  >
                    <ListItemText
                      primary={
                        item.productType === 'chair'
                          ? `${item.productDetail.brand}, ${item.productDetail.model}, ${item.productDetail.frameColor}, ${item.productDetail.backColor}, ${item.productDetail.seatColor}`
                          : `${item.productDetail.supplierCode}, ${item.productDetail.model}, ${item.productDetail.color}, ${item.productDetail.armSize}, ${item.productDetail.feetSize}, ${item.productDetail.beamSize}`
                      }
                      secondary={`${
                        item.productDetail.withHeadrest ? 'Headrest, ' : ''
                      }${item.productDetail.withAdArmrest ? 'Armrest' : ''}`}
                    />
                    <Box
                      display="flex"
                      alignItems="center"
                      justifyContent="center"
                      variant="span"
                      color={red[900]}
                      bgcolor={red[100]}
                      sx={{
                        flexShrink: 0,
                        width: 40,
                        height: 40,
                        marginRight: '10px',
                        borderRadius: '50%',
                      }}
                    >
                      {item.productAmount}
                    </Box>
                  </ListItem>
                ))}
              </List>
            </Paper>
          )}
          <Paper sx={{ my: '10px' }}>
            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
              <Tabs
                value={stocksIndex}
                onChange={(event, value) => {
                  event.preventDefault();
                  setStocksIndex(value);
                }}
                aria-label="basic tabs example"
              >
                <Tab label="Chairs" />
                <Tab label="Desks" />
              </Tabs>
            </Box>
            <TabPanel value={stocksIndex} index={0}>
              <DataGrid
                nonSelect={true}
                title="Chair Stocks"
                rows={chairStocks.map(
                  (
                    {
                      id,
                      withHeadrest,
                      withAdArmrest,
                      shipmentDate,
                      arrivalDate,
                      ...restProps
                    },
                    index
                  ) => ({
                    id: index,
                    withHeadrest: withHeadrest ? 'Yes' : 'No',
                    withAdArmrest: withAdArmrest ? 'Yes' : 'No',
                    add: (
                      <IconButton
                        onClick={(event) => {
                          event.preventDefault();
                          setProductType('chair');
                          setProductDetail(chairStocks[index]);
                          setProductAmount(1);
                          if (
                            cart.find(
                              (item) =>
                                item.productType === 'chair' &&
                                item.productDetail.id === chairStocks[index].id
                            )
                          ) {
                            Swal.fire({
                              icon: 'warning',
                              title: 'Warning',
                              text: 'This product is already added.',
                              allowOutsideClick: false,
                            });
                            return;
                          }
                          setAddOpen(true);
                        }}
                      >
                        <AddIcon />
                      </IconButton>
                    ),
                    shipmentDate: (() => {
                      if (shipmentDate === null) return 'No';
                      const createdTime = new Date(shipmentDate);
                      createdTime.setMinutes(
                        createdTime.getMinutes() -
                          createdTime.getTimezoneOffset()
                      );
                      return createdTime.toISOString().split('T')[0];
                    })(),
                    arrivalDate: (() => {
                      if (arrivalDate === null) return 'No';
                      const createdTime = new Date(arrivalDate);
                      createdTime.setMinutes(
                        createdTime.getMinutes() -
                          createdTime.getTimezoneOffset()
                      );
                      return createdTime.toISOString().split('T')[0];
                    })(),
                    ...restProps,
                  })
                )}
                columns={columns}
              ></DataGrid>
            </TabPanel>
            <TabPanel value={stocksIndex} index={1}>
              <DataGrid
                title="Desk Stocks"
                rows={deskStocks.map(
                  (
                    {
                      id,
                      withHeadrest,
                      withAdArmrest,
                      shipmentDate,
                      arrivalDate,
                      ...restProps
                    },
                    index
                  ) => ({
                    id: index,
                    withHeadrest: withHeadrest ? 'Yes' : 'No',
                    withAdArmrest: withAdArmrest ? 'Yes' : 'No',
                    add: (
                      <IconButton
                        onClick={(event) => {
                          event.preventDefault();
                          setProductType('desk');
                          setProductDetail(deskStocks[index]);
                          setProductAmount(1);
                          if (
                            cart.find(
                              (item) =>
                                item.productType === 'desk' &&
                                item.productDetail.id === deskStocks[index].id
                            )
                          ) {
                            Swal.fire({
                              icon: 'warning',
                              title: 'Warning',
                              text: 'This product is already added.',
                              allowOutsideClick: false,
                            });
                            return;
                          }
                          setAddOpen(true);
                        }}
                      >
                        <AddIcon />
                      </IconButton>
                    ),
                    shipmentDate: (() => {
                      if (shipmentDate === null) return 'No';
                      const createdTime = new Date(shipmentDate);
                      createdTime.setMinutes(
                        createdTime.getMinutes() -
                          createdTime.getTimezoneOffset()
                      );
                      return createdTime.toISOString().split('T')[0];
                    })(),
                    arrivalDate: (() => {
                      if (arrivalDate === null) return 'No';
                      const createdTime = new Date(arrivalDate);
                      createdTime.setMinutes(
                        createdTime.getMinutes() -
                          createdTime.getTimezoneOffset()
                      );
                      return createdTime.toISOString().split('T')[0];
                    })(),
                    ...restProps,
                  })
                )}
                columns={columns}
              />
            </TabPanel>
          </Paper>
          <Button
            variant="outlined"
            onClick={(e) => {
              e.preventDefault();
              setCurrentStep(0);
            }}
          >
            Previous
          </Button>
          <Button
            variant="outlined"
            sx={{ float: 'right' }}
            onClick={(e) => {
              e.preventDefault();
              if (cart.length === 0) {
                Swal.fire({
                  icon: 'warning',
                  title: 'Warning',
                  text: 'Products list cannot be empty',
                  allowOutsideClick: false,
                });
                return;
              }
              const data = new FormData(clientForm.current);
              if (componentType === 'create')
                axios
                  .post(`/salesOrder/create`, {
                    name: data.get('name'),
                    phone: data.get('phone'),
                    email: data.get('email'),
                    district: data.get('district'),
                    street: data.get('street'),
                    block: data.get('block'),
                    floor: data.get('floor'),
                    unit: data.get('unit'),
                    deliveryDate: data.get('deliveryDate') || null,
                    remark: data.get('remark'),
                    products: cart.map(({ productDetail, ...restProps }) => ({
                      productId: productDetail.id,
                      ...restProps,
                    })),
                  })
                  .then((response) => {
                    // handle success
                    props.history.push('/admin/order');
                  })
                  .catch(function (error) {
                    // handle error
                    Swal.fire({
                      icon: 'error',
                      title: 'Error',
                      text: error.response.data.message,
                      allowOutsideClick: false,
                    }).then(() => {});
                    console.log(error);
                  })
                  .then(function () {
                    // always executed
                  });
              else {
                axios
                  .put(`/salesOrder/${initialClient.id}`, {
                    name: data.get('name'),
                    phone: data.get('phone'),
                    email: data.get('email'),
                    district: data.get('district'),
                    street: data.get('street'),
                    block: data.get('block'),
                    floor: data.get('floor'),
                    unit: data.get('unit'),
                    deliveryDate: data.get('deliveryDate') || null,
                    remark: data.get('remark'),
                    products: cart.map(({ productDetail, ...restProps }) => ({
                      productId: productDetail.id,
                      ...restProps,
                    })),
                  })
                  .then((response) => {
                    // handle success
                    props.history.push('/admin/order');
                  })
                  .catch(function (error) {
                    // handle error
                    Swal.fire({
                      icon: 'error',
                      title: 'Error',
                      text: error.response.data.message,
                      allowOutsideClick: false,
                    }).then(() => {});
                    console.log(error);
                  })
                  .then(function () {
                    // always executed
                  });
              }
            }}
          >
            Finish
          </Button>
        </>
      )}
      <Dialog open={addOpen} maxWidth="sm" fullWidth>
        <DialogTitle>Amount</DialogTitle>
        <DialogContent sx={{ textAlign: 'center' }}>
          <IconButton
            onClick={(e) => {
              e.preventDefault();
              setProductAmount(Math.max(productAmount - 1, 1));
            }}
          >
            <RemoveIcon />
          </IconButton>
          <Typography variant="span" mx="10px">
            {productAmount}
          </Typography>
          <IconButton
            onClick={(e) => {
              e.preventDefault();
              setProductAmount(Math.min(productAmount + 1, 9));
            }}
          >
            <AddIcon />
          </IconButton>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={(e) => {
              setAddOpen(false);
            }}
          >
            Cancle
          </Button>
          <Button
            onClick={(e) => {
              e.preventDefault();
              setAddOpen(false);
              if (
                cart.find(
                  (item) =>
                    item.productType === 'chair' &&
                    item.productDetail.id === productDetail.id
                )
              ) {
                Swal.fire({
                  icon: 'warning',
                  title: 'Warning',
                  text: 'This product is already added.',
                  allowOutsideClick: false,
                });
                return;
              }
              setCart(
                cart.concat({ productType, productDetail, productAmount })
              );
            }}
          >
            OK
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
});
